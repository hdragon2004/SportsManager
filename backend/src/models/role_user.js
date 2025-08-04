'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Role_User belongs to User
      Role_User.belongsTo(models.User, { 
        foreignKey: 'User_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Role_User belongs to Role
      Role_User.belongsTo(models.Role, { 
        foreignKey: 'Role_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Role_User.init({
    Role_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    User_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role_User',
  });
  return Role_User;
};