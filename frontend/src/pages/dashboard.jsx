import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

import PageTitle from "@/components/pageTitle";
import DashboardNavbar from "@/components/dashboardNavbar";
import NextAppointments from "@/components/nextAppointments";
import PastAppointments from "@/components/pastAppointments";
import PieChartWrapper from "./../components/pieChartWrapper";
import GeneralInformation from "@/components/generalInformation";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [cookies] = useCookies(["__btime_account_jwt", "__btime_account_user"]);

  useEffect(() => {
    if (!cookies.__btime_account_jwt) {
      window.location.replace("/");
    } else {
      setIsLoading(false);
    }
  }, [cookies]);

  useEffect(() => {
    if (!cookies.__btime_account_user) {
      return;
    }

    setUser(cookies.__btime_account_user);

    return () => {
      setUser({});
    };
  }, []);

  return (
    <>
      <PageTitle title={`${import.meta.env.VITE_APP_NAME} • Suas Informações`} />

      <main className="bg-off-white-600 h-dvh w-dvh">
        <DashboardNavbar user={user} />

        <div className="flex flex-col sm:flex-row w-full px-4 py-2 gap-3 h-[calc(100%-90px)] overflow-y-auto">
          <section className="w-full lg:w-2/6 flex flex-col gap-3 h-full  sm:overflow-hidden">
            <GeneralInformation isAdmin={user.role === "admin"} />

            <PieChartWrapper isAdmin={user.role === "admin"} />
          </section>

          <div className="flex flex-col gap-3 justify-between w-full sm:w-4/6">
            <NextAppointments isAdmin={user.role === "admin"} />

            <PastAppointments isAdmin={user.role === "admin"} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
