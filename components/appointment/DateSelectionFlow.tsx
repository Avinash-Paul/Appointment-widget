"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateSelectionSection } from "@/components/appointment/DateSelectionSection";
import { SchedulerActions } from "@/components/appointment/SchedulerActions";
import { appointmentDates } from "@/data/appointment";
import { getAvailability } from "@/services/appointment-api";
import { FeedbackState } from "@/components/ui/FeedbackState";

type DateSelectionFlowProps = {
  initialSelectedDate: string | null;
  appointmentTypeId: string;
};

export function DateSelectionFlow({ initialSelectedDate, appointmentTypeId }: DateSelectionFlowProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [availabilityState, setAvailabilityState] = useState<"idle" | "loading" | "ready" | "error">(
    initialSelectedDate ? "loading" : "idle",
  );
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!selectedDate) return;

    let active = true;
    getAvailability(selectedDate)
      .then(() => {
        if (active) setAvailabilityState("ready");
      })
      .catch((error: unknown) => {
        if (active) {
          setAvailabilityError(error instanceof Error ? error.message : "Unable to check availability.");
          setAvailabilityState("error");
        }
      });

    return () => {
      active = false;
    };
  }, [selectedDate, retryCount]);

  function selectDate(date: (typeof appointmentDates)[number]) {
    setSelectedDate(date.value);
    setAvailabilityState("loading");
    setAvailabilityError(null);
    router.replace(
      `/appointment/date?type=${encodeURIComponent(appointmentTypeId)}&date=${encodeURIComponent(date.value)}`,
      { scroll: false },
    );
  }

  function continueToTime() {
    if (!selectedDate) return;
    router.push(
      `/appointment/time?type=${encodeURIComponent(appointmentTypeId)}&date=${encodeURIComponent(selectedDate)}`,
    );
  }

  return (
    <>
      <div className="px-6 py-7 sm:px-10 sm:py-9">
        <DateSelectionSection
          dates={appointmentDates}
          selectedDate={selectedDate}
          onSelectDate={selectDate}
        />
      </div>
      {availabilityState === "loading" && (
        <FeedbackState kind="loading" title="Checking available times" />
      )}
      {availabilityState === "error" && (
        <div className="px-6 pb-5 sm:px-10">
          <FeedbackState kind="error" message={availabilityError ?? undefined} />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setAvailabilityState("loading");
                setAvailabilityError(null);
                setRetryCount((count) => count + 1);
              }}
              className="min-h-11 rounded border border-[#dce5dc] px-4 text-sm font-semibold text-[#52665f] hover:bg-[#f8faf7]"
            >
              Retry availability
            </button>
          </div>
        </div>
      )}
      <SchedulerActions
        canContinue={selectedDate !== null && availabilityState === "ready"}
        backHref={`/appointment?type=${encodeURIComponent(appointmentTypeId)}`}
        onContinue={continueToTime}
      />
    </>
  );
}
