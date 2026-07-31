import { db } from "@/db";
import { userrepositories } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {
        repoId,
        userId,
        name,
        full_name,
        private_,
        html_url,
        description,
        language,
        updated_at,
        owner,
    } = await req.json();

    const result = await db.insert(userrepositories).values({
        repoId,
        userId,
        name,
        fullName: full_name,
        private: private_ ? 1 : 0,
        htmlUrl: html_url,
        description,
        language,

        owner,
    }).returning();

    return NextResponse.json(result[0]);
}