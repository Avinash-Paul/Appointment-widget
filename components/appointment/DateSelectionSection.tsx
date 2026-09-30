import { formatDay, formatWeekday } from "@/lib/date";
import type { AppointmentDate } from "@/types/appointment";

type DateSelectionSectionProps = {
  dates: AppointmentDate[];
  selectedDate: string | null;
  onSelectDate: (date: AppointmentDate) => void;
};

export function DateSelectionSection({ dates, selectedDate, onSelectDate }: DateSelectionSectionProps) {
  return (
    <section aria-labelledby="date-heading">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9a6b55]">
            Step 01
          </p>
          <h2 id="date-heading" className="mt-1 text-base font-semibold text-[#243d37]">
            Choose a date
          </h2>
        </div>
        <p className="text-xs text-[#829088]">October 2026</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {dates.map((date) => {
          const isSelected = date.value === selectedDate;

          return (
            <button
              key={date.value}
              type="button"
              onClick={() => onSelectDate(date)}
              aria-pressed={isSelected}
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded border px-2 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#32685b] ${
                isSelected
                  ? "border-[#32685b] bg-[#32685b] text-white"
                  : "border-[#e3e9e3] bg-white text-[#52665f] hover:border-[#9ab5a6] hover:bg-[#f8faf7]"
              }`}
            >
              <span className={`text-[11px] ${isSelected ? "text-white/75" : "text-[#829088]"}`}>
                {formatWeekday(date.value)}
              </span>
              <span className="text-lg font-semibold leading-5">{formatDay(date.value)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
