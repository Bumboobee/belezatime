const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Por favor, informe o usuário para o agendamento"],
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Por favor, informe o serviço para o agendamento"],
    },
  ],
  date: {
    type: Date,
    required: [true, "Por favor, informe a data do agendamento"],
  },
  hour: {
    type: String,
    required: [true, "Por favor, informe o horário do agendamento"],
    validate: {
      validator: function (value) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Valida formato HH:mm
      },
      message: "Por favor, informe um horário válido no formato HH:mm",
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
