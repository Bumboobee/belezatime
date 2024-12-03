import { useContext } from "react";
import { TbEdit } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { LuLoader2 } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PiHairDryerFill } from "react-icons/pi";
import { MdDeleteForever } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { NumericFormat } from "react-number-format";
import { ServiceContext } from "@/context/serviceContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatToBRL } from "@/utils/currencyOperations";
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

const ServiceDialog = () => {
  const {
    types,
    serviceForm,
    serviceFormErrors,
    isSavingService,
    isServiceDialogOpen,
    servicesData,
    isFetchingServices,
    errorServices,
    isPromotionEnabled,
    setIsPromotionEnabled,
    setIsServiceDialogOpen,
    handleInputChange,
    handlePostOrPatchService,
    handleEditClick,
    handleServiceDialogClose,
    handleDeleteService,
  } = useContext(ServiceContext);

  return (
    <Dialog
      open={isServiceDialogOpen}
      onOpenChange={(isOpen) => {
        setIsServiceDialogOpen(isOpen);
        if (!isOpen) {
          handleServiceDialogClose();
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
            <PiHairDryerFill className="!w-[16px]" />
          </div>
          Serviços
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[360px] sm:w-fit sm:px-6 px-2 rounded-md bg-off-white-600/90 text-zinc-700">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-orange-600 text-left">Gerenciamento de Serviços</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-4 py-4 text-zinc-600">
          <div className="grid grid-cols-12 gap-2.5">
            <div className="flex flex-col col-span-6">
              <Label htmlFor="service" className="text-left text-1xs">
                Serviço*
              </Label>
              <Input
                id="service"
                required
                name="service"
                className="text-1xs"
                value={serviceForm.service}
                onChange={handleInputChange}
              />
              <ErrorForm error={serviceFormErrors.service} />
            </div>

            <div className="flex flex-col col-span-3">
              <Label htmlFor="price" className="text-left text-1xs">
                Preço*
              </Label>
              <NumericFormat
                customInput={Input}
                name="price"
                value={serviceForm.price}
                required
                onValueChange={(values) => {
                  const { value } = values;
                  handleInputChange({
                    target: {
                      name: "price",
                      value: value,
                    },
                  });
                }}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                prefix={"R$ "}
                className="text-1xs"
              />

              <ErrorForm error={serviceFormErrors.price} />
            </div>

            <div className="flex flex-col col-span-3">
              <Label htmlFor="duration" className="text-left text-1xs">
                Duração*
              </Label>

              <NumericFormat
                customInput={Input}
                name="duration"
                value={serviceForm.duration}
                required
                onValueChange={(values) => {
                  const { value } = values;
                  handleInputChange({
                    target: {
                      name: "duration",
                      value: value,
                    },
                  });
                }}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                suffix={" min"}
                className="text-1xs"
              />
              <ErrorForm error={serviceFormErrors.duration} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2.5">
            <div className="flex flex-col col-span-8">
              <Label htmlFor="imageURL" className="text-left text-1xs">
                Imagem URL*
              </Label>
              <Input
                id="imageURL"
                name="imageURL"
                className="text-1xs"
                required
                value={serviceForm.imageURL}
                onChange={handleInputChange}
              />

              <ErrorForm error={serviceFormErrors.imageURL} />
            </div>

            <div className="flex flex-col col-span-4">
              <Label htmlFor="type" className="text-left text-1xs">
                Tipo*
              </Label>

              <Select
                id="type"
                name="type"
                className="text-1xs"
                value={serviceForm.type}
                onValueChange={(value) => handleInputChange({ target: { name: "type", value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <ErrorForm error={serviceFormErrors.type} />
            </div>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="description" className="text-left text-1xs">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              className="text-1xs"
              value={serviceForm.description}
              onChange={handleInputChange}
            />

            <ErrorForm error={serviceFormErrors.description} />
          </div>

          <div className="grid grid-cols-12">
            <div className="flex items-center space-x-2 col-span-6">
              <Switch
                id="promotion"
                checked={isPromotionEnabled}
                onCheckedChange={() => setIsPromotionEnabled(!isPromotionEnabled)}
              />
              <Label htmlFor="promotion" className="text-xs">
                Ativar Promoção?
              </Label>
            </div>

            {isPromotionEnabled && (
              <div className="mt-4 col-span-6 flex justify-end">
                <div className="flex flex-col max-w-[110px]">
                  <Label htmlFor="percentOfDiscount" className="text-left text-1xs">
                    Desconto (%)
                  </Label>

                  <NumericFormat
                    customInput={Input}
                    name="percentOfDiscount"
                    value={serviceForm.percentOfDiscount}
                    onValueChange={(values) => {
                      const { value } = values;
                      handleInputChange({
                        target: {
                          name: "percentOfDiscount",
                          value: value,
                        },
                      });
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    suffix={"%"}
                    className="text-1xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex !flex-col gap-4 items-end">
          <Button
            className={buttonVariants({
              className: "bg-red-700 hover:bg-red-800 text-white gap-1.5 px-6 w-fit",
              size: "md",
            })}
            onClick={handlePostOrPatchService}
            disabled={isSavingService}
          >
            {isSavingService ? (
              <>
                <LuLoader2 className="animate-spin" /> Salvando...
              </>
            ) : (
              <>
                {" "}
                <FaCheck /> Salvar
              </>
            )}
          </Button>

          {isFetchingServices ? (
            <div className="flex items-center justify-center">
              <LuLoader2 className="animate-spin" />
            </div>
          ) : (
            <>
              <Table className="relative overflow-x-auto w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs text-zinc-700 font-semibold !w-[200px] sm:!w-auto">Serviço</TableHead>
                    <TableHead className="text-xs text-zinc-700 font-semibold text-center">Preço</TableHead>
                    <TableHead className="text-xs text-zinc-700 font-semibold text-center">Promoção</TableHead>
                    <TableHead className="text-xs text-zinc-700 font-semibold text-center">Duração</TableHead>
                    <TableHead className="text-xs text-zinc-700 font-semibold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicesData.map((service) => (
                    <TableRow key={service._id} className="text-2xs sm:text-1xs">
                      <TableCell className="font-medium truncate max-w-[150px] whitespace-nowrap">
                        {service.service}
                      </TableCell>
                      <TableCell className="text-center">{formatToBRL(service.price)}</TableCell>
                      <TableCell className="text-center">
                        {service.percentOfDiscount ? formatToBRL(service.percentOfDiscount) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {service.duration}
                        <span className="text-zinc-600/90 text-3xs">min.</span>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2 itens-center">
                        <MdDeleteForever
                          className="text-red-600 cursor-pointer text-lg"
                          onClick={() => handleDeleteService(service._id)}
                        />
                        <TbEdit
                          className="text-yellow-600 cursor-pointer text-lg"
                          onClick={() => handleEditClick(service)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {errorServices ? (
            <div className="text-center w-full text-sm bg-red-400 rounded py-3 text-zinc-200">
              <span>Não foi possível carregar os Serviços!</span>
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
