const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')

//ADD THIS DATABASE IN AFTER
const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'

const saltRounds = 10

const User = require('../../modules/user')

module.exports = class login {

    constructor() {
        this.username = ""
        this.email = ""
    }

    async login(user, pass) {

        pass = await bcrypt.hash(pass, saltRounds)

        try {
            //const loginUser = await new User(dbName)
            const loginUser = await new User()
            return loginUser.login(user, pass)
        } catch(err) {
            throw err
        }
    }

}