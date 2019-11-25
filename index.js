#!/usr/bin/env node

/**
 * Routes File
 */

'use strict'

/* MODULE IMPORTS */

const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const sqlite = require('sqlite-async')
const fs = require('fs-extra')
const mime = require('mime-types')
//const jimp = require('jimp')


const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Issue = require('./modules/issue')

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'
const dbNameIssue = 'issue.db'
const saltRounds = 10

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} 
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		if(ctx.session.authorised == null) return ctx.redirect('/login?msg=Please log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index', {name : "Joe!"})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/registerPost', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)

		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass, body.address, body.postcode, body.ward, body.email, body.staffPass)
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true      
		ctx.session.username = body.user //save the username in ctx.session.username


		return ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.username = null
	ctx.redirect('/?msg=you are now logged out')
})

router.get('/addIssue', async ctx => {
	if(ctx.session.authorised == null) return ctx.redirect('/login?msg=Please log in')
	await ctx.render('addIssue')
})

router.post('/addIssue', async ctx => {
	try {
		if(ctx.session.authorised === null)	throw new Error("Please log in")
		const body = ctx.request.body
		const location = body.location
		const description = body.description
		const username = ctx.session.username //saved when the user logs in in ctx.session.username

		const user = await new User(dbName)
		const userEmail = await user.getEmail(username)
		
		const issue = await new Issue(dbNameIssue)
		await issue.addIssue(userEmail, location, description, null) //nullis to represent dateOfReport -- this is only needed for testing and will always be null
		return ctx.redirect('/?msg=issue created')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/viewIssues/:status', async ctx =>{
	if(ctx.session.authorised == null) return ctx.redirect('/login?msg=Please log in')
	try {
	    const status = ctx.params.status
		const issue = await new Issue(dbNameIssue)
		let issueArray = await issue.viewIssueBy(status)

		const user = await new User(dbName)
		const username = ctx.session.username
		const staff = await user.isStaff(username)
		
	    if(staff == 1 ){
		    await ctx.render('viewIssuesStaff', {issues: issueArray})
	        } else {
			await ctx.render('viewIssues', {issues: issueArray})
		}
	    } catch(err) {
		await ctx.render('error', {message: err.message})
	}
	
})


router.get('/viewIssuesByCoords/:coordinates', async ctx =>{
	if(ctx.session.authorised == null) return ctx.redirect('/login?msg=Please log in')
	try {
		const coordinates = ctx.params.coordinates

		const issue = await new Issue(dbNameIssue)


		const user = await new User(dbName)
		const username = ctx.session.username
		const staff = await user.isStaff(username)

		let issueArray = await issue.viewIssueByCoords(coordinates) //need to make
		


	    if(staff == 1 ){
		    await ctx.render('viewIssuesStaff', {issues: issueArray})
	        } else {
			await ctx.render('viewIssues', {issues: issueArray})
		}
	    } catch(err) {
		await ctx.render('error', {message: err.message})
	}
	
})


router.post('/viewIssues', async ctx => { 
	try {
		let i
		//console.log(ctx.session.username)
		const issue = await new Issue(dbNameIssue)
		const user = await new User(dbName)
		if(ctx.session.authorised === null)	throw new Error("Please log in")
		const body = ctx.request.body
		//console.log(body)
		const staff = await user.isStaff(ctx.session.username)


		if(staff != 1) { //if not staff - use the vote for issue function
			if(body.id === undefined|| body.id.length != 1) throw new Error("Please vote for one issue")
			//if nothing is selected or more than one is, throw the error
			//otherwise, cast the vote with the id of the selected issue
			issue.voteForIssue(body.id)
			return ctx.redirect('/?msg=vote has been sent')
		}
		//if staff; run the updateJobPriority function
		for(i = 0; i < body.id.length; i++){
			//console.log(body.id[i] + " is the id, with:" + body.priority[i] + "priority, and " + body.status[i] + " status.")
			if(body.priority[i] != 2){// if 2, this means no change. if 0, change to low
				issue.updateJobPrioity(body.id[i], body.priority[i])// if 5, = medium, 10 = high
			}
			if(body.status[i] != "No change"){
				issue.updateJobStatus(body.id[i], body.status[i])
			}
		}
		return ctx.redirect('/?msg=change made changes')

	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})



app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
