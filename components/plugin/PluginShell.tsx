import type { ReactNode } from "react";

type PluginShellProps = {
  children: ReactNode;
};

export function PluginShell({ children }: PluginShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_90%_0%,#e0ebe2_0%,transparent_34%),var(--background)] px-4 py-6 sm:px-8 sm:py-10">
      <main className="mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-[#e3e9e3] bg-white shadow-[0_20px_70px_-48px_rgba(24,51,46,0.42)]">
        {children}
      </main>
    </div>
  );
}
