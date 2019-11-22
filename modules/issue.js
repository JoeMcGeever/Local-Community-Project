'use strict'

const sqlite = require('sqlite-async')

module.exports = class Issue {

	constructor(dbName = ':memory:') { //not sure what to call this 
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS issue (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT, userEmail TEXT, location TEXT, dateOfReport TEXT, dateOfCompletion TEXT, description TEXT, priority TEXT, numberOfVotes INTEGER);'
			await this.db.run(sql)
			return this
		})()
	}

	async addIssue(userEmail, location, description, dateOfCompletion) {
		const priority = "low"
		const status = "reported"
		try {
			//only email and location needs validating
		   // let sql = `SELECT COUNT(id) as records FROM issue WHERE userEmail="${userEmail}";`
			//const data2 = await this.db.get(sql)
		//	if(data2.records !== 0) throw new Error(`email "${userEmail}" is already in use`)
			if(userEmail.length === 0) throw new Error('missing email')
			if(location.length=== 0) throw new Error('missing location')
			if(description.length === 0)throw new Error('missing description')
			//if((userEmail.match(/@/g)||[]).length!= 1) throw new Error('please enter a valid email')
			

			//validate format of location (must be GPS)
			location = location.replace(/\s+/g, '');
			var formatTest = location.split(',')
			if(isNaN(parseFloat(formatTest[0])) || isNaN(parseFloat(formatTest[1])) || formatTest.length != 2) {
				throw new Error ('location must be as GPS coords (format by 2 numbers with a comma inbetween)')
			}




		    //creates the month
			var d = new Date()
			const month = d.getMonth() + 1
			const dateOfReport = d.getDate() + "/" + month + "/" + d.getFullYear()
			let sql
			if(dateOfCompletion !== null){
				sql = `INSERT INTO issue (status, userEmail, location, dateOfReport, description, priority, dateofCompletion, numberOfVotes) VALUES("${status}", "${userEmail}", "${location}", "${dateOfReport}", "${description}", "${priority}", "${dateOfCompletion}", 0)`
			} else {
				sql = `INSERT INTO issue (status, userEmail, location, dateOfReport, description, priority, numberOfVotes) VALUES("${status}", "${userEmail}", "${location}", "${dateOfReport}", "${description}", "${priority}", 0)`
			}
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
            html: `<strong> The issue: "${description}" at "${location}" has been resolved. Sent to: "${userEmail}".</strong>`,
        };
            sgMail.send(msg);
		}
		return true

	}

	async viewIssueBy (status){ //gets all issues filtered by user location 
		//show number of days since raised / days it took to resolve
		//ensure issueID is sent also
		let sql = `SELECT * FROM issue WHERE status = "${status}";`
		if(status == 'all') {
			sql = `SELECT * FROM issue;`
		}
		
		const data = await this.db.all(sql)


		if(data.length ==0) throw new Error(`No current problems are set to ${status}`)

		//EDIT THE DATA FOR WHAT WOULD BE: (dateOfCompletion)
		//TO BE days elapsed (since completion or until today)

		var currentDate = new Date()
		currentDate = currentDate.toLocaleDateString("en-US")
		//this is in US format:
		var i
		var reportDate
		var completionDate
		var differenceInTime
		var daysElapsed

		for (i = 0; i < data.length; i++){
			//reportDate = new Date(data[i].dateOfReport)
			reportDate = data[i].dateOfReport
			var dateAsArray = reportDate.split('/')
		    reportDate = dateAsArray[1] + "/" + dateAsArray[0] + "/" + dateAsArray[2] //NEEDS TO CONVERT TO US FORMAT
			reportDate = new Date(reportDate)
			currentDate = new Date(currentDate)
			if(data[i].dateOfCompletion == null){ //if not yet completed
				// To calculate the time difference of two dates 
				differenceInTime = Math.abs(currentDate.getTime() - reportDate.getTime()) 
				// To calculate the no. of days between two dates 
				daysElapsed = differenceInTime / (1000 * 3600 * 24)
				data[i].dateOfCompletion = Math.round(daysElapsed)
			} else {
				completionDate = data[i].dateOfCompletion
				var dateAsArray = completionDate.split('/')
		        completionDate = new Date (dateAsArray[1] + "/" + dateAsArray[0] + "/" + dateAsArray[2])//NEEDS TO CONVERT TO US FORMAT
				// To calculate the time difference of two dates 
				differenceInTime = Math.abs(completionDate.getTime() - reportDate.getTime())
				// To calculate the no. of days between two dates 
				daysElapsed = differenceInTime / (1000 * 3600 * 24)
				data[i].dateOfCompletion = Math.round(daysElapsed)
			}
		}

		return data
	}

	async voteForIssue(issueID){ //will update the priority of an issue by the numberOfVotes
		//if priority is a number spanning from low-medium-high (after 10 votes, put up)
		//can only be voted for if status == reported
		let sql = `SELECT numberOfVotes FROM issue WHERE id = "${issueID}";`

		let currentNumber = await this.db.get(sql)


		currentNumber = currentNumber.numberOfVotes
		currentNumber = Number(currentNumber) + 1
		if(currentNumber == 5) {
			this.updateJobPrioity(issueID, 5)
			await this.db.run(sql)
		}else if (currentNumber == 10) {
			this.updateJobPrioity(issueID, 10)
		}
		sql = `UPDATE issue SET numberOfVotes = "${currentNumber}" WHERE id = "${issueID}";`
		await this.db.run(sql)


		return currentNumber


	}

	async updateJobPrioity(issueID, numberOfVotes){
		//send the 2nd parameter as 5 to make medium, 10 to make high
		//can be used accessed by staff, but not locals
		let sql
		if(numberOfVotes == 0) {
			sql = `UPDATE issue SET priority = "Low" WHERE id = "${issueID}";`
			await this.db.run(sql)
		}
		if(numberOfVotes == 5) {
			sql = `UPDATE issue SET priority = "Medium" WHERE id = "${issueID}";`
			await this.db.run(sql)
		}else if (numberOfVotes == 10) {
			sql = `UPDATE issue SET priority = "High" WHERE id = "${issueID}";`
			await this.db.run(sql)
		}
		return true
	}

	async getJobList(){ //returns a list of jobs to do in a day
		//done by location + importance 
		//say a member of staff can resolve 3 tasks a day
	}

}