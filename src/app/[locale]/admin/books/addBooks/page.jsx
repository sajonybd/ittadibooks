"use client";

import { useState, useEffect, useRef } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "@/app/components/CustomDateInput";
import toast from "react-hot-toast";

export default function AddBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [subtitleBn, setSubtitleBn] = useState("");

  const [authorList, setAuthorList] = useState([{ name: "", uid: "" }]);
  const [translatorList, setTranslatorList] = useState([{ name: "", uid: "" }]);
  const [editorList, setEditorList] = useState([{ name: "", uid: "" }]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [categoriesSelected, setCategoriesSelected] = useState([
    { category: null, subCategory: [] },
  ]);

  
  const [publisher, setPublisher] = useState(null);
  const [customPublisher, setCustomPublisher] = useState("");

  const PUBLISHER_OPTIONS = [
    {
      value: "ittadi",
      label: "ইত্যাদি গ্রন্থ প্রকাশ / Ittadi Grantho Prokash",
    },
    { value: "bhumika", label: "ভূমিকা / Bhumika" },
    { value: "other", label: "অন্যান্য (Other)" },
  ];
  const [publishedDate, setPublishedDate] = useState("");
  const [isbn, setIsbn] = useState("");
  
  const [language, setLanguage] = useState(null);
  const LANGUAGE_OPTIONS = [
    { value: "bangla", label: "বাংলা / Bangla" },
    { value: "english", label: "ইংরেজি / English" },
  ];
  const [format, setFormat] = useState("");
  const [edition, setEdition] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [orderType, setOrderType] = useState("");
  
  const [collections, setCollections] = useState([]);
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [bookPdf, setBookPdf] = useState(null);
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/authors/getAllName`
      );
      setAuthors(data?.data?.authors || []);
    };
   
    const fetchCategories = async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/getAll`
      );
      const categories = data?.data?.categories || [];

      // 🔤 Sort Bangla category names alphabetically
      categories.sort((a, b) =>
        (a.nameBn || "").localeCompare(b.nameBn || "", "bn")
      );

      setCategories(categories);
    };
    fetchAuthors();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (price) {
      if (discount) {
        const discountAmount = (Number(price) * Number(discount)) / 100;
        const discounted = Number(price) - discountAmount;
        setDiscountedPrice(Math.round(discounted));
      } else {
        setDiscountedPrice(Number(price));
      }
    } else {
      setDiscountedPrice("");
    }
  }, [price, discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("titleEn", titleEn);
      formData.append("titleBn", titleBn);
      formData.append("subtitleEn", subtitleEn);
      formData.append("subtitleBn", subtitleBn);

      authorList.forEach((a) =>
        formData.append("authors[]", JSON.stringify(a))
      );
      translatorList.forEach((t) =>
        formData.append("translators[]", JSON.stringify(t))
      );
      editorList.forEach((e) =>
        formData.append("editors[]", JSON.stringify(e))
      );

      
      formData.append(
        "publisher",
        publisher?.value === "other" ? customPublisher : publisher?.label || ""
      );
      formData.append("publishedDate", publishedDate);
      formData.append("isbn", isbn);
      
      formData.append("language", language?.label || "");
      formData.append("format", format);
      formData.append("edition", edition);
      formData.append("pages", pages);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("discountedPrice", discountedPrice);
      formData.append("orderType", orderType);
      formData.append("availability", availability);
     

      categoriesSelected.forEach((catObj) => {
        if (catObj.category) {
          formData.append(
            "categories[]",
            JSON.stringify({
              category: catObj.category.label.split(" / ")[0], // save Bangla name
              subCategory: Array.isArray(catObj.subCategory)
                ? catObj.subCategory.map((s) => s.value) // extract array of values
                : [],
            })
          );
        }
      });

  

      formData.append("description", description);
      formData.append("descriptionBn", descriptionBn);
      formData.append("coverImage", coverImage);
      if (bookPdf) formData.append("bookPdf", bookPdf);
      
      collections.forEach((c) =>
        formData.append("collections[]", JSON.stringify(c))
      );

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/addBook`,
        formData
      );

      if (res.data.success) {
        toast.success("Book added successfully");
        window.location.reload();
      } else {
        toast.error("Failed to add book");
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error("Cover image is required");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addField = (setter, arr) => setter([...arr, { name: "", uid: "" }]);
  const removeField = (setter, arr, idx) =>
    setter(arr.filter((_, i) => i !== idx));
  const handleFieldChange = (setter, arr, idx, value, uid) => {
    const updated = [...arr];
    updated[idx] = { name: value, uid };
    setter(updated);
  };
  const addCategoryField = () => {
    setCategoriesSelected([
      ...categoriesSelected,
      { category: null, subCategory: null },
    ]);
  };

  const removeCategoryField = (idx) => {
    setCategoriesSelected(categoriesSelected.filter((_, i) => i !== idx));
  };


  const handleCategoryChange = (idx, selected) => {
    const updated = [...categoriesSelected];
    updated[idx].category = selected;
    updated[idx].subCategory = []; // reset subcategories when category changes
    setCategoriesSelected(updated);
  };

  
  const handleSubCategoryChange = (idx, selected) => {
    const updated = [...categoriesSelected];
    updated[idx].subCategory = selected || []; // always array
    setCategoriesSelected(updated);
  };

  return (
    <div className="px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex lg:flex-row flex-col justify-between gap-10">
          {/* Left side */}
          <div className="lg:grid lg:grid-cols-3 gap-5 lg:w-[60%] space-y-3">
            {/* Titles */}
            <div>
              <label className="block mb-1 font-medium">Title (English)</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Title (Bangla)</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Sub Title (English)
              </label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Sub Title (Bangla)
              </label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={subtitleBn}
                onChange={(e) => setSubtitleBn(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Publisher</label>
              <Select
                className="w-full"
                options={PUBLISHER_OPTIONS}
                value={publisher}
                onChange={(selected) => {
                  setPublisher(selected);
                  if (selected.value !== "other") {
                    setCustomPublisher("");
                  }
                }}
                placeholder="Select Publisher..."
              />
              {publisher?.value === "other" && (
                <input
                  type="text"
                  className="w-full border p-2 rounded mt-2"
                  placeholder="Enter publisher name"
                  value={customPublisher}
                  onChange={(e) => setCustomPublisher(e.target.value)}
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Published Date</label>
              
              <DatePicker
                selected={
                  publishedDate
                    ? new Date(publishedDate.split("/").reverse().join("/"))
                    : null
                }
                onChange={(date) => {
                  if (date) {
                    const formattedDate = new Intl.DateTimeFormat(
                      "en-GB"
                    ).format(date);
                    setPublishedDate(formattedDate);
                  } else {
                    setPublishedDate("");
                  }
                }}
                placeholderText="dd/mm/yyyy"
                dateFormat="dd/MM/yyyy"
                wrapperClassName="w-full"
                className="border-1 py-2 px-4 rounded-lg w-full"
              />
            </div>

            {/* Dynamic Authors */}
            <div>
              <label className="block mb-1 font-medium">Author(s)</label>
              {authorList.map((a, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Select
                    className="w-full"
                    options={[...authors]
                      .sort((x, y) => x.nameBn.localeCompare(y.nameBn, "bn"))
                      .map((au) => ({
                        value: au.uid,
                        label: `${au.nameBn} / ${au.name}`,
                      }))}
                    value={a.uid ? { value: a.uid, label: a.name } : null}
                    onChange={(selected) =>
                      handleFieldChange(
                        setAuthorList,
                        authorList,
                        idx,
                        selected.label,
                        selected.value
                      )
                    }
                    isSearchable
                  />
                  {authorList.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-600 text-white px-2 rounded"
                      onClick={() =>
                        removeField(setAuthorList, authorList, idx)
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded mt-1"
                onClick={() => addField(setAuthorList, authorList)}
              >
                + Add
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-3 py-1 rounded mt-1 ml-2"
                onClick={() => setAuthorList([{ uid: "", name: "" }])}
              >
                Clear All
              </button>
            </div>

            {/* Translators */}
            <div>
              <label className="block mb-1 font-medium">Translator(s)</label>
              {translatorList.map((t, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Select
                    className="w-full"
                    options={[...authors]
                      .sort((x, y) => x.nameBn.localeCompare(y.nameBn, "bn"))
                      .map((au) => ({
                        value: au.uid,
                        label: `${au.nameBn} / ${au.name}`,
                      }))}
                    value={t.uid ? { value: t.uid, label: t.name } : null}
                    onChange={(selected) =>
                      handleFieldChange(
                        setTranslatorList,
                        translatorList,
                        idx,
                        selected.label,
                        selected.value
                      )
                    }
                    isSearchable
                  />
                  {translatorList.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-600 text-white px-2 rounded"
                      onClick={() =>
                        removeField(setTranslatorList, translatorList, idx)
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded mt-1"
                onClick={() => addField(setTranslatorList, translatorList)}
              >
                + Add
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-3 py-1 rounded mt-1 ml-2"
                onClick={() => setTranslatorList([{ uid: "", name: "" }])}
              >
                Clear All
              </button>
            </div>

            {/* Editors */}
            <div>
              <label className="block mb-1 font-medium">Editor(s)</label>
              {editorList.map((e, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Select
                    className="w-full"
                    options={[...authors]
                      .sort((x, y) => x.nameBn.localeCompare(y.nameBn, "bn"))
                      .map((au) => ({
                        value: au.uid,
                        label: `${au.nameBn} / ${au.name}`, // your original format
                      }))}
                    value={e.uid ? { value: e.uid, label: e.name } : null}
                    onChange={(selected) =>
                      handleFieldChange(
                        setEditorList,
                        editorList,
                        idx,
                        selected.label,
                        selected.value
                      )
                    }
                    isSearchable
                  />
                  {editorList.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-600 text-white px-2 rounded"
                      onClick={() =>
                        removeField(setEditorList, editorList, idx)
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded mt-1"
                onClick={() => addField(setEditorList, editorList)}
              >
                + Add
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-3 py-1 rounded mt-1 ml-2"
                onClick={() => setEditorList([{ uid: "", name: "" }])}
              >
                Clear All
              </button>
            </div>

            {/* ISBN,  Language, Format, Edition, Pages */}

            <div>
              <label className="block mb-1 font-medium">ISBN</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Language</label>
              <Select
                className="w-full"
                options={LANGUAGE_OPTIONS}
                value={language}
                onChange={setLanguage}
                placeholder="Select Language..."
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Format</label>
              <select
                className="w-full border px-3 py-1 rounded"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="">Select Format</option>
                <option value="হার্ড কভার (১/১৬)">হার্ড কভার (১/১৬)</option>
                <option value="হার্ড কভার (১/৮)">হার্ড কভার (১/৮)</option>
                <option value="পেপারব্যাক (১/১৬)">পেপারব্যাক (১/১৬)</option>
                <option value="পেপারব্যাক (১/৮)">পেপারব্যাক (১/৮)</option>
                <option value="পেপারব্যাক (কালার বুক)">
                  পেপারব্যাক (কালার বুক)
                </option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Edition</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Pages</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>

            {/* Price, Discount, Discounted Price */}
            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Discount (%)</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Discounted Price</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded bg-gray-100"
                value={discountedPrice}
                disabled
              />
            </div>

            {/* Order Type */}
            <div>
              <label className="block mb-1 font-medium">Order Type</label>
              <select
                className="w-full border px-3 py-1 rounded"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="">Select Order Type</option>
                <option value="Buy Now">Buy Now</option>
                <option value="Pre-Order">Pre-Order</option>
              </select>
            </div>
            {/* Product Availability */}
            <div>
              <label className="block mb-1 font-medium">Product Availability</label>
              <select
                className="w-full border px-3 py-1 rounded"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">Select Availability</option>
                <option value="In Stock">In Stock</option>
                <option value="Stock Out">Stock Out</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Right side */}
          <div className="lg:w-[35%] space-y-8">
           

            <div>
              <label className="block mb-1 font-medium">
                Categories & Subcategories
              </label>

              {categoriesSelected.map((catObj, idx) => (
                <div key={idx} className="border p-2 mb-3 rounded space-y-2">
                  <Select
                    options={categories
                      .slice() // copy to avoid mutating original
                      .sort((a, b) => a.bn.localeCompare(b.bn, "bn"))
                      .map((c) => ({
                        value: c._id,
                        label: `${c.bn} / ${c.en}`,
                        subcategories: c.subcategories,
                      }))}
                    value={catObj.category}
                    onChange={(selected) => handleCategoryChange(idx, selected)}
                    placeholder="Select category..."
                  />

                  {catObj.category?.subcategories?.length > 0 && (
                   
                    <Select
                      className="border focus:border-black"
                      options={catObj.category.subcategories
                        .slice()
                        .sort((a, b) => a.bn.localeCompare(b.bn, "bn"))
                        .map((sc) => ({
                          value: sc.bn, // save Bangla
                          label: `${sc.bn} / ${sc.en}`,
                        }))}
                      value={catObj.subCategory}
                      onChange={(selected) =>
                        handleSubCategoryChange(idx, selected)
                      }
                      isMulti
                      isSearchable
                      placeholder="Select subcategory..."
                    />
                  )}
                  {categoriesSelected.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-600 text-white px-2 py-1 rounded mt-1"
                      onClick={() => removeCategoryField(idx)}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded mt-1"
                onClick={addCategoryField}
              >
                + Add Category
              </button>
            </div>
            

            {/* Collections */}
            <div>
              <label className="block mb-1 font-medium">Collections</label>
              {collections.map((c, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Select
                    className="w-full"
                    options={[
                      { id: "bookfair2025", label: "Book Fair 2025" },
                      { id: "ittadiBooks", label: "Ittadi Books" },
                      { id: "bhumikaBooks", label: "Bhumika Books" },
                      { id: "awardWinners", label: "Award Winning Books" },
                      { id: "newArrivals", label: "New Arrivals" },
                      { id: "bestSellers", label: "Best Sellers" },
                      { id: "editorChoice", label: "Editor’s Choice" },
                      { id: "mustReads", label: "Must Reads" },
                    ].map((col) => ({ value: col.id, label: col.label }))}
                    value={c.value ? { value: c.value, label: c.label } : null}
                    onChange={(selected) => {
                      const updated = [...collections];
                      updated[idx] = {
                        value: selected.value,
                        label: selected.label,
                      };
                      setCollections(updated);
                    }}
                    isSearchable
                    placeholder="Select collection..."
                  />
                  {collections.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-600 text-white px-2 rounded"
                      onClick={() =>
                        setCollections(collections.filter((_, i) => i !== idx))
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded mt-1"
                onClick={() =>
                  setCollections([...collections, { value: "", label: "" }])
                }
              >
                + Add
              </button>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Description (English)
              </label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Description (Bangla)
              </label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
              ></textarea>
            </div>

             

            <div>
              <label className="block mb-1 font-medium">Cover Image</label>

              {/* If existing cover or newly selected image exists, show preview with remove button */}
              {coverImage ? (
                <div className="mb-2 relative w-32 h-32">
                  <img
                    src={
                      coverImage
                        ? URL.createObjectURL(coverImage)
                        : existingCover
                    }
                    alt="cover"
                    className="w-32 h-32 object-contain border p-2 rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white px-2 rounded"
                    onClick={() => {
                      setCoverImage(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""; // clears the input
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-2">No cover selected</p>
              )}

              {/* File input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Book PDF */}
            <div>
              <label className="block mb-1 font-medium">Book PDF</label>

              {bookPdf ? (
                <div className="mb-2 relative w-32 h-32 flex items-center justify-center border p-2 rounded">
                  <span className="text-sm text-gray-700">PDF Selected</span>
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white px-2 rounded"
                    onClick={() => {
                      setBookPdf(null);
                      // You might want a separate ref for the PDF input if you need to clear it specifically
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-2">No PDF selected</p>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setBookPdf(e.target.files[0])}
                className="border p-2 rounded w-full"
              />
            </div>
             

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white w-full py-2 rounded mt-2"
            >
              {isSubmitting ? "Submitting..." : "Add Book"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
