const bcrypt = require('bcrypt-promise')
const saltRounds = 10 //REMEMBER TO USE THIS WHEN USERS LOG IN TO THE SYSTEM
const sqlite = require('sqlite-async')

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'

const User = require('../../modules/user')

module.exports = class register {

    constructor() {
        this.username = ""
        this.email = ""
    }


    async register(user, pass, address, postcode, ward, email, staff) {
		try {
            pass = await bcrypt.hash(pass, saltRounds)
            const userReg = await new User()
            return userReg.register(user, pass, address, postcode, ward, email, staff)
		} catch(err) {
			throw err
		}
	}

}