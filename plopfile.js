import fs from 'fs'
import * as dotenv from 'dotenv' 
dotenv.config()

export default async function (plop) {
	const session = process.env.SESSION
	
	const completedChallenges = fs.readdirSync('.')
	.filter(d => d.startsWith('day'))
	.map(d => d.replace( /^\D+/g, ''))
	.map(d => parseInt(d))

	const rawDate = (Math.max(...completedChallenges) + 1).toString()
	const day = rawDate.padStart(2, '0')
	
	console.log(`Scaffolding day: ${day}`) 

	let input = "Provide input manually"
	if (session) {
		const result = await fetch(`https://adventofcode.com/2022/day/${rawDate}/input`, { headers: { 'cookie' : `session=${session}` }})
		input = await result.text()	
	} 
	
	plop.setGenerator('newDay', {
		description: 'A way of adding a new day', 
		prompts: [],
		actions: [{
			type: 'add',
			path: `day${day}/input.txt`,
			templateFile: 'templates/input.txt',
			data: { input }
		},{
			type: 'add',
			path: `day${day}/challenge.test.ts`,
			templateFile: 'templates/challenge.test.ts',
			data: { day: day}
		}
	]  
	});
};
