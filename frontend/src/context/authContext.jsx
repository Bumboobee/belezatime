import { useCookies } from "react-cookie";
import { IoMdAlert } from "react-icons/io";
import { useToast } from "../hooks/use-toast";
import { createContext, useMemo, useCallback, useState } from "react";

import axios from "axios";
import PropTypes from "prop-types";

const baseUrl =
  import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_API_URL_DEV : import.meta.env.VITE_API_URL_PROD;

const cookieOptions = {
  expires: new Date(Date.now() + import.meta.env.VITE_JW_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  secure: import.meta.env.VITE_ENV === "production",
  path: "/",
  sameSite: import.meta.env.VITE_ENV === "production" ? "none" : "lax",
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [isDoingAuthProcess, setIsDoingAuthProcess] = useState(false);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    passwordConfirm: "",
  });
  const [authFormErrors, setAuthFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    passwordConfirm: "",
  });
  const [cookies, setCookie] = useCookies(["__btime_account_jwt", "__btime_account_user"]);

  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;

    setAuthForm((prev) => ({ ...prev, [name]: value }));

    setAuthFormErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  }, []);

  const handleSignUp = useCallback(async () => {
    setIsDoingAuthProcess(true);

    const hasError = Object.values(authFormErrors).some((error) => error !== "");
    if (hasError) {
      setIsDoingAuthProcess(false);
      return;
    }

    if (authForm.password !== authForm.passwordConfirm) {
      setAuthFormErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirm: "As senhas não são iguais",
      }));

      setIsDoingAuthProcess(false);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/users/singup`, {
        ...authForm,
      });

      if (response.status === 201) {
        const token = response.data.token;
        const user = response.data.data.user;

        setCookie("__btime_account_jwt", token, cookieOptions);
        setCookie("__btime_account_user", user, cookieOptions);

        window.location.replace("/dashboard");
      } else {
        toast({
          title: (
            <span className="flex items-center">
              <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
              Algo deu errado!
            </span>
          ),
          description: "Erro ao criar conta. Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      handleAuthErrors(error);
      setIsDoingAuthProcess(false);
    } finally {
      setIsDoingAuthProcess(false);

      toast({
        title: (
          <span className="flex items-center">
            <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
            Algo deu errado!
          </span>
        ),
        description: "Erro ao criar conta. Tente novamente mais tarde.",
      });
    }
  }, [authForm, authFormErrors]);

  const handleSignIn = useCallback(async () => {
    setIsDoingAuthProcess(true);

    const hasError = Object.values(authFormErrors).some((error) => error !== "");

    if (hasError) {
      setIsDoingAuthProcess(false);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/users/login`, {
        email: authForm.email,
        password: authForm.password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.data.user;

        setCookie("__btime_account_jwt", token, cookieOptions);
        setCookie("__btime_account_user", user, cookieOptions);

        window.location.replace("/dashboard");
      } else {
        toast({
          title: (
            <span className="flex items-center">
              <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
              Algo deu errado!
            </span>
          ),
          description: "Erro ao fazer login. Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      if (error.status === 401) {
        setAuthFormErrors((prevErrors) => ({
          ...prevErrors,
          password: "Email ou senha incorretos",
        }));
      }

      handleAuthErrors(error);
      setIsDoingAuthProcess(false);
    } finally {
      setIsDoingAuthProcess(false);
    }
  }, [authForm, authFormErrors]);

  const handleAuthErrors = (error) => {
    const parts = error.response.data.message.split(": ");
    const trimmedStr = parts.slice(1).join(": ");
    const errorMessages = trimmedStr.split(",").map((s) => s.trim());

    errorMessages.forEach((message) => {
      const [key, value] = message.split(": ");

      if (key && value) {
        //email já cadastrado: belezatime.users index
        if (key === "belezatime.users index") {
          return setAuthFormErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email já cadastrado",
          }));
        } else {
          setAuthFormErrors((prevErrors) => ({
            ...prevErrors,
            [key]: value,
          }));
        }
      }
    });
  };

  const value = useMemo(() => {
    return {
      authForm,
      authFormErrors,
      isDoingAuthProcess,
      setAuthFormErrors,
      handleInputChange,
      handleSignUp,
      handleSignIn,
    };
  }, [authForm, authFormErrors, isDoingAuthProcess, setAuthFormErrors, handleInputChange, handleSignUp, handleSignIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
