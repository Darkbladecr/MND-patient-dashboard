import { forEach } from 'lodash';

let config = {
	SECRET: '.4ab!]9uLu])w%MA',
	URL: 'http://localhost:3000',
};

forEach(config, function(value, key) {
	process.env[key] = value;
});
