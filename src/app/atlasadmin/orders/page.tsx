import { getOrders } from "@/actions/order.actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrdersPageClient } from "@/components/admin/OrdersPageClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  try {
    orders = await getOrders();
  } catch {
    /* env or unauthorized during build */
  }
  return (
    <>
      <AdminHeader
        title="Orders"
        description="Track and manage customer orders"
      />
      <OrdersPageClient orders={orders} />
    </>
  );
}
