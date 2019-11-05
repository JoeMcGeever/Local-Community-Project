
'use strict'

const Accounts = require('../modules/user.js')

describe('register()', () => { 

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg2@uni.com', 0) )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0) )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', '', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0) )
			.rejects.toEqual( Error('missing password') )
		done()
	})

	//tests for: address, postcode, ward and email

	test('error if blank address', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '', '2RE', 24, 'mcg@uni.com', 0) )
			.rejects.toEqual( Error('missing address') )
		done()
	})

	test('incorrect postcode format', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', 'R4E', 24, 'mcg@uni.com', 0) )
			.rejects.toEqual( Error('please enter the last 3 characters of your postcode (e.g 1ER)') )
		done()
	})

	test('error if blank poscode', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '', 24, 'mcg@uni.com', 0) )
			.rejects.toEqual( Error('missing postcode') )
		done()
	})

	test ('ward is not a number', async done=> {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '3ER', 'twenty-four', 'mcg@uni.com', 0) )
			.rejects.toEqual( Error('your ward should be a number') )
		done()
	})
	
	test('error if blank email', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, '', 0) )
.rejects.toEqual( Error('missing email') )
		done()
	})

	test('email is incorrect format (without @ symbol)', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg.cov.com', 0) )
			.rejects.toEqual( Error('please enter a valid email') )
		done()
	})

	test('email is incorrect format (with 2 @ symbols)', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@@cov.com', 0) )
			.rejects.toEqual( Error('please enter a valid email') )
		done()
	})

 	test('email is duplicate', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		await expect( account.register('doej2', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0) )
			.rejects.toEqual( Error('email "mcg@uni.com" is already in use') )
		done()
	})

	

})


describe('login()', () => {
	//removed valid login as hashing is involved at business layer

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})


})


describe('getEmail()', () => { 
	
	test('get email given correct username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		const valid = await account.getEmail('doej')
		expect(valid).toBe('mcg@uni.com')
		done()
	})

	test('get email given incorrect username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		await expect( account.getEmail('dosssssssss') )
			.rejects.toEqual( Error('no user with this email') )
		done()
	})

	test('no username given', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', '28 Bonley Road', '2RE', 24, 'mcg@uni.com', 0)
		await expect( account.getEmail('') )
			.rejects.toEqual( Error('no username given') )
		done()
	})
})
