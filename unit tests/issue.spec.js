
'use strict'

const Issue = require('../modules/issue.js')

describe('creation()', () => { 
    var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	
	test('create a valid issue', async done => {
		expect.assertions(1)
		const account = await new Issue()
		const create = await account.creation('Completed', 'joeMcg@gmail.com', '23, 15', 'Pothole', 'High')
        expect(create).toBe(true)
		done()
	})

	test('location is invalid format - one number ', async done => {
		//location should be a street name or 2 numbers in the format 'decimal, decimal'
		expect.assertions(0)
		const account = await new Issue()
		await expect(account.creation('Completed', 'joeMcg@gmail.com', '250', 'Pothole', 'High')).rejects.toEqual(Error('Please enter a valid location. Street name or GPS'));
		done()
	})

	test('location is not a valid street name', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.creation('Completed', 'joeMcg@gmail.com', 'Binley Woods', 'Pothole', 'High'))
		    .rejects.toEqual( Error('Please enter a valid location. Street name or GPS') )
		done()
	})

	test('email is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.creation('Completed', '', '23, 15', 'Pothole', 'High'))
		    .rejects.toEqual( Error('missing email') )
		done()
	})

	test('location is missing', async done => {
		expect.assertions(1)
		const account = await new Issue()
		await expect (account.creation('Completed', 'joeMcg@gmail.com', '', 'Pothole', 'High'))
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
