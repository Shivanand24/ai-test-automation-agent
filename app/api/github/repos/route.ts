import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("gh_token")?.value;

    if (!token) {
        return NextResponse.json(
            { error: "Github token not found" },
            { status: 401 }
        );
    }

    const allRepos = [];
    let page = 1;

    while (true) {
        const res = await fetch(
            `https://api.github.com/user/repos?per_page=100&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const repos = await res.json();

        if (!repos.length) {
            break;
        }

        allRepos.push(...repos);
        page++;
    }

    return NextResponse.json(allRepos.map(r => {
        return {
            id: r.id,
            name: r.name,
            full_name: r.full_name,
            url: r.html_url,
            fork: r.fork,
            language: r.language,
            private: r.private,
            created_at: r.created_at,
            updated_at: r.updated_at,
            owner: r.owner.login,
            owner_id: r.owner.id,
            description: r.description,
            default_branch: r.default_branch,
            license: r.license?.name || "No license",

        }
    }));
}