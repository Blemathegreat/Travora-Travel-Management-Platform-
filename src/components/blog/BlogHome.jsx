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
    <div className="max-w-[1600px] mx-auto py-8">
      {/* SEARCH */}
      <div className="flex justify-between">
       <div className="flex flex-col gap-4">
         <h1 className="text-black">Viaggio Abroad Blogs</h1>
         <p className="items-start mb-4">Blog Topic</p>
       </div>
          <input
        type="text"
        placeholder="Search blog..."
        className="border p-2  mb-4 rounded"
        onChange={(e) => setSearch(e.target.value)}
      />
      </div>
    

      {/* CATEGORY FILTER */}
      <div className=" max-w-[1400px] mx-auto  flex gap-2 mb-6">
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
      <div className=" max-w-[1400px] mx-auto   grid grid-cols-2  py-6 gap-3">
        {filteredBlogs.slice(0, 6).map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogHome;