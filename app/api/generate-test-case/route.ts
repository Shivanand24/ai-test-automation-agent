import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/groq";
import { db } from "@/db";
import { TestCasesTable } from "@/db/schema";




const ALLOWED_EXTENSIONS = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".md",
    ".html",
    ".css",
    ".py",
    ".vue",
    ".svelte",
];

const IMPORTANT_FILES = [
    "package.json",
    "next.config",
    "middleware",
    "app/",
    "pages/",
    "components/",
    "src/",
    "lib/",
    "utils/",
    "actions/",
    "api/",
    "server/",
];

const IGNORE_PATHS = [
    "node_modules",
    ".next",
    "dist",
    "build",
    ".git",
    "coverage",
    "public",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".webp",
    ".mp4",
    ".mov",
];

function isUsefulFile(path: string) {
    const isIgnored = IGNORE_PATHS.some((item) =>
        path.includes(item)
    );

    const isAllowedExtension = ALLOWED_EXTENSIONS.some((ext) =>
        path.endsWith(ext)
    );

    return !isIgnored && isAllowedExtension;
}

async function getRepoTree({
    owner,
    repo,
    branch,
    githubToken,
}: {
    owner: string;
    repo: string;
    branch: string;
    githubToken: string;
}) {
    let targetBranch = branch;

    // Fetch repository metadata to ensure we have the correct default branch
    const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github+json",
        },
        cache: "no-store"
    });

    if (repoInfoRes.ok) {
        const repoInfo = await repoInfoRes.json();
        targetBranch = repoInfo.default_branch || branch;
    }

    let res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${targetBranch}?recursive=1`,
        {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github+json",
            },
            cache: "no-store"
        }
    );

    if (!res.ok) {
        // Fallback to default branch (HEAD) if specified branch fails
        res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: "application/vnd.github+json",
                },
                cache: "no-store"
            }
        );
    }

    if (!res.ok) {
        const errorText = await res.text();
        console.error("GitHub API Error (fetch tree):", errorText, "owner:", owner, "repo:", repo, "branch:", targetBranch);
        throw new Error(`Failed to fetch GitHub repo tree: ${errorText}`);
    }

    const data = await res.json();
    const blobs = (data.tree || []).filter((item: any) => item.type === "blob");

    let usefulFiles = blobs.filter((item: any) => isUsefulFile(item.path));

    // Fallback to any non-ignored file if extension filter yields no matches
    if (usefulFiles.length === 0) {
        usefulFiles = blobs.filter((item: any) => {
            const isIgnored = IGNORE_PATHS.some((ignored) => item.path.includes(ignored));
            return !isIgnored;
        });
    }

    return usefulFiles.slice(0, 10);
}

async function readGithubFile({
    owner,
    repo,
    path,
    branch,
    githubToken,
}: {
    owner: string;
    repo: string;
    path: string;
    branch: string;
    githubToken: string;
}) {
    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    if (!res.ok) {
        return null;
    }

    const data = await res.json();

    if (!data.content) {
        return null;
    }

    const decodedContent = Buffer.from(
        data.content,
        "base64"
    ).toString("utf-8");

    return {
        path,
        content: decodedContent.slice(0, 1500),
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            userId,
            repoId,
            owner,
            repo,
            branch = "main",
            githubToken,
        } = body;

        if (!userId || !owner || !repo || !githubToken) {
            return NextResponse.json(
                {
                    error:
                        "userId, owner, repo and githubToken are required",
                },
                { status: 400 }
            );
        }

        // 1. Get repo tree
        const repoFiles = await getRepoTree({
            owner,
            repo,
            branch,
            githubToken,
        });

        // 2. Read useful files
        const fileContents = await Promise.all(
            repoFiles.map((file: any) =>
                readGithubFile({
                    owner,
                    repo,
                    branch,
                    path: file.path,
                    githubToken,
                })
            )
        );

        const validFiles = fileContents.filter(Boolean);

        if (validFiles.length === 0) {
            return NextResponse.json(
                {
                    error:
                        "No useful source files found in this repository",
                },
                { status: 400 }
            );
        }

        // 3. Prepare repo context
        const repoContext = validFiles
            .map(
                (file: any) => `
File Path: ${file.path}

File Content:
${file.content}
`
            )
            .join("\n\n---------------------\n\n");

        // 4. Ask Gemini
        const prompt = `
You are an expert QA automation engineer.

Analyze the GitHub repository source code and generate useful small test cases.

Your goal:
Generate test cases that can later be converted into Playwright / Browserbase automation scripts.

Repository:
Owner: ${owner}
Repo: ${repo}
Branch: ${branch}

Repository File Context:

${repoContext}

Generate 8 test cases.

Each test case must include:
- title
- description
- type
- priority
- targetRoute
- targetFiles
- expectedResult

Important rules:
- Only use file paths that exist in the repository context.
- Do not invent files.
- Keep descriptions short.
- Return valid JSON only, with a single root key "testCases" containing the array.
`;

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",

            response_format: {
                type: "json_object",
            },

            max_tokens: 2500,

            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert QA automation engineer. Return ONLY valid JSON. Do not add explanations, markdown, or extra text.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],

            temperature: 0.3,
        });

        console.log("FULL RESPONSE:");
        console.dir(response, { depth: null });

        const content = response.choices[0]?.message?.content || "";


        console.log("===== GROQ RESPONSE =====");
        console.log(content);
        console.log("=========================");

        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");

        if (start === -1 || end === -1) {
            return NextResponse.json(
                {
                    error: "Groq did not return JSON",
                    raw: content,
                },
                { status: 500 }
            );
        }

        const jsonString = content.slice(start, end + 1);

        let aiResult;

        try {
            aiResult = JSON.parse(jsonString);
        } catch (e) {
            return NextResponse.json(
                {
                    error: "Failed to parse Groq JSON",
                    raw: content,
                },
                { status: 500 }
            );
        }

        const testCases = aiResult.testCases || [];


        if (!testCases.length) {
            return NextResponse.json(
                {
                    error: "Groq did not generate any test cases",
                },
                { status: 400 }
            );
        }

        // 5. Save test cases
        const insertedTestCases = await db
            .insert(TestCasesTable)
            .values(
                testCases.map((testCase: any) => ({
                    userId,
                    repoId,
                    repoName: repo,
                    repoOwner: owner,
                    branch,

                    title: testCase.title,
                    description: testCase.description,
                    type: testCase.type,
                    priority: testCase.priority,

                    targetRoute: testCase.targetRoute,
                    targetFiles: Array.isArray(testCase.targetFiles) 
                        ? testCase.targetFiles 
                        : (typeof testCase.targetFiles === 'string' ? (() => { try { return JSON.parse(testCase.targetFiles) } catch(e) { return [] } })() : []),
                    expectedResult: testCase.expectedResult,
                    targetDomain: testCase.targetDomain || 'http://localhost:3000/',

                    status: "generated",
                }))
            )
            .returning();

        return NextResponse.json({
            success: true,
            message: "Test cases generated successfully",
            count: insertedTestCases.length,
            testCases: insertedTestCases,
        });
    } catch (error: any) {
        console.error("Generate test cases error:", error);

        let userErrorMessage = error?.message || "Failed to generate test cases";

        try {
            const parsed = JSON.parse(userErrorMessage);
            if (parsed?.error?.message) {
                userErrorMessage = parsed.error.message;
            }
        } catch (_) { }

        if (userErrorMessage.includes("RESOURCE_EXHAUSTED") || userErrorMessage.includes("429")) {
            userErrorMessage = "Groq API rate limit reached. Please wait 30 seconds before trying again.";
        }

        return NextResponse.json(
            {
                success: false,
                error: userErrorMessage,
            },
            { status: 500 }
        );
    }
}