import './auth';
import './config';

import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';

import OpticsAgent from 'optics-agent';
import Resolvers from './resolvers';
import Schema from './schema.graphql';
import apis from './apis';
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import logger from './logger';
import { makeExecutableSchema } from 'graphql-tools';
import passport from 'passport';
import path from 'path';

let SERVER_PORT = process.env.PORT || 8080;

let app = express();
app.use(compression());
app.use(passport.initialize());

let picturesDir = path.join(__dirname, '../images');
let maxAge = process.env.NODE_ENV === 'production' ? 8640000000 * 7 : 0;
app.use('/images', express.static(picturesDir, {
	maxAge
}));
if (process.env.NODE_ENV !== 'production') {
	app.use('/graphiql', graphiqlExpress({
		endpointURL: '/graphql',
	}));
}

const executableSchema = makeExecutableSchema({
	typeDefs: Schema,
	resolvers: Resolvers,
	allowUndefinedInResolve: false,
	resolverValidationOptions: {
		requireResolversForNonScalar: false
	},
	printErrors: process.env.NODE_ENV !== 'production',
});
if (process.env.NODE_ENV === 'production') {
	OpticsAgent.instrumentSchema(executableSchema);
}

const graphqlExpressOptions = (req) => {
	const options = {
		schema: executableSchema,
		debug: false,
		context: {}
	};
	if (process.env.NODE_ENV === 'production') {
		options.context.opticsContext = OpticsAgent.context(req);
	}
	return options;
}
if (process.env.NODE_ENV !== 'production') {
	graphqlExpressOptions.formatError = (err) => {
		logger.error({
			stack: 'GraphQLError',
			path: err.path,
			message: err.message,
			locations: err.locations
		});
	};
}
if (process.env.NODE_ENV === 'production') {
	app.use('/graphql', OpticsAgent.middleware());
}
app.use('/graphql', bodyParser.json(), graphqlExpress((req) => graphqlExpressOptions(req)));

const router = express.Router();
router.use(bodyParser.json());
router.use(apis);
app.use('/api', router);

require('./dailyTasks');

app.listen(SERVER_PORT, () => logger.info(
	`GraphQL Server is now running on http://localhost:${SERVER_PORT}/graphql`
));
