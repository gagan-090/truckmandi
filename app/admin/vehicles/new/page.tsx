"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Plus, Save, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export default function AdminNewVehiclePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [title, setTitle] = useState("");
  const [brandName, setBrandName] = useState("Ashok Leyland");
  const [categoryName, setCategoryName] = useState("Trucks");
  const [price, setPrice] = useState("1850000");
  const [gvwKg, setGvwKg] = useState("18500");
  const [payloadKg, setPayloadKg] = useState("12000");
  const [year, setYear] = useState("2023");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          brandName,
          categoryName,
          price,
          gvwKg,
          payloadKg,
          manufacturingYear: year,
          city,
          state,
          description,
          isUsed: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(true);
        setTimeout(() => {
          router.push("/admin/vehicles");
          router.refresh();
        }, 1500);
      }
    } catch {
      // error handling
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-steel-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-brand-100 text-brand-600">
            <Truck className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-steel-900">
              Publish New Commercial Truck Listing
            </h2>
            <p className="text-xs text-steel-500">
              Create a new vehicle record directly in the MongoDB database collection.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          Vehicle listing added to MongoDB database successfully! Redirecting to inventory...
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-steel-200 bg-white p-6 shadow-2xs space-y-5">
        <FormField id="truck-title" label="Vehicle Model & Title" required hint="e.g. Ashok Leyland 1920 4x2 Haulage Truck">
          <Input
            id="truck-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter vehicle model title"
            required
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="truck-brand" label="Brand / Manufacturer" required>
            <Input
              id="truck-brand"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Tata Motors, Ashok Leyland, Mahindra"
              required
            />
          </FormField>

          <FormField id="truck-category" label="Category" required>
            <Input
              id="truck-category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Trucks, Tippers, Pickups"
              required
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField id="truck-price" label="Price (₹ INR)" required>
            <Input
              id="truck-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1850000"
              required
            />
          </FormField>

          <FormField id="truck-gvw" label="GVW (kg)">
            <Input
              id="truck-gvw"
              type="number"
              value={gvwKg}
              onChange={(e) => setGvwKg(e.target.value)}
              placeholder="18500"
            />
          </FormField>

          <FormField id="truck-payload" label="Payload (kg)">
            <Input
              id="truck-payload"
              type="number"
              value={payloadKg}
              onChange={(e) => setPayloadKg(e.target.value)}
              placeholder="12000"
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField id="truck-year" label="Manufacturing Year">
            <Input
              id="truck-year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2023"
            />
          </FormField>

          <FormField id="truck-city" label="City" required>
            <Input
              id="truck-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai"
              required
            />
          </FormField>

          <FormField id="truck-state" label="State" required>
            <Input
              id="truck-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Maharashtra"
              required
            />
          </FormField>
        </div>

        <FormField id="truck-desc" label="Overview & Description">
          <textarea
            id="truck-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High efficiency commercial vehicle with strong build quality..."
            className="w-full rounded-md border border-steel-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-3 border-t border-steel-100">
          <Button type="button" variant="subtle" onClick={() => router.push("/admin/vehicles")}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
            Save & Publish to MongoDB
          </Button>
        </div>
      </form>
    </div>
  );
}
