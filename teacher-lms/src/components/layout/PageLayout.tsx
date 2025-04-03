import type React from "react";
import Navbar from "./Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 container mx-auto">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
