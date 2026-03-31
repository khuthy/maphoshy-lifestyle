import crypto from "crypto";

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE!;
const IS_SANDBOX = process.env.NODE_ENV !== "production";

const PAYFAST_BASE_URL = IS_SANDBOX
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  email_confirmation?: string;
  confirmation_address?: string;
}

/**
 * Generates the MD5 signature for a PayFast payment
 */
export function generatePayFastSignature(
  data: Record<string, string>,
  passphrase: string
): string {
  // Sort keys alphabetically and build query string
  const paramString = Object.keys(data)
    .sort()
    .filter((key) => data[key] !== "" && data[key] !== undefined)
    .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
    .join("&");

  const stringWithPassphrase = `${paramString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;

  return crypto.createHash("md5").update(stringWithPassphrase).digest("hex");
}

/**
 * Builds the complete PayFast payment URL with all signed parameters
 */
export function buildPayFastUrl(params: {
  bookingReference: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  amount: number;
  siteUrl: string;
}): string {
  const nameParts = params.clientName.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || firstName;

  const data: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${params.siteUrl}/booking/success?ref=${params.bookingReference}`,
    cancel_url: `${params.siteUrl}/booking/cancel?ref=${params.bookingReference}`,
    notify_url: `${params.siteUrl}/api/payfast-notify`,
    name_first: firstName,
    name_last: lastName,
    email_address: params.clientEmail,
    m_payment_id: params.bookingReference,
    amount: params.amount.toFixed(2),
    item_name: `Maphoshy Lifestyle — ${params.serviceName}`,
    item_description: `Consultation booking: ${params.bookingReference}`,
    email_confirmation: "1",
    confirmation_address: params.clientEmail,
  };

  const signature = generatePayFastSignature(data, PAYFAST_PASSPHRASE);
  data.signature = signature;

  const queryString = Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join("&");

  return `${PAYFAST_BASE_URL}?${queryString}`;
}

/**
 * Validates a PayFast ITN (Instant Transaction Notification) signature
 */
export function validatePayFastSignature(
  itnData: Record<string, string>
): boolean {
  const receivedSignature = itnData.signature;
  const dataWithoutSignature = { ...itnData };
  delete dataWithoutSignature.signature;

  const expectedSignature = generatePayFastSignature(
    dataWithoutSignature,
    PAYFAST_PASSPHRASE
  );

  return receivedSignature === expectedSignature;
}
