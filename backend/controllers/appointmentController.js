const moment = require("moment");
const round = require("./../utils/round");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const { startOfWeek, endOfWeek } = require("date-fns");
const factory = require("./../controllers/handlerFactory");
const Appointment = require("./../models/appointmentModel");

exports.getAppointment = factory.getOne(Appointment);
exports.createAppointment = factory.createOne(Appointment);
exports.deleteAppointment = factory.deleteOne(Appointment);
exports.updateAppointment = factory.updateOne(Appointment);

exports.getAllAppointments = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.user.role !== "admin") {
    filter.user = req.user._id;
  }

  const features = new APIFeatures(Appointment.find(filter), req.query).filter().sort().limitFields().paginate();

  const appointments = await features.query;

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.getWeeklyMetrics = catchAsync(async (req, res, next) => {
  const appointments = await getWeeklyAppointments();
  const confirmedAppointments = getConfirmedAppointments(appointments);

  const estimatedRevenue = calculateEstimatedRevenue(confirmedAppointments);
  const mostPopularServices = getMostPopularServices(confirmedAppointments);
  const mostFrequentClients = getMostFrequentClients(confirmedAppointments);

  res.status(200).json({
    status: "success",
    data: {
      confirmedAppointments: confirmedAppointments.length,
      estimatedRevenue,
      mostPopularServices,
      mostFrequentClients,
    },
  });
});

exports.getYearlyStats = catchAsync(async (req, res, next) => {
  moment.locale("pt-br");
  const today = new Date();
  const twelveMonthsAgo = moment(today).subtract(12, "months").startOf("month").toDate();

  const appointments = await Appointment.find({
    date: { $gte: twelveMonthsAgo },
  });

  const groupedData = {};

  appointments.forEach((appt) => {
    const monthKey = moment(appt.date).startOf("month").format("YYYY-MM");
    const isConfirmed = appt.isConfirmed;

    if (!groupedData[monthKey]) {
      groupedData[monthKey] = {
        confirmedAppointments: 0,
        unconfirmedAppointments: 0,
        monthlyRevenue: 0,
      };
    }

    if (isConfirmed) {
      groupedData[monthKey].confirmedAppointments += 1;
    } else {
      groupedData[monthKey].unconfirmedAppointments += 1;
    }

    const totalRevenue = appt.services.reduce((total, service) => {
      const discountedPrice = service.price * (1 - (service.percentOfDiscount || 0) / 100);
      return total + discountedPrice;
    }, 0);

    groupedData[monthKey].monthlyRevenue += totalRevenue;
  });

  const stats = [];
  let previousMonthConfirmedAppointments = null;

  for (let i = 11; i >= 0; i--) {
    const monthKey = moment(today).subtract(i, "months").startOf("month").format("YYYY-MM");
    const monthData = groupedData[monthKey] || {
      confirmedAppointments: 0,
      unconfirmedAppointments: 0,
      monthlyRevenue: 0,
    };

    const currentMonthConfirmedAppointments = monthData.confirmedAppointments;
    let percentChangeConfirmedApp = null;

    if (previousMonthConfirmedAppointments !== null && previousMonthConfirmedAppointments !== 0) {
      percentChangeConfirmedApp =
        ((currentMonthConfirmedAppointments - previousMonthConfirmedAppointments) /
          previousMonthConfirmedAppointments) *
        100;
    } else if (previousMonthConfirmedAppointments === 0 && currentMonthConfirmedAppointments !== 0) {
      percentChangeConfirmedApp = currentMonthConfirmedAppointments * 100;
    }

    const monthName = moment(today).subtract(i, "months").format("MMMM");
    const year = moment(today).subtract(i, "months").format("YYYY");

    stats.push({
      month: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${year}`,
      confirmedAppointments: currentMonthConfirmedAppointments,
      unconfirmedAppointments: monthData.unconfirmedAppointments,
      monthlyRevenue: round(monthData.monthlyRevenue, 2),
      percentChangeConfirmedApp: percentChangeConfirmedApp !== null ? round(percentChangeConfirmedApp, 2) : 0,
    });

    previousMonthConfirmedAppointments = currentMonthConfirmedAppointments;
  }

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

exports.getServicesSpentByUser = catchAsync(async (req, res, next) => {
  const today = new Date();
  const threeMonthsAgo = moment(today).subtract(3, "months").startOf("month").toDate();

  const appointments = await Appointment.find({
    user: req.user._id,
    date: { $gte: threeMonthsAgo },
    isConfirmed: true,
  });

  const serviceStats = {};

  appointments.forEach((appt) => {
    appt.services.forEach((service) => {
      const discountedPrice = service.price * (1 - (service.percentOfDiscount || 0) / 100);

      if (!serviceStats[service.service]) {
        serviceStats[service.service] = { total: 0, count: 0 };
      }

      serviceStats[service.service].total += discountedPrice;
      serviceStats[service.service].count += 1;
    });
  });

  const services = Object.entries(serviceStats).map(([service, { total, count }]) => {
    const percentage = round(
      (total /
        appointments.reduce((acc, appt) => {
          return (
            acc +
            appt.services.reduce(
              (sum, service) => sum + service.price * (1 - (service.percentOfDiscount || 0) / 100),
              0
            )
          );
        }, 0)) *
        100,
      2
    );

    return {
      service,
      total: round(total, 2),
      count,
      percentage,
    };
  });

  res.status(200).json({
    status: "success",
    data: services,
  });
});

const getWeeklyAppointments = async () => {
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Semana inicia no domingo
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 }); // Semana termina no sábado

  return await Appointment.find({
    date: { $gte: weekStart, $lte: weekEnd },
  });
};

const getConfirmedAppointments = (appointments) => {
  return appointments.filter((appt) => appt.isConfirmed);
};

const calculateEstimatedRevenue = (appointments) => {
  return appointments.reduce((total, appt) => {
    return (
      total +
      appt.services.reduce((serviceTotal, service) => {
        const discountedPrice = service.price * (1 - (service.percentOfDiscount || 0) / 100);
        return round(serviceTotal + discountedPrice);
      }, 0)
    );
  }, 0);
};

const getMostPopularServices = (appointments) => {
  const serviceCount = appointments.reduce((acc, appt) => {
    appt.services.forEach((service) => {
      if (!acc[service.service]) {
        acc[service.service] = { count: 0, total: 0 };
      }
      acc[service.service].count += 1;
      const discountMultiplier = 1 - (service.percentOfDiscount || 0) / 100;
      acc[service.service].total += service.price * discountMultiplier;
    });
    return acc;
  }, {});

  const totalServices = Object.values(serviceCount).reduce((sum, { count }) => sum + count, 0);

  return Object.entries(serviceCount)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([service, { count, total }]) => ({
      service,
      count,
      total: round(total),
      percentage: round((count / totalServices) * 100),
    }));
};

const getMostFrequentClients = (appointments, topN = 2) => {
  const clientSpending = appointments.reduce((acc, appt) => {
    const totalSpent = appt.services.reduce((serviceTotal, service) => {
      const discountedPrice = service.price * (1 - (service.percentOfDiscount || 0) / 100);
      return serviceTotal + discountedPrice;
    }, 0);

    acc[appt.user._id] = acc[appt.user._id] || { name: appt.user.name, totalSpent: 0, appointments: 0 };
    acc[appt.user._id].totalSpent += totalSpent;
    acc[appt.user._id].appointments += 1;

    return acc;
  }, {});

  return Object.values(clientSpending)
    .sort((a, b) => b.appointments - a.appointments || b.totalSpent - a.totalSpent)
    .slice(0, topN)
    .map((client) => ({
      ...client,
      totalSpent: round(client.totalSpent),
    }));
};
