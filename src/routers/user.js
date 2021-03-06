const express = require("express")

const auth = require("./../middleware/auth")
const User = require("./../models/user")
const { sendWelcome } = require("../email/account")
const { sendGoodbye } = require("../email/account")

const router = new express.Router()

router.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcome(user.email, user.name) //assincrono, não precisa ser esperado
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post("/users/login", async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log(user)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(500).send()
    }
})

router.post("/users/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.token)
    } catch(e) {
        res.status(500).send()
    }
})

router.post("/users/logout/all", auth, async(req, res) => {
    try {
        const revoked = req.user.tokens
        req.user.tokens = []
        await req.user.save()
        res.send(revoked)
    } catch(e) {
        res.status(500).send()
    }
})

router.get("/users", auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send()
    }
    
})

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})

router.get("/users/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        const user = req.user
        updates.forEach((update) => { user[update] = req.body[update] })
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send()
    }
})

router.patch("/users/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        const user = await User.findById(req.params.id) //new retorna o usuário pós alteração
        updates.forEach((update) => { user[update] = req.body[update] })
        await user.save()
        if(!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete("/users/me", auth, async(req, res) => {
    console.log("1")
    try {
        console.log(req.user)
        await req.user.remove()
        sendGoodbye(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete("/users/me", auth, async(req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id)
        sendGoodbye(user.email, user.name)
        res.send(user)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete("/users/:id", auth, async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router