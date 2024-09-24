import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clinix",
  description: "Sistema de agendamento de consultas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} dark`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
