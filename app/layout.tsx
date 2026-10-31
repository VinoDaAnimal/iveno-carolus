import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { person } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const description =
  "Iveno Carolus, Data Professional & Python Developer and Analytics Engineer at SeedGrowth Analytics. Eight Zindi medals, a career from data science intern to analytics engineer, and a pipeline that scraped 1.4 million URLs.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${person.name} - ${person.role}`,
  description,
  alternates: { canonical: "./" },
  openGraph: {
    type: "profile",
    url: "./",
    title: `${person.name} - ${person.role}`,
    description,
    siteName: person.name,
    images: [{ url: "og.png", width: 1200, height: 630, alt: "Iveno Carolus, Data Professional & Python Developer, with his Zindi medal finishes" }],
  },
  twitter: { card: "summary_large_image", images: ["og.png"] },
};

export const viewport: Viewport = { themeColor: "#f4f6f8" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={schibsted.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
