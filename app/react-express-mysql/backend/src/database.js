const knex = require('knex');
const { database } = require('./config');

module.exports = knex({
  client: 'pg',
  connection: database,
});
