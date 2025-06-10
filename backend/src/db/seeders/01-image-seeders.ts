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
    url: "https://i.pinimg.com/originals/d7/27/73/d72773f5b4bb520b504f600edd032dae.jpg"
  },
    {
    url: "https://i.scdn.co/image/ab67616d0000b2739c6589cb7500fa8e6f343990"
  },
    {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqPHtsaOJY2WgJ5bLcNwi227CBMs1bHeqAMA&s"
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
