import { forEach } from 'lodash';

let config = {
	SECRET: 'wishingForAngular2',
	MONGODB: 'mongodb://localhost:27017/ques/',
	MONGODB_DIST: 'mongodb://stefan:stefan@ds033996.mlab.com:33996/heroku_6f3pplpt',
	URL: 'http://localhost:3000',
	URL_DIST: 'https://app.quesmed.com',
	MAILCHIMP_URL: 'https://quesmed:adde423c9203493b8f000a4ac135a1fd-us13@us13.api.mailchimp.com/3.0/lists/bf48bfcd26',
	OPTICS_API_KEY: 'service:Darkbladecr-Quesmed:K5Yn5FW0qUe3o60gxMY5bQ'
};

if(process.env.NODE_ENV === 'production'){
	config.STRIPE_PUBLISHABLE = 'pk_live_qSUng1c2iZoJIIwLvCgbl1mh',
	config.STRIPE_SECRET = 'sk_live_DKipqrSJv5SfXuChEDeSTIYD';
} else {
	config.STRIPE_PUBLISHABLE = 'pk_test_ztbYgbnxewC0WH9Cm8I7OiY5';
	config.STRIPE_SECRET = 'sk_test_LZ8E6oAxmK3fU067QzldgrPK';
}

forEach(config, function(value, key) {
	process.env[key] = value;
});
