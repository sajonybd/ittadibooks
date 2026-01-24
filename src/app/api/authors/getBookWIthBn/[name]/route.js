


// import { connectDb } from "@/lib/connectDb";
// import { NextResponse } from "next/server";

// export async function GET(req, context) {
//   try {
//     const params = await context.params;
//     const encodedName = params.name;

//     if (!encodedName) {
//       return NextResponse.json({ message: "Author name is required" }, { status: 400 });
//     }

//     // Decode URI component and trim
//     const name = decodeURIComponent(encodedName).trim();


//     const db = await connectDb();

//     // Match books where authors array has exact name (Bangla)
//     const books = await db
//       .collection("books")
//       .find({
//         authors: { $elemMatch: { name: name } }
//       })
//       .toArray();

//     if (!books.length) {
//       return NextResponse.json(
//         { message: "No books found for this author" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(books, { status: 200 });
//   } catch (err) {
//     // // console.error("Error fetching books:", err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }





import { connectDb } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const encodedName = params.name;

    if (!encodedName) {
      return NextResponse.json({ message: "Author name is required" }, { status: 400 });
    }

    // Decode URI component and trim
    // const name = decodeURIComponent(encodedName).trim();


    const db = await connectDb();

    // Match books where authors array has exact name (Bangla)
    const books = await db
      .collection("books")
      .find({
        authors: {
          $elemMatch: {
            uid: encodedName
          }
        }
      })

      .toArray();

    if (!books.length) {
      return NextResponse.json(
        { message: "No books found for this author" },
        { status: 404 }
      );
    }

    return NextResponse.json(books, { status: 200 });
  } catch (err) {
    // // console.error("Error fetching books:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
