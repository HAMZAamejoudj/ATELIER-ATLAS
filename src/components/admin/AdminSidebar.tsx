'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Sliders,
  FileText,
  Search,
  BookOpen,
  Images,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Settings,
  AppWindow,
  Mail,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/atlasadmin', icon: LayoutDashboard },
  { label: 'Products', path: '/atlasadmin/products', icon: Package },
  { label: 'Categories & SEO', path: '/atlasadmin/categories', icon: FolderTree },
  { label: 'Hero & Sliders', path: '/atlasadmin/sections', icon: Sliders },
  { label: 'Promo Popup', path: '/atlasadmin/popup', icon: AppWindow },
  { label: 'Contact Inquiries', path: '/atlasadmin/contact', icon: Mail },
  { label: 'Orders', path: '/atlasadmin/orders', icon: ShoppingCart },
  { label: 'Blog', path: '/atlasadmin/blog', icon: FileText },
  { label: 'Media Library', path: '/atlasadmin/library', icon: Images },
  { label: 'SEO Settings', path: '/atlasadmin/seo', icon: Search },
  { label: 'Static Pages', path: '/atlasadmin/static-pages', icon: BookOpen },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col bg-slate-900 text-white transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        {!collapsed && (
          <span className="font-serif text-lg font-semibold text-amber-400">
            Moroccan Travertine Admin
          </span>
        )}
        <button type="button" onClick={onToggle} className="rounded p-1 hover:bg-slate-800">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.path === '/atlasadmin' ? pathname === '/atlasadmin' : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active ? 'bg-amber-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
