import { getFirstAndLastWord } from "@/utils/stringFormaters";

import PropTypes from "prop-types";
import UserMenu from "@/components/userMenu";
import ServiceDialog from "@/components/serviceDialog";
import AppointmentDialog from "@/components/appointmentDialog";

const DashboardNavbar = ({ user }) => {
  return (
    <nav className="w-full h-[90px] relative px-4 py-2">
      <div className="w-full h-full flex justify-between sm:flex-row flex-row gap-2 sm:gap-0 sm:items-center  items-center font-montserrat border-b border-off-white-800">
        <div className="flex gap-3 items-center">
          <img
            src="/assets/content/user.svg"
            alt="user"
            className="w-10 h-10 sm:w-12 sm:h-12"
          />

          <div className="flex flex-col">
            <span className="text-zinc-700 font-medium text-2xs sm:text-sm">{getFirstAndLastWord(user.name, 3)}</span>
            <span className="text-zinc-500 text-2xs sm:text-1xs">{user.email}</span>

            {user.role === "admin" ? (
              <span className="text-4xs sm:text-2xs font-medium me-2 mt-1 w-fit px-2.5 py-0.5 rounded-full bg-orange-600 text-off-white-100">
                Admin
              </span>
            ) : null}
          </div>

          <UserMenu user={user} />
        </div>

        {user.role === "admin" ? (
          <>
            <ServiceDialog />
            <div className="hidden">
              <AppointmentDialog />
            </div>
          </>
        ) : (
          <AppointmentDialog />
        )}
      </div>
    </nav>
  );
};

DashboardNavbar.propTypes = {
  user: PropTypes.object.isRequired,
};

export default DashboardNavbar;
