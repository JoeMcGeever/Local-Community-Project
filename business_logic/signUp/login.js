const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')

//ADD THIS DATABASE IN AFTER
const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'

const saltRounds = 10

const User = require('../../modules/user')

module.exports = class login {

    constructor(dbName = ':memory:') {
        this.username = ""
        this.email = ""
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, address TEXT, postcode TEXT, ward INTEGER, email TEXT, staff INTEGER);'
			await this.db.run(sql)
			return this
		})()
    }

    async login(user, pass) {

        try {

            const loginUser = await new User(dbName)

            return loginUser.login(user, pass)
        } catch(err) {
            throw err
        }
    }

}