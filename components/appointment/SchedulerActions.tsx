import Link from "next/link";

type SchedulerActionsProps = {
  canContinue: boolean;
  onContinue: () => void;
  backHref: string;
};

export function SchedulerActions({ canContinue, onContinue, backHref }: SchedulerActionsProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#e8ede8] bg-[#fafbf9] px-6 py-5 sm:flex-row sm:items-center sm:px-10">
      <p className="text-xs text-[#75837d]" aria-live="polite">
        {canContinue ? "Your selection is ready to review." : "Select a date and time to continue."}
      </p>
      <div className="flex gap-2 sm:ml-auto">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center justify-center rounded border border-[#dce5dc] px-4 text-sm font-semibold text-[#52665f] hover:bg-[#f8faf7]"
        >
          Back
        </Link>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="inline-flex min-h-11 items-center justify-center gap-3 rounded bg-[#183f36] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#245449] disabled:cursor-not-allowed disabled:bg-[#ccd6ce] disabled:text-[#69776f]"
        >
          Continue
          <span aria-hidden="true">-&gt;</span>
        </button>
      </div>
    </div>
  );
}
