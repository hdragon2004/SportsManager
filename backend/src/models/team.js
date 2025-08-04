'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Team belongs to a user
      Team.belongsTo(models.User, { 
        foreignKey: 'User_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Team has many team members
      Team.hasMany(models.Team_Member, {
        foreignKey: 'Team_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Team has many registrations
      Team.hasMany(models.Registration, {
        foreignKey: 'Team_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Team belongs to many matches through Match_Team
      Team.belongsToMany(models.Match, {
        through: models.Match_Team,
        foreignKey: 'Team_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Team.init({
    name: DataTypes.STRING,
    // Add new fields from the diagram with camelCase to match Sequelize conventions
    teamCode: DataTypes.STRING,
    logo: DataTypes.STRING,
    description: DataTypes.TEXT,
    User_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Team',
  });
  
  return Team;
};