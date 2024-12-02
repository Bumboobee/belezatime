import { TbEdit } from "react-icons/tb";
import { useCookies } from "react-cookie";
import { GiCancel } from "react-icons/gi";
import { LuLoader2 } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { formatDateBrazil } from "@/utils/formatDate";
import { useContext, useEffect, useState } from "react";
import { formatToBRL } from "@/utils/currencyOperations";
import { getFirstAndLastWord } from "@/utils/stringFormaters";
import { AppointmentContext } from "@/context/appointmentContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import UserMenu from "@/components/userMenu";
import PageTitle from "@/components/pageTitle";
import ServiceDialog from "@/components/serviceDialog";
import AppointmentDialog from "@/components/appointmentDialog";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [cookies] = useCookies(["__btime_account_jwt", "__btime_account_user"]);
  const {
    appointmentsData,
    isFetchingAppointments,
    errorAppointments,
    handleCornfimOrCancelAppointment,
    handleOpenEditAppointmentDialog,
  } = useContext(AppointmentContext);

  useEffect(() => {
    if (!cookies.__btime_account_jwt) {
      window.location.replace("/");
    } else {
      setIsLoading(false);
    }
  }, [cookies]);

  useEffect(() => {
    if (!cookies.__btime_account_user) {
      return;
    }

    setUser(cookies.__btime_account_user);

    return () => {
      setUser({});
    };
  }, []);

  if (isLoading) {
    return (
      <section className="h-dvh w-dvw flex justify-center items-center">
        <LuLoader2 className="text-4xl text-red-700 animate-spin" />
      </section>
    );
  }

  return (
    <>
      <PageTitle title={`${import.meta.env.VITE_APP_NAME} • Suas Informações`} />

      <main className="bg-off-white-600 h-screen w-screen">
        <nav className="w-full h-[90px] relative px-4 py-2">
          <div className="w-full h-full flex justify-between items-center font-montserrat border-b border-off-white-800">
            <div className="flex gap-3 items-center">
              <img src="/assets/content/user.svg" alt="user" width={60} />

              <div className="flex flex-col">
                <span className="text-zinc-700 font-medium text-sm">{getFirstAndLastWord(user.name, 3)}</span>
                <span className="text-zinc-500 text-1xs">{user.email}</span>

                {user.role === "admin" ? (
                  <span className="text-4xs font-medium me-2 mt-1 w-fit px-2.5 py-0.5 rounded-full bg-orange-600 text-off-white-100">
                    Admin
                  </span>
                ) : null}
              </div>

              <UserMenu user={user} />
            </div>

            {user.role === "admin" ? (
              <>
                <ServiceDialog />
                <div className="hidden">
                  <AppointmentDialog />
                </div>
              </>
            ) : (
              <AppointmentDialog />
            )}
          </div>
        </nav>

        <div className="w-full flex px-4 py-2 gap-3 justify-between h-[calc(100%-90px)]">
          <span className="bg-brown-chocolate-400 w-2/6">TESTE</span>

          <div className="flex flex-col gap-3 justify-between w-4/6">
            <section className="h-4/6  w-full border border-off-white-800 rounded py-2 px-3">
              <h2 className="text-orange-600 font-montserrat font-semibold">Próximos Agendamentos</h2>

              {isFetchingAppointments ? (
                <div className="flex justify-center items-center w-full h-full">
                  <LuLoader2 className="text-4xl text-red-700 animate-spin" />
                </div>
              ) : (
                <Table className="relative overflow-x-auto w-full">
                  <TableHeader>
                    <TableRow className="!border-b !border-off-white-800">
                      <TableHead className="text-sm text-zinc-700 font-semibold !w-[200px] sm:!w-auto">
                        Serviço
                      </TableHead>
                      <TableHead className="text-sm text-zinc-700 font-semibold text-center">Data</TableHead>
                      <TableHead className="text-sm text-zinc-700 font-semibold text-center">Preço</TableHead>
                      <TableHead className="text-sm text-zinc-700 font-semibold text-center">Promoção</TableHead>

                      <TableHead className="text-sm text-zinc-700 font-semibold text-center">Valor</TableHead>
                      <TableHead className="text-sm text-zinc-700 font-semibold text-center">Confirmado?</TableHead>
                      <TableHead className="text-sm text-zinc-700 font-semibold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointmentsData.map((appointment) =>
                      appointment.services.map((service, index) => (
                        <TableRow
                          key={`${appointment._id}-${index}`}
                          className="text-xs sm:text-1xs !border-b !border-off-white-700 "
                        >
                          <TableCell className="font-medium truncate max-w-[150px] whitespace-nowrap">
                            {service.service}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatDateBrazil(appointment.date)} às {appointment.hour}hr
                          </TableCell>
                          <TableCell className="text-center">{formatToBRL(service.price)}</TableCell>

                          <TableCell className="text-center">
                            {service.percentOfDiscount
                              ? formatToBRL((service.price * service.percentOfDiscount) / 100)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {service.percentOfDiscount
                              ? formatToBRL(service.price - (service.price * service.percentOfDiscount) / 100)
                              : formatToBRL(service.price)}
                          </TableCell>
                          <TableCell className="text-center">
                            {appointment.isConfirmed ? (
                              <span className="bg-green-200 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                Sim
                              </span>
                            ) : (
                              <span className="bg-red-200 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                Não
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="flex justify-end gap-2 itens-center">
                            <GiCancel
                              className={`text-red-600 cursor-pointer text-lg ${
                                !appointment.isConfirmed ? "opacity-30 cursor-not-allowed" : ""
                              }`}
                              onClick={
                                appointment.isConfirmed
                                  ? () => handleCornfimOrCancelAppointment(appointment._id, false)
                                  : undefined
                              }
                            />
                            <TbEdit
                              className="text-yellow-600 cursor-pointer text-lg"
                              onClick={() => handleOpenEditAppointmentDialog(appointment._id)}
                            />

                            <FaRegCircleCheck
                              className={`text-green-600 cursor-pointer text-lg ${
                                appointment.isConfirmed ? "opacity-30 cursor-not-allowed" : ""
                              }`}
                              onClick={
                                !appointment.isConfirmed
                                  ? () => handleCornfimOrCancelAppointment(appointment._id, true)
                                  : undefined
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </section>
            <section className="h-2/6 bg-red-600 w-full">TESTE</section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
