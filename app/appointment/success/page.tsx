import { redirect } from "next/navigation";
import { AppointmentSuccess } from "@/components/appointment/AppointmentSuccess";

type SuccessPageProps = {
  searchParams: Promise<{ id?: string | string[] }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const appointmentId = typeof params.id === "string" ? params.id : null;

  if (!appointmentId) redirect("/appointment");

  return <AppointmentSuccess appointmentId={appointmentId} />;
}
