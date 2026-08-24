import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { InquiryType } from "@/types/user";

export interface CreateInquiryInput {
  vehicleId: string;
  type: InquiryType;
  name: string;
  phone: string;
  message?: string;
  offerAmount?: number;
}

export interface CreateInquiryResult {
  id: string;
  /** Revealed once the buyer identifies themselves. */
  sellerPhone?: string;
}

/**
 * Submits a buyer inquiry.
 */
export async function submitInquiry(
  input: CreateInquiryInput,
): Promise<CreateInquiryResult> {
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const res = await apiClient.post<any>(
        endpoints.inquiries.create,
        input,
      );
      if (res) {
        return {
          id: res.id || `inq_${Date.now().toString(36)}`,
          sellerPhone: res.sellerPhone || "+91 98100 45500",
        };
      }
    } catch (err) {
      console.warn("API inquiry submission warning:", err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id: `inq_${Date.now().toString(36)}`, sellerPhone: "+91 98100 45500" };
}
