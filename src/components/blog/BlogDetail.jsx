// src/pages/BlogDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../utils/apiClient";
import { cdn } from "../../utils/image";
import { showSuccess, showError } from '../../utils/toastConfig';
import { 
  Share2,  
  Link2, 
  Mail,
  MessageCircle
} from "lucide-react";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | missing | error

  // Fetch the post whenever the address (slug) changes
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api
      .get(`/api/blog/posts/${slug}`)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data ?? res;
        setBlog(data.post);
        setRelated(data.related || []);
        setPopular(data.popular || []);
        setStatus("ready");
        window.scrollTo({ top: 0 });
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(/not found/i.test(err.message) ? "missing" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-12 w-3/4 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-5/6 bg-gray-100 rounded" />
      </div>
    );
  }

  // Handle case where blog is not found
  if (status !== "ready" || !blog) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            {status === "missing" ? "Blog Not Found" : "Something went wrong"}
          </h1>
          <p className="text-red-600">
            {status === "missing"
              ? "The blog post you're looking for doesn't exist."
              : "We could not load this post. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // Get current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(blog.title || '');
  const encodedSummary = encodeURIComponent(
    blog.excerpt || blog.content?.substring(0, 150) || ''
  );

  // Social share handlers
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      showSuccess('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      showError('Failed to copy link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className=" max-w-[1600px] mx-auto px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
          {/* Main Blog Content */}
          <article className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-8 lg:p-10">
            <div className="space-y-10">
              {/* Header Section */}
              <header className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {blog.publishedAt && <span className="font-medium">{new Date(blog.publishedAt).toLocaleDateString()}</span>}
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">{blog.readMinutes} min read</span>
                  {blog.category && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold border border-blue-200">
                      {blog.category}
                    </span>
                  )}
                </div>
              </header>

              {/* Featured Image */}
              {blog.coverImageUrl && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                  <img
                    src={cdn(blog.coverImageUrl, 1400)}
                    alt={blog.title}
                    className="w-full h-64 lg:h-80 xl:h-96 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Blog Content */}
              {blog.content && (
                <div className="prose prose-lg xl:prose-xl max-w-none text-gray-700 leading-relaxed">
                  <div className="whitespace-pre-line text-base lg:text-lg">
                    {blog.content}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Share this article
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                  >
                    <Share2 size={18} />
                    <span className="font-medium">Facebook</span>
                  </a>

                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 shadow-md"
                  >
                    <Share2 size={18} />
                    <span className="font-medium">Twitter</span>
                  </a>

                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 shadow-md"
                  >
                    <Share2 size={18} />
                    <span className="font-medium">LinkedIn</span>
                  </a>

                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md"
                  >
                    <MessageCircle size={18} />
                    <span className="font-medium">WhatsApp</span>
                  </a>

                  <a
                    href={shareLinks.email}
                    aria-label="Share via Email"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-md"
                  >
                    <Mail size={18} />
                    <span className="font-medium">Email</span>
                  </a>

                  <button
                    onClick={copyToClipboard}
                    type="button"
                    aria-label="Copy link to clipboard"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-full hover:bg-gray-50 hover:shadow-lg transition-all duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-md"
                  >
                    <Link2 size={18} />
                    <span className="font-medium">Copy Link</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
         {/* RELATED POSTS */}
<div className="mt-10 max-w-5xl">
   <h2 className="text-xl font-bold mb-6 text-gray-900">Popular Posts</h2>
  <div className="space-y-6">
    {popular.map(item => (
      <div key={item.id} onClick={() => navigate(`/blog/${item.slug}`)} className="flex gap-4 group cursor-pointer">
        {/* Image */}
        <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded">
          <img 
            src={cdn(item.coverImageUrl, 300) || '/placeholder.jpg'} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Category and Read Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase mb-2">
            <span>{item.category}</span>
            <span>•</span>
            <span>{item.readMinutes} MIN READ</span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.excerpt}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
          {/* RELATED POSTS */}
<div className="mt-10 max-w-4xl">
  <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-wide">
    Here are some related articles you may find interesting:
  </h2>
  <div className="space-y-6">
    {related.map(item => (
      <div key={item.id} onClick={() => navigate(`/blog/${item.slug}`)} className="flex gap-4 group cursor-pointer">
        {/* Image */}
        <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded">
          <img 
            src={cdn(item.coverImageUrl, 300) || '/placeholder.jpg'} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Category and Read Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase mb-2">
            <span>{item.category}</span>
            <span>•</span>
            <span>{item.readMinutes} MIN READ</span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.excerpt}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;