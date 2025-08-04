import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import models from '~/models';

// Middleware kiểm tra quyền truy cập dữ liệu của user
export const checkDataAccess = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy thông tin người dùng'));
      }

      // Kiểm tra role của user
      const userWithRoles = await models.User.findByPk(userId, {
        include: [{
          model: models.Role,
          through: models.Role_User
        }]
      });

      if (!userWithRoles) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng'));
      }

      // Kiểm tra nếu user có role admin thì cho phép truy cập tất cả
      const isAdmin = userWithRoles.Roles?.some(role => role.name === 'admin');
      if (isAdmin) {
        req.userRoles = userWithRoles.Roles;
        return next();
      }

      // Lưu thông tin user và roles vào request
      req.userRoles = userWithRoles.Roles;
      req.userData = userWithRoles;

      // Kiểm tra quyền truy cập theo loại resource
      switch (resourceType) {
        case 'user':
          await checkUserAccess(req, res, next);
          break;
        case 'team':
          await checkTeamAccess(req, res, next);
          break;
        case 'tournament':
          await checkTournamentAccess(req, res, next);
          break;
        case 'match':
          await checkMatchAccess(req, res, next);
          break;
        case 'registration':
          await checkRegistrationAccess(req, res, next);
          break;
        case 'notification':
          await checkNotificationAccess(req, res, next);
          break;
        default:
          return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập'));
      }
    } catch (error) {
      console.error('Authorization error:', error);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi kiểm tra quyền truy cập'));
    }
  };
};

// Kiểm tra quyền truy cập user data
const checkUserAccess = async (req, res, next) => {
  const userId = req.user.userId;
  const targetUserId = req.params.id || req.body.User_ID;

  // Kiểm tra nếu user có role admin thì cho phép truy cập tất cả
  const isAdmin = req.userRoles?.some(role => role.name === 'admin');
  if (isAdmin) {
    return next();
  }

  // User chỉ có thể xem/sửa thông tin của chính mình
  if (targetUserId && parseInt(targetUserId) !== userId) {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin người dùng khác'));
  }

  next();
};

// Kiểm tra quyền truy cập team data
const checkTeamAccess = async (req, res, next) => {
  const userId = req.user.userId;
  const teamId = req.params.id || req.body.Team_ID;

  // Kiểm tra nếu user có role admin thì cho phép truy cập tất cả
  const isAdmin = req.userRoles?.some(role => role.name === 'admin');
  if (isAdmin) {
    return next();
  }

  if (teamId) {
    // Kiểm tra xem user có phải là chủ sở hữu của team không
    const team = await models.Team.findOne({
      where: {
        id: teamId,
        User_ID: userId
      }
    });

    if (!team) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin đội này'));
    }
  }

  next();
};

// Kiểm tra quyền truy cập tournament data
const checkTournamentAccess = async (req, res, next) => {
  const userId = req.user.userId;
  const tournamentId = req.params.id || req.params.tournamentId || req.body.Tournament_ID;

  // Kiểm tra nếu user có role admin thì cho phép truy cập tất cả
  const isAdmin = req.userRoles?.some(role => role.name === 'admin');
  if (isAdmin) {
    return next();
  }

  if (tournamentId) {
    // Lấy thông tin tournament để kiểm tra trạng thái
    const tournament = await models.Tournament.findByPk(tournamentId);
    
    if (!tournament) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy giải đấu'));
    }

    // Kiểm tra nếu tournament đang trong giai đoạn đăng ký thì cho phép xem
    const now = new Date();
    const registrationDeadline = new Date(tournament.signup_deadline || tournament.registration_deadline);
    
    if (now < registrationDeadline) {
      // Tournament đang trong giai đoạn đăng ký, cho phép xem
      return next();
    }

    // Nếu không trong giai đoạn đăng ký, kiểm tra xem user có đăng ký tham gia không
    const registration = await models.Registration.findOne({
      where: {
        Tournament_ID: tournamentId
      },
      include: [{
        model: models.Team,
        where: { User_ID: userId }
      }]
    });

    if (!registration) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin giải đấu này'));
    }
  }

  next();
};

// Kiểm tra quyền truy cập match data
const checkMatchAccess = async (req, res, next) => {
  const userId = req.user.userId;
  const matchId = req.params.id || req.body.Match_ID;
  const tournamentId = req.params.tournamentId || req.body.Tournament_ID;

  // Kiểm tra nếu user có role admin thì cho phép truy cập tất cả
  const isAdmin = req.userRoles?.some(role => role.name === 'admin');
  if (isAdmin) {
    return next();
  }

  if (matchId) {
    // Kiểm tra xem match có thuộc tournament mà user tham gia không
    const match = await models.Match.findByPk(matchId, {
      include: [{
        model: models.Tournament,
        include: [{
          model: models.Registration,
          include: [{
            model: models.Team,
            where: { User_ID: userId }
          }]
        }]
      }]
    });

    if (!match || !match.Tournament.Registrations.length) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin trận đấu này'));
    }
  }

  if (tournamentId) {
    // Kiểm tra quyền truy cập tournament
    await checkTournamentAccess(req, res, next);
    return;
  }

  next();
};

// Kiểm tra quyền truy cập registration data
const checkRegistrationAccess = async (req, res, next) => {
  const userId = req.user.userId;
  const registrationId = req.params.id || req.body.Registration_ID;
  const tournamentId = req.params.tournamentId || req.body.Tournament_ID;

  // Kiểm tra nếu user có role admin thì cho phép truy cập tất cả
  const isAdmin = req.userRoles?.some(role => role.name === 'admin');
  if (isAdmin) {
    return next();
  }

  if (registrationId) {
    // Kiểm tra xem registration có thuộc về user không
    const registration = await models.Registration.findByPk(registrationId, {
      include: [{
        model: models.Team,
        where: { User_ID: userId }
      }]
    });

    if (!registration) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin đăng ký này'));
    }
  }

  if (tournamentId) {
    // Kiểm tra quyền truy cập tournament
    await checkTournamentAccess(req, res, next);
    return;
  }

  next();
};

// Kiểm tra quyền truy cập notification data
const checkNotificationAccess = async (req, res, next) => {
  const userId = req.user.userId;
  const notificationId = req.params.id || req.body.Notification_ID;
  const targetUserId = req.params.userId || req.body.User_ID;

  // Kiểm tra nếu user có role admin thì cho phép truy cập tất cả
  const isAdmin = req.userRoles?.some(role => role.name === 'admin');
  if (isAdmin) {
    return next();
  }

  if (notificationId) {
    // Kiểm tra xem notification có thuộc về user không
    const notification = await models.Notification.findByPk(notificationId);

    if (!notification || notification.User_ID !== userId) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông báo này'));
    }
  }

  // Kiểm tra quyền truy cập thông báo của user khác
  if (targetUserId) {
    const targetUserIdInt = parseInt(targetUserId);
    if (isNaN(targetUserIdInt) || targetUserIdInt !== userId) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông báo của người khác'));
    }
  }

  next();
};

// Middleware lọc dữ liệu theo user
export const filterDataByUser = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy thông tin người dùng'));
      }

      // Kiểm tra role của user
      const userWithRoles = await models.User.findByPk(userId, {
        include: [{
          model: models.Role,
          through: models.Role_User
        }]
      });

      // Lưu thông tin user và roles vào request để controllers sử dụng
      req.userData = userWithRoles;
      req.userRoles = userWithRoles.Roles;
      req.userId = userId;

      // Nếu user có role admin thì không cần lọc
      const isAdmin = userWithRoles.Roles?.some(role => role.name === 'admin');
      if (isAdmin) {
        return next();
      }

      // Đối với tournaments, cho phép user xem tất cả (sẽ được lọc trong controller)
      if (resourceType === 'tournament') {
        return next();
      }

      next();
    } catch (error) {
      console.error('Filter data error:', error);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi lọc dữ liệu'));
    }
  };
}; 