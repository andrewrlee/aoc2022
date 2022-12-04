import fs from 'fs'

export default function (plop) {

	const completedChallenges = fs.readdirSync('.')
	.filter(d => d.startsWith('day'))
	.map(d => d.replace( /^\D+/g, ''))
	.map(d => parseInt(d))

	const day = (Math.max(...completedChallenges) + 1).toString().padStart(2, '0')
	console.log(`Scaffolding day: ${day}`) 

	plop.setGenerator('newDay', {
		description: 'A way of adding a new day', 
		prompts: [],
		actions: [{
			type: 'add',
			path: `day${day}/input.txt`,
			templateFile: 'templates/input.txt',
		},{
			type: 'add',
			path: `day${day}/challenge.test.ts`,
			templateFile: 'templates/challenge.test.ts',
			data: { day: day}
		}
	]  
	});
};