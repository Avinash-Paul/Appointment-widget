import { DateSelectionFlow } from "@/components/appointment/DateSelectionFlow";
import { appointmentDates } from "@/data/appointment";
import { redirect } from "next/navigation";

type DatePageProps = {
  searchParams: Promise<{ date?: string | string[]; type?: string | string[] }>;
};

export default async function DatePage({ searchParams }: DatePageProps) {
  const params = await searchParams;
  const appointmentTypeId = typeof params.type === "string" ? params.type : null;

  if (!appointmentTypeId) {
    redirect("/appointment");
  }

  const dateValue = typeof params.date === "string" ? params.date : null;
  const selectedDate = appointmentDates.find((date) => date.value === dateValue);

  return (
    <DateSelectionFlow
      appointmentTypeId={appointmentTypeId}
      initialSelectedDate={selectedDate?.value ?? null}
    />
  );
}
