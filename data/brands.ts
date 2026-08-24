import { endpoints } from "@/lib/api/endpoints";
import type { Brand } from "@/types/vehicle";

export const initialBrands: Brand[] = [
  {
    id: "tata",
    slug: "tata",
    name: "Tata Motors",
    origin: "India",
    popular: true,
  },
  {
    id: "mahindra",
    slug: "mahindra",
    name: "Mahindra",
    origin: "India",
    popular: true,
  },
  {
    id: "ashok-leyland",
    slug: "ashok-leyland",
    name: "Ashok Leyland",
    origin: "India",
    popular: true,
  },
  {
    id: "eicher",
    slug: "eicher",
    name: "Eicher",
    origin: "India",
    popular: true,
  },
  {
    id: "bharatbenz",
    slug: "bharatbenz",
    name: "BharatBenz",
    origin: "India / Daimler",
    popular: true,
  },
  {
    id: "force",
    slug: "force",
    name: "Force Motors",
    origin: "India",
    popular: true,
  },
  {
    id: "maruti-suzuki",
    slug: "maruti-suzuki",
    name: "Maruti Suzuki",
    origin: "India / Japan",
    popular: true,
  },
  {
    id: "isuzu",
    slug: "isuzu",
    name: "Isuzu",
    origin: "Japan",
    popular: false,
  },
  {
    id: "volvo",
    slug: "volvo",
    name: "Volvo",
    origin: "Sweden",
    popular: false,
  },
  {
    id: "scania",
    slug: "scania",
    name: "Scania",
    origin: "Sweden",
    popular: false,
  },
  { id: "man", slug: "man", name: "MAN", origin: "Germany", popular: false },
  {
    id: "piaggio",
    slug: "piaggio",
    name: "Piaggio",
    origin: "Italy",
    popular: true,
  },
  {
    id: "sml-isuzu",
    slug: "sml-isuzu",
    name: "SML Isuzu",
    origin: "India",
    popular: false,
  },
  {
    id: "jcb",
    slug: "jcb",
    name: "JCB",
    origin: "United Kingdom",
    popular: false,
  },
  {
    id: "atul",
    slug: "atul",
    name: "Atul Auto",
    origin: "India",
    popular: false,
  },
];

let cachedBackendBrands: Brand[] | null = null;

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const API_KEY =
  process.env.NEXT_PUBLIC_API_SERVER_TOKEN ||
  process.env.API_SERVER_TOKEN ||
  "e732d462a159c20d0c17d4ba38891a076baf2bc5c087fd0c9b2c60f98de32746e89624b49b0714b48701b9bb6c2428a1fe6599cdd6e4f2dc425a44df7d2e8c4a";

export async function getAllBrands(): Promise<Brand[]> {
  if (cachedBackendBrands) return cachedBackendBrands;

  try {
    const response = await fetch(`${BASE_URL}${endpoints.brands.list}`, {
      headers: {
        Accept: "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    if (response.ok) {
      const res = await response.json();
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        const fetchedBrands: Brand[] = res.data.map((b: any) => ({
          id: String(b.id || b._id),
          slug: b.slug,
          name: b.name,
          origin: "India",
          popular: Boolean(b.models_count && b.models_count > 5),
        }));
        cachedBackendBrands = fetchedBrands;
        return fetchedBrands;
      }
    }
  } catch (err) {
    console.error("Failed to fetch brands from backend:", err);
  }

  return initialBrands;
}

export const brands = initialBrands;

export function getBrandBySlug(slug: string): Brand {
  const found = initialBrands.find((b) => b.slug === slug);
  if (found) return found;

  const formattedName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: slug,
    slug,
    name: formattedName,
    origin: "India",
    popular: true,
  };
}

export const popularBrands = initialBrands.filter((b) => b.popular);
