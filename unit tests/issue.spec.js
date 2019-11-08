
'use strict'

const Issue = require('../modules/issue.js')

describe('addIssue()', () => { 
    var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	
	test('create a valid issue', async done => {
		expect.assertions(1)
		const account = await new Issue()
		const create = await account.addIssue('joeMcg@gmail.com', '23, 15', 'Pothole')
        expect(create).toBe(true)
		done()
	})


	test('email is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.addIssue("", '23, 15', 'Pothole'))
		    .rejects.toEqual( Error('missing email') )
		done()
	})

	test('location is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.addIssue('joeMcg@gmail.com', '', 'Pothole'))
			.rejects.toEqual( Error('missing location') )
		done()
	})

	test('Description is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.addIssue('joeMcg@gmail.com', '23, 15', ''))
			.rejects.toEqual( Error('missing description') )
		done()
	})

})


describe('updateJobStatus()', () => { 
	
	test('update status to allocated', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue('joeMcg@gmail.com', '23, 15', 'Pothole')
		const update = await  account.updateJobStatus(1, "Allocated")
		expect(update).toBe(true)
		done()
	})

	test('update status to resolved', async done => { //NOTE: USE THIS STATUS UPDATE FOR OTHER TESTS
		//TO CHECK TO SEE IF DATE OF COMPLETION IS CORRECT
		//TO SEE IF RESOLVED - AND THEREFORE SHOULDNT BE ABLE TO VOTE
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue('mcgeevej@uni.coventry.ac.uk', '23, 15', 'Pothole') //using my email so I can check an actual email is sent
		const update = await  account.updateJobStatus(1, "Resolved")
		expect(update).toBe(true)
		done()
	})

	test('update status to reported', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue('joeMcg@gmail.com', '23, 15', 'Pothole')
		const update = await  account.updateJobStatus(1, "Reported")
		expect(update).toBe(true)
		done()
	})

})


describe('voteForIssue()', () => { 

	test('Vote for an issue correctly', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("userEmail", "location", "description")
		const update = await account.voteForIssue(1)
		expect(update).toBe(true)
		done()
	})

})

describe('viewIssueBy()', () => { 


	test('Return all issues ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "reported")
		await account.addIssue("second", "23, 56", "allocated")
		await account.addIssue("third", "22, 0", "reported")
		await account.updateJobStatus(2, "allocated")
		const issues = await account.viewIssueBy("all")
		expect(issues.length).toBe(3)
		done()
	})


	test('Return issues which are filtered by reported ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "reported")
		await account.addIssue("second", "23, 56", "allocated")
		await account.addIssue("third", "22, 0", "reported")
		await account.updateJobStatus(2, "allocated")
		const issues = await account.viewIssueBy("reported")
		expect(issues.length).toBe(2)
		done()
	})

	test('Return issues which are filtered by allocated ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "reported")
		await account.addIssue("second", "23, 56", "reported")
		await account.addIssue("third", "22, 0", "allocated")
		await account.updateJobStatus(3, "allocated")
		const issues = await account.viewIssueBy("allocated")
		expect(issues.length).toBe(1)
		done()
	})

	test('Return issues which are filtered by resolved ', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await account.addIssue("first", "24, 23", "resolved")
		await account.addIssue("second", "23, 56", "resolved")
		await account.addIssue("third", "22, 0", "resolved")
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
		await account.addIssue("first", "24, 23", "reported")
		await expect (account.viewIssueBy("resolved"))
			.rejects.toEqual( Error('No current problems are set to resolved') )
		done()
	})

})
