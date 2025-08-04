'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match_Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Match_Team belongs to a match
      Match_Team.belongsTo(models.Match, {
        foreignKey: 'Match_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Match_Team belongs to a team
      Match_Team.belongsTo(models.Team, {
        foreignKey: 'Team_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Match_Team.init({
    Match_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Matches',
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
    is_winner: DataTypes.BOOLEAN,
    result: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Match_Team',
  });
  return Match_Team;
};