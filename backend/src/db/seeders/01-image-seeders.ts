'use strict';

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Images';
    return queryInterface.bulkInsert(options, [
  {
    url: "The Greats"
  },
    {
    url: "The Greats"
  },
    {
    url: "The Greats"
  },

  
], {});
  },

  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [''] }
    }, {});
  }
};
