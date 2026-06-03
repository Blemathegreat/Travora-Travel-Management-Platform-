// src/components/BlogCard.jsx
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const dateValue = blog.date instanceof Date ? blog.date : new Date(blog.date)

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-[600px] mx-auto">
      <img src={blog.image} className="w-full h-48 object-cover" />

      <div className="p-4">
        <p className="text-gray-500 text-sm mb-2">
          {dateValue.toLocaleDateString("en-US", {
            month: "short",     day: "numeric",     year: "numeric"
          })}
        </p>    
        <h2 className="text-2xl sm:text-[30px] font-bold text-[#1E1E1E] leading-tight mb-3">{blog.title}</h2>
        <p className="text-[#7D7D7D] text-[16px] mt-2 leading-[24px]">{blog.excerpt}</p>

        <button
          onClick={() => {
    console.log("clicked:", blog.id);
    navigate(`/blog/${blog.id}`);
  }}
          className="mt-4 text-blue-500 font-semibold"
        >
          Read More →
        </button>
      </div>
    </div>
  );
};

export default BlogCard;