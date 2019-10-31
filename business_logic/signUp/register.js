const bcrypt = require('bcrypt-promise')
const saltRounds = 10 //REMEMBER TO USE THIS WHEN USERS LOG IN TO THE SYSTEM
const sqlite = require('sqlite-async')

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'

const User = require('../../modules/user')

module.exports = class register {

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


    async register(user, pass, address, postcode, ward, email, staff) {
		try {
            pass = await bcrypt.hash(pass, saltRounds)
            const userReg = await new User(dbName)
            return userReg.register(user, pass, address, postcode, ward, email, staff)
		} catch(err) {
			throw err
		}
	}

}