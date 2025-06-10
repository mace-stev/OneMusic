'use strict';

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Songs';
    return queryInterface.bulkInsert(options, [
  {
    title: "G6",
    artist: "Lil Wayne",
    playlistId: "1",
    previewId: "1"
  },
    {
    title: "Let's Go",
    artist: "Key Glock",
    playlistId: "2",
    previewId: "2"
  },
    {
    title: "BLOCC IS HOT",
    artist: "NLE Choppa",
    playlistId: "3",
    previewId: "3"
  },
 
  
], {});
  },

  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Songs';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [''] }
    }, {});
  }
};
