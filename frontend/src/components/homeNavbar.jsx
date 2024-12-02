import { useCookies } from "react-cookie";
import { LuLoader2 } from "react-icons/lu";
import { useWindowScroll } from "react-use";
import { LuLayoutDashboard } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "./ui/button";

import gsap from "gsap";
import axios from "axios";
import AuthDialog from "./authDialog";

const navItems = ["Serviços", "Agendamento"];
const baseUrl =
  import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_API_URL_DEV : import.meta.env.VITE_API_URL_PROD;

const HomeNavbar = () => {
  const navContainerRef = useRef(null);
  const [lastScrollY, setlastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isUserLoggedIn, setisUserLoggedIn] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const { y: currentScrollY } = useWindowScroll();
  const [cookies] = useCookies(["__btime_account_jwt"]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setlastScrollY(currentScrollY);
  }, [currentScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  useEffect(() => {
    if (cookies.__btime_account_jwt) {
      setisUserLoggedIn(true);
    }
  }, [cookies]);

  useEffect(() => {
    if (cookies.__btime_account_jwt) {
      checkTokenValidity();
    }
  }, []);

  const checkTokenValidity = async () => {
    setIsCheckingToken(true);

    try {
      const response = await axios.get(`${baseUrl}/users/verifyToken`, {
        headers: {
          Authorization: `Bearer ${cookies.__btime_account_jwt}`,
        },
      });

      if (response.data.status === "success") {
        setisUserLoggedIn(true);

        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingToken(false);
    }
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center p-4 sm:rounded-md rounded select-none">
          <div className="flex items-center justify-between w-full">
            <div className="flex h-full items-center">
              <div className="flex gap-2 sm:gap-8">
                {navItems.map((item, index) => (
                  <a key={index} className="nav-hover-btn" href={`#${item.toLowerCase()}`}>
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <img src="/assets/logos/190x39/190x39-white.svg" alt="belezatime" width={150} className="hidden sm:block" />

            {isCheckingToken ? (
              <LuLoader2 className="animate-spin text-red-700" />
            ) : (
              <>
                {isUserLoggedIn ? (
                  <Button
                    className={buttonVariants({
                      className: "bg-red-700 hover:bg-red-800 gap-1.5 px-6 text-xs text-white",
                      size: "md",
                    })}
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    <div className="w-4 h-4">
                      <LuLayoutDashboard className="!w-[12px]" />
                    </div>
                    Dashboard
                  </Button>
                ) : (
                  <AuthDialog />
                )}
              </>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HomeNavbar;
