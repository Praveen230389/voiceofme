import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextNLLB200 Language Translator",
  description: "This is a language translator app created with the help of Meta's NLLB-200 model.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        {children}

        <ToastContainer />

      </body>
    </html>
  );
}
