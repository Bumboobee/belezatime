const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  service: {
    type: String,
    required: [true, "Informe o nome do serviço"],
    trim: true,
    minLength: [3, "O nome do serviço deve ter no mínimo 3 caracteres"],
    maxLength: [100, "O nome do serviço deve ter no máximo 100 caracteres"],
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Informe o tipo do serviço"],
    enum: {
      values: ["Cabelo", "Barba", "Depilação", "Unhas", "Maquiagem", "Corte", "Outros"],
      message: "O tipo do serviço deve ser Cabelo, Barba, Depilação, Unhas, Maquiagem, Corte ou Outros",
    },
  },
  price: {
    type: Number,
    required: [true, "Informe o preço do serviço"],
    min: [0, "O preço deve ser maior ou igual a 0"],
  },
  duration: {
    type: Number,
    required: [true, "Informe a duração do serviço em minutos"],
    min: [1, "A duração deve ser de pelo menos 1 minuto"],
  },
  percentOfDiscount: {
    type: Number,
    default: null,
    validate: {
      validator: function (value) {
        return value === null || (value >= 0 && value <= 100);
      },
      message: "O desconto deve estar entre 0% e 100%",
    },
  },
  imageURL: {
    type: String,
    required: [true, "Informe a URL da imagem do serviço"],
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
