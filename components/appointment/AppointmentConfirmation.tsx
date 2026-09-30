"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { appointmentContext } from "@/data/appointment";
import { formatLongDate, formatTime } from "@/lib/date";
import { createAppointment, getAvailability } from "@/services/appointment-api";
import type { AvailabilitySlot } from "@/types/appointment";

type AppointmentConfirmationProps = {
  date: string;
  time: string;
};

export function AppointmentConfirmation({ date, time: slotId }: AppointmentConfirmationProps) {
  const router = useRouter();
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const dateParam = encodeURIComponent(date);
  const slotParam = encodeURIComponent(slotId);

  useEffect(() => {
    let active = true;

    getAvailability(date)
      .then((availability) => {
        if (!active) return;
        const selectedSlot = availability.slots.find((item) => item.id === slotId);
        if (!selectedSlot || !selectedSlot.available) {
          setError("That time is no longer available. Choose another slot.");
          return;
        }
        setSlot(selectedSlot);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to check this time.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [date, slotId, retryCount]);

  async function confirmAppointment() {
    if (!slot) return;
    setSubmitting(true);
    setError(null);

    try {
      const appointment = await createAppointment({
        user_id: appointmentContext.userId,
        appointment_type_id: appointmentContext.appointmentTypeId,
        date,
        slot_id: slot.id,
      });
      router.push(`/appointment/success?id=${encodeURIComponent(appointment.id)}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to confirm appointment.");
      setSubmitting(false);
    }
  }

  if (loading) return <FeedbackState kind="loading" title="Checking appointment details" />;

  if (!slot) {
    return (
      <section className="px-6 py-8 sm:px-10 sm:py-10">
        <FeedbackState kind="error" message={error ?? "The selected time could not be loaded."} />
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={`/appointment/time?date=${dateParam}`}
            className="inline-flex min-h-11 items-center justify-center rounded border border-[#dce5dc] px-4 text-sm font-semibold text-[#52665f] hover:bg-[#f8faf7]"
          >
            Choose another time
          </Link>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              setRetryCount((count) => count + 1);
            }}
            className="min-h-11 rounded bg-[#183f36] px-4 text-sm font-semibold text-white hover:bg-[#245449]"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const details = [
    ["Patient", appointmentContext.patientName],
    ["Provider", appointmentContext.organizationName],
    ["Appointment type", appointmentContext.serviceName],
    ["Date", formatLongDate(date)],
    ["Time", formatTime(slot.start)],
  ];

  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10" aria-labelledby="confirm-heading">
      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9a6b55]">
        Final step
      </p>
      <h2 id="confirm-heading" className="mt-2 text-xl font-semibold text-[#243d37]">
        Confirm your appointment
      </h2>
      <dl className="mt-6 divide-y divide-[#e8ede8] border-y border-[#e8ede8]">
        {details.map(([label, value]) => (
          <div key={label} className="flex flex-wrap justify-between gap-2 py-4 text-sm">
            <dt className="text-[#75837d]">{label}</dt>
            <dd className="font-medium text-[#243d37]">{value}</dd>
          </div>
        ))}
      </dl>
      {error && <FeedbackState kind="error" message={error} />}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/appointment/date?type=${encodeURIComponent(appointmentContext.appointmentTypeId)}&date=${dateParam}`}
            className="inline-flex min-h-11 items-center justify-center rounded border border-[#dce5dc] px-4 text-sm font-semibold text-[#52665f] hover:bg-[#f8faf7]"
          >
            Edit date
          </Link>
          <Link
            href={`/appointment/time?date=${dateParam}&time=${slotParam}`}
            className="inline-flex min-h-11 items-center justify-center rounded border border-[#dce5dc] px-4 text-sm font-semibold text-[#52665f] hover:bg-[#f8faf7]"
          >
            Edit time
          </Link>
        </div>
        <button
          type="button"
          onClick={confirmAppointment}
          disabled={submitting || !slot.available}
          className="inline-flex min-h-11 items-center justify-center rounded bg-[#183f36] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#245449] disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Confirming..." : "Confirm appointment"}
        </button>
      </div>
    </section>
  );
}
