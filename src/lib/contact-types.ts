import { SITE_CONTACT_EMAIL } from "@/lib/constants";

export type InquiryType = "general" | "bespoke" | "trade" | "appointment";

export type InquiryStatus = "new" | "in_progress" | "replied" | "archived";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: InquiryType;
  subject: string;
  message: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
}

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  conciergeEmail: string;
  tradeEmail: string;
  addressEn: string;
  addressAr: string;
  hoursEn: string;
  hoursAr: string;
  googleMapsUrl?: string;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  phone: "+212 621 922 283",
  whatsapp: "+212 621 922 283",
  conciergeEmail: SITE_CONTACT_EMAIL,
  tradeEmail: SITE_CONTACT_EMAIL,
  addressEn: "Quartier Industriel Sidi Ghanem, Rue Principale N° 45, Marrakech 40000, Morocco",
  addressAr: "الحي الصناعي سيدي غانم، الشارع الرئيسي رقم 45، مراكش 40000، المغرب",
  hoursEn: "Monday – Saturday: 9:00 AM – 6:30 PM (Sunday by appointment)",
  hoursAr: "الإثنين – السبت: 9:00 صباحاً – 6:30 مساءً (الأحد بموعد مسبق)",
  googleMapsUrl: "https://maps.google.com/?q=Sidi+Ghanem+Marrakech",
};

export const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: "inq_001",
    name: "Karim Benjelloun",
    email: "karim.benjelloun@archistudio.ma",
    phone: "+212 6 61 22 33 44",
    type: "trade",
    subject: "Villa Palmeraie Project - Travertine Dining & Seating",
    message: "Bonjour Atelier Atlas, we are working on a luxury private villa in Palmeraie Marrakech and would like to request the trade catalog and quote for 2 custom travertine dining tables and 8 bespoke benches.",
    status: "new",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "inq_002",
    name: "Sophie Laurent",
    email: "sophie.laurent@interiors-paris.com",
    phone: "+33 6 12 34 56 78",
    type: "bespoke",
    subject: "Custom Dimensions for Atlas Console in Walnut",
    message: "Hello, I fell in love with your handcrafted walnut console table. Is it possible to customize the width to 220cm with aged brass feet details?",
    status: "in_progress",
    notes: "Sent drawing specifications to workshop team.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "inq_003",
    name: "Amine Tazi",
    email: "amine.tazi@gmail.com",
    phone: "+212 6 70 88 99 00",
    type: "appointment",
    subject: "Workshop & Showroom Visit next Thursday",
    message: "Salam, I would like to book a private appointment to visit your Sidi Ghanem workshop next Thursday at 3:00 PM to view the marble & lighting collection.",
    status: "replied",
    notes: "Confirmed appointment for Thursday 3 PM.",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];
