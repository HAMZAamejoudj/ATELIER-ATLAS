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
          "max-h-10 max-w-[10rem] brightness-0 invert sm:max-h-11 sm:max-w-[11rem]",
        variant === "mobile" && "max-h-11 max-w-[8rem]",
        className,
      )}
    />
  );
}
