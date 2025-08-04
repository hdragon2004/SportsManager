'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Registration belongs to a tournament
      Registration.belongsTo(models.Tournament, {
        foreignKey: 'Tournament_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Registration belongs to a team
      Registration.belongsTo(models.Team, {
        foreignKey: 'Team_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Registration has many notifications
      Registration.hasMany(models.Notification, {
        foreignKey: 'Registration_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Registration.init({
    Tournament_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tournaments',
        key: 'id'
      }
    },
    Team_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teams',
        key: 'id'
      }
    },
    time: DataTypes.DATE,
    approval_status: DataTypes.STRING,
    note: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Registration',
  });
  return Registration;
};