"use strict";

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    return queryInterface.createTable("Playlists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull:false,
        type: Sequelize.STRING(45)
      },
      ownerId: {
        allowNull:false,
        type: Sequelize.INTEGER,
         references: {
          model: {
            tableName: "Users",  
            schema: options.schema  
          },
          key: "id"
        },
        onDelete: 'CASCADE',
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
    options.tableName = "Playlists";
    return queryInterface.dropTable(options);
  }
};
