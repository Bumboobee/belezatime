import { useContext, useState } from "react";
import { FaChartSimple } from "react-icons/fa6";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import LineChartAnual from "./lineChartAnual";
import { AppointmentContext } from "@/context/appointmentContext";
import Loader from "./loader";

import { MessageWarning } from "./messageWarning";
import { LuInfo } from "react-icons/lu";

const LineChartAnualDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { yearlyApointmentsData, isFetchingYearlyApointments, errorYearlyApointments } = useContext(AppointmentContext);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
          Faturamento Anual
          <FaChartSimple className="w-4 h-4 text-zinc-500" />
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="max-w-fit sm:max-w-[600px] bg-off-white-600/90 p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="border-b border-brown-chocolate-200 pb-4">
          <DialogTitle className="font-montserrat text-orange-600">Faturamento Anual</DialogTitle>
          <DialogDescription className="text-2xs text-zinc-500">
            Dados com base em Agendamentos nos últimos 12 meses
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          {isFetchingYearlyApointments ? (
            <Loader />
          ) : errorYearlyApointments || yearlyApointmentsData.length === 0 ? (
            <MessageWarning
              icon={<LuInfo />}
              color={errorYearlyApointments ? "yellow" : "zinc"}
              type={errorYearlyApointments ? "error" : "warning"}
              message={
                errorYearlyApointments
                  ? import.meta.env.VITE_ENV === "development"
                    ? errorYearlyApointments?.response?.data?.message || "Não foi possível carregar o gráfico Anual."
                    : "Não foi possível carregar o gráfico Anual."
                  : "Sem dados dos últimos 12 meses."
              }
            />
          ) : (
            <LineChartAnual anualAppointmentsData={yearlyApointmentsData} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LineChartAnualDialog;
