 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/connectDb';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const db = await connectDb();

    const result = await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { image } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'User not found or image not changed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, image });
  } catch (error) {
    // // // console.error('Image update failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
