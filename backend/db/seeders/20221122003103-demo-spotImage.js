'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "king's-landing-picture1",
        preview: true
      },
      {
        spotId: 1,
        url: "king's-landing-picture2",
        preview: false
      },
      {
        spotId: 2,
        url: "disneyland-picture1",
        preview: true
      },
      {
        spotId: 2,
        url: "disneyland-picture2",
        preview: false
      },
      {
        spotId: 3,
        url: "olympus-picture1",
        preview: true
      },
      {
        spotId: 3,
        url: "olympus-picture2",
        preview: false
      },
      {
        spotId: 4,
        url: "empire-state-building-picture1",
        preview: true
      },
      {
        spotId: 4,
        url: "empire-state-building-picture2",
        preview: false
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
