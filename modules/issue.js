'use strict'

const sqlite = require('sqlite-async')

module.exports = class Issue {

	constructor(dbName = ':memory:') { //not sure what to call this 
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS issue (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT, userEmail TEXT, location TEXT, dateOfReport TEXT, dateOfCompletion TEXT, description TEXT, priority TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async addIssue(userEmail, location, description) {
		const priority = "Low"
		const status = "reported"
		try {
			//only email and location needs validating
		    let sql = `SELECT COUNT(id) as records FROM issue WHERE userEmail="${userEmail}";`
			const data2 = await this.db.get(sql)
			if(data2.records !== 0) throw new Error(`email "${userEmail}" is already in use`)
			if(userEmail.length === 0) throw new Error('missing email')
			if(location.length=== 0) throw new Error('missing location')
			if((userEmail.match(/@/g)||[]).length!= 1) throw new Error('please enter a valid email')
		    //creates the month
			var d = new Date()
			const month = d.getMonth() + 1
			const dateOfReport = d.getDate() + "/" + month + "/" + d.getFullYear()
			sql = `INSERT INTO issue (status, userEmail, location, dateOfReport, description, priority) VALUES("${status}", "${userEmail}", "${location}", "${dateOfReport}", "${description}", "${priority}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async updateJobStatus(issueID, status) { //will change the "status" of a job in the database (reported / allocated / resolved)
	//note -> if set to resolved, the user who flagged it should be sent an email
	//status update should be a drop down option of Reported, Resolved, Allocated
	//issueID should be sent to and fro these layers anyway
	try {
		let sql = `UPDATE issue SET status = "${status}" WHERE id = "${issueID}";`
		await this.db.run(sql)
		if(status == "Resolved"){
			var d = new Date()
			const month = d.getMonth() + 1
			const dateOfCompletion = d.getDate() + "/" + month + "/" + d.getFullYear()
			sql = `UPDATE issue SET dateOfCompletion = "${dateOfCompletion}" WHERE id = "${issueID}";`
			await this.db.run(sql)

			sql = `SELECT userEmail, description, location FROM issue WHERE id = "${issueID}";`
			let userDetails = await this.db.get(sql)

			let userEmail = userDetails.userEmail //cant remember how to get individual data
			let description = userDetails.description
			let location = userDetails.location


			//GET RID OF THIS
			return true //HERE JUST SO I DON'T USE UP MY EMAIL SENDING LIMIT
			//GET RID OF THIS


			//send email here
			const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey('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');
            const msg = {
            to: userEmail,
            from: 'localcommunity@304.co.uk',
            subject: 'Your issue has been resolved!',
            text: 'Your issue has been resolved!',
            html: `<strong> The issue: "${description}" at "${location}" has been resolved. Sent to: "${userEmail}". FUCK YOU JAZZ BUGG</strong>`,
        };
            sgMail.send(msg);
		}
		return true
	} catch(err) {
		throw err
	    }
	}

	async viewIssue(location){ //gets all issues filtered by user location 
		//show number of days since raised / days it took to resolve
		//ensure issueID is sent also
	}

	async voteForIssue(issueID){ //will update the priority of an issue by the numberOfVotes
		//if priority is a number spanning from low-medium-high (after 10 votes, put up)
		//can only be voted for if status == reported

	}

	async getJobList(){ //returns a list of jobs to do in a day
		//done by location + importance 
		//say a member of staff can resolve 3 tasks a day
	}

}