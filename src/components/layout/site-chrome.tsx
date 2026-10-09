"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { CartDrawer } from "@/components/cart/cart-drawer";

export function SiteChrome({
  children,
  footer,
  popup,
}: {
  children: ReactNode;
  footer: ReactNode;
  popup?: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith("/atlasadmin") || pathname.startsWith("/login");

  return (
    <>
      {children}
      {!isAdmin && (
        <>
          {footer}
          <CartDrawer />
          {popup}
        </>
      )}
    </>
  );
}
