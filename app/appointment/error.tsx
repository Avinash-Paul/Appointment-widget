"use client";

import { FeedbackState } from "@/components/ui/FeedbackState";

type AppointmentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppointmentError({ reset }: AppointmentErrorProps) {
  return (
    <section className="px-6 py-8 sm:px-10">
      <FeedbackState kind="error" />
      <div className="flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="min-h-11 rounded bg-[#183f36] px-5 text-sm font-semibold text-white hover:bg-[#245449]"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
