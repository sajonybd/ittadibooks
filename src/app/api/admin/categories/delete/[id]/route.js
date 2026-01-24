import { connectDb } from '@/lib/connectDb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(req, context) {
  try {
    const params = await context.params; // unwrap if Promise
    const { id } = params;
    if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

    const db = await connectDb();
    const result = await db
      .collection('categories')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    // // // console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
