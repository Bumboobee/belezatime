import { FaLock } from "react-icons/fa6";
import { useContext, useState } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { AuthContext } from "@/context/authContext";
import { getFirstAndLastWord } from "@/utils/stringFormaters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import PropTypes from "prop-types";

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogout } = useContext(AuthContext);

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <ChevronDown className="cursor-pointer w-4 h-4 tour-step-2" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm ">{getFirstAndLastWord(user.name, 4)}</p>
            <p className="w-[200px] truncate text-xs text-zinc-700">{user.phone}</p>
          </div>
        </div>

        {/* <DropdownMenuItem className="flex items-center justify-between " onClick={handleLogout}>
          Alterar Senha
          <FaLock />
        </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center justify-between " onClick={handleLogout}>
          Sair
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserMenu;
