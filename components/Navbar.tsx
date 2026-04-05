"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiMenu3Fill } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";
import Button from "./Button";
import Logo from "./Logo";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
  { name: "Credits", path: "/credits" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // In a real application, this would come from an auth context
  // For demonstration purposes, let's assume we can check for authentication
  // This is just a placeholder - in a real app this would use a proper auth system
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';

  return (
    <nav className="sticky top-0 z-50 h-fit py-4 bg-background/80 backdrop-blur-md border-b border-[var(--primary)]/10 transition-all duration-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-28">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              {/* <span className="icon-Logo text-primary text-[1.75em]"></span> */}
              {/* <Image src={logo} alt="Logo" className="w-7" /> */}
              <Logo/>
            </Link>
          </div>
          {/* Desktop Nav Items */}
          <div className="hidden gap-2 lg:flex lg:items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`relative justify-center rounded-md px-3 py-2 text-base leading-normal text-text opacity-80 ${
                  pathname === item.path
                    ? "font-bold text-primary opacity-100"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button
              className="text-base text-background"
              label={isAuthenticated ? "Dashboard" : "Get Started"}
              onClick={() => {
                if (isAuthenticated) {
                  router.push("/dashboard");
                } else {
                  router.push("/login");
                }
              }}
            />
          </div>
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-primary hover:bg-primary focus:ring-offset-primary-900 bg-primary inline-flex items-center justify-center rounded-md p-2 hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaXmark className="size-3 text-white md:size-4" />
              ) : (
                <RiMenu3Fill className="size-3 text-white md:size-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Nav Items with transition - absolutely positioned */}
      <div
        id="mobile-menu"
        className={`bg-background absolute top-full right-0 left-0 origin-top overflow-hidden transition-transform duration-300 lg:hidden ${
          isOpen ? "scale-y-100" : "scale-y-0"
        }`}
      >
        <div className="bg-primary-900 space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium md:text-base ${
                pathname === item.path
                  ? "text-primary underline underline-offset-4"
                  : "text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="flex flex-col space-y-2 pt-2">
            <Button
              className="inline-flex h-8.5 text-sm md:text-base"
              label={isAuthenticated ? "Dashboard" : "Sign In"}
              onClick={() => {
                if (isAuthenticated) {
                  setIsOpen(false);
                  router.push("/dashboard");
                } else {
                  setIsOpen(false);
                  router.push("/login");
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
