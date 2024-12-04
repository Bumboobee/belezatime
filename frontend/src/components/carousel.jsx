import { LuInfo } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa6";
import { MessageWarning } from "./messageWarning";
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState, useContext } from "react";
import { ServiceContext } from "@/context/serviceContext";

import Loader from "./loader";
import PropTypes from "prop-types";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ServiceCard = ({ index, service, type, imageURL, isDashboard }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => setIsLoading(false);
  const colors = ["bg-off-white-950", "bg-off-white-700", "bg-red-900", "bg-brown-chocolate-400"];
  const color = colors[index % colors.length];
  const sizeHome = index % 2 === 0 ? "w-[200px] h-[240px]" : "w-[200px] h-[300px]";
  const sizeDashboard = index % 2 === 0 ? "w-[100px] h-[140px]" : "w-[100px] h-[180px]";

  return (
    <div
      className={`${color} ${
        isDashboard ? sizeDashboard : sizeHome
      } rounded-xl flex flex-col font-montserrat justify-between overflow-hidden`}
    >
      <div className={`flex flex-col text-left ${isDashboard ? "gap-1 p-2" : "gap-2 p-4"}`}>
        <span className="text-2xs font-medium me-2 px-2.5 py-0.5 rounded bg-yellow-900 text-yellow-100 w-fit">
          {type}
        </span>
        <span className={`text-zinc-800 italic font-medium ${isDashboard ? "text-1xs line-clamp-2" : "text-md"} `}>
          {service}
        </span>
      </div>
      <div
        className={`flex justify-center items-end b h-[140px] ${isDashboard ? "!h-[80px]" : "h-[140px]"} ${
          isLoading ? "flex-col" : "flex-row"
        }`}
      >
        {isLoading && <Loader />}

        <img
          src={imageURL}
          alt={service}
          loading="lazy"
          className={`max-h-full max-w-full object-contain select-none hidden ${
            isLoading ? "opacity-0 " : "opacity-100"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

const CarouselContainer = ({ isDashboard }) => {
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(25);
  const { servicesData, isFetchingServices, errorServices } = useContext(ServiceContext);

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
      {isFetchingServices ? (
        <div className="">
          <Loader />
        </div>
      ) : errorServices || servicesData.length === 0 ? (
        <MessageWarning
          icon={<LuInfo />}
          color={"zinc"}
          type={"warning"}
          message={errorServices ? "Não foi possível carregar os serviços." : "Sem serviços disponíveis."}
        />
      ) : (
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
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              index={index}
              service={service.service}
              type={service.type}
              imageURL={service.imageURL}
              isDashboard={isDashboard}
            />
          ))}
        </Carousel>
      )}
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
