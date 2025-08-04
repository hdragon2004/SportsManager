'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Notification belongs to a user
      Notification.belongsTo(models.User, {
        foreignKey: 'User_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Notification belongs to a tournament (optional)
      Notification.belongsTo(models.Tournament, {
        foreignKey: 'Tournament_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      
      // Notification belongs to a registration (optional)
      Notification.belongsTo(models.Registration, {
        foreignKey: 'Registration_ID',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    type: DataTypes.STRING,
    is_read: DataTypes.BOOLEAN,
    time_sent: DataTypes.DATE,
    priority: DataTypes.INTEGER,
    is_deleted: DataTypes.BOOLEAN,
    User_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    Tournament_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tournaments',
        key: 'id'
      },
      allowNull: true
    },
    Registration_ID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Registrations',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};