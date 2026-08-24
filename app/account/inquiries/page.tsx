import type { Metadata } from "next";
import { InquiryList } from "@/components/account/inquiry-list";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "My Enquiries",
  description: "Messages, callbacks and offers you have sent to sellers.",
  path: "/account/inquiries",
  noIndex: true,
});

export default function InquiriesPage() {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-steel-900">
        My enquiries
      </h2>
      <p className="mt-1.5 mb-6 max-w-2xl text-sm text-pretty text-steel-600">
        Every message and offer you have sent, with the seller&rsquo;s response.
      </p>

      <InquiryList />
    </div>
  );
}
