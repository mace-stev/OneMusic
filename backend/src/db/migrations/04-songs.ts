"use strict";

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    return queryInterface.createTable("Songs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull:false,
        type: Sequelize.STRING(120)
      },
       artist: {
        allowNull:false,
        type: Sequelize.STRING(120)
      },
 
      previewId: {
        type: Sequelize.INTEGER,
        allowNull: true,
         references: {
          model: {
            tableName: "Images",  
            schema: options.schema  
          },
          key: "id"
        },
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = "Songs";
    return queryInterface.dropTable(options);
  }
};
