'use strict';

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Playlists';
    return queryInterface.bulkInsert(options, [
  {
    name: "The Greats",
    ownerId: "1",
    previewId: "1"
  },
    {
    name: "workout-mix",
    ownerId: "2",
    previewId: "2"
  },
    {
    name: "study-session",
    ownerId: "3",
    previewId: "3"
  }
  
], {});
  },

  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Playlists';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [''] }
    }, {});
  }
};
