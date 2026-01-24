

"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "@/app/components/CustomDateInput";
const COLLECTION_OPTIONS = [
  { value: "bookfair2025", label: "Book Fair 2025" },
  { value: "ittadiBooks", label: "Ittadi Books" },
  { value: "bhumikaBooks", label: "Bhumika Books" },
  { value: "awardWinners", label: "Award Winning Books" },
  { value: "newArrivals", label: "New Arrivals" },
  { value: "bestSellers", label: "Best Sellers" },
  { value: "editorChoice", label: "Editor’s Choice" },
  { value: "mustReads", label: "Must Reads" },
];

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [subtitleBn, setSubtitleBn] = useState("");
  const fileInputRef = useRef(null);
  const [authorList, setAuthorList] = useState([{ name: "", uid: "" }]);
  const [translatorList, setTranslatorList] = useState([{ name: "", uid: "" }]);
  const [editorList, setEditorList] = useState([{ name: "", uid: "" }]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState([
    { category: null, subCategory: null },
  ]);
  // const [publisher, setPublisher] = useState("");
  const [publisher, setPublisher] = useState(null);
  const [customPublisher, setCustomPublisher] = useState("");

  const [publishedDate, setPublishedDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [language, setLanguage] = useState("");
  const [format, setFormat] = useState("");
  const [edition, setEdition] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [orderType, setOrderType] = useState("");
  const [availability, setAvailability] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [collections, setCollections] = useState([]);
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [bookPdf, setBookPdf] = useState(null);
  const [existingCover, setExistingCover] = useState("");
  const [existingBookPdf, setExistingBookPdf] = useState("");
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

      setCategories(data?.data?.categories || []);
    };
    fetchAuthors();
    fetchCategories();
  }, []);
  const PUBLISHER_OPTIONS = [
    {
      value: "ittadi",
      label: "ইত্যাদি গ্রন্থ প্রকাশ / Ittadi Grantho Prokash",
    },
    { value: "bhumika", label: "ভূমিকা / Bhumika" },
    { value: "other", label: "অন্যান্য (Other)" },
  ];
  const LANGUAGE_OPTIONS = [
    { value: "bangla", label: "বাংলা / Bangla" },
    { value: "english", label: "ইংরেজি / English" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch categories from DB
        const catRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories/getAll`
        );
        const cats = catRes.data.categories || [];
        setCategories(cats);

        // 2. Fetch book data
        const bookRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/bookbyid/${id}`
        );
        const book = bookRes.data;

        // 3. Map book.categories array to categoriesSelected
        const mappedCategories = (book.categories || [])
          .map((cat) => {
            const catObj = cats.find(
              (c) => c.bn === cat.category || c.en === cat.category
            );
            if (!catObj) return null;

            let subCatArray = [];
            if (cat.subCategory && catObj.subcategories?.length > 0) {
              // if DB stores multiple subcategories, make it an array
              const subCats = Array.isArray(cat.subCategory)
                ? cat.subCategory
                : [cat.subCategory];

              subCatArray = subCats
                .map((scBn) => {
                  const subObj = catObj.subcategories.find(
                    (sc) => sc.bn === scBn
                  );
                  if (!subObj) return null;
                  return {
                    value: subObj.bn,
                    label: `${subObj.bn} / ${subObj.en}`,
                  };
                })
                .filter(Boolean);
            }

            return {
              category: {
                value: catObj._id,
                label: `${catObj.bn} / ${catObj.en}`,
                subcategories: catObj.subcategories || [],
              },
              subCategory: subCatArray, // always array for multi-select
            };
          })
          .filter(Boolean);

        setCategoriesSelected(
          mappedCategories.length > 0
            ? mappedCategories
            : [{ category: null, subCategory: [] }] // default empty array
        );

        // 4. Set other fields
        setTitleEn(book.title.en || "");
        setTitleBn(book.title.bn || "");
        setSubtitleEn(book.title.subtitle?.en || "");
        setSubtitleBn(book.title.subtitle?.bn || "");
        setAuthorList(
          book.authors.length ? book.authors : [{ name: "", uid: "" }]
        );
        setTranslatorList(
          book.translators.length ? book.translators : [{ name: "", uid: "" }]
        );
        setEditorList(
          book.editors.length ? book.editors : [{ name: "", uid: "" }]
        );
        // setPublisher(book.publisher || "");
        // Handle publisher on fetch
        const savedPublisher = book.publisher || "";

        const publisherOption = PUBLISHER_OPTIONS.find(
          (opt) => opt.value === savedPublisher || opt.label === savedPublisher
        );

        if (publisherOption) {
          setPublisher(publisherOption);
          setCustomPublisher("");
        } else {
          setPublisher({ value: "other", label: "অন্যান্য (Other)" });
          setCustomPublisher(savedPublisher);
        }
        setPublishedDate(book.publishedDate?.slice(0, 10) || "");
        setIsbn(book.isbn || "");
        const savedLanguage = book.language; // "বাংলা / Bangla"

        const languageOption = LANGUAGE_OPTIONS.find(
          (opt) => opt.label === savedLanguage
        );
        setLanguage(languageOption || null);
        // setLanguage(book.language ||"");
        setFormat(book.format || "");
        setEdition(book.edition || "");
        setPages(book.pages || "");
        setPrice(book.price || "");
        setDiscount(book.discount || "");
        setOrderType(book.orderType || "");
        setAvailability(book.availability || "");

        setCollections(
          book.collections.length
            ? book.collections.map((c) => ({
              value: c.value,
              label: c.label,
            }))
            : []
        );

        setDescription(book.description?.en || "");
        setDescriptionBn(book.description?.bn || "");
        setExistingCover(book.cover?.url || "");
        setExistingBookPdf(book?.pdf.url || "")
      } catch (err) {
        toast.error("Failed to load book data");
        // // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Discounted price calculation
  useEffect(() => {
    if (price) {
      if (discount) {
        const discountAmount = (Number(price) * Number(discount)) / 100;
        setDiscountedPrice(Math.round(Number(price) - discountAmount));
      } else {
        setDiscountedPrice(Number(price));
      }
    } else setDiscountedPrice("");
  }, [price, discount]);

  // Field helpers
  const addField = (setter, arr) => setter([...arr, { name: "", uid: "" }]);
  const removeField = (setter, arr, idx) =>
    setter(arr.filter((_, i) => i !== idx));
  const handleFieldChange = (setter, arr, idx, value, uid) => {
    const updated = [...arr];
    updated[idx] = { name: value, uid };
    setter(updated);
  };

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

      // formData.append("publisher", publisher);
      formData.append(
        "publisher",
        publisher?.value === "other" ? customPublisher : publisher?.label || ""
      );
      formData.append("publishedDate", publishedDate);
      formData.append("isbn", isbn);
      formData.append("language", language ? language.label : "");
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
              category: catObj.category.label.split(" / ")[0], // Bangla only
              subCategory: catObj.subCategory?.map((sc) => sc.value) || [],

              // subCategory: catObj.subCategory ? catObj.subCategory.value : null,
            })
          );
        }
      });

      formData.append("description", description);
      formData.append("descriptionBn", descriptionBn);
      if (coverImage) formData.append("coverImage", coverImage);
      if (bookPdf) formData.append("bookPdf", bookPdf);
      // collections.forEach((c) => formData.append("collections[]", c));
      collections.forEach((c) =>
        formData.append("collections[]", JSON.stringify(c))
      );

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/update/${id}`,
        formData
      );
      if (res.data.success) {
        toast.success("Book updated successfully");
        router.push("/admin/books");
      } else {
        toast.error("Failed to update book");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h3 className="text-xl">Loading...</h3>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Edit Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex lg:flex-row flex-col justify-between gap-10">
          {/* Left side */}
          <div className="lg:grid lg:grid-cols-3 gap-5 lg:w-[60%] ">
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

            {/* Publisher, Published Date */}

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
              {/* <input
                type="date"
                lang="en-GB"
                className="w-full border px-3 py-2 rounded"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
              /> */}
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

            {/* Authors, Translators, Editors */}
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
            {/* <DynamicSelect
              label="Author(s)"
              list={authorList}
              setter={setAuthorList}
              options={authors}
            />
            <DynamicSelect
              label="Translator(s)"
              list={translatorList}
              setter={setTranslatorList}
              options={authors}
            />
            <DynamicSelect
              label="Editor(s)"
              list={editorList}
              setter={setEditorList}
              options={authors}
            /> */}

            {/* ISBN, Language, Format, Edition, Pages */}
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
          <div className="lg:w-[35%] space-y-3 ">
            {/* Category */}


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
                      options={catObj.category.subcategories.slice()
                        .sort((a, b) => a.bn.localeCompare(b.bn, "bn")).map((sc) => ({
                          value: sc.bn, // save Bangla
                          label: `${sc.bn} / ${sc.en}`,
                        }))}
                      value={catObj.subCategory}
                      onChange={(selected) =>
                        handleSubCategoryChange(idx, selected)
                      }
                      isMulti // <-- allow multiple subcategories
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



            <div>
              <label className="block mb-1 font-medium">Collections</label>
              {collections.map((c, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Select
                    className="w-full"
                    options={COLLECTION_OPTIONS}
                    value={c || null}
                    onChange={(selected) => {
                      const updated = [...collections];
                      updated[idx] = selected;
                      setCollections(updated);
                    }}
                    isSearchable
                    placeholder="Select collection..."
                  />
                  {collections.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-600 text-white px-2 py-1 rounded"
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
                onClick={() => setCollections([...collections, null])}
              >
                + Add Collection
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">
                Description (English)
              </label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Description (Bangla)
              </label>
              <textarea
                className="w-full border px-3 py-2 rounded"
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
              />
            </div>


            {/* Cover Image */}
            <div>
              <label className="block mb-1 font-medium">Cover Image</label>

              {/* If existing cover or newly selected image exists, show preview with remove button */}
              {existingCover || coverImage ? (
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
                      setExistingCover(null);
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
            {/* Pdf  */}
            <div>
              <label className="block mb-1 font-medium">Book Pdf</label>

              {/* If existing cover or newly selected image exists, show preview with remove button */}
              {/* {existingBookPdf || bookPdf ? (
                <div className="mb-2 relative w-32 h-32">
                  <img
                    src={
                      coverImage
                        ? URL.createObjectURL(bookPdf)
                        : existingBookPdf
                    }
                    alt="cover"
                    className="w-32 h-32 object-contain border p-2 rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white px-2 rounded"
                    onClick={() => {
                      setBookPdf(null);
                      setExistingBookPdf(null);
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
              )} */}

              {/* File input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => setBookPdf(e.target.files[0])}
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white w-full py-2 rounded mt-2"
            >
              {isSubmitting ? "Updating..." : "Update Book"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Reusable Dynamic Select Component
function DynamicSelect({ label, list, setter, options }) {
  const addField = (setter, arr) => setter([...arr, { name: "", uid: "" }]);
  const removeField = (setter, arr, idx) =>
    setter(arr.filter((_, i) => i !== idx));
  const handleFieldChange = (setter, arr, idx, value, uid) => {
    const updated = [...arr];
    updated[idx] = { name: value, uid };
    setter(updated);
  };

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      {list.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <Select
            className="w-full"
            options={options
              .filter((au) => au.nameBn) // only keep entries with nameBn
              .sort((a, b) => a.nameBn.localeCompare(b.nameBn, "bn"))
              .map((au) => ({
                value: au.uid,
                label: `${au.nameBn} / ${au.name}`,
              }))}
            value={item.uid ? { value: item.uid, label: item.name } : null}
            onChange={(selected) =>
              handleFieldChange(
                setter,
                list,
                idx,
                selected.label,
                selected.value
              )
            }
            isSearchable
          />
          {list.length > 1 && (
            <button
              type="button"
              className="bg-red-600 text-white px-2 rounded"
              onClick={() => removeField(setter, list, idx)}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="bg-green-600 text-white px-3 py-1 rounded mt-1"
        onClick={() => addField(setter, list)}
      >
        + Add
      </button>
    </div>
  );
}
