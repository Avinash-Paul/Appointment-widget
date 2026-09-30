"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { formatLongDate, formatTime } from "@/lib/date";
import { getAppointment } from "@/services/appointment-api";
import type { AppointmentRecord } from "@/types/appointment";

type AppointmentSuccessProps = {
  appointmentId: string;
};

export function AppointmentSuccess({ appointmentId }: AppointmentSuccessProps) {
  const [appointment, setAppointment] = useState<AppointmentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    getAppointment(appointmentId)
      .then((record) => {
        if (active) setAppointment(record);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load appointment.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [appointmentId, retryCount]);

  if (loading) return <FeedbackState kind="loading" title="Loading confirmation" />;

  if (error || !appointment) {
    return (
      <section className="px-6 py-8 sm:px-10 sm:py-10">
        <FeedbackState kind="error" message={error ?? "Appointment record was not found."} />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              setRetryCount((count) => count + 1);
            }}
            className="min-h-11 rounded border border-[#dce5dc] px-4 text-sm font-semibold text-[#52665f] hover:bg-[#f8faf7]"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10" aria-labelledby="success-heading">
      <div className="mb-6 flex items-start gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eaf3ec] text-lg font-semibold text-[#3e7953]" aria-hidden="true">
          ✓
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#47745b]">
            Appointment confirmed
          </p>
          <h2 id="success-heading" className="mt-1 text-xl font-semibold text-[#243d37]">
            You&apos;re all set.
          </h2>
        </div>
      </div>
      <div className="rounded border border-[#e3e9e3] bg-[#fafbf9] p-4">
        <p className="text-xs text-[#75837d]">Appointment ID</p>
        <p className="mt-1 font-mono text-sm font-semibold text-[#243d37]">{appointment.id}</p>
        <dl className="mt-4 grid gap-3 border-t border-[#e3e9e3] pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[#75837d]">Service</dt>
            <dd className="text-right font-medium text-[#243d37]">{appointment.appointment_type_name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#75837d]">Date</dt>
            <dd className="text-right font-medium text-[#243d37]">{formatLongDate(appointment.date)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#75837d]">Time</dt>
            <dd className="text-right font-medium text-[#243d37]">{formatTime(appointment.start)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#75837d]">Status</dt>
            <dd className="text-right font-medium capitalize text-[#47745b]">{appointment.status}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-4 text-xs leading-5 text-[#75837d]">
        This confirmation is stored in backend memory and will be cleared when the API restarts.
      </p>
      <div className="mt-6 flex justify-end">
        <Link
          href="/appointment"
          className="inline-flex min-h-11 items-center justify-center rounded bg-[#183f36] px-5 text-sm font-semibold text-white hover:bg-[#245449]"
        >
          Done
        </Link>
      </div>
    </section>
  );
}
