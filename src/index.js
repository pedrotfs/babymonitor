const app = require("./app")

const port = process.env.PORT

app.listen(port, () => {
    console.log("starting server on port " + port)
    console.log("connection url:" + process.env.CONNECTION_URL)
})