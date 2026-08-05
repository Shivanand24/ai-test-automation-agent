import { db } from "@/db";
import { TestCasesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Support both nested testCase object or top-level properties
        const testCaseData = body.testCase || body;
        const testCaseId = body.testCaseId || body.id || testCaseData.id;

        if (!testCaseId) {
            return NextResponse.json({ error: "testCaseId is required" }, { status: 400 });
        }

        const updateData: Record<string, any> = {};
        if (testCaseData.title !== undefined) updateData.title = testCaseData.title;
        if (testCaseData.description !== undefined) updateData.description = testCaseData.description;
        if (testCaseData.targetRoute !== undefined) updateData.targetRoute = testCaseData.targetRoute;
        if (testCaseData.expectedResult !== undefined) updateData.expectedResult = testCaseData.expectedResult;
        if (testCaseData.repoId !== undefined) updateData.repoId = testCaseData.repoId;
        if (testCaseData.targetDomain !== undefined) updateData.targetDomain = testCaseData.targetDomain;

        const result = await db
            .update(TestCasesTable)
            .set(updateData)
            .where(eq(TestCasesTable.id, Number(testCaseId)))
            .returning();

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error updating test case settings:", error);
        return NextResponse.json({ error: error.message || "Failed to update test case settings" }, { status: 500 });
    }
}