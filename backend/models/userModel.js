const crypto = require("crypto");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Informe seu nome"],
    minLength: [3, "O nome deve ter no mínimo 3 caracteres"],
    maxLength: [250, "O nome deve ter no máximo 250 caracteres"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowerCase: true,
    required: [true, "Informe seu e-mail"],
    validate: [isEmail, "Informe um e-mail válido"],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Informe seu número de telefone"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    select: false,
    required: [true, "Informe uma senha"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "Confirme a senha"],
    validate: {
      // Isso só funciona no método SAVE!
      validator: function (el) {
        return el === this.password;
      },
      message: "As senhas não são iguais",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
