import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemoteFlow - Find Your Dream Remote Full Stack Job",
  description: "Join RemoteFlow, the ultimate AI-powered platform for remote job seekers in the IT industry. Discover thousands of remote opportunities tailored for Full Stack Engineers, Frontend, Backend, and DevOps professionals worldwide.",
  keywords: [
    "remote jobs",
    "full stack engineer",
    "remote work",
    "IT jobs",
    "software developer",
    "frontend developer",
    "backend developer",
    "devops engineer",
    "AI job matching",
    "remote career",
    "work from home",
    "tech jobs"
  ],
  authors: [{ name: "RemoteFlow Team" }],
  creator: "RemoteFlow",
  publisher: "RemoteFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://remoteflow.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RemoteFlow - Find Your Dream Remote Full Stack Job",
    description: "Join RemoteFlow, the ultimate AI-powered platform for remote job seekers in the IT industry. Discover thousands of remote opportunities tailored for Full Stack Engineers worldwide.",
    url: "https://remoteflow.com",
    siteName: "RemoteFlow",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RemoteFlow - AI-Powered Remote Job Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RemoteFlow - Find Your Dream Remote Full Stack Job",
    description: "Join RemoteFlow, the ultimate AI-powered platform for remote job seekers in the IT industry.",
    images: ["/og-image.jpg"],
    creator: "@RemoteFlow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
        {/* Global cursor canvas overlay */}
        <canvas id="canvas" className="pointer-events-none fixed inset-0 z-[9999]" style={{ width: "100vw", height: "100vh" }} />
        <Script id="init-global-canvas" strategy="afterInteractive">
          {`window.renderInteractiveCanvas && window.renderInteractiveCanvas();`}
        </Script>
      </body>
    </html>
  );
}