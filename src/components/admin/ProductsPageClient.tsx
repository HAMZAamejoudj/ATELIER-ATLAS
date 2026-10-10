'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Pencil,
  Plus,
  Trash2,
  LayoutGrid,
  List,
  Package,
  Boxes,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { Button } from '@/components/ui/button';
import { getProductById, deleteProduct } from '@/actions/product.actions';
import type { CollectionDB, ShopProductDB } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface Props {
  initialProducts: ShopProductDB[];
  collections: CollectionDB[];
}

export function ProductsPageClient({ initialProducts, collections }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShopProductDB | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // KPI Calculations (on total catalog)
  const totalProducts = initialProducts.length;
  const totalStock = initialProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStock = initialProducts.filter((p) => (p.stock || 0) === 0).length;
  const lowStock = initialProducts.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = async (id: string) => {
    setLoadingEdit(true);
    try {
      const product = await getProductById(id);
      if (!product) {
        alert('Could not load this product. Please refresh and try again.');
        return;
      }
      setEditing(product);
      setOpen(true);
    } finally {
      setLoadingEdit(false);
    }
  };

  const storefrontPath = (p: ShopProductDB) =>
    p.collectionSlug ? `/${p.collectionSlug}` : '/';

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    router.refresh();
  };

  // Filtered Products
  const filteredProducts = initialProducts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.collection === selectedCategory || p.collectionId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <AdminHeader title="Products" description="Manage shop products with EN/AR content and SEO" />
      <div className="p-8">
        
        {/* KPI Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Card 1: Total Products */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Products</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">{totalProducts}</h3>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <Package size={24} />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Active catalog items</p>
          </motion.div>

          {/* Card 2: Total Inventory */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-slate-700" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Stock Items</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">{totalStock}</h3>
              </div>
              <div className="rounded-lg bg-slate-100 p-3 text-slate-700">
                <Boxes size={24} />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Total physical items</p>
          </motion.div>

          {/* Card 3: Out of Stock */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${
              outOfStock > 0 ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white'
            }`}
          >
            <div className={`absolute top-0 left-0 h-1 w-full ${outOfStock > 0 ? 'bg-red-500' : 'bg-slate-300'}`} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Out of Stock</p>
                <h3 className={`mt-2 text-3xl font-bold ${outOfStock > 0 ? 'text-red-600' : 'text-slate-900'}`}>{outOfStock}</h3>
              </div>
              <div className={`rounded-lg p-3 ${outOfStock > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                <AlertTriangle size={24} />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Products requiring restocking</p>
          </motion.div>

          {/* Card 4: Low Stock */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className={`rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${
              lowStock > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-white'
            }`}
          >
            <div className={`absolute top-0 left-0 h-1 w-full ${lowStock > 0 ? 'bg-amber-500' : 'bg-slate-300'}`} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Low Stock Alert</p>
                <h3 className={`mt-2 text-3xl font-bold ${lowStock > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{lowStock}</h3>
              </div>
              <div className={`rounded-lg p-3 ${lowStock > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                <AlertTriangle size={24} />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Stock levels 5 or below</p>
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
                placeholder="Search product title or SKU..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
              >
                <option value="all">All collections</option>
                {collections.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
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

            {/* Add Product Button */}
            <Button onClick={openCreate} className="bg-amber-800 hover:bg-amber-900 text-white shadow-sm transition-all duration-200">
              <Plus size={16} /> Add Product
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
            <Package className="h-16 w-16 text-slate-300 stroke-1 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No products found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs px-4">
              Try adjusting your search query or category filters, or add a new product to get started.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">SKU</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image || '/placeholder-product.jpg'} alt="" className="h-12 w-12 rounded-lg object-cover border border-slate-100" />
                        <div>
                          <p className="font-semibold text-slate-900">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.collection}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{p.sku}</td>
                    <td className="px-6 py-4">
                      {p.compareAtUsd != null && p.compareAtUsd > p.priceUsd ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-amber-700">{formatPrice(p.priceUsd)}</span>
                          <span className="text-xs text-slate-400 line-through">{formatPrice(p.compareAtUsd)}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-slate-900">{formatPrice(p.priceUsd)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.stock === 0
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : p.stock <= 5
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:bg-slate-50"
                          onClick={() =>
                            window.open(storefrontPath(p), "_blank", "noopener,noreferrer")
                          }
                          aria-label={`View ${p.title} on storefront`}
                        >
                          <ExternalLink size={14} />
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50" disabled={loadingEdit} onClick={() => openEdit(p.id)}>
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
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((p) => {
              const isOutOfStock = (p.stock || 0) === 0;
              const isLowStock = (p.stock || 0) > 0 && (p.stock || 0) <= 5;
              const hasSale = p.compareAtUsd != null && p.compareAtUsd > p.priceUsd;

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
                      src={p.image || '/placeholder-product.jpg'}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Badges container */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
                      {isOutOfStock && (
                        <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Out of Stock
                        </span>
                      )}
                      {!isOutOfStock && isLowStock && (
                        <span className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Low Stock ({p.stock})
                        </span>
                      )}
                      {hasSale && (
                        <span className="rounded-md bg-amber-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Sale
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      {p.collection}
                    </span>
                    <h4 className="mt-1 font-semibold text-base text-slate-800 line-clamp-1 group-hover:text-amber-800 transition-colors">
                      {p.title}
                    </h4>
                    <span className="mt-1 text-xs text-slate-500 font-mono">
                      {p.sku}
                    </span>

                    <div className="mt-4 flex items-baseline gap-2">
                      {hasSale ? (
                        <>
                          <span className="text-lg font-bold text-amber-700">
                            {formatPrice(p.priceUsd)}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(p.compareAtUsd!)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-slate-900">
                          {formatPrice(p.priceUsd)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      Stock: <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}>{p.stock} units</span>
                    </div>

                    {/* Action buttons footer */}
                    <div className="mt-auto pt-5 flex flex-wrap gap-2 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 min-w-[5.5rem] border-slate-200 hover:border-amber-800 hover:text-amber-800"
                        onClick={() =>
                          window.open(storefrontPath(p), "_blank", "noopener,noreferrer")
                        }
                      >
                        <ExternalLink size={14} /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 min-w-[5.5rem] border-slate-200 hover:border-amber-800 hover:text-amber-800"
                        disabled={loadingEdit}
                        onClick={() => openEdit(p.id)}
                      >
                        <Pencil size={14} /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 min-w-[5.5rem] bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{Math.min((safePage - 1) * itemsPerPage + 1, filteredProducts.length)}</span> to{' '}
              <span className="font-medium text-slate-700">{Math.min(safePage * itemsPerPage, filteredProducts.length)}</span> of{' '}
              <span className="font-medium text-slate-700">{filteredProducts.length}</span> products
            </p>
            
            <div className="flex items-center gap-2">
              {/* Page Numbers 1, 2, 3 */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                        safePage === page
                          ? 'bg-amber-800 text-white shadow-sm'
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-9 px-3 border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                Next <ChevronRight size={16} />
              </Button>

              {/* Last Page Number */}
              {totalPages > 3 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ProductFormModal
        key={editing?.id ?? "create"}
        isOpen={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        product={editing}
        collections={collections}
        onSaved={() => router.refresh()}
      />
    </>
  );
}

