import Footer from "../components/footer";
import PageTitle from "@/components/pageTitle";
import HomeNavbar from "../components/homeNavbar";
import CarouselContainer from "../components/carousel";
import PromotionWrapper from "@/components/promotionWrapper";

import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";

const Home = () => {
  const { handleScheduleAppointmentRedirect } = useContext(AuthContext);

  return (
    <>
      <PageTitle title={`${import.meta.env.VITE_APP_NAME} • O estilo que você merece!`} />

      <main className="relative min-h-screen w-screen">
        <HomeNavbar />

        <section className="sm:h-dvh h-full bg-radial-gradient font-montserrat">
          <div className="w-full h-full px-6 sm:px-10 pt-16 sm:pt-24 flex flex-col-reverse sm:flex-row-reverse">
            <div className="w-full sm:w-1/2 h-1/2 sm:h-full flex justify-center items-end">
              <img
                src="/assets/models/model-01.svg"
                alt="Model"
                loading="lazy"
                className="max-h-full object-contain select-none"
              />
            </div>

            <div className="w-full sm:w-1/2 flex flex-col justify-between gap-10 sm:gap-0 mt-12 sm:mt-0">
              <header className="flex flex-col gap-6 sm:gap-14 text-left h-auto sm:h-full justify-center">
                <h1 className="text-4xl sm:text-8xl text-off-white-500 font-extralight">O Estilo Que Você Merece</h1>

                <Button
                  className={buttonVariants({
                    className: "bg-red-700 hover:bg-red-800 text-white gap-1.5 text-xs w-fit",
                    size: "lg",
                  })}
                  onClick={handleScheduleAppointmentRedirect}
                >
                  <RiCalendarScheduleLine />
                  Agendar Horário
                </Button>
              </header>

              <div className="flex flex-col gap-6 sm:gap-10">
                <p className="text-white text-sm sm:text-base font-montserrat leading-relaxed font-light">
                  Descubra um mundo de sofisticação e beleza aqui na BelezaTime. Nosso salão é muito mais do que um
                  lugar para cortes de cabelo; é um refúgio onde o seu estilo único é o protagonista.
                </p>

                <PromotionWrapper />
              </div>
            </div>
          </div>
        </section>

        <section
          id="serviços"
          className="w-full px-4 sm:px-10 py-10 sm:py-24 flex flex-col sm:flex-row bg-off-white-600 items-center sm:items-start justify-center sm:justify-between gap-8 sm:gap-0"
        >
          <div className="w-full sm:w-2/5 flex flex-col items-center sm:items-start justify-center text-center sm:text-left font-poppins">
            <h2 className="text-2xl sm:text-4xl text-zinc-800">Nossos Serviços</h2>
            <p className="text-sm sm:text-base text-zinc-500 mt-4 font-light">
              Muito além de cortes de cabelo, descubra uma variedade completa de serviços, desde coloração até
              alongamentos.
            </p>
          </div>

          <CarouselContainer />
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Home;
