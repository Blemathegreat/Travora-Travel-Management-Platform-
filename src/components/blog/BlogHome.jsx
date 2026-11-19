import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { api } from "../../utils/apiClient";

const PAGE_SIZE = 6;

const BlogHome = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all"); // a category slug, or "all"
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // the search text, after the person stops typing

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // Category buttons come from the database
  useEffect(() => {
    api
      .get("/api/blog/categories")
      .then((res) => setCategories((res?.data ?? res).categories || []))
      .catch(() => {}); // the page still works without the filter buttons
  }, []);

  // Wait 400ms after the last keystroke before searching (so we don't call the API on every letter)
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  function buildUrl(pageNumber) {
    const params = new URLSearchParams({ page: pageNumber, limit: PAGE_SIZE });
    if (category !== "all") params.set("category", category);
    if (query) params.set("q", query);
    return `/api/blog/posts?${params.toString()}`;
  }

  // Start again from page 1 whenever the category or the search changes
  useEffect(() => {
    let cancelled = false; // ignore slow answers to old requests
    setLoading(true);
    api
      .get(buildUrl(1))
      .then((res) => {
        if (cancelled) return;
        const data = res?.data ?? res;
        setPosts(data.posts || []);
        setPage(1);
        setTotalPages(data.totalPages || 1);
        setError("");
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await api.get(buildUrl(page + 1));
      const data = res?.data ?? res;
      setPosts((prev) => [...prev, ...(data.posts || [])]);
      setPage(page + 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  const tabs = [{ slug: "all", name: "All" }, ...categories];

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
          value={search}
          className="w-full max-w-md border p-3 rounded text-sm outline-none focus:border-slate-400"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORY FILTER */}
      <div className="max-w-[1400px] mx-auto flex flex-wrap gap-2 mt-6 mb-6">
        {tabs.map((cat) => (
          <motion.button
            key={cat.slug}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(cat.slug)}
            className={`px-10 py-4 rounded transition-colors ${
              category === cat.slug ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {error && (
        <div className="max-w-[1400px] mx-auto mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* BLOG GRID */}
      {loading ? (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                <div className="h-7 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="max-w-[1400px] mx-auto py-16 text-center text-gray-500">
          {query || category !== "all" ? "No posts match your search." : "No posts have been published yet. Please check back soon."}
        </div>
      ) : (
        <>
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
            <AnimatePresence>
              {posts.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {page < totalPages && (
            <div className="flex justify-center pb-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-10 py-3 rounded bg-[#103e72] text-white font-medium hover:bg-blue-900 disabled:opacity-60 transition-colors"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogHome;