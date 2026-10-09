'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Package,
  Search,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateOrderStatus } from '@/actions/order.actions';
import type { AdminOrder, OrderStatus } from '@/types/order';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-800', icon: Clock },
  PROCESSING: { label: 'Processing', className: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: 'Shipped', className: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', className: 'bg-slate-100 text-slate-700', icon: XCircle },
  REFUNDED: { label: 'Refunded', className: 'bg-red-100 text-red-800', icon: AlertCircle },
};

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const config = statusConfig[status];
  const Icon = config.icon;

  const handleChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    });
  };

  return (
    <div className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
      >
        {(Object.keys(statusConfig) as OrderStatus[]).map((key) => (
          <option key={key} value={key}>
            {statusConfig[key].label}
          </option>
        ))}
      </select>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          config.className
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {isPending ? 'Updating...' : config.label}
      </span>
    </div>
  );
}

interface Props {
  orders: AdminOrder[];
}

export function OrdersPageClient({ orders }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !q ||
        order.reference.toLowerCase().includes(q) ||
        order.customer.firstName.toLowerCase().includes(q) ||
        order.customer.lastName.toLowerCase().includes(q) ||
        order.customer.email.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ref, customer name or email..."
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
        >
          <option value="ALL">All statuses</option>
          {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
            <option key={status} value={status}>
              {statusConfig[status].label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Items</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{order.reference}</p>
                  <p className="text-xs text-slate-500">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : 'No address'}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{order.customer.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{order.itemsCount}</td>
                <td className="px-4 py-3 text-right font-semibold text-amber-900">
                  {formatCurrency(order.totalAmount, order.currency)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="mr-1.5 h-4 w-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <FileText className="mb-3 h-12 w-12 text-slate-300" />
            <p>No orders found</p>
            <p className="mt-1 text-xs text-slate-400">
              Orders will appear here once customers complete checkout.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing {filteredOrders.length} of {orders.length} orders
      </p>

      {selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-amber-900">Order {selectedOrder.reference}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(selectedOrder.createdAt).toLocaleString()} · {selectedOrder.paymentProvider}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-1">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 font-semibold text-slate-800">Customer</h3>
                  <p className="font-medium">
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </p>
                  <p className="text-sm text-slate-600">{selectedOrder.customer.email}</p>
                  {selectedOrder.customer.phone && (
                    <p className="text-sm text-slate-600">{selectedOrder.customer.phone}</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 font-semibold text-slate-800">Shipping address</h3>
                  {selectedOrder.shippingAddress ? (
                    <div className="text-sm text-slate-600">
                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {selectedOrder.shippingAddress.city}
                        {selectedOrder.shippingAddress.state ? `, ${selectedOrder.shippingAddress.state}` : ''}{' '}
                        {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No shipping address</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 font-semibold text-slate-800">Status</h3>
                  <OrderStatusSelect orderId={selectedOrder.id} status={selectedOrder.status} />
                  {selectedOrder.notes && (
                    <p className="mt-3 text-sm text-slate-600">
                      <span className="font-medium">Notes:</span> {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="border-b bg-slate-50 px-4 py-3 font-semibold text-slate-800">
                    Items ({selectedOrder.itemsCount})
                  </div>
                  <div className="divide-y">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-slate-50">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-300">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            Qty {item.quantity} × {formatCurrency(item.price, selectedOrder.currency)}
                          </p>
                        </div>
                        <p className="font-medium text-slate-900">
                          {formatCurrency(item.price * item.quantity, selectedOrder.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 border-t bg-slate-50 px-4 py-3 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span>{formatCurrency(selectedOrder.shipping, selectedOrder.currency)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-amber-900">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
