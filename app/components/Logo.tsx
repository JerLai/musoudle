'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";

const Logo = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <Link href="/" aria-label="Go to homepage">
      <div
        className={
          isHome
            ? `w-40 sm:w-56 md:w-72 lg:w-96 aspect-square rounded-lg bg-cover bg-center mb-8${isHome ? " pt-8" : ""}`
            : "w-20 sm:w-28 md:w-36 lg:w-48 aspect-square rounded-lg bg-cover bg-center mb-8"
        }
        style={{ backgroundImage: "url('/Musoudle_logo.png')" }}
      />
    </Link>
  );
};

export default Logo;