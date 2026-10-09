"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Archive,
  Save,
  Trash2,
  ExternalLink,
  MapPin,
  Building,
  User,
  Calendar,
  AlertCircle,
  Tag,
  Check,
} from "lucide-react";
import {
  saveContactSettings,
  updateInquiryStatus,
  deleteInquiry,
} from "@/actions/contact.actions";
import type {
  ContactInquiry,
  ContactSettings,
  InquiryStatus,
  InquiryType,
} from "@/lib/contact-types";

interface ContactAdminClientProps {
  initialSettings: ContactSettings;
  initialInquiries: ContactInquiry[];
}

export function ContactAdminClient({
  initialSettings,
  initialInquiries,
}: ContactAdminClientProps) {
  const [activeTab, setActiveTab] = useState<"inquiries" | "settings">("inquiries");
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [settings, setSettings] = useState<ContactSettings>(initialSettings);
  const [settingsLang, setSettingsLang] = useState<"en" | "ar">("en");

  // Inquiries filter & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    initialInquiries[0]?.id || null
  );

  // States
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedInquiry = inquiries.find((i) => i.id === selectedInquiryId);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setToast(null);
    try {
      const res = await saveContactSettings(settings);
      if (res.success) {
        setToast({
          type: "success",
          text: "Studio contact settings saved successfully!",
        });
      } else {
        setToast({
          type: "error",
          text: res.error || "Failed to save settings.",
        });
      }
    } catch {
      setToast({
        type: "error",
        text: "An error occurred while saving.",
      });
    } finally {
      setSavingSettings(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await updateInquiryStatus(id, newStatus);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        setToast({
          type: "success",
          text: `Inquiry status updated to ${newStatus}.`,
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ type: "error", text: "Failed to update status." });
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    try {
      await updateInquiryStatus(
        id,
        selectedInquiry?.status || "in_progress",
        notes
      );
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, notes } : i))
      );
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await deleteInquiry(id);
      if (res.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiryId === id) {
          setSelectedInquiryId(null);
        }
        setToast({ type: "success", text: "Inquiry deleted." });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ type: "error", text: "Failed to delete inquiry." });
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.phone && inq.phone.includes(searchQuery)) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || inq.status === statusFilter;

    const matchesType = typeFilter === "all" || inq.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            New
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/30">
            In Progress
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="size-3" />
            Replied
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-400">
            Archived
          </span>
        );
    }
  };

  const getTypeBadge = (type: InquiryType) => {
    switch (type) {
      case "bespoke":
        return (
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
            Sur-Mesure / Bespoke
          </span>
        );
      case "trade":
        return (
          <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
            Trade & Architecture
          </span>
        );
      case "appointment":
        return (
          <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded">
            Showroom Visit
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
            General Inquiry
          </span>
        );
    }
  };

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
            <Mail className="size-6 text-amber-400" />
            Contact & Client Inquiries
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage inquiries from bespoke clients, architects, showroom visits, and edit Marrakech atelier contact info.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${
              activeTab === "inquiries"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="size-4" />
            <span>Inquiries</span>
            {newCount > 0 && (
              <span className="rounded-full bg-amber-400 text-black px-1.5 py-0.2 text-[10px] font-bold">
                {newCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${
              activeTab === "settings"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building className="size-4" />
            <span>Studio & Contact Info</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm border animate-in fade-in ${
            toast.type === "success"
              ? "bg-emerald-950/60 border-emerald-700/50 text-emerald-200"
              : "bg-red-950/60 border-red-700/50 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="size-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-red-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* TAB 1: INQUIRIES LIST & DETAIL */}
      {activeTab === "inquiries" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Inquiries List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search & Filter Bar */}
            <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-3.5 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-slate-300 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New ({newCount})</option>
                    <option value="in_progress">In Progress</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-slate-300 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="general">General</option>
                    <option value="bespoke">Sur-Mesure</option>
                    <option value="trade">Trade</option>
                    <option value="appointment">Showroom Visit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredInquiries.length === 0 ? (
                <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-8 text-center text-slate-400 text-xs">
                  No inquiries found matching your filters.
                </div>
              ) : (
                filteredInquiries.map((item) => {
                  const isSelected = selectedInquiryId === item.id;
                  const dateStr = new Date(item.createdAt).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInquiryId(item.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        isSelected
                          ? "bg-slate-800 border-amber-500/80 shadow-md ring-1 ring-amber-500/40"
                          : "bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-white text-sm truncate">
                          {item.name}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>

                      <p className="text-xs text-amber-300/90 font-medium truncate mb-1">
                        {item.subject}
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-2.5">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-700/60">
                        <div>{getTypeBadge(item.type)}</div>
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Inquiry Full Viewer (7 cols) */}
          <div className="lg:col-span-7">
            {selectedInquiry ? (
              <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-6 space-y-6">
                {/* Top Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-700/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeBadge(selectedInquiry.type)}
                      {getStatusBadge(selectedInquiry.status)}
                    </div>
                    <h2 className="text-lg font-serif font-bold text-white">
                      {selectedInquiry.subject}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Received on{" "}
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions / Status Change */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedInquiry.id,
                          e.target.value as InquiryStatus
                        )
                      }
                      className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="new">Mark as New</option>
                      <option value="in_progress">Mark In Progress</option>
                      <option value="replied">Mark as Replied</option>
                      <option value="archived">Archive</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Sender Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Client Name</span>
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <User className="size-3.5 text-amber-400" />
                      {selectedInquiry.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">Email</span>
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                        selectedInquiry.subject
                      )}`}
                      className="text-amber-400 hover:underline flex items-center gap-1.5 truncate"
                    >
                      <Mail className="size-3.5 shrink-0" />
                      {selectedInquiry.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">Phone / WhatsApp</span>
                    {selectedInquiry.phone ? (
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="text-slate-200 hover:underline flex items-center gap-1.5 truncate"
                      >
                        <Phone className="size-3.5 shrink-0 text-amber-400" />
                        {selectedInquiry.phone}
                      </a>
                    ) : (
                      <span className="text-slate-500">Not provided</span>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Message Body
                  </h3>
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-700/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Quick Reply Bar */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                      selectedInquiry.subject
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-500 transition-colors"
                  >
                    <Mail className="size-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  {selectedInquiry.phone && (
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(
                        /[^0-9]/g,
                        ""
                      )}?text=${encodeURIComponent(
                        `Bonjour ${selectedInquiry.name}, Atelier Atlas Marrakech vous remercie pour votre message concernant "${selectedInquiry.subject}".`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-xs font-bold text-black shadow hover:bg-[#20bd5a] transition-colors"
                    >
                      <MessageSquare className="size-3.5" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* Internal Admin Notes */}
                <div className="space-y-2 pt-3 border-t border-slate-700/80">
                  <label className="block text-xs font-semibold text-slate-400">
                    Internal Workshop Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add private internal notes about this client / project..."
                    defaultValue={selectedInquiry.notes || ""}
                    onBlur={(e) =>
                      handleNotesChange(selectedInquiry.id, e.target.value)
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">
                    Auto-saved when you click away.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-12 text-center text-slate-400 text-sm">
                Select an inquiry from the list to view details and reply.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: STUDIO & CONTACT INFO SETTINGS */
        <div className="max-w-4xl space-y-6">
          <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Building className="size-5 text-amber-400" />
                  Marrakech Atelier & Concierge Information
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update direct phone numbers, WhatsApp, concierge emails, and Marrakech showroom addresses.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-amber-500 disabled:opacity-50 transition-all active:scale-95"
              >
                <Save className="size-4" />
                {savingSettings ? "Saving..." : "Save Settings"}
              </button>
            </div>

            {/* Direct Communication Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-amber-400" />
                  Studio Direct Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-emerald-400" />
                  WhatsApp Concierge Number
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-amber-400" />
                  Concierge & Orders Email
                </label>
                <input
                  type="email"
                  value={settings.conciergeEmail}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      conciergeEmail: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-purple-400" />
                  Trade & Architecture Email
                </label>
                <input
                  type="email"
                  value={settings.tradeEmail}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      tradeEmail: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Google Maps link */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-amber-400" />
                Google Maps Location URL
              </label>
              <input
                type="text"
                placeholder="https://maps.google.com/..."
                value={settings.googleMapsUrl || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    googleMapsUrl: e.target.value,
                  }))
                }
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Bilingual Addresses & Hours */}
            <div className="pt-4 border-t border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Address & Studio Hours (Bilingual)
                </h3>

                <div className="flex rounded-md bg-slate-900 p-0.5 border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setSettingsLang("en")}
                    className={`px-3 py-1 rounded transition-colors ${
                      settingsLang === "en"
                        ? "bg-amber-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsLang("ar")}
                    className={`px-3 py-1 rounded transition-colors ${
                      settingsLang === "ar"
                        ? "bg-amber-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              {settingsLang === "en" ? (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Physical Address (English)
                    </label>
                    <input
                      type="text"
                      value={settings.addressEn}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          addressEn: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Opening Hours (English)
                    </label>
                    <input
                      type="text"
                      value={settings.hoursEn}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          hoursEn: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div dir="rtl" className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      العنوان الفعلي للورشة (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={settings.addressAr}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          addressAr: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ساعات العمل والاستقبال (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={settings.hoursAr}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          hoursAr: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
