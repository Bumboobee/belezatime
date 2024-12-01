import PropTypes from "prop-types";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CarouselContainer from "../components/carousel";

import { RiCalendarScheduleLine } from "react-icons/ri";
import { Button, buttonVariants } from "@/components/ui/button";

const PromotionCard = ({ index, service, imageURL, percentOfDiscount }) => {
  const bgClass = index % 2 === 0 ? "bg-off-white-800" : "bg-brown-chocolate-100";

  return (
    <div className={`${bgClass} pr-4 rounded-lg flex gap-4 sm:gap-4 relative`}>
      <div className="h-full w-[100px] sm:w-[120px] rounded-l-lg relative overflow-hidden">
        <img src={imageURL} alt={service} className="sm:absolute sm:-left-2 sm:-bottom-6" />
      </div>

      <div className="flex flex-col gap-2 sm:gap-4 text-zinc-800 pb-4 pt-4">
        <header className="flex flex-col">
          <span className="text-xs">Somente Hoje</span>
          <span className="text-lg sm:text-xl font-semibold">{percentOfDiscount}% OFF</span>
        </header>
        <span className="text-sm sm:text-lg max-w-[155px]">{service}</span>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <main className="relative min-h-screen w-screen">
      <Navbar />

      <section className="sm:h-dvh h-full bg-radial-gradient font-montserrat">
        <div className="w-full h-full px-6 sm:px-10 pt-16 sm:pt-24 flex flex-col-reverse sm:flex-row-reverse">
          <div className="w-full sm:w-1/2 h-1/2 sm:h-full flex justify-center items-end">
            <img src="/assets/models/model-01.svg" alt="Model" className="max-h-full object-contain" />
          </div>

          <div className="w-full sm:w-1/2 flex flex-col justify-between gap-10 sm:gap-0 mt-12 sm:mt-0">
            <header className="flex flex-col gap-6 sm:gap-14 text-left h-auto sm:h-full justify-center">
              <h1 className="text-4xl sm:text-8xl text-off-white-500 font-extralight">O Estilo Que Você Merece</h1>

              <Button
                className={buttonVariants({
                  className: "bg-red-700 hover:bg-red-800 text-white gap-1.5 text-xs w-fit",
                  size: "lg",
                })}
              >
                <RiCalendarScheduleLine />
                Agendar Horário
              </Button>
            </header>

            <div className="flex flex-col gap-6 sm:gap-10">
              <p className="text-white text-sm sm:text-base font-montserrat leading-relaxed font-light">
                Descubra um mundo de sofisticação e beleza aqui na BelezaTime. Nosso salão é muito mais do que um lugar
                para cortes de cabelo; é um refúgio onde o seu estilo único é o protagonista.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:pb-6">
                <PromotionCard
                  index={1}
                  service="Escova"
                  imageURL="/assets/models/model-02.svg"
                  percentOfDiscount={50}
                />
                <PromotionCard
                  index={2}
                  service="Chapinha com Alisamento"
                  imageURL="/assets/models/model-03.png"
                  percentOfDiscount={15}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-10 py-10 sm:py-24 flex flex-col sm:flex-row bg-off-white-600 items-center sm:items-start justify-center sm:justify-between gap-8 sm:gap-0">
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
  );
};

PromotionCard.propTypes = {
  index: PropTypes.number,
  service: PropTypes.string,
  imageURL: PropTypes.string,
  percentOfDiscount: PropTypes.number,
};

export default Home;
