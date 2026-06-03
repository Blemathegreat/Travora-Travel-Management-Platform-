// src/pages/Home.jsx
import { useState } from "react";
import BlogCard from "./BlogCard";
import { useBlogContext } from "../../context/BlogContext";


const BlogHome = () => {
  const { blogs } = useBlogContext();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase());  

    const matchesCategory =
      category === "All" || blog.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6">
      {/* SEARCH */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-black text-3xl font-semibold">Viaggio Abroad Blogs</h1>
          <p className="text-gray-600">Blog Topic</p>
        </div>

        <input
          type="text"
          placeholder="Search blog..."
          className="w-full max-w-md border p-3 rounded text-sm outline-none focus:border-slate-400"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORY FILTER */}
      <div className="max-w-[1400px] mx-auto flex flex-wrap gap-2 mt-6 mb-6">
        {["All", "Programming", "Design", "Tech", "Business","Self Growth", "Career", "Freelancing","Designing"].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-10 py-4 rounded ${
              category === cat ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* BLOG GRID */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
        {filteredBlogs.slice(0, 6).map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogHome;