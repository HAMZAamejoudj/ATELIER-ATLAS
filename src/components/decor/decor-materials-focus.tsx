import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { DECOR_MATERIALS } from "@/lib/decor-data";

export async function DecorMaterialsFocus() {
  const t = await getTranslations("decor.materialsFocus");

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-atlas-cream py-12 sm:py-14 lg:py-16"
      aria-labelledby="decor-materials-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <h2
          id="decor-materials-heading"
          className="max-w-2xl font-serif text-[1.65rem] font-semibold leading-[1.15] text-atlas-charcoal sm:text-[1.85rem] lg:text-[2rem]"
        >
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-atlas-charcoal/85">
          {t("description")}
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {DECOR_MATERIALS.map((item) => (
            <li key={item.title}>
              <article>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe3]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />
                </div>
                <h3 className="mt-3 font-serif text-sm font-semibold text-atlas-charcoal sm:text-[15px]">
                  {item.title}
                </h3>
                <p className="mt-1.5 font-serif text-xs leading-relaxed text-atlas-charcoal/70 sm:text-[13px]">
                  {item.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
