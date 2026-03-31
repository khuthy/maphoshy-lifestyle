import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEnquiry } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten() },
        { status: 400 }
      );
    }

    await sendContactEnquiry(result.data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
