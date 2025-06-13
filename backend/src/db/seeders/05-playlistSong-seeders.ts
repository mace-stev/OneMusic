'use strict';

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'PlaylistSong';
    return queryInterface.bulkInsert(options, [
  {
    playlistId: 1,
    songId: 1
  },
    {
    playlistId: 2,
    songId: 2
  },
    {
    playlistId: 3,
    songId: 3
  },
 
  
], {});
  },

  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'PlaylistSong';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [''] }
    }, {});
  }
};
