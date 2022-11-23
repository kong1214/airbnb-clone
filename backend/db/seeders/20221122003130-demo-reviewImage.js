'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "king's-landing-onfire-picture",
      },
      {
        reviewId: 1,
        url: "king's-landing-cersei-picture",
      },
      {
        reviewId: 2,
        url: "olympus-food-picture",
      },
      {
        reviewId: 3,
        url: "disneyland-ferriswheel-picture",
      },
      {
        reviewId: 3,
        url: "disneyland-food-picture",
      },
      {
        reviewId: 4,
        url: "king's-landing-nedstark-picture",
      },
      {
        reviewId: 4,
        url: "king's-landing-throne-picture",
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
