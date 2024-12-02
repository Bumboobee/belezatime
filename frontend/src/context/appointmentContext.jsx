/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { FaCheck } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { IoMdAlert } from "react-icons/io";
import { useToast } from "../hooks/use-toast";
import { useQuery, useQueryClient } from "react-query";
import { ServiceContext } from "@/context/serviceContext";
import { formatToDateOnly, getCurrentDate } from "@/utils/formatDate";
import { createContext, useMemo, useCallback, useState, useEffect } from "react";

import axios from "axios";
import PropTypes from "prop-types";

const baseUrl =
  import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_API_URL_DEV : import.meta.env.VITE_API_URL_PROD;

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [servicesUserPick, setServicesUserPick] = useState([]);
  const [isSavingAppointment, setIsSavingAppointment] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    user: "",
    service: "",
    date: "",
    hour: "",
    notes: "",
    isConfirmed: "",
  });
  const [appointmentFormErrors, setAppointmentFormErrors] = useState({
    user: "",
    service: "",
    date: "",
    hour: "",
    notes: "",
    isConfirmed: "",
  });
  const [cookies] = useCookies(["__btime_account_jwt", "__btime_account_user"]);
  const { servicesData } = useContext(ServiceContext);

  const fetchAppointments = async () => {
    if (!cookies.__btime_account_jwt) {
      return [];
    }

    const response = await axios.get(`${baseUrl}/appointments`, {
      headers: {
        Authorization: `Bearer ${cookies.__btime_account_jwt}`,
      },
    });

    return response.data.data.appointments;
  };

  const {
    data: appointmentsData,
    isFetching: isFetchingAppointments,
    error: errorAppointments,
  } = useQuery("appointments", fetchAppointments, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setAppointmentForm((prev) => ({
      ...prev,
      date: getCurrentDate(),
    }));
  }, []);

  const handleAddService = useCallback(() => {
    const selectedService = servicesData.find((service) => service._id === appointmentForm.service);

    setServicesUserPick((prev) => {
      const isAlreadyAdded = prev.some((service) => service._id === selectedService._id);
      if (isAlreadyAdded) {
        toast({
          description: (
            <span className="flex items-center">
              <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
              {`O serviço "${selectedService.service}" já foi adicionado!`}
            </span>
          ),
        });

        return prev;
      }

      const filteredService = {
        _id: selectedService._id,
        service: selectedService.service,
        type: selectedService.type,
        price: selectedService.price,
        duration: selectedService.duration,
        percentOfDiscount: selectedService.percentOfDiscount,
      };

      return [...prev, filteredService];
    });
  }, [servicesData, appointmentForm.service]);

  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;

    setAppointmentForm((prev) => ({ ...prev, [name]: value }));

    setAppointmentFormErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  }, []);

  const handlePostOrPatchAppointment = useCallback(async () => {
    setIsSavingAppointment(true);

    const hasError = Object.values(appointmentFormErrors).some((error) => error !== "");
    if (hasError) {
      setIsSavingAppointment(false);
      return;
    }

    if (appointmentForm.service === "") {
      setAppointmentFormErrors((prevErrors) => ({
        ...prevErrors,
        service: "Informe o serviço",
      }));

      setIsSavingAppointment(false);
      return;
    }

    try {
      const appointmentData = {
        ...appointmentForm,
        user: cookies.__btime_account_user._id,
        isConfirmed: false,
        services: servicesUserPick,
      };

      let response;

      if (appointmentForm.id) {
        response = await axios.patch(`${baseUrl}/appointments/${appointmentForm.id}`, appointmentData, {
          headers: {
            Authorization: `Bearer ${cookies.__btime_account_jwt}`,
          },
        });
      } else {
        response = await axios.post(`${baseUrl}/appointments`, appointmentData, {
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
              {`Horário ${appointmentForm.id ? "atualizado" : "agendado"} com sucesso!`}
            </span>
          ),
        });

        setAppointmentForm({
          service: "",
          date: "",
          hour: "",
          notes: "",
        });

        setServicesUserPick([]);
        setIsAppointmentDialogOpen(false);
        queryClient.invalidateQueries("appointments");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        handleAppointmentErrors(error);
      } else {
        toast({
          title: (
            <span className="flex items-center">
              <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
              Algo deu errado!
            </span>
          ),
          description: "Não foi possível agendar seu horário.",
        });

        handleAppointmentErrors(error);
      }
    } finally {
      setIsSavingAppointment(false);
    }
  }, [appointmentForm, appointmentFormErrors, cookies.__btime_account_jwt, toast]);

  const handleCornfimOrCancelAppointment = useCallback(
    async (appointmentId, isConfirmed) => {
      try {
        const response = await axios.patch(
          `${baseUrl}/appointments/${appointmentId}`,
          { isConfirmed },
          {
            headers: {
              Authorization: `Bearer ${cookies.__btime_account_jwt}`,
            },
          }
        );

        if (response.status === 200) {
          toast({
            description: (
              <span className="flex items-center">
                <FaCheck className="mr-2 w-5 h-5 text-green-400" />
                {`Horário ${isConfirmed ? "confirmado" : "cancelado"} com sucesso!`}
              </span>
            ),
          });

          queryClient.invalidateQueries("appointments");
        }
      } catch (error) {
        console.log(error);

        toast({
          title: (
            <span className="flex items-center">
              <IoMdAlert className="mr-2 w-5 h-5 text-red-400" />
              Algo deu errado!
            </span>
          ),
          description: `Não foi possível ${isConfirmed ? "confirmar" : "cancelar"} o horário.`,
        });
      }
    },
    [cookies.__btime_account_jwt, toast, queryClient]
  );

  const handleAppointmentErrors = (error) => {
    const parts = error.response.data.message.split(": ");
    const trimmedStr = parts.slice(1).join(": ");
    const errorMessages = trimmedStr.split(",").map((s) => s.trim());

    errorMessages.forEach((message) => {
      const [key, value] = message.split(": ");

      if (key && value) {
        setAppointmentFormErrors((prevErrors) => ({
          ...prevErrors,
          [key]: value,
        }));
      }
    });
  };

  const handleAppointmentDialogClose = useCallback(() => {
    setIsAppointmentDialogOpen(false);
    setAppointmentForm({
      user: "",
      service: "",
      date: "",
      hour: "",
      notes: "",
      isConfirmed: "",
    });

    setAppointmentFormErrors({
      user: "",
      service: "",
      date: "",
      hour: "",
      notes: "",
      isConfirmed: "",
    });

    setServicesUserPick([]);
  }, []);

  const handleOpenEditAppointmentDialog = useCallback(
    (appointmentId) => {
      const appointment = appointmentsData.find((appointment) => appointment._id === appointmentId);

      console.log(appointment);

      setAppointmentForm((prev) => ({
        ...prev,
        id: appointment._id,
        user: appointment.user._id,
        service: appointment.services[0]._id,
        date: formatToDateOnly(appointment.date),
        hour: appointment.hour,
        notes: appointment.notes,
        isConfirmed: appointment.isConfirmed,
      }));

      setServicesUserPick(appointment.services);
      setIsAppointmentDialogOpen(true);
    },
    [appointmentsData]
  );

  const value = useMemo(() => {
    return {
      appointmentForm,
      appointmentFormErrors,
      isSavingAppointment,
      isAppointmentDialogOpen,
      appointmentsData,
      isFetchingAppointments,
      errorAppointments,
      servicesUserPick,
      setIsAppointmentDialogOpen,
      setAppointmentFormErrors,
      handleInputChange,
      handlePostOrPatchAppointment,
      handleAppointmentErrors,
      handleAddService,
      handleAppointmentDialogClose,
      handleCornfimOrCancelAppointment,
      handleOpenEditAppointmentDialog,
    };
  }, [
    appointmentForm,
    appointmentFormErrors,
    isSavingAppointment,
    isAppointmentDialogOpen,
    appointmentsData,
    isFetchingAppointments,
    errorAppointments,
    servicesUserPick,
    setIsAppointmentDialogOpen,
    setAppointmentFormErrors,
    handleInputChange,
    handlePostOrPatchAppointment,
    handleAppointmentErrors,
    handleAddService,
    handleAppointmentDialogClose,
    handleCornfimOrCancelAppointment,
    handleOpenEditAppointmentDialog,
  ]);

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

AppointmentProvider.propTypes = {
  children: PropTypes.node,
};

export default AppointmentProvider;
