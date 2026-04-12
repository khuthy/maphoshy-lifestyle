import type { Metadata } from "next";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export const metadata: Metadata = {
  title: {
    default: "Maphoshy Lifestyle — Personal Styling & Image Consultancy",
    template: "%s | Maphoshy Lifestyle",
  },
  description:
    "Professional personal styling and image consultancy by Portia Maluleke. Based in South Africa. Quality is our priority.",
  keywords: [
    "personal styling",
    "image consultancy",
    "wardrobe curation",
    "custom garments",
    "South Africa",
    "Maphoshy Lifestyle",
    "Portia Maluleke",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://maphoshylifestyle.co.za",
    siteName: "Maphoshy Lifestyle",
    title: "Maphoshy Lifestyle — Personal Styling & Image Consultancy",
    description:
      "Professional personal styling and image consultancy by Portia Maluleke. Quality is our priority.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maphoshy Lifestyle",
    description: "Personal styling & image consultancy. Quality is our priority.",
  },
  metadataBase: new URL("https://maphoshylifestyle.co.za"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-bg text-gray-900">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
