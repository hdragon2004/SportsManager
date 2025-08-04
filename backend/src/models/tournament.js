'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tournament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Tournament belongs to a tournament type
      Tournament.belongsTo(models.Tournament_Type, {
        foreignKey: 'Type_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Tournament has many registrations
      Tournament.hasMany(models.Registration, {
        foreignKey: 'Tournament_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Tournament has many matches
      Tournament.hasMany(models.Match, {
        foreignKey: 'Tournament_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Tournament has many notifications
      Tournament.hasMany(models.Notification, {
        foreignKey: 'Tournament_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Tournament.init({
    Type_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tournament_Types',
        key: 'id'
      }
    },
    name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    location: DataTypes.STRING,
    rules: DataTypes.TEXT,
    prize: DataTypes.STRING,
    max_teams: DataTypes.INTEGER,
    banner_url: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    signup_deadline: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Tournament',
  });
  return Tournament;
};