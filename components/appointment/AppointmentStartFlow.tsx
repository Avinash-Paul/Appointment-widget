"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FeedbackState } from "@/components/ui/FeedbackState";
import { appointmentContext } from "@/data/appointment";
import { getAppointmentTypes } from "@/services/appointment-api";
import type { AppointmentType } from "@/types/appointment";

export function AppointmentStartFlow() {
  const [appointmentType, setAppointmentType] = useState<AppointmentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    getAppointmentTypes()
      .then((types) => {
        if (active) {
          const selectedType = types.find(
            (item) => item.id === appointmentContext.appointmentTypeId,
          );
          setAppointmentType(selectedType ?? null);
          if (!selectedType) setError("The selected appointment type is unavailable.");
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load appointment types.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10" aria-labelledby="start-heading">
      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9a6b55]">
        Your visit
      </p>
      <h2 id="start-heading" className="mt-2 text-xl font-semibold text-[#243d37]">
        Appointment details
      </h2>
      {loading ? (
        <FeedbackState kind="loading" title="Loading appointment types" />
      ) : error ? (
        <div>
          <FeedbackState kind="error" message={error} />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError(null);
                setRetryCount((count) => count + 1);
              }}
              className="min-h-11 rounded bg-[#183f36] px-5 text-sm font-semibold text-white hover:bg-[#245449]"
            >
              Try again
            </button>
          </div>
        </div>
      ) : appointmentType ? (
        <>
          <div className="mt-5 flex flex-col gap-4 rounded border border-[#e3e9e3] bg-[#fafbf9] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#243d37]">{appointmentType.name}</p>
              <p className="mt-1 text-xs text-[#75837d]">
                {appointmentType.duration_minutes} minutes · {appointmentContext.organizationName}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#65756f]">{appointmentType.description}</p>
            </div>
            <span className="w-fit rounded border border-[#dce8dd] bg-white px-2.5 py-1 text-xs font-medium text-[#47745b]">
              Available
            </span>
          </div>
          <div className="mt-7 flex justify-end">
            <Link
              href={`/appointment/date?type=${encodeURIComponent(appointmentType.id)}`}
              className="inline-flex min-h-11 items-center justify-center gap-3 rounded bg-[#183f36] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#245449]"
            >
              Book appointment
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </>
      ) : null}
    </section>
  );
}
