const mongoose = require("mongoose")

const sleepCycleScheme = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Cycle" //referência outro model, exatamente como foi exportado
    },
    init: {
        type: Date,
        default: Date.now
    },
    sleep: {
        type: Boolean,
        default: false
    }
    
},  {
    timestamps: true //ativa timestamps para criação e atualização
})

const SleepCycle = mongoose.model("SleepCycle", sleepCycleScheme)

module.exports = SleepCycle