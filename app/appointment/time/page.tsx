import { redirect } from "next/navigation";
import { TimeSelectionFlow } from "@/components/appointment/TimeSelectionFlow";
import { appointmentDates } from "@/data/appointment";

type TimePageProps = {
  searchParams: Promise<{ date?: string | string[]; time?: string | string[] }>;
};

export default async function TimePage({ searchParams }: TimePageProps) {
  const params = await searchParams;
  const dateValue = typeof params.date === "string" ? params.date : null;
  const date = appointmentDates.find((item) => item.value === dateValue);

  if (!date) {
    redirect("/appointment/date");
  }

  const timeValue = typeof params.time === "string" ? params.time : null;
  const initialSelectedTime = timeValue;

  return (
    <TimeSelectionFlow
      date={date.value}
      initialSelectedTime={initialSelectedTime}
    />
  );
}
