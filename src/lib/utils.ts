import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a booking reference number in the format ML-BOOK-YYYY-XXXXX
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ML-BOOK-${year}-${random}`;
}

/**
 * Formats a South African phone number for display
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("27") && cleaned.length === 11) {
    return `+27 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Formats a currency amount in South African Rands
 */
export function formatRand(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Returns service label from service_type enum value
 */
export function getServiceLabel(serviceType: string): string {
  const labels: Record<string, string> = {
    consultation: "Personal Style Consultation",
    wardrobe: "Wardrobe Curation & Editing",
    shopping: "Personal Shopping Services",
    corporate: "Professional & Corporate Styling",
    event: "Event & Special Occasion Styling",
    custom_garment: "Custom Design & In-House Alterations",
    alteration: "Alterations",
    style_discovery: "Style Discovery Session",
  };
  return labels[serviceType] ?? serviceType;
}
