let welcome = [
	'Each day will be better than the last. <br />This one especially.',
	'Sometimes you eat the bear <br />and sometimes the bear, well, he eats you.',
	'Be cool. But also be warm.',
	'You’re here, the day just got better.',
	'Always get plenty of sleep, if you can.',
	'The mystery of life isn’t a problem to solve,<br />but a reality to experience.',
	'Thank you for using Ques. <br />We appreciate it!',
	'Please enjoy Ques responsibly.',
	'Please consider the environment <br />before printing this Ques.',
	'What a day! What cannot be <br />accomplished on such a splendid day?',
	'We like you.',
	'Remember to get up & stretch <br />once in a while.',
	'Alright world, time to take you on!',
	'Either you run the day or the day runs you.',
	'Good, better, best. Never let it rest. <br />’Till your good is better and your better is best.',
	'What you do today can improve all your tomorrows.',
	'The secret of getting ahead is getting started.',
	'It does not matter how slowly you go <br />as long as you do not stop.',
	'Don’t watch the clock; <br />do what it does. Keep going.',
	'Laughter is the best medicine, <br />except for treating diarrhea.'
];
let message = welcome[Math.floor(Math.random() * welcome.length)];

function welcomeMessage(){
	const el = document.getElementById('welcomeMsg');
	if(el){
		el.innerHTML = message;
	} else {
		window.setTimeout(welcomeMessage, 100);
	}
}
welcomeMessage();
