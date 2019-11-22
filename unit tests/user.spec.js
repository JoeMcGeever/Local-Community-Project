'use strict'

const Accounts = require('../modules/user.js')

describe('register()', () => { 

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		expect(register).toBe(true)
		done()
	})

	test('register a valid staff account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 'Geheim')
		const staff = await account.isStaff('doej')
		expect(staff).toBe(1)
		done()
	})


	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg2@uni.com') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', '', '28 Bonley Road', '2RE', 24, 'mcg@uni.com') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

	//tests for: address, postcode, ward and email

	test('error if blank address', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '', '2RE', 24, 'mcg@uni.com') )
			.rejects.toEqual( Error('missing address') )
		done()
	})

	test('incorrect postcode format', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', 'R4E', 24, 'mcg@uni.com') )
			.rejects.toEqual( Error('please enter the last 3 characters of your postcode (e.g 1ER)') )
		done()
	})

	test('error if blank postcode', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '', 24, 'mcg@uni.com') )
			.rejects.toEqual( Error('missing postcode') )
		done()
	})

	test('error if blank ward', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', 'R4E', null, 'mcg@uni.com') )
			.rejects.toEqual( Error('missing ward') )
		done()
	})

	test ('ward is not a number', async done=> {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '3ER', 'twenty-four', 'mcg@uni.com') )
			.rejects.toEqual( Error('your ward should be a number') )
		done()
	})
	
	test('error if blank email', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, '') )
.rejects.toEqual( Error('missing email') )
		done()
	})

	test('email is incorrect format (without @ symbol)', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg.cov.com') )
			.rejects.toEqual( Error('please enter a valid email') )
		done()
	})

	test('email is incorrect format (with 2 @ symbols)', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@@cov.com') )
			.rejects.toEqual( Error('please enter a valid email') )
		done()
	})

 	test('email is duplicate', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await expect( account.register('doej2', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com') )
			.rejects.toEqual( Error('email "mcg@uni.com" is already in use') )
		done()
	})

	

})


describe('login()', () => {
	
	test('valid login', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		const validLogin = await account.login('doej', 'password') 
		expect(validLogin).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})


})


describe('getEmail()', () => { 
	
	test('get email given correct username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		const valid = await account.getEmail('doej')
		expect(valid).toBe('mcg@uni.com')
		done()
	})

	test('get email given incorrect username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await expect( account.getEmail('dosssssssss') )
			.rejects.toEqual( Error('no email with this user') )
		done()
	})

	test('no username given', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await expect( account.getEmail('') )
			.rejects.toEqual( Error('no username given') )
		done()
	})
})

describe('isStaff()', () => { 
	test('return 0 for local', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		const staff = await account.isStaff('doej')
		expect(staff).toBe(0)
		done()
	})

	test('return 1 for staff', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await account.upgradeToStaff('doej')
		const staff = await account.isStaff('doej')
		expect(staff).toBe(1)
		done()
	})

	test('no username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.isStaff('') )
			.rejects.toEqual( Error('no username given') )
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.isStaff('doej') )
			.rejects.toEqual( Error('no user found') )
		done()
	})
})

describe('upgradeToStaff()', () => {
	
	test('Upgrade a local', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		const upgrade = await account.upgradeToStaff('doej')
		expect(upgrade).toBe(true)
		done()
	})

	test('Upgrade a staff', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com')
		await account.upgradeToStaff('doej')
		await expect( account.upgradeToStaff('doej') )
			.rejects.toEqual( Error('user is already staff!') )
		done()
	})

	test('no username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.upgradeToStaff('') )
			.rejects.toEqual( Error('no username given') )
		done()
	})


	test('No user found', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.upgradeToStaff('doej') )
			.rejects.toEqual( Error('no user found') )
		done()
	})

})