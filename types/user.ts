export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export const INQUIRY_STATUSES = [
  "sent",
  "viewed",
  "responded",
  "closed",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_TYPES = ["callback", "message", "offer", "visit"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export interface Inquiry {
  id: string;
  vehicleId: string;
  vehicleSlug: string;
  vehicleTitle: string;
  vehicleImage: string;
  type: InquiryType;
  status: InquiryStatus;
  message?: string;
  offerAmount?: number;
  createdAt: string;
}
