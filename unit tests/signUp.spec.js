
'use strict'
const sqlite = require('sqlite-async')
const logIn = require('../business_logic/signUp/login.js')
const registration = require('../business_logic/signUp/register.js')

describe('register', () => {
    test('register successfully', async done => {
        expect.assertions(1)
        const reg = new registration()

        const newUser = await reg.register('Jazz', 'Jazz', '28 Bonley Road', '2RE', 24, 'mcg@uni.cov.com', 0)
        expect(newUser).toBe(true)
        done()
    })
})



//describe('logIn', () => {

 //   test('login successfully and return correct redirect', async done => {
        //A sample login is already stored within the database
        //It's details are: 'Joe', 'Joe'

 //       expect.assertions(1)
 //       const loginObj = new logIn(":memory:")
 //       const newUser = await loginObj.login('Joe', 'Joe')
 //       expect(newUser).toBe(true)
 //   done()
//})

//})