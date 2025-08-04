const seedData = require('./seed-data');
const models = require('../models');

async function seedDatabase() {
  try {
    console.log('🔄 Bắt đầu seed database...');

    // 1. Seed Users
    console.log('📝 Đang tạo Users...');
    await models.User.bulkCreate(seedData.users, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['name', 'phone', 'email', 'password', 'avatar', 'isActive']
    });
    console.log('✅ Users đã được tạo thành công');

    // 2. Seed Roles
    console.log('📝 Đang tạo Roles...');
    await models.Role.bulkCreate(seedData.roles, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['name', 'description']
    });
    console.log('✅ Roles đã được tạo thành công');

    // 3. Seed Role_Users
    console.log('📝 Đang tạo Role_Users...');
    await models.Role_User.bulkCreate(seedData.roleUsers, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['User_ID', 'Role_ID']
    });
    console.log('✅ Role_Users đã được tạo thành công');

    // 4. Seed Tournament Types
    console.log('📝 Đang tạo Tournament Types...');
    await models.Tournament_Type.bulkCreate(seedData.tournamentTypes, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['name', 'description']
    });
    console.log('✅ Tournament Types đã được tạo thành công');

    // 5. Seed Teams
    console.log('📝 Đang tạo Teams...');
    await models.Team.bulkCreate(seedData.teams, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['name', 'teamCode', 'logo', 'description', 'User_ID']
    });
    console.log('✅ Teams đã được tạo thành công');

    // 6. Seed Team_Members
    console.log('📝 Đang tạo Team_Members...');
    await models.Team_Member.bulkCreate(seedData.teamMembers, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['Team_ID', 'name', 'age', 'gender', 'phone', 'dateOfBirth']
    });
    console.log('✅ Team_Members đã được tạo thành công');

    // 7. Seed Tournaments
    console.log('📝 Đang tạo Tournaments...');
    await models.Tournament.bulkCreate(seedData.tournaments, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['name', 'Type_ID', 'start_date', 'end_date', 'location', 'rules', 'prize', 'max_teams', 'banner_url', 'description', 'status']
    });
    console.log('✅ Tournaments đã được tạo thành công');

    // 7. Seed Registrations
    console.log('📝 Đang tạo Registrations...');
    await models.Registration.bulkCreate(seedData.registrations, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['Tournament_ID', 'Team_ID', 'points', 'wins', 'draws', 'losses', 'goals_for', 'goals_against', 'approval_status']
    });
    console.log('✅ Registrations đã được tạo thành công');

    // 8. Seed Matches
    console.log('📝 Đang tạo Matches...');
    await models.Match.bulkCreate(seedData.matches, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['Tournament_ID', 'match_date', 'location', 'status']
    });
    console.log('✅ Matches đã được tạo thành công');

    // 9. Seed Match_Teams
    console.log('📝 Đang tạo Match_Teams...');
    await models.Match_Team.bulkCreate(seedData.matchTeams, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['Match_ID', 'Team_ID']
    });
    console.log('✅ Match_Teams đã được tạo thành công');

    // 10. Seed Notifications
    console.log('📝 Đang tạo Notifications...');
    await models.Notification.bulkCreate(seedData.notifications, { 
      ignoreDuplicates: true,
      updateOnDuplicate: ['User_ID', 'Tournament_ID', 'Registration_ID', 'title', 'message', 'type', 'is_read']
    });
    console.log('✅ Notifications đã được tạo thành công');

    console.log('🎉 Seed database hoàn thành thành công!');
    console.log('\n📊 Thống kê dữ liệu đã tạo:');
    console.log(`- Users: ${seedData.users.length}`);
    console.log(`- Roles: ${seedData.roles.length}`);
    console.log(`- Tournament Types: ${seedData.tournamentTypes.length}`);
    console.log(`- Teams: ${seedData.teams.length}`);
    console.log(`- Team_Members: ${seedData.teamMembers.length}`);
    console.log(`- Tournaments: ${seedData.tournaments.length}`);
    console.log(`- Registrations: ${seedData.registrations.length}`);
    console.log(`- Matches: ${seedData.matches.length}`);
    console.log(`- Match_Teams: ${seedData.matchTeams.length}`);
    console.log(`- Notifications: ${seedData.notifications.length}`);

    console.log('\n🔑 Thông tin đăng nhập test:');
    console.log('Email: admin@example.com');
    console.log('Password: 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    process.exit(1);
  }
}

// Chạy seed nếu file được gọi trực tiếp
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 