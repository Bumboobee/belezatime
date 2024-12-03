import { LuLoader2 } from "react-icons/lu";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LuLoader2 className="text-4xl text-red-700 animate-spin" />
    </div>
  );
};
export default Loader;
