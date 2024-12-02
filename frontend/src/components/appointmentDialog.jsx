import { useCookies } from "react-cookie";
import { FaCheck } from "react-icons/fa6";
import { LuLoader2 } from "react-icons/lu";
import { GrSchedule } from "react-icons/gr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CiCirclePlus } from "react-icons/ci";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useEffect, useState } from "react";
import { formatToBRL } from "@/utils/currencyOperations";
import { ServiceContext } from "@/context/serviceContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { AppointmentContext } from "@/context/appointmentContext";
import { formatDateBrazil, isDateWithinDaysRange } from "@/utils/formatDate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ErrorForm from "./errorForm";

const AppointmentDialog = () => {
  const {
    appointmentForm,
    appointmentFormErrors,
    isSavingAppointment,
    isAppointmentDialogOpen,
    servicesUserPick,
    setIsAppointmentDialogOpen,
    handleAddService,
    handleInputChange,
    handlePostOrPatchAppointment,
    handleAppointmentDialogClose,
  } = useContext(AppointmentContext);
  const limitDays = 2;
  const { servicesData, isFetchingServices, errorServices } = useContext(ServiceContext);
  const [isDateWithinTwoDaysRange, setIsDateWithinDaysRange] = useState(true);
  const [cookies] = useCookies(["__btime_account_user"]);

  useEffect(() => {
    if (appointmentForm.id) {
      if (cookies.__btime_account_user && cookies.__btime_account_user.role === "user") {
        const withinRange = isDateWithinDaysRange(appointmentForm.date, limitDays);
        setIsDateWithinDaysRange(withinRange);
      } else setIsDateWithinDaysRange(true);
    } else setIsDateWithinDaysRange(true);
  }, [appointmentForm.date, appointmentForm.id, cookies.__btime_account_user]);

  return (
    <Dialog
      open={isAppointmentDialogOpen}
      onOpenChange={(isOpen) => {
        setIsAppointmentDialogOpen(isOpen);
        if (!isOpen) {
          handleAppointmentDialogClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className={buttonVariants({
            className: "bg-red-700 hover:bg-red-800 gap-1.5 px-6 text-xs text-white",
            size: "md",
          })}
        >
          <div className="w-4 h-4">
            <GrSchedule className="!w-[13px]" />
          </div>
          Agendar Horário
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[360px] sm:w-fit sm:px-6 px-2 pb-0 rounded-md bg-off-white-600/90 text-zinc-700">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-orange-600 text-left">Agendar Horário</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-4 py-4 text-zinc-600">
          <div className="grid grid-cols-12 gap-2.5">
            <div className="flex flex-col col-span-5">
              <Label htmlFor="service" className="text-left text-1xs">
                Serviço*
              </Label>

              <Select
                id="type"
                name="type"
                disabled={!isDateWithinTwoDaysRange}
                className="!text-1xs"
                value={appointmentForm.service}
                onValueChange={(value) => handleInputChange({ target: { name: "service", value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {!isFetchingServices
                      ? servicesData.map((service) => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.service}
                          </SelectItem>
                        ))
                      : null}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <ErrorForm error={appointmentFormErrors.service} />
            </div>

            <div className="flex flex-col col-span-4">
              <Label htmlFor="price" className="text-left text-1xs">
                Data*
              </Label>

              <Input
                id="date"
                type="date"
                required
                name="date"
                disabled={!isDateWithinTwoDaysRange}
                className="text-1xs"
                value={appointmentForm.date}
                onChange={handleInputChange}
              />

              <ErrorForm error={appointmentFormErrors.price} />
            </div>

            <div className="flex flex-col col-span-3">
              <Label htmlFor="duration" className="text-left text-1xs">
                Hora*
              </Label>

              <Input
                type="time"
                name="hour"
                disabled={!isDateWithinTwoDaysRange}
                value={appointmentForm.hour}
                required
                onChange={(event) => {
                  const { name, value } = event.target;
                  handleInputChange({
                    target: { name, value },
                  });
                }}
                className="text-1xs"
              />

              <ErrorForm error={appointmentFormErrors.hour} />
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="notes" className="text-left text-1xs">
              Anotações
            </Label>
            <Textarea
              id="notes"
              name="notes"
              disabled={!isDateWithinTwoDaysRange}
              className="text-1xs"
              value={appointmentForm.notes}
              onChange={handleInputChange}
            />

            <ErrorForm error={appointmentFormErrors.notes} />
          </div>
        </div>

        <DialogFooter className="flex !flex-col gap-4 items-end">
          <div className="flex w-full flex-col items-end gap-2">
            {isDateWithinTwoDaysRange ? (
              <Button
                className={buttonVariants({
                  variant: "icon",
                  className: "bg-brown-chocolate-700 hover:bg-brown-chocolate-800 text-white w-fit",
                  size: "sm",
                })}
                onClick={handleAddService}
                disabled={appointmentForm.service === "" || isSavingAppointment}
              >
                <CiCirclePlus />
                Add. Serviço
              </Button>
            ) : null}

            {servicesUserPick.length > 0 ? (
              <>
                <span className="bg-orange-200 text-orange-800 text-1xs font-medium px-2.5 py-1 rounded leading-none">
                  Total:{" "}
                  {formatToBRL(
                    servicesUserPick.reduce((acc, service) => {
                      const discount = service.percentOfDiscount
                        ? (service.price * service.percentOfDiscount) / 100
                        : 0;
                      return acc + (service.price - discount);
                    }, 0)
                  )}
                </span>

                <Table className="relative overflow-x-auto w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-zinc-700 font-semibold !w-[200px] sm:!w-auto">
                        Serviço
                      </TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold text-center">Preço</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold text-center">Promoção</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold text-right">Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicesUserPick.map((service) => (
                      <TableRow key={service._id} className="text-2xs sm:text-1xs">
                        <TableCell className="font-medium truncate max-w-[150px] whitespace-nowrap">
                          {service.service}
                        </TableCell>
                        <TableCell className="text-center">{formatToBRL(service.price)}</TableCell>
                        <TableCell className="text-center">
                          {service.percentOfDiscount
                            ? formatToBRL((service.price * service.percentOfDiscount) / 100)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-end">
                          {service.duration}
                          <span className="text-zinc-600/90 text-3xs">min.</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : null}
          </div>

          {isFetchingServices ? (
            <div className="flex items-center justify-center w-full">
              <LuLoader2 className="animate-spin" />
            </div>
          ) : appointmentForm.service !== "" ? (
            isDateWithinTwoDaysRange ? (
              <>
                <Table className="relative overflow-x-auto w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-zinc-700 font-semibold !w-[200px] sm:!w-auto">
                        Serviço
                      </TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold text-center">Preço</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold text-center">Promoção</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold text-right">Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicesData
                      .filter((service) => service._id === appointmentForm.service)
                      .map((service) => (
                        <TableRow key={service._id} className="text-2xs sm:text-1xs">
                          <TableCell className="font-medium truncate max-w-[150px] whitespace-nowrap">
                            {service.service}
                          </TableCell>
                          <TableCell className="text-center">{formatToBRL(service.price)}</TableCell>
                          <TableCell className="text-center">
                            {service.percentOfDiscount
                              ? formatToBRL((service.price * service.percentOfDiscount) / 100)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-end">
                            {service.duration}
                            <span className="text-zinc-600/90 text-3xs">min.</span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </>
            ) : null
          ) : null}

          {errorServices ? (
            <div className="text-center w-full text-sm bg-red-400 rounded py-3 text-zinc-200">
              <span>Não foi possível carregar o Serviço!</span>
            </div>
          ) : null}

          {isDateWithinTwoDaysRange ? (
            <div className="flex justify-between w-full items-end">
              <img
                src={"/assets/models/model-01.svg"}
                // servicesData.filter((service) => service._id === appointmentForm.service)[0].imageURL
                loading="lazy"
                alt="Serviço Img Ilustrativa"
                width={150}
                className="select-none"
              />

              <Button
                className={buttonVariants({
                  className: "bg-red-700 hover:bg-red-800 text-white gap-1.5 px-6 w-fit mb-6",
                  size: "md",
                })}
                onClick={handlePostOrPatchAppointment}
                disabled={isSavingAppointment}
              >
                {isSavingAppointment ? (
                  <>
                    <LuLoader2 className="animate-spin" /> Agendando...
                  </>
                ) : (
                  <>
                    <FaCheck /> Agendar
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full bg-yellow-100 p-4 rounded-lg border border-yellow-300 text-center text-xs mb-4">
              <span className="text-yellow-800 font-medium">
                Agendamento para{" "}
                <span className="font-semibold underline">{formatDateBrazil(appointmentForm.date)}</span> não pode ser
                editado diretamente pelo site. Ele execede o limite de {limitDays} dias de antecedência.
              </span>
              <span className="text-yellow-700 mt-2">
                Entre em contato conosco pelo telefone:
                <span className="font-bold underline"> (014) 3533-1258</span>
              </span>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
