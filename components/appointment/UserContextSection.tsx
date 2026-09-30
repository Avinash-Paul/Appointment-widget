import type { AppointmentContext } from "@/types/appointment";

type UserContextSectionProps = {
  context: AppointmentContext;
};

export function UserContextSection({ context }: UserContextSectionProps) {
  const initials = context.patientName
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <section
      className="flex items-center gap-3 border-b border-[#e8ede8] bg-[#fafbf9] px-6 py-4 sm:px-10"
      aria-label="Appointment context"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8efea] text-xs font-semibold text-[#345d50]">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#243d37]">
          {context.patientName}
        </p>
        <p className="truncate text-xs text-[#75837d]">
          Booking with {context.organizationName}
        </p>
      </div>
      <span className="ml-auto hidden rounded border border-[#e3e9e3] bg-white px-2.5 py-1 text-[11px] font-medium text-[#65756f] sm:inline-flex">
        Patient
      </span>
    </section>
  );
}
