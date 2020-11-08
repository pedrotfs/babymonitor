const express = require("express")
const session = require("express-session")

const auth = require("./../middleware/webauth")
const User = require("./../models/user")
const Cycle = require("./../models/cycle")
const SleepCycle = require("./../models/sleepCycle")

const bodyParser = require('body-parser')
const { sendWelcome } = require("../email/account")

const router = new express.Router()
router.use(bodyParser.urlencoded({extended:false}))

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    expires: new Date(Date.now() + (30 * 86400 * 1000)),
    maxAge:30 * 86400 * 1000
}))

router.get("", auth, async (req, res) => {
    console.log("access root")
    console.log(req.session.user.email)
    const dto = await populateCycles(req.session.user._id)
    if(!req.session || ! req.session.user) {
        res.redirect("/login")
    }
    res.render("index", {
        user: req.session.user.email,
        id: req.session.user._id,
        cycles: dto,
        first: dto[0]
    })
})

router.get("/web/login", (req, res) => { 
    res.render("login", {})
})

router.get("/web/register", (req, res) => { 
    res.render("register", {})
})

router.post("/web/login",async (req, res) => {
    try {    
        console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        req.session.user = user
        res.redirect("/")
    } catch(e) {
        res.render("login", {
            message: "Error logging on"
        })
    }    
})

router.post("/web/register", async (req, res) => {
    console.log("registering user " + req.body.email)
    const user = new User()
    user.email = req.body.email;
    user.password = req.body.password
    try {
        await user.save()
        // const token = await user.generateAuthToken()
        //sendWelcome(user.email)
        req.session.user = user
    } catch(e) {
        //
    }
    res.redirect("/")
})

async function populateCycles(id) {
    const dto = []
    const cycles = await Cycle.find({owner: id}).sort({_id: -1}).limit(21)
    for(const cycle of cycles) {
        dto.push(cycle)
        console.log(cycle._id + ":" + cycle.complete)
        const sleepCycles = await SleepCycle.find({owner: cycle._id}).sort({_id: 1})
        for(const sleepcycle of sleepCycles) {
            if(!cycle.first) {
                cycle.first = sleepcycle
            }
            dto.push(sleepcycle)            
            console.log(sleepcycle._id + ":" + sleepcycle.sleep)
        }
    }
    return dto
}

module.exports = router