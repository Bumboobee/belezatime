import PageTitle from "@/components/pageTitle";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { LuLoader2 } from "react-icons/lu";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cookies] = useCookies(["__btime_account_jwt"]);

  useEffect(() => {
    if (!cookies.__btime_account_jwt) {
      window.location.replace("/");
    } else {
      setIsLoading(false);
    }
  }, [cookies]);

  if (isLoading) {
    return (
      <section className="h-dvh w-dvw flex justify-center items-center">
        <LuLoader2 className="text-4xl text-red-700 animate-spin" />
      </section>
    );
  }

  return (
    <>
      <PageTitle title={`${import.meta.env.VITE_APP_NAME} • Suas Informações`} />
      <main>Dashboard</main>
    </>
  );
};

export default Dashboard;
