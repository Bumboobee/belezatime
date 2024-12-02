import { LuLoader2 } from "react-icons/lu";
import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/authContext";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import InputMask from "react-input-mask";
import ErrorForm from "./errorForm";

const AuthDialog = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const {
    authForm,
    authFormErrors,
    isDoingAuthProcess,
    setAuthFormErrors,
    handleInputChange,
    handleSignUp,
    handleSignIn,
  } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowPasswordConfirm((prev) => !prev);
  };

  const toggleSignUpOrSignIn = () => {
    setIsSignUp((prev) => !prev);

    setAuthFormErrors({
      name: "",
      email: "",
      password: "",
      phone: "",
      passwordConfirm: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={buttonVariants({
            className: "bg-off-white-600 hover:bg-off-white-700 gap-1.5 px-6 text-xs text-zinc-700",
            size: "md",
          })}
        >
          <div className="w-4 h-4">
            <FaUser className="!w-[12px]" />
          </div>
          Entrar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[325px] max-w-[325px] rounded-md bg-brown-chocolate-100 text-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-center font-montserrat  text-brown-chocolate-400">
            {isSignUp ? "Crie sua Conta" : "Entre na sua Conta"}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="grid gap-4 py-4 text-zinc-600">
          {isSignUp && (
            <div className="flex flex-col">
              <Label htmlFor="name" className="text-left text-1xs">
                Nome
              </Label>

              <Input id="name" className="col-span-3" name="name" value={authForm.name} onChange={handleInputChange} />

              <ErrorForm error={authFormErrors.name} />
            </div>
          )}

          <div className="flex flex-col">
            <Label htmlFor="email" className="text-left text-1xs">
              Email
            </Label>
            <Input id="email" className="col-span-3" name="email" value={authForm.email} onChange={handleInputChange} />

            <ErrorForm error={authFormErrors.email} />
          </div>

          {isSignUp && (
            <div className="flex flex-col">
              <Label htmlFor="phone" className="text-left text-1xs">
                Telefone
              </Label>

              <InputMask
                mask="(99) 99999-9999"
                value={authForm.phone}
                onChange={handleInputChange}
                className="col-span-3"
              >
                {(inputProps) => <Input id="phone" name="phone" {...inputProps} />}
              </InputMask>

              <ErrorForm error={authFormErrors.phone} />
            </div>
          )}

          <div className="flex flex-col relative">
            <Label htmlFor="password" className="text-left text-1xs">
              Senha
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="col-span-3 pr-10"
              name="password"
              value={authForm.password}
              onChange={handleInputChange}
            />

            <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-1/2 text-zinc-500">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            <ErrorForm error={authFormErrors.password} />
          </div>

          {isSignUp && (
            <div className="flex flex-col relative">
              <Label htmlFor="passwordConfirm" className="text-left text-1xs">
                Confirmar Senha
              </Label>
              <Input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                className="col-span-3 pr-10"
                name="passwordConfirm"
                value={authForm.passwordConfirm}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-1/2 text-zinc-500"
              >
                {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>

              <ErrorForm error={authFormErrors.passwordConfirm} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            className={buttonVariants({
              className: "bg-red-700 hover:bg-red-800 text-white gap-1.5 px-6 w-full",
              size: "md",
            })}
            onClick={isSignUp ? handleSignUp : handleSignIn}
            disabled={isDoingAuthProcess}
          >
            {isDoingAuthProcess ? <LuLoader2 className="animate-spin" /> : null}
            {isSignUp
              ? isDoingAuthProcess
                ? "Criando Conta..."
                : "Criar Conta"
              : isDoingAuthProcess
              ? "Entrando..."
              : "Entrar"}
          </Button>
        </DialogFooter>

        <div className="text-center text-xs mt-4 text-zinc-500">
          <span>
            {isSignUp ? "Já tem conta? " : "Não tem conta? "}

            <button onClick={toggleSignUpOrSignIn} className="text-red-700 hover:underline ">
              {isSignUp ? "Entrar" : "Criar"}
            </button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
