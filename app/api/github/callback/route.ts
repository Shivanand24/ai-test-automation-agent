import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(
            new URL("/workspace?error=missing_code", req.url)
        );
    }

    const res = await fetch(
        "https://github.com/login/oauth/access_token",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID!,
                client_secret: process.env.GITHUB_CLIENT_SECRET!,
                code,
            }),
        }
    );

    const data = await res.json();
    const token = data.access_token;

    if (!token) {
        return NextResponse.redirect(
            new URL("/workspace?error=token_exchange_failed", req.url)
        );
    }

    // TODO:
    // Save the token in your database or cookies.
    // This part will be added later in the tutorial.




    const response = NextResponse.redirect(
        new URL("/workspace", req.url)
    );

    // Store token in HTTP-only cookie
    response.cookies.set("gh_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
    });

    return response;
}