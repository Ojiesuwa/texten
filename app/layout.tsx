import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import Header from "@/components/Header";
import WrongDevice from "@/components/WrongDevice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],

  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],

  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Texten",
  description: "AI subtitling application",
  icons: {
    icon: "/logo.png", // Path to your PNG file
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="stylesheet" href="/fontawesome/all.css" precedence="default" />

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.className} ${poppins.className} antialiased `}
      >
        <Header />

        {children}
        <ToastContainer
          position={"top-center"}
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
          closeButton={false}
        />
        <WrongDevice />
      </body>
    </html>
  );
}
