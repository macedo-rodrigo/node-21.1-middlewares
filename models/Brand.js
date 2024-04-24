const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedCountries = ["SPAIN", "ITALY", "USA", "GERMANY", "JAPAN", "FRANCE"];
const currentYear = new Date().getFullYear();

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Hijo mío... dame algo más de detalle, al menos 3 letras para el nombre"],
      maxLength: 20,
      trim: true,
    },
    creationYear: {
      type: Number,
      required: false,
      min: [1803, "No mientas porque la marca de coches más antigua es Peugeot y se creó en 1803"],
      max: currentYear,
    },
    country: {
      type: String,
      required: false,
      enum: allowedCountries,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = { Brand };
