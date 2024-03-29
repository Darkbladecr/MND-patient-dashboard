let activities = {
	'friends': [{
		'name': 'Alice Freeman',
		'avatar': 'assets/images/avatars/alice.jpg',
		'message': 'Alice uploaded a document',
		'status': 'online',
		'time': '13 mins. ago'
	}, {
		'name': 'Joyce Walters',
		'avatar': 'assets/images/avatars/joyce.jpg',
		'message': 'Joyce sent you a message',
		'status': 'away',
		'time': 'A day ago'
	}],
	'servers': [{
		'location': 'US East Zone',
		'status': 'normal',
		'detail': 'Load: Normal, CPU: 32%, Memory: 52%'
	}, {
		'location': 'US West Zone',
		'status': 'normal',
		'detail': 'Load: Normal, CPU: 19%, Memory: 38%'
	}, {
		'location': 'Europe East Zone',
		'status': 'normal',
		'detail': 'Load: Minimal, CPU: 8%, Memory: 12%'
	}, {
		'location': 'Europe West Zone',
		'status': 'warn',
		'detail': 'Increasing IO activity'
	}, {
		'location': 'Asia East Zone',
		'status': 'error',
		'detail': 'No connection!'
	}],
	'stats': [{
		'title': 'Storage',
		'current': '2010',
		'total': '4096',
		'percent': '49',
		'status': 'warn'
	}, {
		'title': 'Cloud',
		'current': '3770',
		'total': '4096',
		'percent': '92',
		'status': 'alert'
	}, {
		'title': 'Projects',
		'current': '5',
		'total': '20',
		'percent': '25',
		'status': 'normal'
	}]
};

let events = [{
	'title': 'Group Meeting',
	'detail': 'In 32 Minutes, Room 1B'
}, {
	'title': 'Public Beta Release',
	'detail': '11:00 PM'
}, {
	'title': 'Dinner with David',
	'detail': '17:30 PM'
}, {
	'title': 'Q&A Session',
	'detail': '20:30 PM'
}];

let notes = [{
	'title': 'Best songs to listen while working',
	'detail': 'Last edit: May 8th, 2015'
}, {
	'title': 'Useful subreddits',
	'detail': 'Last edit: January 12th, 2015'
}];

function QuickPanelController() {
	'ngInject';
	'use strict';

	var vm = this;

	// Data
	vm.date = new Date();
	vm.settings = {
		notify: true,
		cloud: false,
		retro: true
	};

	vm.activities = activities;
	vm.events = events;
	vm.notes = notes;

	// Methods

	//////////
}
export default QuickPanelController;
