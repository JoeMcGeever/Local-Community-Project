
'use strict'

const Issue = require('../modules/issue.js')

describe('addIssue()', () => { 
    var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	
	test('create a valid issue', async done => {
		expect.assertions(1)
		const account = await new Issue()
		const create = await account.addIssue('joeMcg@gmail.com', '23, 15', 'Pothole', null)
        expect(create).toBe(true)
		done()
	})


	test('email is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.addIssue("", '23, 15', 'Pothole', null))
		    .rejects.toEqual( Error('missing email') )
		done()
	})

	test('location is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.addIssue('joeMcg@gmail.com', '', 'Pothole', null))
			.rejects.toEqual( Error('missing location') )
		done()
	})

	test('Description is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.addIssue('joeMcg@gmail.com', '23, 15', '', null))
			.rejects.toEqual( Error('missing description') )
		done()
	})

})


describe('updateJobStatus()', () => { 
	
	test('update status to allocated', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue('joeMcg@gmail.com', '23, 15', 'Pothole', null)
		const update = await  account.updateJobStatus(1, "Allocated")
		expect(update).toBe(true)
		done()
	})

	test('update status to resolved', async done => { //NOTE: USE THIS STATUS UPDATE FOR OTHER TESTS
		//TO CHECK TO SEE IF DATE OF COMPLETION IS CORRECT
		//TO SEE IF RESOLVED - AND THEREFORE SHOULDNT BE ABLE TO VOTE
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue('mcgeevej@uni.coventry.ac.uk', '23, 15', 'Pothole', null) //using my email so I can check an actual email is sent
		const update = await  account.updateJobStatus(1, "Resolved")
		expect(update).toBe(true)
		done()
	})

	test('update status to reported', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue('joeMcg@gmail.com', '23, 15', 'Pothole', null)
		const update = await  account.updateJobStatus(1, "Reported", null)
		expect(update).toBe(true)
		done()
	})

})


describe('voteForIssue()', () => { 

	test('Vote for an issue correctly', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("userEmail", "location", "description", null)
		const update = await account.voteForIssue(1)
		expect(update).toBe(1)
		done()
	})

	test('When vote reaches 5, upgrade priority', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("userEmail", "location", "description", null)
		let update
		let i = 0
		for(i = 0; i < 5; i++){
		    update = await account.voteForIssue(1)
	    } 
		expect(update).toBe(5)
		done()
	})

	test('When vote reaches 10, upgrade priority', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("userEmail", "location", "description", null)
		let update
		let i = 0
		for(i = 0; i < 10; i++){
		    update = await account.voteForIssue(1)
	    } 
		expect(update).toBe(10)
		done()
	})

})

describe('updateJobPriotiy()', () => { 
	test('When vote is sent as 0, downgrade priority', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("userEmail", "location", "description", null)
		const downgrade = await account.updateJobPrioity(1, 0)
		expect(downgrade).toBe(true)
		done()
	})

})

describe('viewIssueBy()', () => { 


	test('Return all issues ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "reported", null)
		await account.addIssue("second", "23, 56", "allocated", null)
		await account.addIssue("third", "22, 0", "reported", null)
		await account.updateJobStatus(2, "allocated")
		const issues = await account.viewIssueBy("all")
		expect(issues.length).toBe(3)
		done()
	})


	test('Return issues which are filtered by reported ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "reported", null)
		await account.addIssue("second", "23, 56", "allocated", null)
		await account.addIssue("third", "22, 0", "reported", null)
		await account.updateJobStatus(2, "allocated")
		const issues = await account.viewIssueBy("reported")
		expect(issues.length).toBe(2)
		done()
	})

	test('Return issues which are filtered by allocated ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "reported", null)
		await account.addIssue("second", "23, 56", "reported", null)
		await account.addIssue("third", "22, 0", "allocated", null)
		await account.updateJobStatus(3, "allocated")
		const issues = await account.viewIssueBy("allocated")
		expect(issues.length).toBe(1)
		done()
	})

	test('Return issues which are filtered by resolved ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "resolved", null)
		await account.addIssue("second", "23, 56", "resolved", null)
		await account.addIssue("third", "22, 0", "resolved", null)
		await account.updateJobStatus(1, "resolved")
		await account.updateJobStatus(2, "resolved")
		await account.updateJobStatus(3, "resolved")
		const issues = await account.viewIssueBy("resolved")
		expect(issues.length).toBe(3)
		done()
	})

	test('No problems are currently resolved', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "reported", null)
		await expect (account.viewIssueBy("resolved"))
			.rejects.toEqual( Error('No current problems are set to resolved') )
		done()
	})

	test('Days elapsed since reported for a resolved issue', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "resolved", "1/11/2019")
		await account.updateJobStatus(0, "resolved") // resolved today, so should = 8
		const issues = await account.viewIssueBy("all")


		let reportDate = new Date("11/1/2019") //US format
		let currentDate = new Date()
		currentDate = currentDate.toLocaleDateString("en-US")
		currentDate = new Date(currentDate)
		// To calculate the time difference of two dates 
		let differenceInTime = Math.abs(currentDate.getTime() - reportDate.getTime()) 
		// To calculate the no. of days between two dates 
		let daysElapsed = differenceInTime / (1000 * 3600 * 24);
		daysElapsed = Math.round(daysElapsed)



		expect(issues[0].dateOfCompletion).toBe(daysElapsed)
		//issues[0].dateOfCompletion == 0
		done()
	})

	test('Days elapsed since reported for not yet resolved issue', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "not resolved", "5/10/2019") // resolved today, so should = 8
		const issues = await account.viewIssueBy("all")

		let reportDate = new Date("10/5/2019") //US format
		let currentDate = new Date()
		currentDate = currentDate.toLocaleDateString("en-US")
		currentDate = new Date(currentDate)
		// To calculate the time difference of two dates 
		let differenceInTime = Math.abs(currentDate.getTime() - reportDate.getTime()) 
		// To calculate the no. of days between two dates 
		let daysElapsed = differenceInTime / (1000 * 3600 * 24);
		daysElapsed = Math.round(daysElapsed)


		expect(issues[0].dateOfCompletion).toBe(daysElapsed)
		//issues[0].dateOfCompletion == 0
		done()
	})

})
