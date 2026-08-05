import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json(
            { error: "GitHub OAuth Environment variables (GITHUB_CLIENT_ID / GITHUB_REDIRECT_URI) are missing on Vercel." },
            { status: 500 }
        );
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "repo read:user",
    });

    redirect(`https://github.com/login/oauth/authorize?${params}`);
}