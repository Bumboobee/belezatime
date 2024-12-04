import Holidays from "date-holidays";

import { useContext } from "react";
import { differenceInDays } from "date-fns";
import { AuthContext } from "@/context/authContext";
import { formatDateBrazil } from "@/utils/formatDate";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";

const ScheduleOfWork = () => {
  const { handleScheduleAppointmentRedirect } = useContext(AuthContext);

  const hd = new Holidays("BR");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  const holidays = hd.getHolidays(currentYear) || [];
  const currentMonthHolidays = holidays.filter((holiday) => holiday.date.startsWith(`${currentYear}-${currentMonth}`));

  return (
    <div className="w-full sm:w-3/5 rounded-lg flex flex-col flex-grow h-full font-montserrat">
      <div className="p-4 border border-brown-chocolate-300/50 flex flex-col gap-4 rounded-lg">
        <header className="bg-brown-chocolate-600 sm:p-4 p-2 text-center font-semibold sm:text-2xl text-md rounded-md text-zinc-100 capitalize">
          {currentDate.toLocaleString("default", { month: "long" })}
        </header>

        <section className="flex flex-col gap-4">
          <header className="text-zinc-700 sm:text-lg text-sm font-semibold">Horários de Atendimento</header>

          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <span className="border-b border-brown-chocolate-100 pb-3.5 text-sm flex justify-between text-zinc-600">
                <span className="medium">Seg. a Sáb.</span>
                <span className="font-semibold">08:00 - 18:00</span>
              </span>

              <span className="border-b border-brown-chocolate-100 pb-3.5 text-sm flex justify-between text-zinc-600">
                <span className="medium">Domingo</span>
                <span className="font-semibold italic text-brown-chocolate-500">Fechado</span>
              </span>

              {currentMonthHolidays.length > 0 &&
                currentMonthHolidays.map((holiday, index) => {
                  const startDate = new Date(holiday.start);
                  const endDate = new Date(holiday.end);

                  return (
                    <span
                      key={index}
                      className="border-b border-brown-chocolate-100 pb-3.5 text-sm flex justify-between text-zinc-600"
                    >
                      <span className="medium">
                        {differenceInDays(endDate, startDate) > 1
                          ? `${formatDateBrazil(startDate)} até ${formatDateBrazil(endDate)} - ${holiday.name}`
                          : `${formatDateBrazil(startDate)} - ${holiday.name}`}
                      </span>
                      <span className="font-semibold italic text-brown-chocolate-500">Fechado</span>
                    </span>
                  );
                })}
            </div>

            <Button
              className={buttonVariants({
                className: "bg-red-700 hover:bg-red-800 text-white gap-1.5 text-xs w-fit",
                size: "lg",
              })}
              onClick={handleScheduleAppointmentRedirect}
            >
              <RiCalendarScheduleLine />
              Agendar Horário
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
export default ScheduleOfWork;
