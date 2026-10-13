"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const router = useRouter();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      router.push("/login");
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1500);
    }
  };

  return (
    <footer className="bg-amber-900 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-white">Sweet Moments</h3>
            <p className="text-amber-200/80 text-sm leading-relaxed">
              Manisnya Momen, Dibuat dengan Cinta. Kami menyediakan kue berkualitas premium untuk melengkapi setiap perayaan Anda.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-amber-200 hover:text-white transition-colors text-sm font-medium">IG</a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors text-sm font-medium">FB</a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors text-sm font-medium">X (Twitter)</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Kontak Kami</h4>
            <ul className="space-y-3 text-sm text-amber-200/80">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <span>Jl. Manis Selalu No. 123<br />Jakarta Selatan, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>+62 812-3456-7890 (WhatsApp)</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>hello@sweetmoments.com</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Jam Operasional</h4>
            <ul className="space-y-2 text-sm text-amber-200/80">
              <li className="flex items-start">
                <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-100">Senin - Jumat</p>
                  <p>08:00 - 20:00 WIB</p>
                </div>
              </li>
              <li className="flex items-start mt-2">
                <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 opacity-0" />
                <div>
                  <p className="font-medium text-amber-100">Sabtu - Minggu</p>
                  <p>09:00 - 22:00 WIB</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-amber-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-amber-300/60">
          <p onClick={handleSecretClick} className="select-none cursor-default">
            &copy; {new Date().getFullYear()} Sweet Moments Bakery. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="#" className="hover:text-amber-200">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-amber-200">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
