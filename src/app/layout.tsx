import { Metadata } from "next";
import "./globals.css";
import Providers from "@/lib/Provider";
import { Toaster } from "sonner";
import { Roboto_Mono } from "next/font/google";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "M360ICT||M360",
  description: "Find the perfect job opportunity that matches your skills and experience. Browse job listings, apply with ease, and take the next step in your career.",
};
const robotoMono = Roboto_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin-ext"],
  style: ['normal'],
  
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#004BAD",
              fontFamily: robotoMono.style.fontFamily,
      
            },
          }}
        >
          <Providers>
            <Toaster richColors position="top-center" />

            {children}
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
