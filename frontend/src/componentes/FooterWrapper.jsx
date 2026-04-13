"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

/**
 * Conditionally renders the footer.
 * Hidden on /editor/* and /view/* routes so those pages can use the full viewport.
 */
export default function FooterWrapper() {
  const pathname = usePathname();
  const noFooter =
    pathname?.startsWith("/editor") || pathname?.startsWith("/view");
  if (noFooter) return null;
  return <Footer />;
}
