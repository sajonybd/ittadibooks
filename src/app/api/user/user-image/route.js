import { connectDb } from '@/lib/connectDb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await connectDb();

    const user = await db.collection('users').findOne(
      { email },
      { projection: { image: 1, _id: 0 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ image: user.image || null });
  } catch (error) {
    // // // console.error('Failed to fetch user image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
