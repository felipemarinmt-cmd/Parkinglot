const mongoose = require('mongoose'); // Import mongoose

// Schema for counter functionality
const counterSchema = new mongoose.Schema({ // Schema for counter
    _id: String,
    seq: Number
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema); 

// Main schema for AccesoSalida
const accesoSalidaSchema = new mongoose.Schema({ 
    idint: Number, //
    cod_acceso: {
        type: Number,
        unique: true
    },
    cod_salida: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    }
});

// Pre-save hook to auto-increment idint
accesoSalidaSchema.pre('save', async function(next) { 
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'idint_acceso_salida',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.idint = counter.seq;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const AccesoSalida = mongoose.models.AccesoSalida || mongoose.model('AccesoSalida', accesoSalidaSchema);

module.exports = AccesoSalida;