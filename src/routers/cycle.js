const express = require("express")
const router = new express.Router()
const auth = require("./../middleware/auth")

const Cycle = require("./../models/cycle")
const SleepCycle = require("./../models/sleepCycle")

router.get("/sleepcycle/add", async (req, res) => {
    const ts = Date.now()
    console.log("access adding cycle for " + req.query.id + "with current timestamp" + ts)
    const latestCycle = await Cycle.find({owner: req.query.id}).sort({_id: -1}).limit(1)
    console.log("current cycle:" + latestCycle[0]._id)
    
    if(!latestCycle.length) {
        console.log("initiating FIRST cycle")
        const newCycle = new Cycle()
        newCycle.owner = req.query.id
        newCycle.number = 0
        newCycle.complete = false        
        await newCycle.save()
        const sleepCycle = new SleepCycle()
        sleepCycle.number = 0
        sleepCycle.owner = newCycle._id
        sleepCycle.initiated = ts
        sleepCycle.sleep = true
        await sleepCycle.save()
        return
    }
    if(latestCycle[0].complete) {
        console.log("initiating NEW cycle")
        const newCycle = new Cycle()
        newCycle.owner = req.query.id
        newCycle.number = (latestCycle[0].number + 1)
        newCycle.complete = false
        await newCycle.save()
        const sleepCycle = new SleepCycle()
        sleepCycle.number = 0
        sleepCycle.owner = newCycle._id
        sleepCycle.initiated = ts
        sleepCycle.sleep = true
        await sleepCycle.save()
        return
    }
    else {
        console.log("adding to current sleep cycle")
        const latestSleepCycle = await SleepCycle.find({owner: latestCycle[0]._id}).sort({_id: -1}).limit(1)
        console.log("current sleep cycle:" + latestSleepCycle[0]._id)
        const sleepCycle = new SleepCycle()        
        sleepCycle.owner = latestCycle[0]._id
        sleepCycle.initiated = ts
        if(!latestSleepCycle.length) {
            sleepCycle.number = 0
            sleepCycle.sleep = true
        } else {
            sleepCycle.number = latestSleepCycle[0].number + 1
            sleepCycle.sleep = !latestSleepCycle[0].sleep
        }
        await sleepCycle.save()
    } 
})

router.get("/sleepcycle/end", async (req, res) => {
    const ts = Date.now()
    console.log("access ending cycle for " + req.query.id + " with current timestamp " + ts)
    const latestCycle = await Cycle.find({owner: req.query.id}).sort({_id: -1}).limit(1)
    if(!latestCycle.length) {
        return
    }
    latestCycle[0].complete = true
    
    const latestSleepCycle = await SleepCycle.find({owner: latestCycle[0]._id}).sort({_id: -1}).limit(1)
    if(latestSleepCycle.length) {
        console.log("latest sleep cycle: number " + latestSleepCycle[0].number + " sleep " + latestSleepCycle[0].sleep)
        if(latestSleepCycle[0].sleep === true) {
            console.log("sleep cycle not closed. adding last cycle to close.")
            const sleepCycle = new SleepCycle()
            sleepCycle.number = latestSleepCycle[0].number + 1
            sleepCycle.owner = latestCycle[0]._id
            sleepCycle.initiated = ts
            sleepCycle.sleep = false
            await sleepCycle.save()
        }
    }
    await latestCycle[0].save()
})

module.exports = router