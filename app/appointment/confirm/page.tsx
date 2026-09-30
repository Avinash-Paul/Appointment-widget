import { redirect } from "next/navigation";
import { AppointmentConfirmation } from "@/components/appointment/AppointmentConfirmation";
import { appointmentDates } from "@/data/appointment";

type ConfirmationPageProps = {
  searchParams: Promise<{ date?: string | string[]; time?: string | string[] }>;
};

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;
  const dateValue = typeof params.date === "string" ? params.date : null;
  const date = appointmentDates.find((item) => item.value === dateValue);

  if (!date) {
    redirect("/appointment/date");
  }

  const timeValue = typeof params.time === "string" ? params.time : null;

  if (!timeValue) {
    redirect(`/appointment/time?date=${encodeURIComponent(date.value)}`);
  }

  return <AppointmentConfirmation date={date.value} time={timeValue} />;
}
