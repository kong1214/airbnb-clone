'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: "2024-11-11",
        endDate: "2024-11-18"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2024-11-11",
        endDate: "2024-11-18"
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2024-11-20",
        endDate: "2024-11-23"
      },
      {
        spotId: 1,
        userId: 3,
        startDate: "2024-12-30",
        endDate: "2025-1-05"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
