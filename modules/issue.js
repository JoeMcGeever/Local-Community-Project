'use strict'

const sqlite = require('sqlite-async')

module.exports = class Issue {

	constructor(dbName = ':memory:') { //not sure what to call this 
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS issue (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT, userEmail TEXT, location TEXT, dateOfReport TEXT, description TEXT, priority TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async creation(status, userEmail, location, description, priority) {
		try {
			//only email and location needs validating
			let sql = `SELECT COUNT(id) as records FROM issue WHERE userEmail="${userEmail}";`
			const data2 = await this.db.get(sql)
			if(data2.records !== 0) throw new Error(`email "${userEmail}" is already in use`)

			if(userEmail.length === 0) throw new Error('missing email')
			if(location.length=== 0) throw new Error('missing location')
			if((userEmail.match(/@/g)||[]).length!= 1) throw new Error('please enter a valid email')
			const dateOfReport = "INSERT JS DATE THING HERE"
			sql = `INSERT INTO issue (status, userEmail, location, dateOfReport, description, priority) VALUES("${status}", "${userEmail}", "${location}", "${dateOfReport}", "${description}", "${priority}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}


	async login(username, password) {
		try {
			
		} catch(err) {
			throw err
		}
	}

}