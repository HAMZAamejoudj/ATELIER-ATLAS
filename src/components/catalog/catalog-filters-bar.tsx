"use client";



import { useEffect, useRef, useState } from "react";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import { useTranslations } from "next-intl";



import { useCatalog } from "@/components/catalog/catalog-provider";

import { cn } from "@/lib/utils";



export function CatalogFiltersBar() {

  const t = useTranslations("catalog");

  const {

    filterDefinitions,

    activeFilters,

    setFilter,

    clearFilters,

    activeFilterCount,

  } = useCatalog();



  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  const barRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    const onPointerDown = (event: MouseEvent) => {

      if (!barRef.current?.contains(event.target as Node)) {

        setOpenFilterKey(null);

      }

    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);

  }, []);



  return (

    <div

      ref={barRef}

      className="sticky top-0 z-20 bg-atlas-cream/95 backdrop-blur-sm"

    >

      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 py-4 sm:gap-2.5 sm:px-6 lg:px-10">

        <span className="mr-1 flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-atlas-charcoal">

            <SlidersHorizontal className="size-3.5" aria-hidden />

            {t("filters")}

          </span>

          {filterDefinitions.map((definition) => {

            const selectedValue = activeFilters[definition.key];

            const selectedOption = definition.options.find(

              (option) => option.value === selectedValue,

            );

            const isOpen = openFilterKey === definition.key;

            return (

              <div key={definition.key} className="relative">

                <button

                  type="button"

                  aria-expanded={isOpen}

                  aria-haspopup="listbox"

                  onClick={() => {

                    setOpenFilterKey(isOpen ? null : definition.key);

                  }}

                  className={cn(

                    "inline-flex items-center gap-1.5 border bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-atlas-charcoal transition-colors",

                    selectedValue || isOpen

                      ? "border-atlas-charcoal/45 shadow-sm"

                      : "border-atlas-charcoal/20 hover:border-atlas-charcoal/40",

                  )}

                >

                  {selectedOption ? (

                    <span className="max-w-[7rem] truncate normal-case tracking-normal">

                      {selectedOption.label}

                    </span>

                  ) : (

                    definition.label

                  )}

                  <ChevronDown

                    className={cn(

                      "size-3 opacity-60 transition-transform",

                      isOpen && "rotate-180",

                    )}

                    aria-hidden

                  />

                </button>

                {isOpen ? (

                  <ul

                    role="listbox"

                    className="absolute top-full left-0 z-30 mt-1 min-w-[11rem] max-h-60 overflow-y-auto border border-atlas-charcoal/15 bg-white py-1 shadow-[0_8px_24px_rgba(26,22,20,0.1)]"

                  >

                    <li>

                      <button

                        type="button"

                        role="option"

                        aria-selected={!selectedValue}

                        className="flex w-full px-3 py-2 text-left text-[11px] text-atlas-charcoal/70 hover:bg-atlas-charcoal/5"

                        onClick={() => {

                          setFilter(definition.key, null);

                          setOpenFilterKey(null);

                        }}

                      >

                        {t("allLabel", { filter: definition.label })}

                      </button>

                    </li>

                    {definition.options.map((option) => (

                      <li key={option.value}>

                        <button

                          type="button"

                          role="option"

                          aria-selected={selectedValue === option.value}

                          className={cn(

                            "flex w-full px-3 py-2 text-left text-[11px] hover:bg-atlas-charcoal/5",

                            selectedValue === option.value

                              ? "font-semibold text-atlas-charcoal"

                              : "text-atlas-charcoal/85",

                          )}

                          onClick={() => {

                            setFilter(definition.key, option.value);

                            setOpenFilterKey(null);

                          }}

                        >

                          {option.label}

                        </button>

                      </li>

                    ))}

                  </ul>

                ) : null}

              </div>

            );

          })}

          {activeFilterCount > 0 ? (

            <button

              type="button"

              onClick={clearFilters}

              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-atlas-charcoal/65 underline-offset-2 hover:text-atlas-charcoal hover:underline"

            >

              <X className="size-3" aria-hidden />

              {t("clear")}

            </button>

          ) : null}

      </div>

    </div>

  );

}


