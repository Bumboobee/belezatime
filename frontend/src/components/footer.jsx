import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaTiktok, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  const { handleScheduleAppointmentRedirect } = useContext(AuthContext);

  return (
    <footer className="bg-zinc-800 text-white py-10 px-6 sm:px-12 font-montserrat">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
        <div className="w-full sm:w-1/3 flex justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.697797809111!2d-49.935324470834985!3d-22.228013321331982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94bfd0ada1c087cf%3A0x2a45ca38d24a9c66!2sR.%20Hosuke%20Uchida%2C%20146%20-%20Fragata%2C%20Mar%C3%ADlia%20-%20SP%2C%2017519-222!5e0!3m2!1spt-BR!2sbr!4v1733077054306!5m2!1spt-BR!2sbr"
            width="600"
            height="250"
            allowFullScreen=""
            loading="lazy"
            className="w-full max-w-md rounded-lg shadow-lg select-none"
          ></iframe>
        </div>

        <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start gap-4 text-off-white-100">
          <h2 className="text-md">Entre em Contato</h2>
          <div className="text-1xs flex flex-col gap-1">
            <span>(014) 3533-1258</span>
            <span>beleza.time@gmail.com</span>
          </div>

          <div className="mt-4">
            <h2 className="text-md mb-2">Faça-nos uma Visita</h2>
            <div className="text-1xs flex flex-col gap-1">
              <span>Avenida Mendonça Freitas - 896A</span>
              <span>17985-855 - Marília/SP</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/3 flex flex-col sm:items-end items-center gap-6">
          <img src="/assets/logos/190x39/190x39-white.svg" alt="belezatime" />

          <Button
            className={buttonVariants({
              className: "bg-red-700 hover:bg-red-800 text-white gap-1.5 text-xs",
              size: "lg",
            })}
            onClick={handleScheduleAppointmentRedirect}
          >
            <RiCalendarScheduleLine />
            Agendar Horário
          </Button>

          <div className="flex gap-4 mt-4">
            <Link to={"#"} className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full">
              <FaFacebook />
            </Link>

            <Link to={"#"} className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full">
              <FaInstagram />
            </Link>

            <Link to={"#"} className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full">
              <FaTiktok />
            </Link>

            <Link to={"#"} className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full">
              <FaWhatsapp />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-600 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="flex gap-4">
          <Link to={"#"} className="hover:underline">
            Política de Privacidade
          </Link>

          <Link to={"#"} className="hover:underline">
            Termos de Serviço
          </Link>
        </div>
        <p className="mt-4 sm:mt-0 text-center sm:text-right">
          Copyright &copy; BelezaTime - Todos os Direitos Reservados
        </p>
      </div>
    </footer>
  );
};
export default Footer;
