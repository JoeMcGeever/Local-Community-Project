
'use strict'

const Accounts = require('../modules/issue.js')

describe('creation()', () => { 
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

	test('create a valid issue', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await Issue.creation(1, 'Completed', 'joeMcg@gmail.com', '23, 15', 'Pothole', 'High')
        expect(register).toBe(true)
		done()
	})

})