import type { Metadata, Viewport } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({ weight: "400", variable: "--font-script", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  /** Matches welcome; client switches meta + edge strips to cream #FFFAF0 after “tap to open” */
  themeColor: "#5A1010",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmad-salsabeel-wedding.vercel.app"),
  title: "Ahmad & Salsabeel — Wedding Invitation",
  description: "You are cordially invited to the wedding of Ahmad & Salsabeel on 2 May 2026. Join us for a day of love, joy, and celebration!",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Ahmad & Salsabeel — Wedding Invitation",
    description: "You are cordially invited to the wedding of Ahmad & Salsabeel on 2 May 2026. Join us for a day of love, joy, and celebration!",
    type: "website",
    siteName: "Ahmad & Salsabeel Wedding",
    images: [{ url: "/og-image.png", width: 1344, height: 768, alt: "Ahmad & Salsabeel Wedding Invitation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad & Salsabeel — Wedding Invitation",
    description: "You are cordially invited to the wedding of Ahmad & Salsabeel on 2 May 2026",
    images: ["/og-image.png"],
  },
  /** Translucent status bar when saved to Home Screen; harmless in Safari tab */
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${greatVibes.variable} ${cormorant.variable} antialiased`}
        style={{ fontFamily: "var(--font-serif), Georgia, serif", overflow: "hidden" }}>
        {/* Cream lives only here — html/body stay transparent so iOS chrome isn’t filled by our background */}
        <div className="app-cream-shell">{children}</div>
      </body>
    </html>
  );
}
