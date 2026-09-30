import { FeedbackState } from "@/components/ui/FeedbackState";
import { formatTime } from "@/lib/date";
import type { AvailabilitySlot } from "@/types/appointment";

type TimeSlotSectionProps = {
  slots: AvailabilitySlot[];
  selectedSlot: string | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
};

export function TimeSlotSection({ slots, selectedSlot, onSelectSlot }: TimeSlotSectionProps) {
  return (
    <section aria-labelledby="time-heading">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9a6b55]">
          Step 02
        </p>
        <h2 id="time-heading" className="mt-1 text-base font-semibold text-[#243d37]">
          Available times
        </h2>
      </div>
      {slots.length === 0 ? (
        <FeedbackState kind="empty" />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => {
            const isSelected = slot.id === selectedSlot;

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot)}
                disabled={!slot.available}
                aria-pressed={isSelected}
                className={`min-h-11 rounded border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#32685b] disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSelected
                    ? "border-[#bf5b3e] bg-[#fff6f2] text-[#a74c34]"
                    : !slot.available
                      ? "border-[#e3e9e3] bg-[#f6f7f5] text-[#98a19c] line-through"
                    : "border-[#e3e9e3] bg-white text-[#52665f] hover:border-[#bf9a89] hover:bg-[#fffaf7]"
                }`}
              >
                {formatTime(slot.start)}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
