import { IoReloadOutline } from "react-icons/io5";
import { Button, buttonVariants } from "@/components/ui/button";

import PropTypes from "prop-types";

const getColorClasses = (color) => {
  const colors = {
    red: "bg-red-900 text-red-300",
    blue: "bg-blue-900 text-blue-300",
    green: "bg-green-900 text-green-300",
    gray: "bg-gray-900 text-gray-300",
    zinc: "bg-zinc-900 text-zinc-300",
    yellow: "bg-yellow-900 !text-yellow-300",
    violet: "bg-violet-900 text-violet-300",
  };

  return colors[color] || colors["gray"];
};

const getColorOpacity = (color) => {
  const colors = {
    red: "bg-red-300/80",
    blue: "bg-blue-300/80",
    green: "bg-green-300/80",
    gray: "bg-gray-300/80",
    zinc: "bg-zinc-300/80",
    yellow: "bg-yellow-300/80",
    violet: "bg-violet-300/80",
  };

  return colors[color] || colors["gray"];
};

export const MessageWarning = ({ icon, color, message, type }) => {
  const colorClasses = getColorClasses(color);
  const colorOpacity = getColorOpacity(color);

  const handleReload = () => {
    window.location.reload(true);
  };

  return (
    <section className="w-full h-full flex justify-center items-center">
      <div className={`flex flex-col rounded-md gap-1 py-2.5 px-1.5 font-plus-jakarta ${colorOpacity}`}>
        <span className={`flex items-center gap-1 text-xs font-medium px-1 py-1 rounded ${colorClasses}`}>
          <span className={`flex items-center justify-center rounded px-1.5 w-7 h-7 ${colorClasses} ${colorOpacity}`}>
            {icon}
          </span>

          <p className="font-semibold text-1xs pr-2" lang="pt-BR">
            {message}
          </p>
        </span>

        {type === "error" && (
          <div className="flex justify-center">
            <Button
              className={buttonVariants({
                size: "sm",
                className: `gap-2 text-xs bg-yellow-800 hover:bg-yellow-950 text-yellow-300`,
              })}
              onClick={() => handleReload()}
            >
              <IoReloadOutline /> Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

MessageWarning.propTypes = {
  icon: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
};
