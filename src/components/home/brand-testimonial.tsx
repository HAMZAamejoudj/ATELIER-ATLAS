import Image from "next/image";

const KEYWORDS = ["Beautiful", "Useful", "Lasting"] as const;

export function BrandTestimonial() {
  return (
    <section
      className="bg-[#3d473a] text-white"
      aria-label="Customer testimonial"
    >
      <div
        className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(9.5rem,12.5rem)_auto] lg:items-stretch"
      >
        <blockquote className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
          <p className="max-w-2xl font-serif text-xl leading-relaxed text-white/95 sm:text-2xl lg:text-[1.6rem] lg:leading-[1.55] xl:max-w-[38rem] xl:text-[1.75rem]">
            &ldquo;Atelier Atlas pieces bring a rare sense of permanence to our
            home. You can feel the thought, the craft, the care in every
            detail.&rdquo;
          </p>
          <footer className="mt-6 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            — Danielle R., Austin TX
          </footer>
        </blockquote>

        <div
          className="relative hidden min-h-[10rem] overflow-hidden lg:block"
          aria-hidden
        >
          <Image
            src="/images/testimonial/testimonial-vase.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="12.5rem"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#3d473a] from-0% via-transparent via-45% to-[#3d473a] to-100%"
          />
        </div>

        <ul
          className="flex flex-col justify-center gap-4 px-6 pb-12 font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-white sm:px-10 sm:pb-14 lg:gap-5 lg:px-10 lg:py-12 lg:pb-12 xl:pr-14"
        >
          {KEYWORDS.map((label) => (
            <li key={label} className="flex items-center gap-3 lg:justify-end">
              <span className="h-px w-8 bg-white/65 sm:w-10" aria-hidden />
              <span>{label}</span>
              <span className="h-px w-8 bg-white/65 sm:w-10" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
