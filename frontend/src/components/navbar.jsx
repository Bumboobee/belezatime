import { useWindowScroll } from "react-use";
import { FaUser } from "react-icons/fa";

import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

import gsap from "gsap";
const navItems = ["Serviços", "Agendamento"];

const Navbar = () => {
  const [lastScrollY, setlastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const navContainerRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();

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

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center p-4 sm:rounded-md rounded">
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

            <Button
              className={buttonVariants({
                className: "bg-off-white-600 hover:bg-off-white-700 text-zinc-700 gap-1.5 px-6 text-xs",
                size: "md",
              })}
            >
              <div className="w-4 h-4">
                <FaUser className="!w-[12px]" />
              </div>
              Entrar
            </Button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
