import { SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  variant?: "header" | "footer" | "mobile";
  className?: string;
  priority?: boolean;
};

export function SiteLogo({
  variant = "header",
  className,
  priority = false,
}: SiteLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand SVG (embedded raster)
    <img
      src={SITE_LOGO_PATH}
      alt={SITE_LOGO_ALT}
      width={1345}
      height={940}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(
        "h-auto w-auto object-contain object-left",
        variant === "header" &&
          "max-h-12 max-w-[9rem] sm:max-h-[3.25rem] sm:max-w-[10.5rem] lg:max-h-14 lg:max-w-[12.5rem] xl:max-h-[3.75rem] xl:max-w-[13.5rem] lg:-translate-y-1",
        variant === "footer" &&
          "block h-14 w-[13.5rem] max-w-[min(13.5rem,80vw)] brightness-0 invert sm:h-16 sm:w-[15.5rem] lg:h-[4.25rem] lg:w-[17rem]",
        variant === "mobile" && "max-h-11 max-w-[8rem]",
        className,
      )}
    />
  );
}
