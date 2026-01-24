import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/connectDb';

export async function GET(req, { params }) {
  const { locale } = params;

  try {
    const db = await connectDb();

    const doc = await db.collection('translations').findOne({ locale });

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(doc.messages); // send just the `messages` object
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
