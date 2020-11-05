const User = require("./../models/user")
const auth = async (req, res, next) => {
    try {        
        const id = req.session.user._id        
        console.log("checking session for " + id)
        const user = await User.findOne({_id: id})
        if(!user) {
            console.log("error auth")
            throw new Error()
        }
        req.session.user = user
        console.log("auth confirmed, running next")
        return next()
    } catch(e) {
        res.render("login", {
            title: "BabyMon - Auth Error",
            name: "Pedro Silva"
        })
    }
}

module.exports = auth