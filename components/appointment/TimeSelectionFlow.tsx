"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SchedulerActions } from "@/components/appointment/SchedulerActions";
import { TimeSlotSection } from "@/components/appointment/TimeSlotSection";
import { formatLongDate } from "@/lib/date";
import { getAvailability } from "@/services/appointment-api";
import { FeedbackState } from "@/components/ui/FeedbackState";
import type { AvailabilitySlot } from "@/types/appointment";

type TimeSelectionFlowProps = {
  date: string;
  initialSelectedTime: string | null;
};

export function TimeSelectionFlow({ date, initialSelectedTime }: TimeSelectionFlowProps) {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState(initialSelectedTime);
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const dateParam = encodeURIComponent(date);
  const backHref = `/appointment/date?date=${dateParam}`;

  useEffect(() => {
    let active = true;
    getAvailability(date)
      .then((availability) => {
        if (!active) return;
        setSlots(availability.slots);
        if (!availability.slots.some((slot) => slot.id === initialSelectedTime && slot.available)) {
          setSelectedTime(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Unable to load available times.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [date, initialSelectedTime, retryCount]);

  function selectTime(slot: AvailabilitySlot) {
    if (!slot.available) return;
    setSelectedTime(slot.id);
    router.replace(`/appointment/time?date=${dateParam}&time=${encodeURIComponent(slot.id)}`, {
      scroll: false,
    });
  }

  function continueToConfirmation() {
    if (!selectedTime) return;
    router.push(
      `/appointment/confirm?date=${dateParam}&time=${encodeURIComponent(selectedTime)}`,
    );
  }

  return (
    <>
      <div className="grid gap-7 px-6 py-7 sm:px-10 sm:py-9 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9a6b55]">
            Step 02
          </p>
          <h2 className="mt-1 text-base font-semibold text-[#243d37]">Choose a time</h2>
          <p className="mt-2 text-sm text-[#75837d]">{formatLongDate(date)}</p>
        </div>
        {loading ? (
          <FeedbackState kind="loading" title="Loading available times" />
        ) : loadError ? (
          <div>
            <FeedbackState kind="error" message={loadError} />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setLoadError(null);
                  setRetryCount((count) => count + 1);
                }}
                className="min-h-11 rounded border border-[#dce5dc] px-4 text-sm font-semibold text-[#52665f] hover:bg-[#f8faf7]"
              >
                Retry availability
              </button>
            </div>
          </div>
        ) : (
          <TimeSlotSection
            slots={slots ?? []}
            selectedSlot={selectedTime}
            onSelectSlot={selectTime}
          />
        )}
      </div>
      <SchedulerActions
        canContinue={Boolean(
          !loading &&
            !loadError &&
            selectedTime &&
            slots?.some((slot) => slot.id === selectedTime && slot.available),
        )}
        backHref={backHref}
        onContinue={continueToConfirmation}
      />
    </>
  );
}
