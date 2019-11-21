
'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')

const width = 800
const height = 600
const delayMS = 5 // 50 when headless is false so you can view the tests slowly

let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })


//Set headless to false to view the test on the real page


beforeAll( async() => {
	browser = await puppeteer.launch({ headless: true, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })
})

afterAll( () => browser.close() ) // https://github.com/GoogleChrome/puppeteer/issues/561

describe('Account', () => {
	test('Login as a new member', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/loginSuccessful.json',screenshots: true})
		await har.start({ path: 'trace/loginSuccessful.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// page.goto('http://localhost:8080', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/registerNewUser.png' })


		await page.type('input[name=user]', 'newUserLogin')
		await page.type('input[name=pass]', 'newUser')
		await page.type('input[name=address]', 'newAddress')
		await page.type('input[name=postcode]', '2BE')
		await page.type('input[name=ward]', '1')
		await page.type('input[name=email]', 'newUser@email.com')

		await page.click('input[type=submit]')

		await page.goto('http://localhost:8080/login?msg=Please%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'newUserLogin')
		await page.type('input[name=pass]', 'newUser')
		await page.click('input[type=submit]')
        await page.waitForSelector('h1') //wait for next page to load (can we see top level heading?)
		//so h1 should be = "Home"
    //	await page.waitFor(1000) // sometimes you need a second delay


		// ASSERT
		const title = await page.title()
		expect(title).toBe('Home Page') //as it is in index.handlebars (where the page should redirect to)

		// extracting the text inside the first H1 element on the page
		const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
		})
		expect(heading).toBe('Home')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)


	test('Enter incorrect username', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/loginFail.json',screenshots: true})
		await har.start({ path: 'trace/login.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/login?msg=Please%20log%20in', { timeout: 30000, waitUntil: 'load' })
		//await page.goto('http://localhost:8080/login?msg=Please%20log%20in', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system

		await page.screenshot({ path: 'screenshots/loginFail.png' })



		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'wrong')
		await page.type('input[name=pass]', 'wrong')
		await page.click('input[type=submit]')
        await page.waitForSelector('h4') //wait for next page to load (can we see top level heading?)
		//so h1 should be = "Home"
	//	await page.waitFor(1000) // sometimes you need a second delay

		// ASSERT
		const title = await page.title()
		expect(title).toBe('Error') 

		// extracting the text inside the first H1 element on the page
		const heading = await page.evaluate( () => {
			const dom = document.querySelector('h4')
			return dom.innerText
		})
		expect(heading).toBe('Invalid credentials')

		const errorMessage = await page.evaluate( () => {
			const dom = document.querySelector('p2')
			return dom.innerText
		})
		expect(errorMessage).toBe('Error: username "wrong" not found.')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
    }, 16000)
    
    test('Missing pass', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/registerMissPass.json',screenshots: true})
		await har.start({ path: 'trace/registerMissPass.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/register.png' })
		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'newUser2')
		await page.type('input[name=address]', 'newAddress')
		await page.type('input[name=postcode]', '2BE')
		await page.type('input[name=ward]', '1')
		await page.type('input[name=email]', 'newUser@email.com')
		await page.click('input[type=submit]')
        await page.waitForSelector('h4') //wait for next page to load (can we see top level heading?)
		//so h1 should be = "Home"
	//	await page.waitFor(1000) // sometimes you need a second delay
		// ASSERT
		const title = await page.title()
		expect(title).toBe('Error') //as it is in index.handlebars (where the page should redirect to)
		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)

	test('Incorrect email format', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/registerBadEmail.json',screenshots: true})
		await har.start({ path: 'trace/registerBadEmail.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/register.png' })
		// ACT
		// complete the form and click submit
		await page.type('input[name=user]', 'newUser3')
		await page.type('input[name=pass]', 'newPass')
		await page.type('input[name=address]', 'newAddress')
		await page.type('input[name=postcode]', '2BE')
		await page.type('input[name=ward]', '1')
		await page.type('input[name=email]', 'notAnEmail')
		await page.click('input[type=submit]')
        await page.waitForSelector('h4') //wait for next page to load (can we see top level heading?)
		//so h1 should be = "Home"
	//	await page.waitFor(1000) // sometimes you need a second delay
		// ASSERT
		const title = await page.title()
		expect(title).toBe('Error') //as it is in index.handlebars (where the page should redirect to)
		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})

describe('Issue Creation', () => {
	test('Create an issue successfully', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/reportIssueSuccess.json',screenshots: true})
		await har.start({ path: 'trace/reportIssueSuccess.har' })
		// ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		// page.goto('http://localhost:8080', { timeout: 30000, waitUntil: 'load' })
		// take a screenshot and save to the file system
		await page.screenshot({ path: 'screenshots/login.png' })

        
		await page.goto('http://localhost:8080/addIssue', { timeout: 30000, waitUntil: 'load' })
		await page.screenshot({ path: 'screenshots/addIssue.png' })
        await page.type('input[name=location]', '23, 15')
		await page.type('input[name=description]', 'pothole')
        await page.click('input[type=submit]')


        await page.waitForSelector('h1')

		// ASSERT
		const title = await page.title()
		expect(title).toBe('Home Page')

        expect(page.url()).toBe('http://localhost:8080/?msg=issue%20created') //unsure if page.url() actually accesses the url

		const heading = await page.evaluate( () => {
			const dom = document.querySelector('h1')
			return dom.innerText
		})
		expect(heading).toBe('Home')


		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		await page.tracing.stop()
		await har.stop()
		done()
    }, 16000)

    test('Missing a box should throw error', async done => {
		// start generating a trace file
		await page.tracing.start({path: 'trace/reportIssueFail.json',screenshots: true})
		await har.start({ path: 'trace/reportIssueFair.har' })
		// ARRANGE
        
        await page.goto('http://localhost:8080/addIssue', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=description]', 'pothole')
		await page.click('input[type=submit]')


        await page.waitForSelector('h4') 
		const title = await page.title()
		expect(title).toBe('Error')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		await page.tracing.stop()
		await har.stop()
		done()
    }, 16000)
    


})
