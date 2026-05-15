"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Upload, Loader2, AlertCircle, Clock } from "lucide-react";
import { STYLE_WORDS } from "@/types/booking";

// ── Time slot constants ──────────────────────────────────────────────────
const BUSINESS_START = 8 * 60;  // 08:00
const BUSINESS_END   = 18 * 60; // 18:00

const SLOT_INTERVAL = 30; // minutes

const ALL_SLOTS: string[] = [];
for (let m = BUSINESS_START; m < BUSINESS_END; m += SLOT_INTERVAL) {
  ALL_SLOTS.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
}

const DURATIONS = [
  { value: "1",   label: "1 hour"    },
  { value: "1.5", label: "1.5 hours" },
  { value: "2",   label: "2 hours"   },
  { value: "2.5", label: "2.5 hours" },
  { value: "3",   label: "3 hours"   },
];

const TIME_GROUPS = [
  { label: "Morning",   slots: ALL_SLOTS.filter(t => { const h = parseInt(t); return h >= 8  && h < 12; }) },
  { label: "Afternoon", slots: ALL_SLOTS.filter(t => { const h = parseInt(t); return h >= 12 && h < 16; }) },
  { label: "Late",      slots: ALL_SLOTS.filter(t => { const h = parseInt(t); return h >= 16; }) },
];

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function slotFitsInDay(slot: string, durationHours: number) {
  return toMin(slot) + durationHours * 60 <= BUSINESS_END;
}

function slotIsAvailable(
  slot: string,
  durationHours: number,
  booked: { start: string; end: string }[]
) {
  if (!slotFitsInDay(slot, durationHours)) return false;
  const s = toMin(slot);
  const e = s + durationHours * 60;
  return !booked.some(b => s < toMin(b.end) && e > toMin(b.start));
}
import { formatRand } from "@/lib/utils";

// ── Zod schema ──────────────────────────────────────────────────────────
const baseSchema = z.object({
  clientName: z.string().min(2, "Please enter your full name"),
  clientEmail: z.string().email("Please enter a valid email address"),
  clientPhone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9+\s()-]{10,15}$/, "Invalid phone number format"),
  serviceType: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a time slot"),
  sessionDuration: z.string().min(1, "Please select a session duration"),
  notes: z.string().optional(),
  // Custom garment fields
  bust: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  height: z.string().optional(),
  inseam: z.string().optional(),
  shoulderWidth: z.string().optional(),
  fabricPreference: z.string().optional(),
  garmentType: z.string().optional(),
  occasion: z.string().optional(),
  // Alteration fields
  alterationType: z.string().optional(),
  garmentDescription: z.string().optional(),
  currentMeasurements: z.string().optional(),
  desiredMeasurements: z.string().optional(),
  // Style discovery fields
  lifestyleContext: z.string().optional(),
  styleWords: z.array(z.string()).optional(),
  sessionFormat: z.enum(["video_call", "in_person"]).optional(),
});

type BookingFormData = z.infer<typeof baseSchema>;

export interface BookingServiceOption {
  service_key: string;
  title: string;
  price_from: string | number | null;
  price_video_call?: string | number | null;
  price_in_person?: string | number | null;
}

function parsePrice(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

// ── Input component ─────────────────────────────────────────────────────
function Field({
  label,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm transition-all bg-white";

// ── Main component ───────────────────────────────────────────────────────
export function BookingForm({ services }: { services: BookingServiceOption[] }) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [bookedRanges, setBookedRanges] = useState<{ start: string; end: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Build lookup maps from the dynamic services list
  const serviceLabels: Record<string, string> = Object.fromEntries(
    services.map((s) => [s.service_key, s.title])
  );
  const serviceOptions = services.map((s) => ({ value: s.service_key, label: s.title }));

  // Determine default service from URL param or first available
  const urlParam = searchParams.get("service") ?? "";
  const defaultService =
    urlParam && serviceLabels[urlParam] ? urlParam : (services[0]?.service_key ?? "");

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      serviceType: defaultService,
      styleWords: [],
    },
  });

  const serviceType      = watch("serviceType");
  const sessionFormat    = watch("sessionFormat");
  const selectedStyleWords = watch("styleWords") ?? [];
  const preferredDate    = watch("preferredDate");
  const sessionDuration  = watch("sessionDuration");
  const preferredTime    = watch("preferredTime");

  // Fetch booked slots whenever the date changes
  useEffect(() => {
    if (!preferredDate) { setBookedRanges([]); return; }
    setLoadingSlots(true);
    setValue("preferredTime", "");
    fetch(`/api/booked-slots?date=${preferredDate}`)
      .then(r => r.json())
      .then(data => setBookedRanges(data.bookedRanges ?? []))
      .catch(() => setBookedRanges([]))
      .finally(() => setLoadingSlots(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredDate]);

  // Clear selected time when duration changes
  useEffect(() => {
    setValue("preferredTime", "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionDuration]);

  // Update service when URL param changes
  useEffect(() => {
    const param = searchParams.get("service");
    if (param && serviceLabels[param]) {
      setValue("serviceType", param);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setValue]);

  const currentService = services.find(s => s.service_key === serviceType);
  // Price = the selected session format's consultation fee
  const consultationFee =
    sessionFormat === "video_call" && currentService?.price_video_call
      ? parsePrice(currentService.price_video_call)
      : sessionFormat === "in_person" && currentService?.price_in_person
      ? parsePrice(currentService.price_in_person)
      : 0;

  const isCustomGarment = serviceType === "custom_garment";
  const isAlteration = serviceType === "alteration";

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = Array.from(e.target.files ?? []);

    for (const file of files) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setFileError("Only JPG and PNG files are accepted.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError("Each file must be under 5MB.");
        return;
      }
    }

    const combined = [...uploadedFiles, ...files].slice(0, 5);
    setUploadedFiles(combined);
  };

  const toggleStyleWord = (word: string) => {
    const current = selectedStyleWords;
    const updated = current.includes(word)
      ? current.filter((w) => w !== word)
      : [...current, word];
    setValue("styleWords", updated);
  };

  // Form submit
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("clientName", data.clientName);
      formData.append("clientEmail", data.clientEmail);
      formData.append("clientPhone", data.clientPhone);
      formData.append("serviceType", data.serviceType);
      formData.append("preferredDate", data.preferredDate);
      formData.append("preferredTime", data.preferredTime);
      formData.append("sessionDuration", data.sessionDuration);
      formData.append("amount", String(consultationFee));
      if (data.notes) formData.append("notes", data.notes);

      // Service-specific fields
      const serviceDetails: Record<string, unknown> = {};

      if (isCustomGarment) {
        serviceDetails.measurements = {
          bust: data.bust,
          waist: data.waist,
          hips: data.hips,
          height: data.height,
          inseam: data.inseam,
          shoulderWidth: data.shoulderWidth,
        };
        serviceDetails.fabricPreference = data.fabricPreference;
        serviceDetails.garmentType = data.garmentType;
        serviceDetails.occasion = data.occasion;
      }

      if (isAlteration) {
        serviceDetails.alterationType = data.alterationType;
        serviceDetails.garmentDescription = data.garmentDescription;
        serviceDetails.currentMeasurements = data.currentMeasurements;
        serviceDetails.desiredMeasurements = data.desiredMeasurements;
      }

      if (data.sessionFormat) {
        serviceDetails.sessionFormat = data.sessionFormat;
        formData.append("sessionFormat", data.sessionFormat);
      }

      if (data.lifestyleContext) serviceDetails.lifestyleContext = data.lifestyleContext;
      if (data.styleWords?.length) serviceDetails.styleWords = data.styleWords;

      formData.append("serviceDetails", JSON.stringify(serviceDetails));

      // Append files
      uploadedFiles.forEach((file) => {
        formData.append("referenceImages", file);
      });

      const res = await fetch("/api/create-payment", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }

      // Redirect to PayFast
      if (json.paymentUrl) {
        window.location.href = json.paymentUrl;
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* ── Section 1: Your details ── */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
        <h2 className="font-heading text-xl font-semibold text-gray-900">
          Your Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full Name" required error={errors.clientName?.message}>
            <input
              {...register("clientName")}
              placeholder="Your full name"
              className={inputCls}
            />
          </Field>

          <Field
            label="Email Address"
            required
            error={errors.clientEmail?.message}
          >
            <input
              {...register("clientEmail")}
              type="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>

          <Field
            label="Phone Number"
            required
            error={errors.clientPhone?.message}
          >
            <input
              {...register("clientPhone")}
              placeholder="073 000 0000"
              className={inputCls}
            />
          </Field>

          <Field
            label="Preferred Date"
            required
            error={errors.preferredDate?.message}
            hint="Pick a date to see available time slots."
          >
            <input
              {...register("preferredDate")}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className={inputCls}
            />
          </Field>
        </div>

        {/* ── Time Slot Picker ── */}
        {preferredDate && (
          <div className="space-y-5 pt-2">
            {/* Duration selector */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Session Duration <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setValue("sessionDuration", d.value, { shouldValidate: true })}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      sessionDuration === d.value
                        ? "border-brand-purple bg-brand-light-purple text-brand-purple"
                        : "border-gray-200 text-gray-600 hover:border-brand-purple/40"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {errors.sessionDuration && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.sessionDuration.message}
                </p>
              )}
            </div>

            {/* Time slot grid */}
            {sessionDuration && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  Available Times
                  {loadingSlots && <Loader2 size={13} className="animate-spin text-brand-purple" />}
                  <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500">
                  Showing available {sessionDuration}-hour slots for{" "}
                  {new Date(preferredDate + "T00:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}
                </p>

                {!loadingSlots && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-4">
                    {TIME_GROUPS.map(group => {
                      const slots = group.slots.filter(s => slotFitsInDay(s, Number(sessionDuration)));
                      if (slots.length === 0) return null;
                      return (
                        <div key={group.label}>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Clock size={10} /> {group.label}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map(slot => {
                              const available = slotIsAvailable(slot, Number(sessionDuration), bookedRanges);
                              const selected  = preferredTime === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={!available}
                                  onClick={() => available && setValue("preferredTime", slot, { shouldValidate: true })}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    selected
                                      ? "bg-brand-purple text-white shadow-sm"
                                      : available
                                      ? "bg-white border border-gray-200 text-gray-700 hover:border-brand-purple hover:text-brand-purple"
                                      : "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Show "no slots" if every possible slot is blocked */}
                    {TIME_GROUPS.every(g =>
                      g.slots.filter(s => slotFitsInDay(s, Number(sessionDuration)))
                        .every(s => !slotIsAvailable(s, Number(sessionDuration), bookedRanges))
                    ) && (
                      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-medium">
                        No time slots available for this date and duration. Please choose a different date.
                      </p>
                    )}
                  </div>
                )}

                {errors.preferredTime && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.preferredTime.message}
                  </p>
                )}

                {preferredTime && (
                  <p className="text-xs text-emerald-600 font-semibold">
                    ✓ Selected: {preferredTime} – {(() => {
                      const end = toMin(preferredTime) + Number(sessionDuration) * 60;
                      return `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
                    })()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Section 2: Service selection ── */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
        <h2 className="font-heading text-xl font-semibold text-gray-900">
          Choose Your Service
        </h2>

        <Field label="Service Type" required error={errors.serviceType?.message}>
          <select {...register("serviceType")} className={inputCls}>
            {serviceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Session format — applies to all services */}
        <Field label="Session Format" required error={errors.sessionFormat?.message}>
          <Controller
            control={control}
            name="sessionFormat"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { value: "video_call", label: "Video Call", emoji: "💻" },
                    { value: "in_person", label: "In Person", emoji: "🤝" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                      field.value === opt.value
                        ? "border-brand-purple bg-brand-light-purple text-brand-purple"
                        : "border-gray-200 text-gray-600 hover:border-brand-purple/50"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          />
        </Field>

        {/* Consultation fee display */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-brand-light-purple border border-brand-purple/20">
          <div>
            <p className="text-sm font-medium text-gray-700">Consultation fee</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {sessionFormat === "video_call" ? "Video call session" : sessionFormat === "in_person" ? "In-person session" : "Select a session format above"}
            </p>
          </div>
          <p className="font-heading text-2xl font-bold text-brand-purple">
            {consultationFee > 0 ? formatRand(consultationFee) : "—"}
          </p>
        </div>

        <Field label="Additional Notes" error={errors.notes?.message}>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Any additional context, questions or requests..."
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      {/* ── Section 3: Custom Garment fields ── */}
      {isCustomGarment && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Garment Details
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: "bust" as const, label: "Bust (cm)" },
              { name: "waist" as const, label: "Waist (cm)" },
              { name: "hips" as const, label: "Hips (cm)" },
              { name: "height" as const, label: "Height (cm)" },
              { name: "inseam" as const, label: "Inseam (cm)" },
              { name: "shoulderWidth" as const, label: "Shoulder Width (cm)" },
            ].map(({ name, label }) => (
              <Field key={name} label={label}>
                <input
                  {...register(name)}
                  type="number"
                  placeholder="e.g. 90"
                  className={inputCls}
                />
              </Field>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Garment Type" hint="e.g. Evening dress, blazer, skirt">
              <input
                {...register("garmentType")}
                placeholder="Evening dress"
                className={inputCls}
              />
            </Field>
            <Field label="Occasion">
              <input
                {...register("occasion")}
                placeholder="Wedding, graduation, work event..."
                className={inputCls}
              />
            </Field>
            <Field label="Fabric Preference" hint="e.g. Satin, cotton, lace">
              <input
                {...register("fabricPreference")}
                placeholder="Satin, cotton..."
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Section 3b: Alteration fields ── */}
      {isAlteration && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Alteration Details
          </h2>

          <Field label="Type of Alteration" hint="e.g. Hem, take in, let out, zip repair">
            <input
              {...register("alterationType")}
              placeholder="Hem shortening, take in waist..."
              className={inputCls}
            />
          </Field>

          <Field label="Garment Description">
            <input
              {...register("garmentDescription")}
              placeholder="Black evening dress with side slit..."
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Current Measurements"
              hint="Relevant measurements before alteration"
            >
              <textarea
                {...register("currentMeasurements")}
                rows={2}
                placeholder="Waist: 78cm, Hem: 115cm..."
                className={`${inputCls} resize-none`}
              />
            </Field>
            <Field
              label="Desired Measurements"
              hint="Measurements you'd like after alteration"
            >
              <textarea
                {...register("desiredMeasurements")}
                rows={2}
                placeholder="Waist: 72cm, Hem: 100cm..."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Section 3c: Style context (all services) ── */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Tell Us About Yourself <span className="text-sm font-normal text-gray-400">(Optional)</span>
          </h2>

          <Field
            label="Lifestyle Context"
            hint="How would you describe your lifestyle and the occasions you dress for?"
          >
            <textarea
              {...register("lifestyleContext")}
              rows={3}
              placeholder="I work in a corporate environment but I love dressing up for events on weekends..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Words That Describe Your Ideal Style" hint="Select up to 3">
            <div className="flex flex-wrap gap-2 mt-1">
              {STYLE_WORDS.map((word) => {
                const selected = selectedStyleWords.includes(word);
                const atLimit =
                  selectedStyleWords.length >= 3 && !selected;
                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => !atLimit && toggleStyleWord(word)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selected
                        ? "bg-brand-purple text-white"
                        : atLimit
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-brand-light-purple hover:text-brand-purple"
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </Field>

      </div>

      {/* ── Section 4: Reference image upload (all services) ── */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Reference Images{" "}
            <span className="text-sm font-normal text-gray-400">(Optional)</span>
          </h2>
          <p className="text-sm text-gray-600">
            Upload inspiration images, garments to be altered, or anything that helps us understand your vision. JPG or PNG only, max 5MB each.
          </p>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-purple hover:bg-brand-light-purple/30 transition-all">
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-400 mt-1">
              JPG, PNG · Max 5MB each · Up to 5 files
            </span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {fileError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {fileError}
            </p>
          )}

          {uploadedFiles.length > 0 && (
            <ul className="space-y-2">
              {uploadedFiles.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setUploadedFiles((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="text-gray-400 hover:text-red-500 ml-3 shrink-0 text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
      </div>

      {/* ── Error message ── */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}

      {/* ── Submit ── */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <p className="font-semibold text-gray-900">Booking Summary</p>
            <p className="text-sm text-gray-500 mt-1">
              {serviceLabels[serviceType] ?? serviceType}
              {sessionFormat ? ` · ${sessionFormat === "video_call" ? "Video Call" : "In Person"}` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Consultation fee</p>
            <p className="font-heading text-3xl font-bold text-brand-purple">
              {consultationFee > 0 ? formatRand(consultationFee) : "—"}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          By clicking &quot;Pay &amp; Book&quot; you&apos;ll be redirected to
          PayFast to complete your secure payment. Your booking is confirmed
          only after successful payment. Accepted: credit/debit cards, EFT,
          Capitec Pay, SnapScan.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all shadow-md hover:shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay &amp; Book — {consultationFee > 0 ? formatRand(consultationFee) : "Select a format"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
