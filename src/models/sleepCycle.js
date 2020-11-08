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

sleepCycleScheme.virtual("formatedTime").get(function() {
    
    const hours = this.initiated.getHours() - 3
    if(hours < 0) {
        hours = hours + 24
    }
    const minutes = this.initiated.getMinutes()
    const seconds = this.initiated.getSeconds()
    let result = ""
    if(hours < 10) {
        result = result + '0'
    }
    result = result + hours + ":"
    if(minutes < 10) {
        result = result + '0'
    }
    result = result + minutes + ":"
    if(seconds < 10) {
        result = result + '0'
    }    
    result = result + seconds

    return result
})

sleepCycleScheme.virtual("formatedDate").get(function() {
    const day = this.initiated.getDate()
    const month = this.initiated.getMonth()
    const year = this.initiated.getFullYear()
    let result = ""
    result = result + day + "/" + month + "/" + year
    return result
})

sleepCycleScheme.virtual("screenNumber").get(function() {
    return this.number / 2
})

const SleepCycle = mongoose.model("SleepCycle", sleepCycleScheme)

module.exports = SleepCycle