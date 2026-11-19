import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cdn } from "../../utils/image";

const BlogCard = ({ blog, index = 0 }) => {
  const navigate = useNavigate();
  const date = blog.publishedAt ? new Date(blog.publishedAt) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 5) * 0.07 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden w-full max-w-[600px] mx-auto"
    >
      {blog.coverImageUrl ? (
        <img src={cdn(blog.coverImageUrl, 800)} alt={blog.title} loading="lazy" className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-slate-200" />
      )}

      <div className="p-4">
        <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
          <span>
            {date && !Number.isNaN(date.getTime())
              ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : ""}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{blog.category}</span>
        </div>
        <h2 className="text-2xl sm:text-[30px] font-bold text-[#1E1E1E] leading-tight mb-3">{blog.title}</h2>
        <p className="text-[#7D7D7D] text-[16px] mt-2 leading-[24px] line-clamp-3">{blog.excerpt}</p>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => navigate(`/blog/${blog.slug}`)} className="text-blue-500 font-semibold">
            Read More →
          </button>
          <span className="text-xs text-gray-400">{blog.readMinutes} min read</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;