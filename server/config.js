import { forEach } from 'lodash';

let config = {
	SECRET: '.4ab!]9uLu])w%MA',
	MONGODB: 'mongodb://localhost:27017/mnd-dashboard/',
	URL: 'http://localhost:3000',
};

if(process.env.NODE_ENV === 'production'){
	config.MONGODB = 'mongodb://stefan:stefan@ds155509.mlab.com:55509/heroku_mcr35gr4';
}

forEach(config, function(value, key) {
	process.env[key] = value;
});
