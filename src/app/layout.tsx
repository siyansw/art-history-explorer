import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
});

const playfair = localFont({
  src: "../fonts/playfair-latin.woff2",
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Art History Explorer",
  description:
    "Explore the Met's collection through human feelings — organized by emotion, not by artist or movement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
        {/* Museum-style nav */}
        <nav className="bg-white border-b border-[#E8E6E1] px-6 py-5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <a href="/" className="group flex items-center gap-3">
              <span className="font-serif text-xl tracking-tight text-[#1A1A1A]">
                Art History Explorer
              </span>
            </a>
            <span className="text-xs tracking-widest uppercase text-[#999] font-light">
              The Metropolitan Museum of Art
            </span>
          </div>
        </nav>

        <main className="flex-1 px-6 py-12">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>

        <footer className="bg-[#1A1A1A] text-[#999] px-6 py-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>
              Built on the{" "}
              <a
                href="https://metmuseum.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white underline underline-offset-2"
              >
                Met Museum Open Access API
              </a>
              {" "}(CC0)
            </p>
            <p className="font-serif italic text-[#666]">
              Art history as a living conversation, not a list.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
