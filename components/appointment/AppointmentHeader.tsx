import type { AppointmentContext } from "@/types/appointment";

type AppointmentHeaderProps = {
  context: AppointmentContext;
};

export function AppointmentHeader({ context }: AppointmentHeaderProps) {
  return (
    <header className="border-b border-[#e8ede8] px-6 py-7 sm:px-10 sm:py-9">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#75837d]">
            Appointment scheduler
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#18332e] sm:text-[30px]">
            Schedule a visit
          </h1>
          <p className="mt-2 text-sm text-[#65756f]">{context.serviceName}</p>
        </div>
        <div className="flex items-center gap-2 rounded border border-[#e5ebe5] px-3 py-2 text-xs font-medium text-[#52665f]">
          <span className="size-2 rounded-full bg-[#6a9b7c]" />
          {context.durationMinutes} minutes
        </div>
      </div>
    </header>
  );
}
