export type ServiceType =
  | "consultation"
  | "wardrobe"
  | "shopping"
  | "corporate"
  | "event"
  | "custom_garment"
  | "alteration"
  | "style_discovery";

export const SERVICE_LABELS: Record<ServiceType, string> = {
  consultation: "Personal Style Consultation",
  wardrobe: "Wardrobe Curation & Editing",
  shopping: "Personal Shopping Services",
  corporate: "Professional & Corporate Styling",
  event: "Event & Special Occasion Styling",
  custom_garment: "Custom Design (New Garment)",
  alteration: "In-House Alterations",
  style_discovery: "Style Discovery Session",
};

export const SERVICE_PRICES: Record<ServiceType, number> = {
  consultation: 500,
  wardrobe: 800,
  shopping: 600,
  corporate: 700,
  event: 650,
  custom_garment: 400,
  alteration: 400,
  style_discovery: 350,
};

export const STYLE_WORDS = [
  "Classic",
  "Bold",
  "Minimalist",
  "Romantic",
  "Edgy",
  "Casual",
  "Feminine",
  "Androgynous",
  "Sporty",
  "Elegant",
  "Bohemian",
  "Corporate",
];
