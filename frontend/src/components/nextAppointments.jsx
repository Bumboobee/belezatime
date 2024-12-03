import { useContext } from "react";
import { TbEdit } from "react-icons/tb";
import { LuInfo } from "react-icons/lu";
import { GiCancel } from "react-icons/gi";
import { isSameDay, parseISO } from "date-fns";
import { MessageWarning } from "./messageWarning";
import { FaRegCircleCheck } from "react-icons/fa6";
import { formatDateBrazil } from "@/utils/formatDate";
import { formatToBRL } from "@/utils/currencyOperations";
import { AppointmentContext } from "@/context/appointmentContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Loader from "./loader";
import PropTypes from "prop-types";
import ExportDataDialog from "./exportDataDialog";

const NextAppointments = ({ isAdmin }) => {
  const {
    nextAppointments,
    isFetchingAppointments,
    errorAppointments,
    handleCornfimOrCancelAppointment,
    handleOpenEditAppointmentDialog,
  } = useContext(AppointmentContext);

  const isDateToday = (date) => {
    const localDate = new Date(parseISO(date).toLocaleString("en-US", { timeZone: "UTC" }));
    const today = new Date();
    return isSameDay(localDate, today);
  };

  return (
    <section className="h-4/6  w-full border border-off-white-800 rounded py-2 px-3 overflow-y-auto">
      <div className="flex justify-between">
        <h2 className="text-orange-600 font-montserrat font-semibold w-fit">Próximos Agendamentos</h2>

        {isAdmin && nextAppointments.length > 0 ? <ExportDataDialog data={nextAppointments} /> : null}
      </div>

      {isFetchingAppointments ? (
        <Loader />
      ) : errorAppointments || nextAppointments.length === 0 ? (
        <MessageWarning
          icon={<LuInfo />}
          color={errorAppointments ? "yellow" : "zinc"}
          type={errorAppointments ? "error" : "warning"}
          message={
            errorAppointments
              ? import.meta.env.VITE_ENV === "development"
                ? errorAppointments?.response?.data?.message || "Falha ao carregar Próximos Agendamentos."
                : "Falha ao carregar Próximos Agendamentos."
              : "Sem próximos agendamentos no momento."
          }
        />
      ) : (
        <Table className="relative overflow-x-auto w-full">
          <TableHeader>
            <TableRow className="!border-b !border-off-white-800">
              <TableHead className="text-sm text-zinc-700 font-semibold !w-[200px] sm:!w-auto">Serviço</TableHead>
              {isAdmin ? (
                <TableHead className="text-sm text-zinc-700 font-semibold text-left">Cliente</TableHead>
              ) : null}
              <TableHead className="text-sm text-zinc-700 font-semibold text-center">Data</TableHead>
              <TableHead className="text-sm text-zinc-700 font-semibold text-center">Preço</TableHead>
              <TableHead className="text-sm text-zinc-700 font-semibold text-center">Promoção</TableHead>
              <TableHead className="text-sm text-zinc-700 font-semibold text-center">Valor</TableHead>
              <TableHead className="text-sm text-zinc-700 font-semibold text-center">Confirmado?</TableHead>
              <TableHead className="text-sm text-zinc-700 font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {(nextAppointments || []).map((appointment) =>
              (appointment.services || []).map((service, index) => (
                <TableRow
                  key={`${appointment._id}-${index}`}
                  className="text-xs sm:text-1xs !border-b !border-off-white-700 "
                >
                  <TableCell className="font-medium truncate max-w-[150px] whitespace-nowrap">
                    {service.service}
                  </TableCell>
                  {isAdmin ? <TableCell className="text-left">{appointment.user.name}</TableCell> : null}
                  <TableCell className="text-center">
                    <span
                      className={`${
                        isDateToday(appointment.date)
                          ? "bg-brown-chocolate-200 text-brown-chocolate-600 text-xs font-medium me-2 px-2.5 py-0.5 rounded"
                          : null
                      }`}
                    >
                      {isDateToday(appointment.date) ? "Hoje" : formatDateBrazil(appointment.date)} às{" "}
                      {appointment.hour}hr
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{formatToBRL(service.price)}</TableCell>
                  <TableCell className="text-center">
                    {service.percentOfDiscount ? formatToBRL((service.price * service.percentOfDiscount) / 100) : "-"}
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
  );
};

NextAppointments.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default NextAppointments;
