
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


	test('email is incorrect format (without @ symbol)', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.addIssue('Completed', 'joeMcggmail.com', '23, 15', 'Pothole', 'High'))
		    .rejects.toEqual( Error('please enter a valid email') )
		done()
	})

	
	test('email is incorrect format (with 2 @ symbols)', async done => {
		expect.assertions(1)
		const account = await new Issue()
		//console.log(typeof(account))
		await expect (account.addIssue('Completed', 'joe@@Mcggmail.com', '23, 15', 'Pothole', 'High'))
		    .rejects.toEqual( Error('please enter a valid email') )
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
		await account.addIssue('josephmcgeever@hotmail.co.uk', '23, 15', 'Pothole') //using my email so I can check an actual email is sent
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

