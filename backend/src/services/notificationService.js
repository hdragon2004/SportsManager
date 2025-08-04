import models from '~/models';

const getAllNotifications = async () => {
  const notifications = await models.Notification.findAll({
    include: [
      { model: models.User },
      { model: models.Tournament },
      { model: models.Registration }
    ]
  });
  return notifications;
};

const getNotificationById = async (id) => {
  const notification = await models.Notification.findByPk(id, {
    include: [
      { model: models.User },
      { model: models.Tournament },
      { model: models.Registration }
    ]
  });
  return notification;
};

const getNotificationsByUserId = async (userId) => {
  const notifications = await models.Notification.findAll({
    where: { 
      User_ID: userId,
      is_deleted: false 
    },
    include: [
      { model: models.Tournament },
      { model: models.Registration }
    ],
    order: [
      ['time_sent', 'DESC']
    ]
  });
  return notifications;
};

const getUnreadNotificationsCount = async (userId) => {
  try {
    const count = await models.Notification.count({
      where: { 
        User_ID: userId,
        is_read: false,
        is_deleted: false 
      }
    });
    return count;
  } catch (error) {
    console.error('Error in getUnreadNotificationsCount:', error);
    throw error;
  }
};

const createNotification = async (notificationData) => {
  // Set default values if not provided
  const notificationWithDefaults = {
    ...notificationData,
    is_read: notificationData.is_read !== undefined ? notificationData.is_read : false,
    time_sent: notificationData.time_sent || new Date(),
    priority: notificationData.priority || 1,
    is_deleted: notificationData.is_deleted !== undefined ? notificationData.is_deleted : false
  };
  
  const notification = await models.Notification.create(notificationWithDefaults);
  return notification;
};

const updateNotification = async (id, updateData) => {
  await models.Notification.update(updateData, {
    where: { id },
  });
  return getNotificationById(id);
};

const deleteNotification = async (id) => {
  // Soft delete - mark as deleted instead of removing from database
  await models.Notification.update(
    { is_deleted: true },
    { where: { id } }
  );
  return true;
};

const markAsRead = async (id) => {
  await models.Notification.update(
    { is_read: true },
    { where: { id } }
  );
  return getNotificationById(id);
};

const markAllAsRead = async (userId) => {
  await models.Notification.update(
    { is_read: true },
    { where: { User_ID: userId, is_read: false, is_deleted: false } }
  );
  return true;
};

export {
  getAllNotifications,
  getNotificationById,
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead
}; 