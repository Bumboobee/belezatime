import Loader from "./loader";
import PropTypes from "prop-types";

import { LuInfo } from "react-icons/lu";
import { MessageWarning } from "./messageWarning";
import { useContext, useEffect, useState } from "react";
import { formatToBRL } from "@/utils/currencyOperations";
import { ServiceContext } from "@/context/serviceContext";

const PromotionCard = ({ index, service, imageURL, percentOfDiscount, price }) => {
  const [isLoading, setIsLoading] = useState(true);
  const bgClass = index % 2 === 0 ? "bg-off-white-800" : "bg-brown-chocolate-100";

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => setIsLoading(false);

  return (
    <div className={`${bgClass} pr-4 rounded-lg flex gap-4 sm:gap-4 relative`}>
      <div
        className={`h-full w-[108px] sm:w-[130px] rounded-l-lg relative overflow-hidden  ${
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
        <header className="flex gap-2">
          <div className="flex flex-col">
            <span className="text-1xs">Somente Hoje</span>
            <span className="text-md sm:text-lg font-semibold">{percentOfDiscount}% OFF</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs line-through">{formatToBRL(price)}</span>
            <span className="text-lg sm:text-xl font-semibold">
              {formatToBRL(price - price * (percentOfDiscount / 100))}
            </span>
          </div>
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
      }, 20000); // 20 segundos

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
              price={service.price}
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
  price: PropTypes.number,
};

export default PromotionWrapper;
