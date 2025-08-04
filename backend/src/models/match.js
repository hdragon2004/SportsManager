'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Match belongs to a tournament
      Match.belongsTo(models.Tournament, {
        foreignKey: 'Tournament_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Match belongs to many teams through Match_Team
      Match.belongsToMany(models.Team, {
        through: models.Match_Team,
        foreignKey: 'Match_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Match.init({
    Tournament_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tournaments',
        key: 'id'
      }
    },
    match_date: DataTypes.DATE,
    location: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Match',
  });
  return Match;
};