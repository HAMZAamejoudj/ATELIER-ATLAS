import { getBlogPosts } from "@/actions/blog.actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogAdminClient } from "@/components/admin/BlogAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  try {
    posts = await getBlogPosts(true);
  } catch {
    /* env */
  }
  return (
    <>
      <AdminHeader title="Blog" description="Manage blog posts and SEO (EN / AR)" />
      <BlogAdminClient posts={posts} />
    </>
  );
}
