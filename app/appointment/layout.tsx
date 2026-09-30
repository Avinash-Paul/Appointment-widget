import type { ReactNode } from "react";
import { AppointmentHeader } from "@/components/appointment/AppointmentHeader";
import { UserContextSection } from "@/components/appointment/UserContextSection";
import { PluginShell } from "@/components/plugin/PluginShell";
import { appointmentContext } from "@/data/appointment";

export default function AppointmentLayout({ children }: { children: ReactNode }) {
  return (
    <PluginShell>
      <AppointmentHeader context={appointmentContext} />
      <UserContextSection context={appointmentContext} />
      {children}
    </PluginShell>
  );
}
