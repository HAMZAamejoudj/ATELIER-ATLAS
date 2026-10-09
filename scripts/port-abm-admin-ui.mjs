import fs from "fs";
import path from "path";

const ABM = "C:/Users/AI HUB/Desktop/mdf/antiquebrassmoroccan";
const ATLAS = "C:/Users/AI HUB/Desktop/ATELIER ATLAS";

function port(src, dst, repl) {
  let s = fs.readFileSync(path.join(ABM, src), "utf8");
  for (const [a, b] of repl) {
    s = s.split(a).join(b);
  }
  const out = path.join(ATLAS, dst);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, s);
}

const common = [
  ["/antiquadmin", "/atlasadmin"],
  ["ABM Admin", "Atlas Admin"],
  ["from '@/lib/upload-helper'", "from '@/lib/client-library-upload'"],
];

port(
  "src/components/admin/SimpleTiptapEditor.tsx",
  "src/components/admin/SimpleTiptapEditor.tsx",
  common
);
port(
  "src/components/admin/MediaPickerModal.tsx",
  "src/components/admin/MediaPickerModal.tsx",
  common
);
port(
  "src/app/antiquadmin/library/LibraryAdminClient.tsx",
  "src/components/admin/LibraryAdminClient.tsx",
  common
);

port("src/components/admin/AdminSidebar.tsx", "src/components/admin/AdminSidebar.tsx", [
  ...common,
  [
    "{ label: 'Categories', path: '/atlasadmin/categories', icon: Tags },\n  ",
    "",
  ],
  [
    "{ label: 'Site Settings', path: '/atlasadmin/site', icon: Settings },\n  ",
    "",
  ],
  ["Tags,\n  ", ""],
  ["Settings,\n  ", ""],
]);

// ProductsPageClient: maintained manually in Atlas (collections + priceUsd)

// Blog admin list UI (Atlas BlogPostForm API)
{
  let s = fs.readFileSync(
    path.join(ABM, "src/app/antiquadmin/blog/BlogAdminClient.tsx"),
    "utf8"
  );
  s = s
    .replace(
      "import { BlogPostForm, type BlogEditorData } from '@/components/admin/BlogPostForm';",
      "import { BlogPostForm } from '@/components/admin/BlogPostForm';"
    )
    .replace(
      "import { deleteBlogPost, getBlogPostById } from '@/actions/blog.actions';",
      "import { deleteBlogPost } from '@/actions/blog.actions';"
    )
    .replace(
      `  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editorData, setEditorData] = useState<BlogEditorData | undefined>();
  
`,
      `  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

`
    )
    .replace(
      /  const openNew = \(\) => \{[\s\S]*?  \};\n\n  const openEdit = async \(id: string\) => \{[\s\S]*?  \};/,
      `  const openNew = () => {
    setEditingId(null);
    setView('editor');
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setView('editor');
  };`
    )
    .replace(
      /  if \(view === 'editor'\) \{[\s\S]*?  \}\n\n  return \(/,
      `  if (view === 'editor') {
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

  return (`
    )
    .replaceAll("/wp-content/uploads/2022/12/Logo-v2.webp", "/placeholder-product.jpg")
    .replace("  Eye,\n  ", "");
  fs.writeFileSync(path.join(ATLAS, "src/components/admin/BlogAdminClient.tsx"), s);
}

// Orders UI
port(
  "src/app/antiquadmin/orders/OrdersPageClient.tsx",
  "src/components/admin/OrdersPageClient.tsx",
  [
    ...common,
    ["@/components/ui/input", "@/components/ui/input"],
  ]
);

console.log("ported base files");
