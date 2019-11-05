
'use strict'

const Issue = require('../modules/issue.js')

describe('creation()', () => { 
    var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	
	test('create a valid issue', async done => {
		expect.assertions(1)
		const account = await new Issue()
		const create = await account.creation('joeMcg@gmail.com', '23, 15', 'Pothole')
        expect(create).toBe(true)
		done()
	})


	test('email is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.creation("", '23, 15', 'Pothole'))
		    .rejects.toEqual( Error('missing email') )
		done()
	})

	test('location is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.creation('joeMcg@gmail.com', '', 'Pothole'))
			.rejects.toEqual( Error('missing location') )
		done()
	})


	test('email is incorrect format (without @ symbol)', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.creation('Completed', 'joeMcggmail.com', '23, 15', 'Pothole', 'High'))
		    .rejects.toEqual( Error('please enter a valid email') )
		done()
	})

	
	test('email is incorrect format (with 2 @ symbols)', async done => {
		expect.assertions(1)
		const account = await new Issue()
		console.log(typeof(account))
		await expect (account.creation('Completed', 'joe@@Mcggmail.com', '23, 15', 'Pothole', 'High'))
		    .rejects.toEqual( Error('please enter a valid email') )
		done()
	})
})
