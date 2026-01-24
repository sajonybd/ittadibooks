import { connectDb } from '@/lib/connectDb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  try {
    const params = await context.params; // unwrap if Promise
    const { id } = params;

    const db = await connectDb();
    const category = await db
      .collection('categories')
      .findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json({ message: 'category not found' }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    // // // console.error('Error fetching author:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
