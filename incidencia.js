const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

const incidenciaSchema = new mongoose.Schema({
  idint: {
    type: Number,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
});

incidenciaSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        "idint_incidencia",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.idint = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Incidencia = mongoose.model("Incidencia", incidenciaSchema);
module.exports = Incidencia;
