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

	async creation(id, status, userEmail, location, dateOfReport, description, priority) {
		try {





			sql = `INSERT INTO issueid, status, userEmail, location, dateOfReport, description, priority) VALUES("${ID}", "${status}", "${userEmail}", "${location}", "${dateOfReport}", "${typeOfIssue}, ${description}, ${priority}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			
		}
	}


	async login(username, password) {
		try {
			
		} catch(err) {
			throw err
		}
	}

}