import { useState } from "react";
import { colors } from "@/style/colors";
import { LuLoader2 } from "react-icons/lu";
import { IoMdAlert } from "react-icons/io";
import { useToast } from "../hooks/use-toast";
import { FaFileDownload } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { Button, buttonVariants } from "./ui/button";
import { formatDateBrazil } from "@/utils/formatDate";
import { FaFilePdf, FaFileCsv } from "react-icons/fa6";
import { formatToBRL } from "@/utils/currencyOperations";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import autoTable from "jspdf-autotable";
import logoPath from "/assets/logos/190x39/190x39-brown.png";

const fileName = `${import.meta.env.VITE_APP_NAME} - Agendamentos`;

const ExportDataDialog = ({ data }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeOption, setActiveOption] = useState("xlsx");

  const handleTypeFileClick = (type) => {
    setActiveOption(type);
  };

  const handleExportToXlsx = async () => {
    try {
      setIsDownloading(true);

      const formattedData = data.flatMap((appointment) =>
        (appointment.services || []).map((service) => ({
          Serviço: service.service,
          Cliente: appointment.user?.name || " - ",
          Email: appointment.user?.email || " - ",
          Telefone: appointment.user?.phone || " - ",
          Data: `${new Date(appointment.date).toLocaleDateString()} às ${appointment.hour}hr`,
          Preço: service.price,
          Promoção: service.percentOfDiscount ? (service.price * service.percentOfDiscount) / 100 : 0,
          Valor: service.percentOfDiscount
            ? service.price - (service.price * service.percentOfDiscount) / 100
            : service.price,
          Confirmado: appointment.isConfirmed ? "Sim" : "Não",
        }))
      );

      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      Object.keys(worksheet).forEach((cell) => {
        if (cell[0] === "F" || cell[0] === "G" || cell[0] === "H") {
          worksheet[cell].z = "R$ #,##0.00";
        }
      });

      const autoAdjustColumnWidths = (worksheet, data) => {
        const colWidths = data.reduce((widths, row) => {
          Object.keys(row).forEach((key, colIdx) => {
            const cellValue = row[key] ? row[key].toString() : "";
            widths[colIdx] = Math.max(widths[colIdx] || 10, cellValue.length + 5);
          });
          return widths;
        }, []);

        worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));
      };

      autoAdjustColumnWidths(worksheet, formattedData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Agendamentos");
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
      toast({
        title: (
          <span className="flex items-center">
            <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
            Algo deu errado!
          </span>
        ),
        description: "Não foi possível exportar para XLSX.",
      });

      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportToPdf = async () => {
    try {
      setIsDownloading(true);
      const doc = new jsPDF({ orientation: "landscape" });

      const title = "";
      const logoXPos = 14;
      const logoYPos = 10;
      const logoWidth = 34;
      const logoHeight = 8;

      doc.addImage(logoPath, "PNG", logoXPos, logoYPos, logoWidth, logoHeight);
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.setTextColor(colors.zinc[500]);
      doc.text(title, logoXPos, logoYPos + logoHeight + 6.5);

      doc.setFont(undefined, "normal");

      doc.setTextColor(0, 0, 0);

      const columns = [
        { header: "Serviço", dataKey: "service" },
        { header: "Cliente", dataKey: "client" },
        { header: "Data", dataKey: "date" },
        { header: "Preço", dataKey: "price" },
        { header: "Promoção", dataKey: "promotion" },
        { header: "Valor", dataKey: "value" },
        { header: "Confirmado?", dataKey: "confirmed" },
      ];

      const formattedData = data.flatMap((appointment) =>
        (appointment.services || []).map((service) => ({
          service: service.service,
          client: appointment.user?.name || " - ",
          date: `${formatDateBrazil(appointment.date)} às ${appointment.hour}hr`,
          price: formatToBRL(service.price),
          promotion: service.percentOfDiscount ? formatToBRL((service.price * service.percentOfDiscount) / 100) : "-",
          value: service.percentOfDiscount
            ? formatToBRL(service.price - (service.price * service.percentOfDiscount) / 100)
            : formatToBRL(service.price),
          confirmed: appointment.isConfirmed ? "Sim" : "Não",
        }))
      );

      doc.autoTable({
        startY: 20,
        head: [columns.map((col) => col.header)],
        body: formattedData.map((row) => columns.map((col) => row[col.dataKey] || " - ")),
        theme: "grid",
        headStyles: { fillColor: [colors.brownChocolate[400]], halign: "center" },
        columnStyles: {
          0: { halign: "left" },
          1: { halign: "left" },
          2: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "center" },
          5: { halign: "center" },
          6: { halign: "center" },
        },
        styles: { fontSize: 6.5 },
        didDrawPage: (data) => {
          doc.setFontSize(6);
          doc.text(
            `Relatório emitido em ${new Date().toLocaleString()}`,
            doc.internal.pageSize.width - 52,
            doc.internal.pageSize.height - 10
          );
        },
      });

      doc.save(`${fileName}.pdf`);
    } catch (error) {
      toast({
        title: (
          <span className="flex items-center">
            <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
            Algo deu errado!
          </span>
        ),
        description: "Não foi possível exportar para PDF.",
      });

      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportData = () => {
    if (activeOption === "xlsx") {
      handleExportToXlsx();
    } else if (activeOption === "pdf") {
      handleExportToPdf();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between p-2 rounded border border-off-white-700 cursor-pointer">
          <FaFileDownload className="scale-125 text-off-white-900" />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-fit bg-off-white-600/90 p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="border-b border-brown-chocolate-200 pb-4">
          <DialogTitle className="font-montserrat text-orange-600">Exportar Dados</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => handleTypeFileClick("xlsx")}
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: `bg-transparent text-zinc-500 text-xs hover:bg-zinc-200 !rounded-md
                          ${
                            activeOption === "xlsx"
                              ? "border-2 border-zinc-500"
                              : "hover:shadow-sm hover:shadow-zinc-100"
                          } 
                          gap-2 font-medium`,
            })}
          >
            <FaFileCsv className="scale-150" />
          </Button>

          <Button
            type="button"
            onClick={() => handleTypeFileClick("pdf")}
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: `bg-transparent text-zinc-500 text-xs hover:bg-zinc-200 !rounded-md
                          ${
                            activeOption === "pdf"
                              ? "border-2 border-zinc-500"
                              : "hover:shadow-sm hover:shadow-zinc-100"
                          } 
                          gap-2 font-medium`,
            })}
          >
            <FaFilePdf className="scale-150" />
          </Button>
        </div>

        {isDownloading ? (
          <div className="w-full flex gap-1 items-center justify-center text-xs text-zinc-700 text-center pt-2">
            <LuLoader2 className="text- text-red-700 animate-spin" />
            <span className="font-medium text-zinc-500/80 italic">Exportando...</span>
          </div>
        ) : null}

        <Button
          type="button"
          className={buttonVariants({
            size: "sm",
            className: "bg-red-700 text-white hover:bg-red-800 gap-2 font-medium",
          })}
          onClick={handleExportData}
          disabled={isDownloading}
        >
          <MdFileDownload className="w-4 h-4" />
          Exportar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

ExportDataDialog.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ExportDataDialog;
