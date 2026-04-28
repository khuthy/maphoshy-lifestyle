"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { STYLE_WORDS } from "@/types/booking";
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

const CONSULTATION_FEE = 500;

// ── Main component ───────────────────────────────────────────────────────
export function BookingForm({ services }: { services: BookingServiceOption[] }) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Build lookup maps from the dynamic services list
  const serviceLabels: Record<string, string> = Object.fromEntries(
    services.map((s) => [s.service_key, s.title])
  );
  const servicePrices: Record<string, number> = Object.fromEntries(
    services.map((s) => [s.service_key, parsePrice(s.price_from)])
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

  const serviceType = watch("serviceType");
  const sessionFormat = watch("sessionFormat");
  const selectedStyleWords = watch("styleWords") ?? [];

  // Update service when URL param changes
  useEffect(() => {
    const param = searchParams.get("service");
    if (param && serviceLabels[param]) {
      setValue("serviceType", param);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setValue]);

  const currentService = services.find(s => s.service_key === serviceType);
  const servicePrice =
    sessionFormat === "video_call" && currentService?.price_video_call
      ? parsePrice(currentService.price_video_call)
      : sessionFormat === "in_person" && currentService?.price_in_person
      ? parsePrice(currentService.price_in_person)
      : servicePrices[serviceType] ?? 0;
  // Deposit = R500 consultation fee + 50% of service price
  const serviceDeposit = Math.round(servicePrice * 0.5);
  const totalDeposit = CONSULTATION_FEE + serviceDeposit;

  const isCustomGarment = serviceType === "custom_garment";
  const isAlteration = serviceType === "alteration";
  const isStyleDiscovery = serviceType === "style_discovery";
  const showFileUpload = isCustomGarment || isAlteration;

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
      formData.append("amount", String(totalDeposit));
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

      if (isStyleDiscovery) {
        serviceDetails.lifestyleContext = data.lifestyleContext;
        serviceDetails.styleWords = data.styleWords;
      }

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
            hint="This is your preferred date — we will confirm availability."
          >
            <input
              {...register("preferredDate")}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className={inputCls}
            />
          </Field>
        </div>
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

        {/* Pricing breakdown */}
        <div className="rounded-xl border border-brand-purple/20 bg-brand-light-purple divide-y divide-brand-purple/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Consultation fee</p>
              <p className="text-xs text-gray-500">Fixed for all services</p>
            </div>
            <p className="font-semibold text-gray-900">{formatRand(CONSULTATION_FEE)}</p>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">50% service deposit</p>
              <p className="text-xs text-gray-500">Balance due at/after your session</p>
            </div>
            <p className="font-semibold text-gray-900">
              {servicePrice > 0 ? formatRand(serviceDeposit) : "—"}
            </p>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-bold text-brand-purple">Total due today</p>
            <p className="font-heading text-2xl font-bold text-brand-purple">
              {servicePrice > 0 ? formatRand(totalDeposit) : formatRand(CONSULTATION_FEE)}
            </p>
          </div>
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

      {/* ── Section 3c: Style Discovery fields ── */}
      {isStyleDiscovery && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Tell Us About Yourself
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
      )}

      {/* ── Section 4: Reference image upload ── */}
      {showFileUpload && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            Reference Images{" "}
            <span className="text-sm font-normal text-gray-400">(Optional)</span>
          </h2>
          <p className="text-sm text-gray-600">
            Upload up to 5 reference images. JPG or PNG only, max 5MB each.
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
      )}

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
            <p className="text-xs text-gray-500">Due today</p>
            <p className="font-heading text-3xl font-bold text-brand-purple">
              {servicePrice > 0 ? formatRand(totalDeposit) : formatRand(CONSULTATION_FEE)}
            </p>
          </div>
        </div>

        {servicePrice > 0 && (
          <p className="text-xs text-gray-500 mb-4">
            Remaining balance of {formatRand(serviceDeposit)} is due at or after your session.
          </p>
        )}

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
              Pay &amp; Book — {servicePrice > 0 ? formatRand(totalDeposit) : formatRand(CONSULTATION_FEE)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
