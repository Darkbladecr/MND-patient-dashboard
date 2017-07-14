import Sequelize from 'sequelize';
import fs from 'fs';
import logger from '../logger';
import path from 'path';

const db = {};

const sequelize = new Sequelize('blog', null, null, {
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
	dialect: 'sqlite',
	storage: './mndDatabse.sqlite',
});

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (
			file.indexOf('.') !== 0 &&
			file !== 'index.js' &&
			file.slice(-3) === '.js'
		);
	})
	.forEach(file => {
		const model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

sequelize
	.authenticate()
	.then(() => {
		logger.debug('Connection has been established successfully.');
	})
	.catch(err => {
		logger.debug('Unable to connect to the database:', err);
	});

db.sequelize = sequelize;

// Import Models such that I can use them in the api just by importing 'db'
db.user = require('./user')(sequelize, Sequelize);
db.tempuser = require('./tempuser')(sequelize, Sequelize);
db.patient = require('./patient')(sequelize, Sequelize);
db.appointment = require('./appointment')(sequelize, Sequelize);

export default db;
