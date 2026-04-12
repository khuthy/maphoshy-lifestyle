import { createClient } from "@supabase/supabase-js";

export type BookingStatus = "pending" | "paid" | "failed" | "cancelled";

export type ServiceType =
  | "consultation"
  | "wardrobe"
  | "shopping"
  | "corporate"
  | "event"
  | "custom_garment"
  | "alteration"
  | "style_discovery";

export interface Booking {
  id: string;
  reference: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: ServiceType;
  service_details: Record<string, unknown> | null;
  preferred_date: string | null;
  amount: number;
  payment_status: BookingStatus;
  payfast_payment_id: string | null;
  notes: string | null;
  session_format: "video_call" | "in_person" | null;
}

/**
 * Browser / public client — uses anon key (RLS enforced).
 * Safe for public reads — Supabase RLS "Public read active" policies allow this.
 * Lazy singleton to avoid build-time env errors.
 */
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}

/**
 * Public server client — uses anon key with Next.js cache disabled.
 * For use in server components reading public CMS data (portfolio, pricing, services, FAQs).
 * RLS "Public read active" policies allow these reads.
 */
export function createPublicServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        // Explicitly bypass Next.js data cache — ensures fresh data on every request
        fetch: (url: RequestInfo | URL, options: RequestInit = {}) =>
          fetch(url, { ...options, cache: "no-store" }),
      },
    }
  );
}

/**
 * Server / admin client — uses service role key (bypasses RLS entirely).
 * For use ONLY in API routes and admin operations.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
      global: {
        fetch: (url: RequestInfo | URL, options: RequestInit = {}) =>
          fetch(url, { ...options, cache: "no-store" }),
      },
    }
  );
}
