import "./globals.css";
import HeaderClientWrapper from "@/components/HeaderClientWrapper";

export const metadata = {
  title: "Fan App",
  description: "Customer Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body className="bg-gray-900 text-white">
        <HeaderClientWrapper />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
