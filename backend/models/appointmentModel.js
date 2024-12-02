const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Informe o usuário para o agendamento"],
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Informe o serviço para o agendamento"],
    },
  ],
  date: {
    type: Date,
    required: [true, "Informe a data do agendamento"],
  },
  hour: {
    type: String,
    required: [true, "Informe o horário do agendamento"],
    validate: {
      validator: function (value) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Valida formato HH:mm
      },
      message: "Informe um horário válido no formato HH:mm",
    },
  },
  notes: {
    type: String,
    trim: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
});

appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone",
  }).populate({
    path: "services",
    select: "service duration price percentOfDiscount",
  });

  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
