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
        spotId: 1,
        url: "https://www.realestate.com.au/blog/images/800x532-fit,progressive,format=webp/2019/03/25153839/726739_953585_2832x4256.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://www.realestate.com.au/blog/images/800x532-fit,progressive,format=webp/2019/03/25154622/GOT707_799563_3102953_4500x2995.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://www.realestate.com.au/blog/images/800x532-fit,progressive,format=webp/2019/03/25153942/GOT705_799561_3109587_4500x29941.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://www.kennythepirate.com/wp-content/uploads/2020/01/Disneyland-Announces-Special-Offers-for-2020.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/anaheimca/0910ZR_0029CR_R3_RTD_51578b3c-f4b9-4b12-916b-56591be853d7.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Pixarpiersunset2019_%28cropped%29.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://www.parksavers.com/wp-content/uploads/2022/04/img_1044-scaled.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://www.ocregister.com/wp-content/uploads/2017/05/0525_nws_ocr-l-dcagotg-01-1.jpg?w=863",
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
        spotId: 3,
        url: "https://static.wikia.nocookie.net/gods-heroes/images/a/a0/1x08_War_for_Olympus_Mount_Olympus_9.png",
        preview: false
      },
      {
        spotId: 3,
        url: "http://shaleewanders.com/wp-content/uploads/2016/08/img_6607-1.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://greecetravelideas.com/wp-content/uploads/2020/06/Sculptural-complex-of-ancient-twelve-gods-on-academy-building-in-Athens-Greece-min.jpg",
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
      },
      {
        spotId: 4,
        url: "https://www.history.com/.image/t_share/MTU3ODc4NjAzNTE1NTA0MzUx/gettyimages-555173607-2.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://untappedcities.com/wp-content/uploads/2019/10/Empire-State-Building-102nd-Floor-Observatory-Floor-to-Ceiling-Windows-360-Degree-View-NYC-007.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Empire_State_Building_86th_floor.jpg/2560px-Empire_State_Building_86th_floor.jpg",
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
