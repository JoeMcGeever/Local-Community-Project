//HERE WILL HOLD THE ACCOUNT OBJECT:
//HAVE GETTERS AND SETTERS WITHIN THE OBJECT
//REMEMBER: ITS ALL IN JSON
//SEE FOUNDATION JAVASCRIPT 4
//USE || TO MASK ERRORS MAYBE
//NOTE PASSWORD SHOULD BE HASHED IN THE SAME WAY IT IS IN 304 


//WRITE TESTS FIRST!

class Account {
 
    constructor(user, pass, address, postcode, ward, email, isStaff) {
        this.user = user
        this.pass = pass //BUSINESS LOGIC SHOULD HASH THIS 
        this.address = address
        this.postcode = postcode
        this.ward = ward
        this.email = email
        this.isStaff = isStaff || false
    }
    
    get loginDetails() {
        return [this.user, this.pass]
    }

    set newUserName(user) {
        this.user = user
    }

    set newPassword(pass) {
        this.pass = pass
    }

    async saveChanges() {
        //some kind of saveChanges button where we save all the data to the database goes here
        //this is called when the user first registers there account (after all the data is set)
        //or when the user confirms the updates to his account
        //should be asynchronous
        try {
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
			sql = `INSERT INTO users(user, pass, address, postcode, ward, email) VALUES("${user}", "${pass}", "${address}", "${postcode}", "${ward}", "${email}")`
			await this.db.run(sql)
			return true
        } catch(err) {
			throw err
		}


    }

}