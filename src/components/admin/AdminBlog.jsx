import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, Pencil, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { api } from '../../utils/apiClient';
import { cdn } from '../../utils/image';
import { showError, showSuccess, showWarning } from '../../utils/toastConfig';

const ease = [0.22, 1, 0.36, 1];
const EMPTY_FORM = { title: '', excerpt: '', content: '', categoryId: '' };

const unwrap = (res, key) => {
  const body = res?.data ?? res;
  return body?.[key] ?? [];
};

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating a new post
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null); // the NEW file the admin picked (if any)
  const [imagePreview, setImagePreview] = useState(''); // what we show in the box
  const [saving, setSaving] = useState(false);

  // categories panel
  const [showCategories, setShowCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api.get('/api/blog/admin/posts'), api.get('/api/blog/admin/categories')]);
      setPosts(unwrap(p, 'posts'));
      setCategories(unwrap(c, 'categories'));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // free the temporary preview address when it is replaced or the page closes
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  /* ---------------- modal ---------------- */
  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  }

  async function openEdit(post) {
    setEditingId(post.id);
    setImageFile(null);
    setImagePreview(post.coverImageUrl ? cdn(post.coverImageUrl, 600) : '');
    setForm({ title: post.title, excerpt: post.excerpt, content: '', categoryId: post.categoryId });
    setIsModalOpen(true);
    try {
      // the list does not carry the full article text, so fetch this one post
      const res = await api.get(`/api/blog/admin/posts/${post.id}`);
      const full = (res?.data ?? res).post;
      setForm((f) => ({ ...f, content: full.content }));
    } catch (err) {
      showError(err.message);
    }
  }

  function closeModal() {
    if (!saving) setIsModalOpen(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleImagePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return showWarning('Please choose a JPG, PNG or WebP image');
    if (file.size > 5 * 1024 * 1024) return showWarning('Image is too large. Maximum size is 5MB.');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // a temporary local address, nothing is uploaded yet
  }

  // `publish` is true when the admin pressed "Publish", false for "Save as draft" / "Save changes"
  async function handleSubmit(e, publish) {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.categoryId) {
      return showWarning('Please fill in the title, excerpt, content and category');
    }
    if (publish && !imageFile && !imagePreview) return showWarning('Add a cover image before publishing');

    // Files cannot travel as JSON, so we use FormData (a "multipart" form)
    const data = new FormData();
    data.append('title', form.title.trim());
    data.append('excerpt', form.excerpt.trim());
    data.append('content', form.content.trim());
    data.append('categoryId', form.categoryId);
    if (imageFile) data.append('image', imageFile);

    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/api/blog/admin/posts/${editingId}`, data);
        showSuccess('Post updated');
      } else {
        data.append('status', publish ? 'published' : 'draft');
        await api.post('/api/blog/admin/posts', data);
        showSuccess(publish ? 'Post published' : 'Draft saved');
      }
      setIsModalOpen(false);
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- card actions ---------------- */
  async function toggleStatus(post) {
    const next = post.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/api/blog/admin/posts/${post.id}/status`, { status: next });
      showSuccess(next === 'published' ? 'Post published' : 'Post unpublished');
      await load();
    } catch (err) {
      showError(err.message);
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This also removes its image and cannot be undone.`)) return;
    try {
      await api.delete(`/api/blog/admin/posts/${post.id}`);
      showSuccess('Post deleted');
      await load();
    } catch (err) {
      showError(err.message);
    }
  }

  /* ---------------- categories ---------------- */
  async function addCategory() {
    const name = newCategory.trim();
    if (name.length < 2) return showWarning('Please enter a category name');
    try {
      await api.post('/api/blog/admin/categories', { name });
      setNewCategory('');
      showSuccess('Category added');
      await load();
    } catch (err) {
      showError(err.message);
    }
  }

  async function removeCategory(cat) {
    try {
      await api.delete(`/api/blog/admin/categories/${cat.id}`);
      showSuccess('Category deleted');
      await load();
    } catch (err) {
      showError(err.message); // e.g. "This category still has posts"
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => setShowCategories((v) => !v)}
              className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4"
            >
              {showCategories ? 'Hide categories' : 'Manage categories'}
            </button>
            <button onClick={openCreate} className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-600 transition-colors">
              <Plus size={16} /> Add Blog
            </button>
          </div>

          {/* Categories panel */}
          <AnimatePresence initial={false}>
            {showCategories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">
                        {c.name} <span className="text-slate-400 text-xs">{c.postCount}</span>
                        <button
                          onClick={() => removeCategory(c)}
                          title={c.postCount > 0 ? 'Has posts. Cannot delete' : 'Delete category'}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                      placeholder="New category name"
                      className="flex-1 h-10 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <button onClick={addCategory} className="px-4 h-10 rounded-md bg-slate-700 text-white text-sm font-medium">Add</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loadError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {loadError}
              <button onClick={load} className="underline ml-3 font-medium">Try again</button>
            </div>
          )}

          {loading && <div className="text-center text-slate-500 py-16 animate-pulse">Loading posts...</div>}

          {!loading && !loadError && posts.length === 0 && (
            <div className="text-center text-slate-500 py-16">No blog posts yet. Click "Add Blog" to write your first one.</div>
          )}

          {/* Posts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {posts.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease, delay: Math.min(i, 8) * 0.04 }}
                  className="relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <span
                    className={`absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1 rounded-full ${
                      p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {p.status === 'published' ? 'Published' : 'Draft'}
                  </span>

                  {p.coverImageUrl ? (
                    <img src={cdn(p.coverImageUrl, 600)} alt={p.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-slate-200 flex items-center justify-center text-slate-400 text-sm">No image</div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-xs text-slate-400 mb-2 flex justify-between">
                      <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Not published'}</span>
                      <span>{p.views} views</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">{p.title}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{p.excerpt}</p>
                    <div className="text-xs text-teal-600 font-medium mb-4">{p.category} · {p.readMinutes} min read</div>

                    <div className="mt-auto flex items-center gap-1 border-t border-slate-100 pt-3">
                      <button onClick={() => openEdit(p)} title="Edit" className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => toggleStatus(p)}
                        title={p.status === 'published' ? 'Unpublish' : 'Publish'}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        {p.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {p.status === 'published' && (
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" title="View on site" className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button onClick={() => handleDelete(p)} title="Delete" className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                  onClick={closeModal}
                />
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.97 }}
                  transition={{ duration: 0.3, ease }}
                  className="relative bg-white rounded-xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto p-6 z-50"
                >
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={closeModal}>
                    <X size={24} />
                  </button>

                  <h2 className="text-lg font-semibold text-slate-900 mb-6">{editingId ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>

                  <form className="space-y-5" onSubmit={(e) => handleSubmit(e, false)}>
                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded" />
                            <label className="absolute bottom-2 right-2 bg-white/90 text-slate-700 text-xs px-3 py-1 rounded cursor-pointer shadow">
                              Change
                              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImagePick} className="hidden" />
                            </label>
                          </div>
                        ) : (
                          <label className="cursor-pointer block text-center py-8">
                            <p className="text-sm text-slate-600">Click to choose an image</p>
                            <p className="text-xs text-slate-400">JPG, PNG or WebP, up to 5MB</p>
                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImagePick} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Blog Title <span className="text-red-500">*</span></label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={200}
                        className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        placeholder="Enter blog title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                      <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                      >
                        <option value="">Choose a category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt <span className="text-red-500">*</span></label>
                      <textarea
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        maxLength={500}
                        className="w-full h-20 border border-slate-200 rounded-md px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="Short teaser shown on the blog list (10 to 500 characters)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Blog Content <span className="text-red-500">*</span></label>
                      <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        className="w-full h-48 border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="Write the full article here. Leave a blank line between paragraphs."
                      />
                      <p className="text-xs text-slate-400 mt-1">The reading time is worked out for you.</p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      {editingId ? (
                        <button type="submit" disabled={saving} className="flex-1 h-11 bg-[#103e72] text-white rounded-md font-medium hover:bg-blue-900 transition-colors disabled:opacity-60">
                          {saving ? 'Saving...' : 'Save changes'}
                        </button>
                      ) : (
                        <>
                          <button type="submit" disabled={saving} className="flex-1 h-11 border border-[#103e72] text-[#103e72] rounded-md font-medium hover:bg-slate-50 transition-colors disabled:opacity-60">
                            {saving ? 'Saving...' : 'Save as draft'}
                          </button>
                          <button type="button" disabled={saving} onClick={(e) => handleSubmit(e, true)} className="flex-1 h-11 bg-[#103e72] text-white rounded-md font-medium hover:bg-blue-900 transition-colors disabled:opacity-60">
                            {saving ? 'Publishing...' : 'Publish Blog'}
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}