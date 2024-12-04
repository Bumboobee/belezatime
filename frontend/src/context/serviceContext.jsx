/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */

import { FaCheck } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { IoMdAlert } from "react-icons/io";
import { useToast } from "../hooks/use-toast";
import { useQuery, useQueryClient } from "react-query";
import { createContext, useMemo, useCallback, useState } from "react";

import axios from "axios";
import PropTypes from "prop-types";

const types = ["Cabelo", "Barba", "Depilação", "Unhas", "Maquiagem", "Corte", "Outros"];
const baseUrl =
  import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_API_URL_DEV : import.meta.env.VITE_API_URL_PROD;

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPromotionEnabled, setIsPromotionEnabled] = useState(false);
  const [isSavingService, setIsSavingService] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    service: "",
    description: "",
    type: "",
    price: "",
    duration: "",
    percentOfDiscount: "",
    imageURL: "",
  });
  const [serviceFormErrors, setServiceFormErrors] = useState({
    service: "",
    description: "",
    type: "",
    price: "",
    duration: "",
    percentOfDiscount: "",
    imageURL: "",
  });
  const [cookies] = useCookies(["__btime_account_jwt", "__btime_account_user"]);

  const fetchServices = async () => {
    const response = await axios.get(`${baseUrl}/services`);

    return response.data.data.services;
  };

  const {
    data: servicesData,
    isFetching: isFetchingServices,
    error: errorServices,
  } = useQuery("services", fetchServices, {
    refetchOnWindowFocus: false,
  });

  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;

    setServiceForm((prev) => ({ ...prev, [name]: value }));

    setServiceFormErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  }, []);

  const handleEditClick = useCallback((service) => {
    setServiceForm(service);

    if (service.percentOfDiscount) {
      setIsPromotionEnabled(true);
    } else {
      setIsPromotionEnabled(false);
    }
  }, []);

  const handlePostOrPatchService = useCallback(async () => {
    setIsSavingService(true);

    const hasError = Object.values(serviceFormErrors).some((error) => error !== "");
    if (hasError) {
      setIsSavingService(false);
      return;
    }

    try {
      let response;

      if (serviceForm._id) {
        response = await axios.patch(`${baseUrl}/services/${serviceForm._id}`, serviceForm, {
          headers: {
            Authorization: `Bearer ${cookies.__btime_account_jwt}`,
          },
        });
      } else {
        response = await axios.post(`${baseUrl}/services`, serviceForm, {
          headers: {
            Authorization: `Bearer ${cookies.__btime_account_jwt}`,
          },
        });
      }

      if (response.status === 201 || response.status === 200) {
        toast({
          description: (
            <span className="flex items-center">
              <FaCheck className="mr-2 w-5 h-5 text-green-400" />
              {`Serviço ${serviceForm._id ? "atualizado" : "cadastrado"} com sucesso!`}
            </span>
          ),
        });

        setServiceForm({
          service: "",
          description: "",
          type: "",
          price: "",
          duration: "",
          percentOfDiscount: "",
          imageURL: "",
        });
        queryClient.invalidateQueries("services");
      }
    } catch (error) {
      if (error.response.status === 400) {
        handleServiceErrors(error);
      } else {
        toast({
          title: (
            <span className="flex items-center">
              <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
              Algo deu errado!
            </span>
          ),
          description: "Não foi possível cadastrar o serviço.",
        });

        handleServiceErrors(error);
      }
    } finally {
      setIsSavingService(false);
    }
  }, [serviceForm, cookies.__btime_account_jwt, toast]);

  const handleDeleteService = useCallback(
    async (serviceId) => {
      try {
        const response = await axios.delete(`${baseUrl}/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${cookies.__btime_account_jwt}`,
          },
        });

        if (response.status === 204) {
          toast({
            description: (
              <span className="flex items-center">
                <FaCheck className="mr-2 w-5 h-5 text-green-400" />
                Serviço deletado com sucesso!
              </span>
            ),
          });

          queryClient.invalidateQueries("services");
        }
      } catch (error) {
        toast({
          title: (
            <span className="flex items-center">
              <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
              Algo deu errado!
            </span>
          ),
          description: "Não foi possível deletar o serviço.",
        });
      }
    },
    [cookies.__btime_account_jwt, toast, queryClient]
  );

  const handleServiceErrors = (error) => {
    const parts = error.response.data.message.split(": ");
    const trimmedStr = parts.slice(1).join(": ");
    const errorMessages = trimmedStr.split(",").map((s) => s.trim());

    errorMessages.forEach((message) => {
      const [key, value] = message.split(": ");

      if (key && value) {
        setServiceFormErrors((prevErrors) => ({
          ...prevErrors,
          [key]: value,
        }));
      }
    });
  };

  const handleServiceDialogClose = useCallback(() => {
    setIsServiceDialogOpen(false);
    setServiceForm({
      service: "",
      description: "",
      type: "",
      price: "",
      duration: "",
      percentOfDiscount: "",
      imageURL: "",
    });
  }, []);

  const value = useMemo(() => {
    return {
      types,
      serviceForm,
      serviceFormErrors,
      isSavingService,
      isServiceDialogOpen,
      servicesData,
      isFetchingServices,
      errorServices,
      isPromotionEnabled,
      setIsPromotionEnabled,
      setIsServiceDialogOpen,
      setServiceFormErrors,
      handleInputChange,
      handlePostOrPatchService,
      handleEditClick,
      handleServiceDialogClose,
      handleDeleteService,
    };
  }, [
    serviceForm,
    serviceFormErrors,
    isSavingService,
    isServiceDialogOpen,
    servicesData,
    isFetchingServices,
    errorServices,
    isPromotionEnabled,
    setIsPromotionEnabled,
    setIsServiceDialogOpen,
    setServiceFormErrors,
    handleInputChange,
    handlePostOrPatchService,
    handleEditClick,
    handleServiceDialogClose,
    handleDeleteService,
  ]);

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

ServiceProvider.propTypes = {
  children: PropTypes.node,
};

export default ServiceProvider;
