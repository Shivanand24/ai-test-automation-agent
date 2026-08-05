import { db } from "@/db";
import { userrepositories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { repoId, id, userId, targetDomain, globalInstruction } = await req.json();

        const targetId = id || repoId;
        if (!targetId) {
            return NextResponse.json({ error: "repoId or id is required" }, { status: 400 });
        }

        const result = await db
            ?.update(userrepositories)
            .set({
                targetDomain: targetDomain,
                globalInstruction: globalInstruction,
            })
            .where(
                id
                    ? eq(userrepositories.id, Number(id))
                    : eq(userrepositories.repoId, Number(repoId))
            );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in POST /api/user-repo/settings:", error);
        return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
    }
}