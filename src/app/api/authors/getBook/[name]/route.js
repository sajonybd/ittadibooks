import { connectDb } from '@/lib/connectDb';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const encodedName = params.name;
    const name = decodeURIComponent(encodedName);  
 

    const db = await connectDb();
    const books = await db
      .collection('books')
      .find({ author: name })
      .toArray();

    if (!books.length) {
      return NextResponse.json({ message: 'No books found for this author' }, { status: 404 });
    }

    return NextResponse.json(books, { status: 200 });
  } catch (err) {
    // // // console.error('Error fetching books:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
