import Loader from "./loader";
import { useState } from "react";

import PropTypes from "prop-types";

const ServiceImage = ({ imageURL }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => setIsLoading(false);

  return (
    <div className="relative w-[150px] h-[150px] flex items-center justify-center">
      {isLoading && <Loader />}

      <img
        src={imageURL}
        loading="lazy"
        alt="Serviço Img Ilustrativa"
        width={150}
        height={150}
        className={`select-none ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

ServiceImage.propTypes = {
  imageURL: PropTypes.string.isRequired,
};

export default ServiceImage;
