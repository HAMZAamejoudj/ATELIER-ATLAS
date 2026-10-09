"use client";



import { useTranslations } from "next-intl";



import { useCatalog } from "@/components/catalog/catalog-provider";



export function CatalogEmptyState() {

  const t = useTranslations("catalog.empty");

  const { clearFilters } = useCatalog();



  return (

    <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 lg:px-10">

      <p className="font-serif text-xl text-atlas-charcoal">

        {t("title")}

      </p>

      <p className="mt-2 text-sm text-atlas-charcoal/65">

        {t("description")}

      </p>

      <button

        type="button"

        onClick={clearFilters}

        className="mt-6 border border-atlas-charcoal/25 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-colors hover:bg-atlas-charcoal/5"

      >

        {t("clearAll")}

      </button>

    </div>

  );

}


