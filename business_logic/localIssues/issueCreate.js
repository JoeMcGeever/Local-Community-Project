const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')

//ADD THIS DATABASE IN AFTER
const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'issue.db'

const Issue = require('../../modules/issue')

module.exports = class issue {

    constructor() {
        
    }

    async create(userEmail, location, description) {

        //userEmail is not an input and should be found from user session
        //maybe through authorisation part

        try {
            //const loginUser = await new User(dbName)
            const newIssue = await new Issue(userEmail, location, description)
            return newIssue.create()
        } catch(err) {
            throw err
        }
    }

}