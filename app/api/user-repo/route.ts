import { db } from "@/db";
import { userrepositories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {
            repoId,
            userId,
            name,
            full_name,
            private_,
            html_url,
            description,
            language,
            owner,
        } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const result = await db.insert(userrepositories).values({
            repoId: Number(repoId),
            userId: Number(userId),
            name: name || "",
            fullName: full_name || "",
            private: private_ ? 1 : 0,
            htmlUrl: html_url || "",
            description: description || "",
            language: language || "",
            owner: owner || "",
        }).returning();

        return NextResponse.json(result[0]);
    } catch (error: any) {
        console.error("Error in POST /api/user-repo:", error);
        return NextResponse.json({ error: error.message || "Failed to save repository" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || userId === "undefined" || isNaN(Number(userId))) {
            return NextResponse.json([]);
        }

        const result = await db.select().from(userrepositories).where(
            eq(userrepositories.userId, Number(userId))
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in GET /api/user-repo:", error);
        return NextResponse.json([], { status: 200 });
    }
}