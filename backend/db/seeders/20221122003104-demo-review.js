'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        review: "The place was okay. It was nice for the first five days, but day 6-8 was bad.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 1,
        review: "Food was overrated, but employees and the experience were great.",
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: "The place was beautiful. Gorgeous view and welcoming people.",
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: "Loved it! Just don't bring your newborns since the place is not baby-proof.",
        stars: 5
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
