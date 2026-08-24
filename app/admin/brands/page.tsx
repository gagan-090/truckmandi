import Image from "next/image";
import { Layers } from "lucide-react";

const brands = [
  { name: "Tata Motors", slug: "tata", logo: "/images/Brands/tata.png", listings: 420 },
  { name: "Ashok Leyland", slug: "ashok-leyland", logo: "/images/Brands/ashok-leyland.png", listings: 380 },
  { name: "Mahindra", slug: "mahindra", logo: "/images/Brands/mahindra.png", listings: 290 },
  { name: "Eicher", slug: "eicher", logo: "/images/Brands/eicher.png", listings: 210 },
  { name: "BharatBenz", slug: "bharatbenz", logo: "/images/Brands/bharatbenz.png", listings: 150 },
  { name: "Maruti Suzuki", slug: "maruti-suzuki", logo: "/images/Brands/maruti-suzuki.png", listings: 95 },
];

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-steel-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-steel-900">
            Brand & Category Catalogue
          </h2>
          <p className="mt-1 text-sm text-steel-600">
            Active commercial vehicle manufacturers and vehicle categories indexed in the system.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <div
            key={brand.slug}
            className="flex items-center gap-4 rounded-xl border border-steel-200 bg-white p-5 shadow-2xs hover:border-steel-300 transition-all"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-steel-100 p-1 border border-steel-200">
              <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-steel-900">{brand.name}</h3>
              <p className="text-xs text-steel-500">{brand.listings} active listings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
