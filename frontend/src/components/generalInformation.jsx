import { LuInfo } from "react-icons/lu";
import { MessageWarning } from "./messageWarning";
import { useContext, useEffect, useState } from "react";
import { formatToBRL } from "@/utils/currencyOperations";
import { ServiceContext } from "@/context/serviceContext";
import { AppointmentContext } from "@/context/appointmentContext";

import Loader from "./loader";
import PropTypes from "prop-types";
import CarouselContainer from "./carousel";

const GeneralInformation = ({ isAdmin }) => {
  const [servicesWithDiscount, setServicesWithDiscount] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const { servicesData } = useContext(ServiceContext);
  const { weeklyAppointmentsData, isFetchingWeeklyAppointments, errorWeeklyAppointments } =
    useContext(AppointmentContext);

  useEffect(() => {
    const discountedServices = servicesData ? servicesData.filter((service) => service.percentOfDiscount != null) : [];

    setServicesWithDiscount(discountedServices);

    const interval = setInterval(() => {
      setCurrentServiceIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= discountedServices.length ? 0 : nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [servicesData]);

  const currentService = servicesWithDiscount.length > 0 ? servicesWithDiscount[currentServiceIndex] : null;

  return (
    <div className="h-auto lg:h-2/5 border border-off-white-800 rounded flex flex-col justify-between">
      <h2 className="text-orange-600 font-montserrat font-semibold mb-1.5 pt-2 px-3">
        {isAdmin ? "Indicadores Gerais Semanal" : "Serviços Especiais para Você!"}
      </h2>

      {isAdmin ? (
        <main className="py-2 px-3">
          {isFetchingWeeklyAppointments ? (
            <Loader />
          ) : errorWeeklyAppointments ? (
            <MessageWarning
              icon={<LuInfo />}
              color={errorWeeklyAppointments ? "yellow" : "zinc"}
              type={errorWeeklyAppointments ? "error" : "warning"}
              message={
                errorWeeklyAppointments
                  ? import.meta.env.VITE_ENV === "development"
                    ? errorWeeklyAppointments?.response?.data?.message || "Falha ao carregar Dados Semanais."
                    : "Falha ao carregar Dados Semanais."
                  : "Sem Agendamentos para esta semana."
              }
            />
          ) : (
            <section className="font-montserrat text-zinc-700 h-full flex flex-col justify-between overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between mb-3 gap-4">
                <div className="flex gap-2 flex-col">
                  <span className="text-xs w-full lg:w-[130px] font-medium">Agendamentos Confirmados</span>
                  <div className="flex items-end gap-2">
                    <img src="/assets/content/schedule.svg" alt="schedule" loading="lazy" className="w-10" />
                    <span className="font-bold text-4xl">{weeklyAppointmentsData.confirmedAppointments}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-col items-start lg:items-end">
                  <span className="text-xs w-full lg:w-[130px] font-medium text-left lg:text-right">
                    Faturamento Estimado
                  </span>
                  <div className="flex items-end gap-2">
                    <img src="/assets/content/payment.svg" alt="payment" loading="lazy" className="w-10" />
                    <span className="font-bold text-4xl">{formatToBRL(weeklyAppointmentsData.estimatedRevenue)}</span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="mb-2">
                  <p className="text-xs font-semibold border-b border-off-white-700 pb-1.5 mb-2 w-full">
                    Serviços mais Solicitados
                  </p>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs flex flex-col lg:flex-row justify-between">
                      {weeklyAppointmentsData.mostPopularServices.slice(0, 2).map((service, index) => (
                        <span key={index} className="font-medium">
                          {service.service} - <span className="font-bold">{service.count}</span>
                        </span>
                      ))}
                    </div>
                    {weeklyAppointmentsData.mostPopularServices.length > 2 && (
                      <div className="text-xs flex flex-col lg:flex-row justify-between">
                        {weeklyAppointmentsData.mostPopularServices.slice(2, 4).map((service, index) => (
                          <span key={index} className="font-medium">
                            {service.service} - <span className="font-bold">{service.count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold border-b border-off-white-700 pb-1.5 mb-2 w-full">
                    Clientes mais Frequentes
                  </p>

                  <div className="flex flex-col gap-1">
                    <div className="text-xs flex flex-col lg:flex-row justify-between">
                      {weeklyAppointmentsData.mostFrequentClients.slice(0, 2).map((client, index) => (
                        <span key={index} className="font-medium">
                          {client.name}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs flex flex-col lg:flex-row justify-between">
                      {weeklyAppointmentsData.mostFrequentClients.slice(0, 2).map((client, index) => (
                        <span key={index} className="font-medium">
                          Total: <span className="font-bold">{formatToBRL(client.totalSpent)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      ) : (
        <section className="w-full h-full flex justify-between flex-col relative">
          <div className="w-full max-h-[200px] py-2 px-3">
            <CarouselContainer isDashboard={true} />
          </div>

          <div className="w-full bg-orange-500 -bottom-0 -left-0 absolute py-1 px-3 rounded-b flex justify-between font-montserrat items-center text-zinc-800">
            {currentService ? (
              <>
                <div className="flex flex-col">
                  <span className="text-4xs sm:text-3xs font-medium">Somente Hoje</span>
                  <span className="text-lg sm:text-xl font-bold font-poppins leading-none">
                    {currentService.percentOfDiscount}% OFF
                  </span>
                </div>

                <span className="text-zinc-900 flex justify-between gap-4 items-center leading-none">
                  <p className="text-sm sm:text-lg font-bold text-center max-w-[120px] sm:max-w-[190px]">
                    {currentService.service}
                  </p>
                  <span className="flex flex-col">
                    <span className="text-4xs sm:text-xs italic text-zinc-800/80 line-through">
                      {formatToBRL(currentService.price)}
                    </span>
                    <span className="text-xs sm:text-base font-bold">
                      {formatToBRL(
                        currentService.price - currentService.price * (currentService.percentOfDiscount / 100)
                      )}
                    </span>
                  </span>
                </span>
                <span className="text-4xs sm:text-3xs font-medium w-[50px] text-right italic">Promoção Imperdível</span>
              </>
            ) : (
              <span className="text-md font-semibold italic">Sem Promoções para hoje.</span>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

GeneralInformation.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default GeneralInformation;
