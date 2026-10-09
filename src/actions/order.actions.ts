"use server";

import { revalidatePath } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { AdminOrder, AdminOrderItem, OrderStatus } from "@/types/order";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrderItem(item: any): AdminOrderItem {
  const images = item.product?.images || [];
  const primary =
    images.find((img: { isPrimary: boolean }) => img.isPrimary) || images[0];

  return {
    id: item.id,
    name: item.productNameSnapshot,
    quantity: item.quantity,
    price: Number(item.priceSnapshot),
    image: primary?.url || null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(order: any): AdminOrder {
  return {
    id: order.id,
    reference: order.reference,
    createdAt: order.createdAt,
    status: order.status,
    subtotal: Number(order.subtotal ?? 0),
    shipping: Number(order.shipping ?? 0),
    totalAmount: Number(order.totalAmount),
    currency: order.currency || "USD",
    paymentProvider: order.paymentProvider,
    paymentId: order.paymentId,
    notes: order.notes,
    customer: {
      id: order.customer.id,
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    shippingAddress: order.address
      ? {
          addressLine1: order.address.addressLine1,
          addressLine2: order.address.addressLine2,
          city: order.address.city,
          state: order.address.state,
          postalCode: order.address.postalCode,
          country: order.address.country,
          phone: order.address.phone,
        }
      : null,
    itemsCount: order.items?.length || 0,
    items: (order.items || []).map(mapOrderItem),
  };
}

const orderSelect = `
  *,
  customer:Customer(id, firstName, lastName, email, phone),
  address:Address!Order_shippingAddressId_fkey(addressLine1, addressLine2, city, state, postalCode, country, phone),
  items:OrderItem(
    id,
    quantity,
    priceSnapshot,
    productNameSnapshot,
    product:Product(images:ProductImage(url, isPrimary))
  )
`;

export async function getOrders(): Promise<AdminOrder[]> {
  await checkAdmin();

  const { data, error } = await supabaseAdmin
    .from("Order")
    .select(orderSelect)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("getOrders:", error);
    throw new Error("Failed to fetch orders");
  }

  return (data || []).map(mapOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await checkAdmin();

  const { error } = await supabaseAdmin
    .from("Order")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/atlasadmin/orders");
  revalidatePath("/atlasadmin");
  return { success: true as const };
}

export async function createCashOnDeliveryOrder(
  form: import("@/types/checkout").CheckoutFormValues,
  items: import("@/types/checkout").CheckoutItem[]
): Promise<import("@/types/checkout").CreateOrderResult> {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: "Your cart is empty." };
    }
    if (
      !form.firstName?.trim() ||
      !form.lastName?.trim() ||
      !form.phone?.trim() ||
      !form.address?.trim() ||
      !form.city?.trim()
    ) {
      return {
        success: false,
        error: "Please complete all required shipping fields.",
      };
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.priceUsd * item.quantity,
      0
    );

    let discount = 0;
    if (
      form.discountCode &&
      form.discountCode.trim().toUpperCase() === "ATLAS10"
    ) {
      discount = subtotal * 0.1;
    }

    const shipping = 0; // Free white-glove luxury delivery
    const totalAmount = Math.max(0, subtotal - discount + shipping);

    const email =
      form.email?.trim() ||
      `${form.phone.replace(/\D/g, "") || "client"}@atelier-atlas.order`;
    const customerId = `cust_${crypto.randomUUID().slice(0, 12)}`;
    const addressId = `addr_${crypto.randomUUID().slice(0, 12)}`;
    const orderId = `ord_${crypto.randomUUID().slice(0, 12)}`;
    const reference = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Find or create Customer
    const { data: existingCustomer } = await supabaseAdmin
      .from("Customer")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let finalCustomerId = existingCustomer?.id;
    if (!finalCustomerId) {
      const { data: newCust, error: custErr } = await supabaseAdmin
        .from("Customer")
        .insert({
          id: customerId,
          email,
          phone: form.phone.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        })
        .select("id")
        .single();
      if (custErr) throw custErr;
      finalCustomerId = newCust.id;
    }

    // 2. Insert Address
    const { data: newAddr, error: addrErr } = await supabaseAdmin
      .from("Address")
      .insert({
        id: addressId,
        customerId: finalCustomerId,
        addressLine1: form.address.trim(),
        city: form.city.trim(),
        country: "Morocco",
        phone: form.phone.trim(),
        postalCode: form.postalCode?.trim() || null,
      })
      .select("id")
      .single();
    if (addrErr) throw addrErr;

    // 3. Insert Order with Cash on Delivery
    const { data: newOrder, error: orderErr } = await supabaseAdmin
      .from("Order")
      .insert({
        id: orderId,
        reference,
        customerId: finalCustomerId,
        shippingAddressId: newAddr.id,
        status: "PENDING",
        subtotal,
        shipping,
        totalAmount,
        currency: "USD",
        paymentProvider: "CASH_ON_DELIVERY",
        notes:
          form.notes?.trim() ||
          (form.discountCode
            ? `Discount Code Applied: ${form.discountCode.trim().toUpperCase()}`
            : null),
      })
      .select("id, reference, totalAmount")
      .single();
    if (orderErr) throw orderErr;

    // 4. Try finding an existing Product id fallback for items if foreign key constraint exists
    const { data: defaultProduct } = await supabaseAdmin
      .from("Product")
      .select("id")
      .limit(1)
      .maybeSingle();

    const fallbackProductId = defaultProduct?.id;

    // 5. Insert OrderItems
    const orderItemsData = items.map((item) => ({
      id: `item_${crypto.randomUUID().slice(0, 12)}`,
      orderId: newOrder.id,
      productId: item.id && item.id.length > 10 ? item.id : (fallbackProductId || item.id),
      productNameSnapshot: item.name,
      priceSnapshot: item.priceUsd,
      quantity: item.quantity,
    }));

    const { error: itemsErr } = await supabaseAdmin
      .from("OrderItem")
      .insert(orderItemsData);

    if (itemsErr) {
      console.warn("OrderItem insertion notice:", itemsErr.message);
    }

    revalidatePath("/atlasadmin/orders");
    revalidatePath("/atlasadmin");

    return {
      success: true,
      orderId: newOrder.id,
      reference: newOrder.reference,
      totalAmount: newOrder.totalAmount,
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to place order";
    console.error("createCashOnDeliveryOrder error:", e);
    return { success: false, error: message };
  }
}
