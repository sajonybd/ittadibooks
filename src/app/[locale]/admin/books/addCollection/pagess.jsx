// "use client";
// import { useEffect, useState } from "react";

// export default function AddBookCollectionPage() {
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [collections, setCollections] = useState([]);

//   // Fetch existing collections
//   useEffect(() => {
//     const fetchCollections = async () => {
//       try {
//         const res = await fetch("/api/admin/books/collection/getAll");
//         const data = await res.json();
//         if (res.ok) setCollections(data);
//         else // // // console.error(data.error);
//       } catch (err) {
//         // // // console.error("Failed to fetch collections", err);
//       }
//     };
//     fetchCollections();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return alert("Please enter collection title");

//     setLoading(true);
//     const res = await fetch("/api/admin/books/addCollection", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title }),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (res.ok) {
//       alert("Collection added!");
//       setTitle("");
//       setCollections((prev) => [...prev, data]); // add new collection to list
//     } else {
//       alert(data.error || "Something went wrong");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
//       <h2 className="text-xl font-bold mb-4">Add Book Collection</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="e.g., Award Winning, Book Fair"
//           className="input input-bordered w-full mb-4"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="btn btn-success w-full"
//           disabled={loading}
//         >
//           {loading ? "Adding..." : "Add Collection"}
//         </button>
//       </form>

//       <div className="mt-8">
//         <h3 className="text-lg font-semibold mb-2">Existing Collections:</h3>
//         {collections.length === 0 ? (
//           <p className="text-gray-500">No collections found.</p>
//         ) : (
//           <ul className="list-disc list-inside text-gray-800 space-y-1">
//             {collections.map((col) => (
//               <li key={col._id}>{col.title}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
