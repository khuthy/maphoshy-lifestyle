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
 * Browser client — uses anon key (RLS enforced)
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
 * Server client — uses service role key (bypasses RLS)
 * Creates a new instance per request. Use ONLY in API routes / server actions.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
