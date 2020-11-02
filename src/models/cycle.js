const mongoose = require("mongoose")
const SleepCycle = require("./sleepCycle")

const cycleScheme = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User" //referência outro model, exatamente como foi exportado
    }
},  {
    timestamps: true //ativa timestamps para criação e atualização
})

userScheme.virtual("sleepCycles", {
    ref:"SleepCycle",
    localField: "_id",
    foreignField: "owner"
})

userScheme.pre("remove", async function (next) {
    const cycle = this
    await SleepCycle.deleteMany({owner: cycle._id})
    next()
})

const Cycle = mongoose.model("Cycle", cycleScheme)

module.exports = Cycle