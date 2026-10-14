import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  FileText,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import { getBlogPosts } from "@/actions/blog.actions";
import { getDashboardStats } from "@/actions/dashboard.actions";
import { getOrders } from "@/actions/order.actions";
import { getProducts } from "@/actions/product.actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = { products: 0, orders: 0, blogPosts: 0, customers: 0 };
  let latestProducts: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  let recentOrders: Awaited<ReturnType<typeof getOrders>> = [];
  let blogPosts: Awaited<ReturnType<typeof getBlogPosts>> = [];

  try {
    stats = await getDashboardStats();
    const [{ products }, orders, posts] = await Promise.all([
      getProducts({ limit: 5 }),
      getOrders().catch(() => []),
      getBlogPosts(true),
    ]);
    latestProducts = products;
    recentOrders = orders.slice(0, 5);
    blogPosts = posts.slice(0, 5);
  } catch {
    /* Supabase not configured yet */
  }

  const statItems = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      color: "bg-amber-500",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      desc: "Active catalog items",
      link: "/atlasadmin/products",
    },
    {
      label: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      color: "bg-indigo-500",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
      desc: "Stories and essays",
      link: "/atlasadmin/blog",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "bg-emerald-500",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      desc: "Customer sales",
      link: "/atlasadmin/orders",
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: Users,
      color: "bg-blue-500",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      desc: "Registered profiles",
      link: "/atlasadmin/orders",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your MOROCCAN TRAVERTINE store"
      />

      <div className="space-y-8 p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={item.link}
                key={item.label}
                className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className={`absolute left-0 top-0 h-1 w-full ${item.color}`} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900 transition-colors group-hover:text-amber-800">
                      {item.value}
                    </h3>
                  </div>
                  <div
                    className={`rounded-lg ${item.iconBg} p-3 ${item.iconColor} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">{item.desc}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
                <Package className="h-5 w-5 text-amber-700" />
                Latest Products
              </h3>
              <Link
                href="/atlasadmin/products"
                className="flex items-center gap-0.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex-1 space-y-4">
              {latestProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-sm text-slate-400">
                  <Package className="mb-2 h-8 w-8 stroke-1 opacity-50" />
                  <p>No products found</p>
                </div>
              ) : (
                latestProducts.map((p) => (
                  <div key={p.id} className="group flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image || "/placeholder-product.jpg"}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg border border-slate-100 bg-slate-50 object-cover"
                      />
                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-amber-800"
                          title={p.title}
                        >
                          {p.title}
                        </p>
                        <p className="truncate text-xs capitalize text-slate-400">{p.collection}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-slate-900">{formatPrice(p.priceUsd)}</p>
                      <p className="text-[10px] text-slate-500">{p.stock} units</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
                <ShoppingBag className="h-5 w-5 text-emerald-700" />
                Recent Orders
              </h3>
              <Link
                href="/atlasadmin/orders"
                className="flex items-center gap-0.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex-1 space-y-4">
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-sm text-slate-400">
                  <ShoppingBag className="mb-2 h-8 w-8 stroke-1 opacity-50" />
                  <p>No orders found</p>
                </div>
              ) : (
                recentOrders.map((o) => (
                  <div key={o.id} className="group flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-emerald-700">
                        Order #{o.reference}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {o.customer.firstName} {o.customer.lastName}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-slate-900">{formatPrice(o.totalAmount)}</p>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          o.status === "DELIVERED" || o.status === "SHIPPED"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : o.status === "PENDING" || o.status === "PROCESSING"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {o.status.toLowerCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
                <FileText className="h-5 w-5 text-indigo-700" />
                Latest Blog Posts
              </h3>
              <Link
                href="/atlasadmin/blog"
                className="flex items-center gap-0.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex-1 space-y-4">
              {blogPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-sm text-slate-400">
                  <FileText className="mb-2 h-8 w-8 stroke-1 opacity-50" />
                  <p>No blog posts found</p>
                </div>
              ) : (
                blogPosts.map((p) => (
                  <div key={p.id} className="group flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-indigo-800"
                        title={p.title}
                      >
                        {p.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">/{p.slug}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end text-right">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          p.status === "published"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar size={10} />
                        {p.publishedAt
                          ? new Date(p.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Draft"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
