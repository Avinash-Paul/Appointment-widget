import Link from "next/link";
import { appointmentContext } from "@/data/appointment";

export function AppointmentStart() {
  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10" aria-labelledby="start-heading">
      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9a6b55]">
        Your visit
      </p>
      <h2 id="start-heading" className="mt-2 text-xl font-semibold text-[#243d37]">
        Appointment details
      </h2>
      <div className="mt-5 flex flex-col gap-4 rounded border border-[#e3e9e3] bg-[#fafbf9] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#243d37]">{appointmentContext.serviceName}</p>
          <p className="mt-1 text-xs text-[#75837d]">{appointmentContext.durationMinutes} minutes · {appointmentContext.organizationName}</p>
        </div>
        <span className="w-fit rounded border border-[#dce8dd] bg-white px-2.5 py-1 text-xs font-medium text-[#47745b]">
          Available
        </span>
      </div>
      <div className="mt-7 flex justify-end">
        <Link
          href="/appointment/date"
          className="inline-flex min-h-11 items-center justify-center gap-3 rounded bg-[#183f36] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#245449]"
        >
          Book appointment
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </section>
  );
}
