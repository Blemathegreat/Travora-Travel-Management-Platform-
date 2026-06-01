import { createContext, useContext, useMemo, useState } from 'react'
import { blogs as initialBlogs } from '../components/blog/BlogData'

const BlogContext = createContext(null)

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState(() =>
    initialBlogs.map((entry) => ({
      ...entry,
      date: entry.date instanceof Date ? entry.date : new Date(entry.date),
    }))
  )

  const addBlog = (blog) => {
    setBlogs((prev) => [{ ...blog, id: Date.now() }, ...prev])
  }

  const removeBlog = (id) => {
    setBlogs((prev) => prev.filter((entry) => entry.id !== id))
  }

  const getBlogById = (id) =>
    blogs.find((entry) => entry.id === Number(id))

  const value = useMemo(() => ({ blogs, addBlog, removeBlog, getBlogById }), [blogs])

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
}

export function useBlogContext() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error('useBlogContext must be used within BlogProvider')
  }
  return context
}
