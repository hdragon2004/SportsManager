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
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    requestDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role_User',
  });
  return Role_User;
};