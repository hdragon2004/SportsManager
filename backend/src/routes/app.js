import express from 'express';
import * as authController from '~/controllers/authController';
import * as userController from '~/controllers/userController';
import * as roleController from '~/controllers/roleController';
import * as roleUserController from '~/controllers/roleUserController';

import * as teamController from '~/controllers/teamController';
import * as teamMemberController from '~/controllers/teamMemberController';
import * as tournamentController from '~/controllers/tournamentController';
import * as tournamentTypeController from '~/controllers/tournamentTypeController';
import * as registrationController from '~/controllers/registrationController';
import * as matchController from '~/controllers/matchController';

import * as notificationController from '~/controllers/notificationController';
// Import middleware đúng cách
import { authMiddleware } from '~/middlewares/authMiddleware';
import { checkDataAccess, filterDataByUser } from '~/middlewares/authorizationMiddleware';
import { userValidation } from '~/validations/userValidation';
import { tournamentValidation } from '~/validations/tournamentValidation';

export function AppRoutes(app) {
    const authRouter = express.Router();
    authRouter.post('/register', authController.register);
    authRouter.post('/login', authController.login);
    // Dùng authMiddleware để đảm bảo chỉ người dùng đã đăng nhập mới được đổi mật khẩu
    authRouter.post('/change-password', authMiddleware, authController.changePassword);
    // Endpoint để lấy thông tin user hiện tại
    authRouter.get('/me', authMiddleware, authController.getCurrentUser);
    
    // Test endpoint để kiểm tra token
    authRouter.get('/test-token', authMiddleware, authController.testToken);

    app.use('/api/auth', authRouter);

    const router = express.Router();

    // User routes
    router.get('/users', authMiddleware, filterDataByUser('user'), userController.getAllUsers);
    router.get('/users/search', authMiddleware, userController.searchUsersController);
    router.get('/users/:id', authMiddleware, checkDataAccess('user'), userController.getUser);

    // Áp dụng authMiddleware cho các route cần bảo vệ
    router.put('/users/:id', authMiddleware, checkDataAccess('user'), userValidation.update, userController.putUser);
    router.delete('/users/:id', authMiddleware, checkDataAccess('user'), userController.removeUser);

    // Role routes (Chỉ admin)
    router.get('/roles', authMiddleware, filterDataByUser('user'), roleController.getAllRoles);
    router.get('/roles/:id', authMiddleware, checkDataAccess('user'), roleController.getRole);
    router.post('/roles', authMiddleware, checkDataAccess('user'), roleController.createRole);
    router.put('/roles/:id', authMiddleware, checkDataAccess('user'), roleController.updateRole);
    router.delete('/roles/:id', authMiddleware, checkDataAccess('user'), roleController.deleteRole);

    // Role User routes (Chỉ admin)
    router.get('/role-users', authMiddleware, filterDataByUser('user'), roleUserController.getAllRoleUsers);
    router.get('/role-users/:id', authMiddleware, checkDataAccess('user'), roleUserController.getRoleUser);
    router.post('/role-users', authMiddleware, checkDataAccess('user'), roleUserController.createRoleUser);
    router.put('/role-users/:id', authMiddleware, checkDataAccess('user'), roleUserController.updateRoleUser);
    router.delete('/role-users/:id', authMiddleware, checkDataAccess('user'), roleUserController.deleteRoleUser);
    
    // Route để user xin quyền huấn luyện viên
    router.post('/request-coach-role', authMiddleware, filterDataByUser('user'), roleUserController.requestCoachRole);
    
    // Routes để admin xử lý yêu cầu xin quyền huấn luyện viên
    router.get('/coach-role-requests', authMiddleware, checkDataAccess('user'), roleUserController.getCoachRoleRequests);
    router.put('/coach-role-requests/:id/process', authMiddleware, checkDataAccess('user'), roleUserController.processCoachRoleRequest);



    // Team routes
    router.get('/teams', authMiddleware, filterDataByUser('team'), teamController.getAllTeams);
    router.get('/teams/:id', authMiddleware, checkDataAccess('team'), teamController.getTeam);
    router.post('/teams', authMiddleware, teamController.createTeam);
    router.put('/teams/:id', authMiddleware, checkDataAccess('team'), teamController.updateTeam);
    router.delete('/teams/:id', authMiddleware, checkDataAccess('team'), teamController.deleteTeam);
    router.post('/teams/:teamId/members', authMiddleware, checkDataAccess('team'), teamController.addMemberToTeam);
    router.delete('/teams/:teamId/members/:memberId', authMiddleware, checkDataAccess('team'), teamController.removeMemberFromTeam);

    // Team Member routes
    router.get('/team-members', authMiddleware, filterDataByUser('team'), teamMemberController.getAllTeamMembers);
    router.get('/team-members/:id', authMiddleware, checkDataAccess('team'), teamMemberController.getTeamMember);
    router.post('/team-members', authMiddleware, teamMemberController.createTeamMember);
    router.put('/team-members/:id', authMiddleware, checkDataAccess('team'), teamMemberController.updateTeamMember);
    router.delete('/team-members/:id', authMiddleware, checkDataAccess('team'), teamMemberController.deleteTeamMember);
    router.get('/teams/:teamId/members', authMiddleware, checkDataAccess('team'), teamMemberController.getTeamMembersByTeam);



    // Tournament Type routes (Chỉ admin)
    router.get('/tournament-types', authMiddleware, filterDataByUser('user'), tournamentTypeController.getAllTournamentTypes);
    router.get('/tournament-types/:id', authMiddleware, checkDataAccess('user'), tournamentTypeController.getTournamentType);
    router.post('/tournament-types', authMiddleware, checkDataAccess('user'), tournamentTypeController.createTournamentType);
    router.put('/tournament-types/:id', authMiddleware, checkDataAccess('user'), tournamentTypeController.updateTournamentType);
    router.delete('/tournament-types/:id', authMiddleware, checkDataAccess('user'), tournamentTypeController.deleteTournamentType);

    // Public Tournament routes (Không cần đăng nhập để xem)
    router.get('/public/tournaments', tournamentController.getAllPublicTournaments);
    router.get('/public/tournaments/:id', tournamentController.getPublicTournament);
    router.get('/public/tournaments/:id/registration-status', tournamentController.getPublicTournamentRegistrationStatus);
    router.get('/public/tournaments/:tournamentId/matches', matchController.getPublicMatchesByTournament);

    // Tournament routes (Cần đăng nhập để thao tác)
    router.get('/tournaments', authMiddleware, filterDataByUser('tournament'), tournamentController.getAllTournaments);
    router.get('/tournaments/:id', authMiddleware, checkDataAccess('tournament'), tournamentController.getTournament);
    router.get('/tournaments/:id/registration-status', authMiddleware, checkDataAccess('tournament'), tournamentController.getTournamentRegistrationStatus);
    router.post('/tournaments', authMiddleware, tournamentValidation.createTournament, tournamentController.createTournament);
    router.put('/tournaments/:id', authMiddleware, checkDataAccess('tournament'), tournamentValidation.updateTournament, tournamentController.updateTournament);
    router.delete('/tournaments/:id', authMiddleware, checkDataAccess('tournament'), tournamentController.deleteTournament);

    // Registration routes
    router.get('/registrations', authMiddleware, filterDataByUser('registration'), registrationController.getAllRegistrations);
    router.get('/registrations/:id', authMiddleware, checkDataAccess('registration'), registrationController.getRegistration);
    router.post('/registrations', authMiddleware, registrationController.createRegistration);
    router.put('/registrations/:id', authMiddleware, checkDataAccess('registration'), registrationController.updateRegistration);
    router.delete('/registrations/:id', authMiddleware, checkDataAccess('registration'), registrationController.deleteRegistration);
    router.get('/tournaments/:tournamentId/registrations', authMiddleware, checkDataAccess('registration'), registrationController.getRegistrationsByTournament);
    router.get('/teams/:teamId/registrations', authMiddleware, checkDataAccess('registration'), registrationController.getRegistrationsByTeam);
    router.get('/tournaments/:tournamentId/teams/:teamId/registration', authMiddleware, checkDataAccess('registration'), registrationController.checkTeamRegistration);

    // Match routes
    router.get('/matches', authMiddleware, filterDataByUser('match'), matchController.getAllMatches);
    router.get('/matches/:id', authMiddleware, checkDataAccess('match'), matchController.getMatch);
    router.post('/matches', authMiddleware, matchController.createMatch);
    router.put('/matches/:id', authMiddleware, checkDataAccess('match'), matchController.updateMatch);
    router.delete('/matches/:id', authMiddleware, checkDataAccess('match'), matchController.deleteMatch);
    router.get('/tournaments/:tournamentId/matches', authMiddleware, checkDataAccess('match'), matchController.getMatchesByTournament);

    // Notification routes
    router.get('/notifications', authMiddleware, filterDataByUser('notification'), notificationController.getAllNotificationsController);
    router.get('/notifications/:id', authMiddleware, checkDataAccess('notification'), notificationController.getNotificationByIdController);
    router.post('/notifications', authMiddleware, notificationController.createNotificationController);
    router.put('/notifications/:id', authMiddleware, checkDataAccess('notification'), notificationController.updateNotificationController);
    router.delete('/notifications/:id', authMiddleware, checkDataAccess('notification'), notificationController.deleteNotificationController);
    router.get('/users/:userId/notifications', authMiddleware, checkDataAccess('notification'), notificationController.getNotificationsByUserIdController);
    router.get('/users/:userId/notifications/unread-count', authMiddleware, checkDataAccess('notification'), notificationController.getUnreadNotificationsCountController);
    router.put('/notifications/:id/read', authMiddleware, checkDataAccess('notification'), notificationController.markAsReadController);
    router.put('/notifications/read-all', authMiddleware, filterDataByUser('notification'), notificationController.markAllAsReadController);
    router.put('/users/:userId/notifications/read-all', authMiddleware, checkDataAccess('notification'), notificationController.markAllAsReadController);
    
    // Auto notification routes (Chỉ admin)
    router.post('/notifications/send-today-tournaments', authMiddleware, checkDataAccess('notification'), notificationController.sendTodayTournamentsNotificationController);
    router.post('/notifications/send-match-reminder', authMiddleware, checkDataAccess('notification'), notificationController.sendMatchReminderNotificationController);
    router.post('/notifications/start-schedule', authMiddleware, checkDataAccess('notification'), notificationController.startNotificationScheduleController);
    router.get('/notifications/today-matches', authMiddleware, checkDataAccess('notification'), notificationController.getTodayMatchesController);

    // Sử dụng router chính với tiền tố /api
    app.use('/api', router);
}