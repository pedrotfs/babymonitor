const express = require("express")
const jwt = require("jsonwebtoken")
const path = require("path")
const hbs = require("hbs")

require("./db/mongoose")

const userRouter = require("./routers/user")
const cycleRouter = require("./routers/cycle")
const webRouter = require("./routers/webRouter")

const app = express()
const maintenance = process.env.MAINTENANCE === "true" || false

app.use((req, res, next) => {
    if(maintenance) {
        res.status(503).send("WE ARE UNDER MAINTENANCE")
    } else {
        next()
    }
})

app.use(express.json())
app.use(userRouter)
app.use(cycleRouter)

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "../templates/views"))
hbs.registerPartials(path.join(__dirname, "../templates/partials"))
hbs.registerHelper('isdefined', function (value) {
    return value !== undefined;
  });
app.use(express.static(path.join(__dirname, "../public")))
app.use(webRouter)

module.exports = app