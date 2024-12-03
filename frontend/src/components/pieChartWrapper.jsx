import { useContext } from "react";
import { LuInfo } from "react-icons/lu";
import { MessageWarning } from "./messageWarning";
import { AppointmentContext } from "@/context/appointmentContext";

import Loader from "./loader";
import PropTypes from "prop-types";
import PieChartContainer from "@/components/pieChart";

const formatAppointmentsServicesData = (services) =>
  services
    .filter((item) => item.count > 0)
    .map((item, index) => ({
      key: item.service,
      service: item.service,
      qtde: item.count,
      total: item.total,
      percentage: item.percentage,
      fill: `var(--color-bar-${services.length + 1 - (index + 1)})`,
      outerRadius: (index + 1) * 4,
    }))
    .sort((a, b) => b.count - a.count);

const PieChartWrapper = ({ isAdmin }) => {
  const {
    weeklyAppointmentsData,
    isFetchingWeeklyAppointments,
    errorWeeklyAppointments,
    pastThreeMonthsApointmentsData,
    isFetchingPastThreeMonthsApointments,
    errorPastThreeMonthsApointments,
  } = useContext(AppointmentContext);

  return (
    <main className="h-full lg:h-3/5 border border-off-white-800 rounded py-2 px-3">
      <h2 className="text-orange-600 font-montserrat font-semibold mb-1.5">
        {isAdmin ? "Divisão de Serviços Semanais" : "Agendamentos Últimos 3 meses"}
      </h2>
      <section className="h-full ">
        {isAdmin ? (
          <>
            {isFetchingWeeklyAppointments ? (
              <Loader />
            ) : errorWeeklyAppointments || weeklyAppointmentsData.length === 0 ? (
              <MessageWarning
                color={errorWeeklyAppointments ? "yellow" : "zinc"}
                type={errorWeeklyAppointments ? "error" : "warning"}
                message={
                  errorWeeklyAppointments
                    ? import.meta.env.VITE_ENV === "development"
                      ? errorWeeklyAppointments?.response?.data?.message ||
                        "Não foi possível carregar o gráfico dos últimos 3 meses."
                      : "Não foi possível carregar o gráfico dos últimos 3 meses."
                    : "Agende um hórario e confirme para visualizar."
                }
              />
            ) : (
              <>
                <PieChartContainer data={formatAppointmentsServicesData(weeklyAppointmentsData.mostPopularServices)} />
              </>
            )}
          </>
        ) : (
          <>
            {isFetchingPastThreeMonthsApointments ? (
              <Loader />
            ) : errorPastThreeMonthsApointments || pastThreeMonthsApointmentsData.length === 0 ? (
              <MessageWarning
                icon={<LuInfo />}
                color={errorPastThreeMonthsApointments ? "yellow" : "zinc"}
                type={errorPastThreeMonthsApointments ? "error" : "warning"}
                message={
                  errorPastThreeMonthsApointments
                    ? import.meta.env.VITE_ENV === "development"
                      ? errorPastThreeMonthsApointments?.response?.data?.message ||
                        "Não foi possível carregar o gráfico dos últimos 3 meses."
                      : "Não foi possível carregar o gráfico dos últimos 3 meses."
                    : "Agende um hórario e confirme para visualizar."
                }
              />
            ) : (
              <>
                <PieChartContainer data={formatAppointmentsServicesData(pastThreeMonthsApointmentsData)} />
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
};

PieChartWrapper.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default PieChartWrapper;
