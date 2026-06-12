'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type PriceType = 'fixed' | 'range' | 'gender' | 'custom';
type GenderPrice = { male: number; female: number };
type RangePrice = [number, number];
type ServicePrice = number | RangePrice | GenderPrice | null;

interface Service {
  name: string;
  price: ServicePrice;
  priceType: PriceType;
}

interface Category {
  id: string;
  title: string;
  image: string;
  highlight: boolean;
  services: Service[];
}

interface Brand {
  name: string;
  tagline: string;
}

interface Database {
  brand: Brand;
  categories: Category[];
}

export default function MenuPage() {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    fetch('/database.json?v=' + Date.now())
      .then((res) => res.json())
      .then((data) => setDb(data))
      .catch((err) => console.error("Error reading database:", err));
  }, []);

  const renderPrice = (service: Service) => {
    if (service.priceType === 'fixed') {
      return (
        <span className="font-semibold text-gray-900 text-lg">
          ₹{service.price as number}
        </span>
      );
    }
    if (service.priceType === 'range') {
      const range = service.price as RangePrice;
      return (
        <span className="font-semibold text-gray-900 text-lg">
          ₹{range[0]}–₹{range[1]}
        </span>
      );
    }
    if (service.priceType === 'gender') {
      const gender = service.price as GenderPrice;
      return (
        <div className="flex flex-col text-right">
          <span className="text-sm">
            <span className="text-gray-500 mr-2 text-xs uppercase">Male</span>
            <strong className="font-semibold text-gray-900">₹{gender.male}</strong>
          </span>
          <span className="text-sm">
            <span className="text-gray-500 mr-2 text-xs uppercase">Female</span>
            <strong className="font-semibold text-gray-900">₹{gender.female}</strong>
          </span>
        </div>
      );
    }
    return (
      <span className="text-sm font-medium text-gray-500 uppercase italic">
        Consultation
      </span>
    );
  };

  if (!db) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-serif text-xl tracking-widest uppercase">Loading Menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-wide group-hover:text-gray-600 transition-colors">
                {db.brand.name}
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-medium -mt-1 hidden sm:block">
                Service Menu
              </span>
            </div>
          </Link>
          <Link
            href="/book"
            className="bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-full px-6 py-2.5 text-xs uppercase tracking-widest font-semibold shadow-md"
          >
            Book Appointment
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gray-900">Our Services</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our curated menu of premium styling, skincare, and therapeutic treatments. 
            Designed to elevate your natural beauty and provide an unparalleled experience.
          </p>
        </div>

        <div className="space-y-16">
          {db.categories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              {/* Category Header */}
              <div className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                  <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">{category.title}</h2>
                  {category.highlight && (
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-widest font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Signature Collection
                    </span>
                  )}
                </div>
              </div>

              {/* Services List */}
              {category.services && category.services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pl-2 md:pl-24">
                  {category.services.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4 group">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-black transition-colors">{service.name}</h3>
                        <div className="w-full border-b border-dotted border-gray-300 mt-2 opacity-50"></div>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {renderPrice(service)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pl-2 md:pl-24 text-gray-400 italic text-sm">Services arriving soon.</p>
              )}
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-serif text-2xl font-bold mb-4">Ready for your transformation?</h3>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Secure your preferred time slot and let our expert stylists take care of the rest.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-full px-8 py-4 text-sm uppercase tracking-widest font-bold shadow-xl"
          >
            Book Your Appointment
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
