import Loader from "./loader";
import PropTypes from "prop-types";

import { LuInfo } from "react-icons/lu";
import { MessageWarning } from "./messageWarning";
import { useContext, useEffect, useState } from "react";
import { ServiceContext } from "@/context/serviceContext";

const PromotionCard = ({ index, service, imageURL, percentOfDiscount }) => {
  const [isLoading, setIsLoading] = useState(true);
  const bgClass = index % 2 === 0 ? "bg-off-white-800" : "bg-brown-chocolate-100";

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => setIsLoading(false);

  return (
    <div className={`${bgClass} pr-4 rounded-lg flex gap-4 sm:gap-4 relative`}>
      <div
        className={`h-full w-[100px] sm:w-[120px] rounded-l-lg relative overflow-hidden  ${
          isLoading ? "block my-auto" : "block my-0"
        }`}
      >
        {isLoading && <Loader />}

        <img
          src={imageURL}
          alt={service}
          className={`sm:absolute sm:-left-2 sm:-bottom-6 select-none  ${isLoading ? "hidden" : "block"}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
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

const PromotionWrapper = () => {
  const [servicesWithDiscount, setServicesWithDiscount] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const { servicesData, isFetchingServices, errorServices } = useContext(ServiceContext);

  useEffect(() => {
    if (!isFetchingServices && !errorServices && servicesData.length > 0) {
      const discountedServices = servicesData
        ? servicesData.filter((service) => service.percentOfDiscount != null)
        : [];
      setServicesWithDiscount(discountedServices);

      const interval = setInterval(() => {
        setCurrentServiceIndex((prevIndex) => {
          const startIndex = (prevIndex * 2) % discountedServices.length;

          return startIndex === discountedServices.length - 1 ? 0 : startIndex + 1;
        });
      }, 10000); // 10 segundos

      return () => clearInterval(interval);
    }
  }, [servicesData, isFetchingServices, errorServices]);

  const currentServices =
    servicesWithDiscount.length > 0
      ? [
          servicesWithDiscount[currentServiceIndex],
          servicesWithDiscount[(currentServiceIndex + 1) % servicesWithDiscount.length],
        ]
      : null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:pb-6">
      {isFetchingServices ? (
        <Loader />
      ) : errorServices || servicesData.length === 0 ? (
        <MessageWarning
          icon={<LuInfo />}
          color={"zinc"}
          type={"warning"}
          message={errorServices ? "Não foi possível carregar as promoções." : "Sem promoções disponíveis."}
        />
      ) : (
        <>
          {currentServices?.map((service, index) => (
            <PromotionCard
              key={service._id}
              index={index}
              service={service.service}
              imageURL={service.imageURL}
              percentOfDiscount={service.percentOfDiscount}
            />
          ))}
        </>
      )}
    </div>
  );
};

PromotionCard.propTypes = {
  index: PropTypes.number,
  service: PropTypes.string,
  imageURL: PropTypes.string,
  percentOfDiscount: PropTypes.number,
};

export default PromotionWrapper;
