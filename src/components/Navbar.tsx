"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User as UserIcon, Menu, X } from "lucide-react";
import { useState, useRef } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      router.push(session ? "/admin" : "/login");
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Kue", path: "/kue" },
    { name: "Custom Kue", path: "/custom" },
    { name: "Cek Pesanan", path: "/cek-pesanan" },
    { name: "Ulasan", path: "/ulasan" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              onClick={handleSecretClick}
              className="flex-shrink-0 flex items-center select-none"
            >
              <span className="font-bold text-2xl text-amber-800 tracking-tight">Sweet Moments</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-amber-100 text-amber-900 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-amber-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <div className="flex items-center space-x-4">
                <Link href={session.user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center text-gray-600 hover:text-amber-700">
                  <UserIcon className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">{session.user.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full border-t border-gray-100">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-amber-100 text-amber-900"
                    : "text-gray-700 hover:text-amber-800 hover:bg-amber-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          {session && (
            <div className="pt-4 pb-4 border-t border-gray-200">
              <div className="px-5 flex flex-col space-y-3">
                <Link
                  href={session.user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-gray-800 hover:text-amber-800"
                >
                  Dashboard Admin
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block text-base font-medium text-red-600 hover:text-red-800 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
