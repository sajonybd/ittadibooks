// "use client";
// import { use, useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";

// export default function EditAuthorPage({ params: paramsPromise }) {
//   const params = use(paramsPromise);
//   const { id } = params;
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     nameBn: "",
//     email: "",
//     description: "",
//     descriptionBn: "",
//   });
// const { locale } = useParams();
//   useEffect(() => {
//     const fetchAuthor = async () => {
//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/authors/getDetail/${id}`);
//         setFormData({
//           name: res.data.name || "",
//           nameBn: res.data.nameBn || "",
//           email: res.data.email || "",
//           description: res.data.description || "",
//           descriptionBn: res.data.descriptionBn || "",
//         });
//       } catch (err) {
//         // // // console.error("Error fetching author details", err);
//       }
//     };

//     if (id) fetchAuthor();
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/authors/update/${id}`, formData);
//       router.push(`/admin/authors/${id}`);
//     } catch (err) {
//       // // // console.error("Error updating author", err);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-semibold mb-4">Edit Author</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Name (English)"
//           className="w-full border p-2 rounded"
//         />
//         <input
//           name="nameBn"
//           value={formData.nameBn}
//           onChange={handleChange}
//           placeholder="Name (Bangla)"
//           className="w-full border p-2 rounded"
//         />
//         <input
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email"
//           className="w-full border p-2 rounded"
//         />
//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           placeholder="Description (English)"
//           className="w-full border p-2 rounded"
//         />
//         <textarea
//           name="descriptionBn"
//           value={formData.descriptionBn}
//           onChange={handleChange}
//           placeholder="Description (Bangla)"
//           className="w-full border p-2 rounded"
//         />

//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Update Author
//         </button>
//       </form>
//     </div>
//   );
// }
