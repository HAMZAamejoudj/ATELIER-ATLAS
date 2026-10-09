'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  LayoutGrid, 
  List, 
  FileText, 
  Calendar, 
CheckCircle2,
  FileEdit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import type { BlogPostListItem } from '@/actions/blog.actions';
import { deleteBlogPost } from '@/actions/blog.actions';

export function BlogAdminClient({ posts }: { posts: BlogPostListItem[] }) {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // KPI Calculations
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === 'published').length;
  const draftPosts = posts.filter((p) => p.status === 'draft').length;

  const openNew = () => {
    setEditingId(null);
    setView('editor');
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setView('editor');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete post?')) return;
    await deleteBlogPost(id);
    router.refresh();
  };

  // Filter logic
  const filteredPosts = posts.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (view === 'editor') {
    return (
      <BlogPostForm
        postId={editingId}
        onClose={() => setView('list')}
        onSaved={() => {
          setView('list');
          router.refresh();
        }}
      />
    );
  }

  return (
    <div className="p-8">
      {/* KPI Section */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Card 1: Total Posts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Posts</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">{totalPosts}</h3>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <FileText size={24} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Total articles in database</p>
        </motion.div>

        {/* Card 2: Published Posts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Published</p>
              <h3 className="mt-2 text-3xl font-bold text-emerald-600">{publishedPosts}</h3>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Live on the store website</p>
        </motion.div>

        {/* Card 3: Draft Posts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-slate-400" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Drafts</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-700">{draftPosts}</h3>
            </div>
            <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
              <FileEdit size={24} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Unpublished drafts</p>
        </motion.div>
      </div>

      {/* Toolbar Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search blog title, excerpt, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / Table View Switcher */}
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Add Post Button */}
          <Button onClick={openNew} className="bg-amber-800 hover:bg-amber-900 text-white shadow-sm transition-all duration-200">
            <Plus size={16} className="mr-1" /> New Post
          </Button>
        </div>
      </div>

      {/* Content Section */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <FileText className="h-16 w-16 text-slate-300 stroke-1 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No blog posts found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs px-4">
            Try adjusting your search filters or create a new blog post.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Post Details</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Published Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={p.featuredImageUrl || '/placeholder-product.jpg'} 
                        alt="" 
                        className="h-12 w-12 rounded-lg object-cover border border-slate-100 bg-slate-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{p.title}</p>
                        {p.excerpt && <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{p.excerpt}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">{p.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      p.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {p.status === 'published' ? (
                        <>
                          <CheckCircle2 size={12} className="mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <FileEdit size={12} className="mr-1" />
                          Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {p.publishedAt ? (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(p.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    ) : (
                      <span className="text-slate-400">---</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50" onClick={() => openEdit(p.id)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <motion.div 
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((p) => {
              const isPublished = p.status === 'published';
              
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  {/* Image & Status Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.featuredImageUrl || '/placeholder-product.jpg'}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                      }}
                    />
                    
                    {/* Badges container */}
                    <div className="absolute left-3 top-3 z-10">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm ${
                        isPublished ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Post Details */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Calendar size={12} />
                      {p.publishedAt ? (
                        new Date(p.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      ) : (
                        'Draft version'
                      )}
                    </span>
                    
                    <h4 className="mt-2 font-bold text-base text-slate-800 line-clamp-2 group-hover:text-amber-800 transition-colors">
                      {p.title}
                    </h4>
                    
                    <span className="mt-1 text-[10px] text-slate-400 font-mono tracking-tight block truncate">
                      /{p.slug}
                    </span>

                    {p.excerpt && (
                      <p className="mt-3 text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">
                        {p.excerpt}
                      </p>
                    )}

                    {/* Action buttons footer */}
                    <div className="mt-5 pt-4 flex gap-2 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-200 hover:border-amber-800 hover:text-amber-800 gap-1.5"
                        onClick={() => openEdit(p.id)}
                      >
                        <Pencil size={14} /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

