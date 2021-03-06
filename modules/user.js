'use strict'

const bcrypt = require('bcrypt-promise')
//const fs = require('fs-extra')
//const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds= 10


module.exports = class User {

	constructor(dbName = ':memory:') {
		this.userEmail = "" //to be saved + set in this class
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, address TEXT, postcode TEXT, ward INTEGER, email TEXT, staff INTEGER);'
			await this.db.run(sql)
			return this
		})()
	}

	
	async register(user, pass, address, postcode, ward, email, staffPass) {
		try {
			//staff is either 1 or 0: 0 is normal user, 1 is a staff
			let staff = 0
			if(staffPass == "Geheim") { //the password for becoming a staff
				staff = 1
			}
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
			if(address.length === 0) throw new Error('missing address')
			if(postcode.length === 0) throw new Error('missing postcode')
			if(ward == null) throw new Error('missing ward')
			if(email.length === 0) throw new Error('missing email')
			if(isNaN(ward)) throw new Error ('your ward should be a number')
			//email cannot be duplicate
			if((email.match(/@/g)||[]).length!= 1) throw new Error('please enter a valid email')
			//Checks to see if postcode is correct format
			//first character needs to be a number, last two need to be letters
			if(postcode.length!=3 || "NaN"==parseInt(postcode[0], 10) || postcode[1].toUpperCase()==postcode[1].toLowerCase() || postcode[2].toUpperCase()==postcode[2].toLowerCase()){
				throw new Error('please enter the last 3 characters of your postcode (e.g 1ER)')
			}
			//Checks to see if username is duplicate
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) {
				throw new Error(`username "${user}" already in use`)
			}
			//Checks to see if email is duplicate
			sql = `SELECT COUNT(id) as records FROM users WHERE email="${email}";`
			const data2 = await this.db.get(sql)

			if(data2.records !== 0) throw new Error(`email "${email}" is already in use`)

			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, pass, address, postcode, ward, email, staff) VALUES("${user}", "${pass}", "${address}", "${postcode}", "${ward}", "${email}", "${staff}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}


	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)

			sql = `SELECT pass FROM users WHERE user = "${username}";`


			const record = await this.db.get(sql)

			var result = await bcrypt.compare(password, record.pass, function(err, res) { //login with bad password
			})

			if(!result){
				throw new Error(`invalid password for account "${username}"`)
			}
			return true
			
			} catch(err) {
			throw err
		}
	}

	async getEmail(username) { //DONT THINK I NEED
		if(username == '') throw new Error('no username given')
		try{
			let sql = `SELECT email FROM users WHERE user="${username}";`
			const email = await this.db.get(sql)
			if(email===undefined) throw new Error('no email with this user')
			return email.email
		} catch(err) {
			throw err
		}
	}

	async upgradeToStaff(username) {
		if(username == '') throw new Error('no username given')
		let sql = `SELECT staff FROM users WHERE user="${username}";`
		const isStaff = await this.db.get(sql)
		if(isStaff===undefined) throw new Error('no user found')
		if(isStaff.staff==1) throw new Error('user is already staff!')
		sql = `UPDATE users SET staff = 1 WHERE user = "${username}";`
		await this.db.run(sql)
		return true
	}

	async isStaff(username) {
		if(username == '') throw new Error('no username given')
		let sql = `SELECT staff FROM users WHERE user="${username}";` //correct sql
		const staff = await this.db.get(sql)
		if (staff === undefined) throw new Error ('no user found')
		return staff.staff
	}

}

