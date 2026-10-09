"use server";

import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const [products, orders, posts, customers] = await Promise.all([
    supabase.from("Product").select("id", { count: "exact", head: true }),
    supabase.from("Order").select("id", { count: "exact", head: true }),
    supabase.from("BlogPost").select("id", { count: "exact", head: true }),
    supabase.from("Customer").select("id", { count: "exact", head: true }),
  ]);

  return {
    products: products.count || 0,
    orders: orders.count || 0,
    blogPosts: posts.count || 0,
    customers: customers.count || 0,
  };
}
