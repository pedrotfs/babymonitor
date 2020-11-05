const mongoose = require("mongoose")

const sleepCycleScheme = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Cycle" //referência outro model, exatamente como foi exportado
    },
    initiated: {
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

sleepCycleScheme.virtual("formatedTimeStamp").get(function() {
    const day = this.initiated.getDate()
    const month = this.initiated.getMonth()
    const year = this.initiated.getFullYear()

    const hours = this.initiated.getHours()
    const minutes = this.initiated.getMinutes()
    const seconds = this.initiated.getSeconds()

    return hours + ":" + minutes + ":" + seconds + ", " + day + "/" + month + "/" + year
})

const SleepCycle = mongoose.model("SleepCycle", sleepCycleScheme)

module.exports = SleepCycle