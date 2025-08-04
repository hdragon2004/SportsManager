'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tournament_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Tournament_Type has many tournaments
      Tournament_Type.hasMany(models.Tournament, {
        foreignKey: 'Type_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Tournament_Type.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    is_team_based: DataTypes.BOOLEAN,
    is_elimination: DataTypes.BOOLEAN,
    match_format: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tournament_Type',
  });
  return Tournament_Type;
};