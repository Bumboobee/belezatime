import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Carousel } from "react-responsive-carousel";

import PropTypes from "prop-types";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ServiceCard = ({ index, service, type, imageURL, isDashboard }) => {
  const colors = ["bg-off-white-950", "bg-off-white-700", "bg-red-900", "bg-brown-chocolate-400"];
  const color = colors[index % colors.length];
  const sizeHome = index % 2 === 0 ? "w-[200px] h-[240px]" : "w-[200px] h-[300px]";
  const sizeDashboard = index % 2 === 0 ? "w-[100px] h-[140px]" : "w-[100px] h-[180px]";

  return (
    <div
      className={`${color} ${
        isDashboard ? sizeDashboard : sizeHome
      } rounded-xl flex flex-col font-montserrat justify-between overflow-hidden ${
        isDashboard ? "scale-100" : "scale-100"
      }`}
    >
      <div className={`flex flex-col text-left ${isDashboard ? "gap-1 p-2" : "gap-2 p-4"}`}>
        <span className="text-2xs font-medium me-2 px-2.5 py-0.5 rounded bg-yellow-900 text-yellow-100 w-fit">
          {type}
        </span>
        <span className={`text-zinc-800 italic font-medium ${isDashboard ? "text-xs" : "text-md"} `}>{service}</span>
      </div>
      <div className="flex justify-center items-end h-[140px]">
        <img src={imageURL} alt={service} className="max-h-full max-w-full object-contain select-none" />
      </div>
    </div>
  );
};

const CarouselContainer = ({ isDashboard }) => {
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(25);

  useEffect(() => {
    const updateSlidePercentage = () => {
      if (window.innerWidth < 640) {
        setCenterSlidePercentage(isDashboard ? 32 : 55);
      } else if (window.innerWidth < 768) {
        setCenterSlidePercentage(60);
      } else if (window.innerWidth < 950) {
        setCenterSlidePercentage(50);
      } else if (window.innerWidth < 1025) {
        setCenterSlidePercentage(40);
      } else if (window.innerWidth < 1225) {
        setCenterSlidePercentage(35);
      } else if (window.innerWidth < 1470) {
        setCenterSlidePercentage(30);
      } else {
        setCenterSlidePercentage(25);
      }
    };

    updateSlidePercentage();
    window.addEventListener("resize", updateSlidePercentage);

    return () => {
      window.removeEventListener("resize", updateSlidePercentage);
    };
  }, []);

  return (
    <div className={`w-full rounded-lg relative ${isDashboard ? "!sm:w-full" : "sm:w-3/5"}`}>
      <Carousel
        className="relative"
        showArrows={true}
        infiniteLoop={true}
        centerMode={true}
        centerSlidePercentage={centerSlidePercentage}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        autoPlay={false}
        renderArrowPrev={(hasPrev) => hasPrev && null}
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <span
              onClick={onClickHandler}
              className="absolute bottom-0 right-0 z-50 bg-zinc-800 text-zinc-100 p-1.5 rounded-full shadow-md cursor-pointer"
            >
              <FaArrowRight className="text-1xs" />
            </span>
          )
        }
      >
        <ServiceCard
          index={0}
          service={"Pixel Cut"}
          type="Corte"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
        <ServiceCard
          index={1}
          service={"Balayage"}
          type="Coloração"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
        <ServiceCard
          index={2}
          service={"Highlights"}
          type="Reflexos"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
        <ServiceCard
          index={3}
          service={"Keratin"}
          type="Tratamento"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
        <ServiceCard
          index={4}
          service={"Straightening"}
          type="Alisamento"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
        <ServiceCard
          index={5}
          service={"Perm"}
          type="Ondulação"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
        <ServiceCard
          index={6}
          service={"Cut & Style"}
          type="Corte & Estilo"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
        <ServiceCard
          index={7}
          service={"Blow Dry"}
          type="Escova"
          imageURL={"/assets/models/model-01.svg"}
          isDashboard={isDashboard}
        />
      </Carousel>
    </div>
  );
};

ServiceCard.propTypes = {
  index: PropTypes.number,
  service: PropTypes.string,
  type: PropTypes.string,
  imageURL: PropTypes.string,
  isDashboard: PropTypes.bool,
};

CarouselContainer.propTypes = {
  width: PropTypes.string,
  isDashboard: PropTypes.bool,
};

export default CarouselContainer;
