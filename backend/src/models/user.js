'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User has many teams
      User.hasMany(models.Team, { 
        foreignKey: 'User_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // User belongs to many roles through Role_User
      User.belongsToMany(models.Role, {
        through: models.Role_User,
        foreignKey: 'User_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // User has many notifications
      User.hasMany(models.Notification, { 
        foreignKey: 'User_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};