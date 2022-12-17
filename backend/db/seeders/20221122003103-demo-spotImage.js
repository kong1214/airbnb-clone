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
        url: "https://watchersonthewall.com/wp-content/uploads/2017/03/Kings-Landing-Red-Keep-North-4x08.png",
        preview: true
      },
      {
        spotId: 1,
        url: "https://blenderartists.org/uploads/default/original/4X/f/a/e/fae83c9d2cbb601e8453049e145848b1636598f2.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/anaheimca/0910ZR_0029CR_R3_RTD_51578b3c-f4b9-4b12-916b-56591be853d7.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Pixarpiersunset2019_%28cropped%29.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://diginomica.com/sites/default/files/images/2017-03/olympus.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://www.ancient-origins.net/sites/default/files/field/image/Mount-Olympus.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://thebettervacation.com/wp-content/uploads/2020/11/Empire-State-Buildings-Lobby.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://worldadventurists.com/wp-content/uploads/2018/05/empirestate05.jpg",
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
