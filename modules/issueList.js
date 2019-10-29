'use strict'

const sqlite = require('sqlite-async')

module.exports = class Issue {

	constructor(dbName = ':memory:') { //not sure what to call this 
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, address TEXT, postcode TEXT, ward INTEGER, email TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async create() {
		try {

		} catch(err) {
			
		}
	}


}