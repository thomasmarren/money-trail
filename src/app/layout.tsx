import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "./providers/QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Money Trail",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <QueryClientProvider>{children}</QueryClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
