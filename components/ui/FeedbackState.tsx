type FeedbackStateProps = {
  kind: "loading" | "empty" | "error";
  title?: string;
  message?: string;
};

const defaultContent = {
  loading: {
    title: "Finding available times",
    message: "This usually takes just a moment.",
  },
  empty: {
    title: "No times available",
    message: "Try another date to see more options.",
  },
  error: {
    title: "Something went wrong",
    message: "Please try again in a little while.",
  },
};

export function FeedbackState({ kind, title, message }: FeedbackStateProps) {
  const content = defaultContent[kind];

  return (
    <div
      className="flex min-h-36 flex-col items-center justify-center px-5 py-6 text-center"
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
    >
      {kind === "loading" ? (
        <span className="mb-3 size-5 animate-spin rounded-full border-2 border-[#dce5dc] border-t-[#32685b]" />
      ) : (
        <span className="mb-3 grid size-8 place-items-center rounded-full bg-[#f1f5f0] text-sm font-semibold text-[#557268]">
          {kind === "error" ? "!" : "-"}
        </span>
      )}
      <p className="text-sm font-semibold text-[#243d37]">{title ?? content.title}</p>
      <p className="mt-1 max-w-56 text-xs leading-5 text-[#75837d]">
        {message ?? content.message}
      </p>
    </div>
  );
}
