'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team_Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Team_Member belongs to a team
      Team_Member.belongsTo(models.Team, {
        foreignKey: 'Team_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Team_Member.init({
    Team_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teams',
        key: 'id'
      }
    },
    name: DataTypes.STRING,
    // Add new fields from the diagram with camelCase to match Sequelize conventions
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Team_Member',
  });
  return Team_Member;
};