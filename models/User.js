const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true, // Este dato no se puede repetir
      validate: {
        validator: validator.isEmail,
        message: "This e-mail is not valid"
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "The password must be at least 8 characters long."],
      select: false, // this field will no longer appear at get requests
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        number: {
          type: Number,
          required: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
