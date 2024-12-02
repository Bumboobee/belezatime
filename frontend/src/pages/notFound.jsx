import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

import PageTitle from "@/components/pageTitle";

const NotFound = () => {
  return (
    <>
      <PageTitle title={`${import.meta.env.VITE_APP_NAME} • Página não encontrada`} />

      <main className="h-screen w-full flex flex-col justify-center items-center bg-zinc-950 text-brown-chocolate-400">
        <h1 className="text-9xl font-extrabold  tracking-widest">404</h1>
        <div className="bg-red-700 px-2 py-0.5 rounded rotate-12 absolute">
          <p className="text-white text-xs">Página não encontrada</p>
        </div>

        <div className="mt-5 relative isolate w-1/2 text-center">
          <Link
            to="/"
            className={`${buttonVariants({
              size: "sm",
              className: "mt-20 font-bold text-white bg-brown-chocolate-800 px-6 py-5",
            })}`}
          >
            Ir para a página inicial
          </Link>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-4 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pulse-glow"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-9rem)] aspect-[1455/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#c9a595] to-[#fb923c] opacity-80 cm:left-[calc(50%-30rem) sm:w-[85.1875rem]"
            ></div>
          </div>
        </div>
      </main>
    </>
  );
};
export default NotFound;
