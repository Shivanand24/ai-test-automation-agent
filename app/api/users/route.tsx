import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(existingUser[0]);
    }

    // Insert new user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
      })
      .returning();

    return NextResponse.json(newUser[0]);
  } catch (error: any) {
    console.error('Error in /api/users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
