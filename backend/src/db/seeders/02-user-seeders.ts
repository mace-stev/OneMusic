'use strict';

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
  {
    firstName: "SpongeBob",
    lastName: "Squarepants",
    email: "spongebob@aa.io",
    username: "Spongebob",
    hashedPassword: "$2a$10$RWA3t0FVaTYW1AOKNz5La.3jZDoe0RRqfZ3GFIIrmuNxnjHS0bxu6"
  },
  {
    firstName: "Patrick",
    lastName: "Star",
    email: "Patrick@Star.com",
    username: "PatrickStar",
    hashedPassword: "$2a$10$3LIv4Lvl2vpNWiQceaGh0uabDJomSvSetIJanpEzualAkKd9Nbbmm"
  },
  {
    firstName: "Joe",
    lastName: "Smith",
    email: "demo@aa.io",
    username: "demo",
    hashedPassword: "$2a$10$RWA3t0FVaTYW1AOKNz5La.3jZDoe0RRqfZ3GFIIrmuNxnjHS0bxu6"
  },
], {});
  },

  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [''] }
    }, {});
  }
};
