'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "777 Aegon Rd",
        city: "King's Landing",
        state: "Crownlands",
        country: "Westeros",
        lat: 42.1584,
        lng: 70.7667,
        name: "The Red Keep",
        description: "The King's Palace",
        price: 500
      },
      {
        ownerId: 2,
        address: "123 Disney Street",
        city: "Anaheim",
        state: "California",
        country: "United States of America",
        lat: 33.8121,
        lng: 117.9190,
        name: "Disneyland",
        description: "The Happiest Place on Earth",
        price: 200
      },
      {
        ownerId: 3,
        address: "13 Olympian Ave",
        city: "New York City",
        state: "New York",
        country: "United States of America",
        lat: 40.7484,
        lng: 73.9857,
        name: "Olympus",
        description: "The Palace of the Gods",
        price: 200
      },
      {
        ownerId: 3,
        address: "1450 Empire St",
        city: "New York City",
        state: "New York",
        country: "United States of America",
        lat: 40.7300,
        lng: 73.9850,
        name: "Empire State Building",
        description: "The tallest building in America",
        price: 180
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['The Red Keep', 'Disneyland', 'Olympus', 'Empire State Building'] }
    }, {});
  }
};
