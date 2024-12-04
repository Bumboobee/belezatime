import { TbEdit } from "react-icons/tb";
import { LuInfo } from "react-icons/lu";
import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageWarning } from "./messageWarning";
import { formatDateBrazil } from "@/utils/formatDate";
import { formatToBRL } from "@/utils/currencyOperations";
import { AppointmentContext } from "@/context/appointmentContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Loader from "./loader";
import PropTypes from "prop-types";
import ExportDataDialog from "./exportDataDialog";

const PastAppointments = ({ isAdmin }) => {
  const [filterDate, setFilterDate] = useState("");
  const { pastAppointments, isFetchingAppointments, errorAppointments, handleOpenEditAppointmentDialog } =
    useContext(AppointmentContext);

  const filteredAppointments = filterDate
    ? pastAppointments.filter((appointment) => new Date(appointment.date).toISOString().split("T")[0] === filterDate)
    : pastAppointments;

  return (
    <section className="sm:h-2/6 h-fit w-full border border-off-white-800 rounded py-2 px-3 sm:overflow-hidden">
      <h2 className="text-orange-600 font-montserrat font-semibold">
        {isAdmin ? "Histórico de Agendamentos" : "Meus Agendamentos Anteriores"}
      </h2>

      {isFetchingAppointments ? (
        <Loader />
      ) : errorAppointments || pastAppointments.length === 0 ? (
        <MessageWarning
          icon={<LuInfo />}
          color={errorAppointments ? "yellow" : "zinc"}
          type={errorAppointments ? "error" : "warning"}
          message={
            errorAppointments
              ? import.meta.env.VITE_ENV === "development"
                ? errorAppointments?.response?.data?.message || "Falha ao carregar Histórico de Agendamentos."
                : "Falha ao carregar Histórico de Agendamentos."
              : "Sem agendamentos passados."
          }
        />
      ) : (
        <>
          {isAdmin ? (
            <div className="mb-4 flex items-end justify-between">
              <ExportDataDialog data={pastAppointments} />

              <div className="flex flex-col items-end">
                <Label htmlFor="date-filter" className="block text-1xs font-medium text-zinc-700">
                  Filtrar por Data:
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-off-white-800 rounded px-3 py-2 w-fit text-sm"
                />
              </div>
            </div>
          ) : null}

          <section className="sm:max-h-[144px] max-h-[400px] overflow-y-auto">
            <Table className="relative overflow-x-auto w-full">
              <TableHeader>
                <TableRow className="!border-b !border-off-white-800">
                  <TableHead className="text-sm text-zinc-700 font-semibold !w-[200px] sm:!w-auto">Serviço</TableHead>
                  {isAdmin ? (
                    <TableHead className="text-sm text-zinc-700 font-semibold text-left">Cliente</TableHead>
                  ) : null}
                  <TableHead className="text-sm text-zinc-700 font-semibold text-left">Data</TableHead>
                  <TableHead className="text-sm text-zinc-700 font-semibold text-center">Preço</TableHead>
                  <TableHead className="text-sm text-zinc-700 font-semibold text-center">Promoção</TableHead>
                  <TableHead className="text-sm text-zinc-700 font-semibold text-center">Valor</TableHead>
                  <TableHead className="text-sm text-zinc-700 font-semibold text-center">Confirmado?</TableHead>
                  <TableHead className="text-sm text-zinc-700 font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-auto">
                {(filteredAppointments || []).map((appointment) =>
                  (appointment.services || []).map((service, index) => (
                    <TableRow
                      key={`${appointment._id}-${index}`}
                      className="text-xs sm:text-1xs !border-b !border-off-white-700"
                    >
                      <TableCell className="font-medium truncate max-w-[150px] whitespace-nowrap">
                        {service.service}
                      </TableCell>
                      {isAdmin ? <TableCell className="text-left">{appointment.user.name}</TableCell> : null}
                      <TableCell className="text-left">
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
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <TbEdit
                                className="text-yellow-600 cursor-pointer text-lg"
                                onClick={() => handleOpenEditAppointmentDialog(appointment._id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Visualizar agendamento{" "}
                                <span className="font-semibold text-yellow-500">(histórico)*</span>
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </section>
        </>
      )}
    </section>
  );
};

PastAppointments.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default PastAppointments;
