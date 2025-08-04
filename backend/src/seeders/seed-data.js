const bcrypt = require('bcrypt');

module.exports = {
  // Users data
  users: [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0987654321',
      email: 'hlv@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0369852147',
      email: 'user2@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      phone: '0523698741',
      email: 'user3@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      phone: '0741852963',
      email: 'user4@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'Vũ Thị F',
      phone: '0852741963',
      email: 'user5@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      name: 'Đỗ Văn G',
      phone: '0963852741',
      email: 'user6@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: 'Lý Thị H',
      phone: '0874563219',
      email: 'user7@example.com',
      password: bcrypt.hashSync('123456', 10),
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Roles data
  roles: [
    {
      id: 1,
      name: 'admin',
      description: 'Administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'user',
      description: 'Regular user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'moderator',
      description: 'Moderator',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Role_Users data
  roleUsers: [
    {
      id: 1,
      User_ID: 1,
      Role_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      User_ID: 2,
      Role_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      User_ID: 3,
      Role_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      User_ID: 4,
      Role_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      User_ID: 5,
      Role_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      User_ID: 6,
      Role_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      User_ID: 7,
      Role_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      User_ID: 8,
      Role_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Tournament Types data
  tournamentTypes: [
    {
      id: 1,
      name: 'Bóng đá 11 người',
      description: 'Giải đấu bóng đá 11 người theo luật FIFA',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Bóng đá 7 người',
      description: 'Giải đấu bóng đá 7 người sân nhỏ',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Bóng đá 5 người',
      description: 'Giải đấu bóng đá 5 người sân futsal',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Chạy bộ',
      description: 'Giải đấu chạy bộ đường trường',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Cầu lông',
      description: 'Giải đấu cầu lông',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Teams data
  teams: [
    {
      id: 1,
      name: 'Đội bóng ĐH Khoa học Tự nhiên',
      teamCode: 'HUS',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Khoa học Tự nhiên',
      User_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Đội bóng ĐH Bách khoa',
      teamCode: 'HCMUT',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Bách khoa',
      User_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Đội bóng ĐH Kinh tế',
      teamCode: 'UEH',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Kinh tế',
      User_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Đội bóng ĐH Y Dược',
      teamCode: 'UMP',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Y Dược',
      User_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Đội bóng ĐH Sư phạm',
      teamCode: 'HCMUE',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Sư phạm',
      User_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'Đội bóng ĐH Ngoại thương',
      teamCode: 'FTU',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Ngoại thương',
      User_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      name: 'Đội bóng ĐH Tôn Đức Thắng',
      teamCode: 'TDTU',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Tôn Đức Thắng',
      User_ID: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: 'Đội bóng ĐH Công nghệ Thông tin',
      teamCode: 'UIT',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội bóng đại diện trường ĐH Công nghệ Thông tin',
      User_ID: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      name: 'Đội cầu lông HUS',
      teamCode: 'HUS_BAD',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội cầu lông ĐH Khoa học Tự nhiên',
      User_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      name: 'Đội cầu lông HCMUT',
      teamCode: 'HCMUT_BAD',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội cầu lông ĐH Bách khoa',
      User_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      name: 'Đội cầu lông UEH',
      teamCode: 'UEH_BAD',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội cầu lông ĐH Kinh tế',
      User_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      name: 'Đội cầu lông UMP',
      teamCode: 'UMP_BAD',
      logo: 'https://via.placeholder.com/100',
      description: 'Đội cầu lông ĐH Y Dược',
      User_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Tournaments data
  tournaments: [
    {
      id: 1,
      Type_ID: 1,
      name: 'Giải bóng đá sinh viên TP.HCM 2025',
      start_date: new Date('2025-09-15'),
      end_date: new Date('2025-09-20'),
      signup_deadline: new Date('2025-09-10'),
      location: 'Sân vận động trường ĐH Khoa học Tự nhiên',
      rules: 'Thi đấu theo luật FIFA, 11 người mỗi đội',
      prize: '50,000,000 VND',
      max_teams: 16,
      banner_url: 'https://via.placeholder.com/800x400',
      description: 'Giải đấu bóng đá sinh viên các trường ĐH tại TP.HCM',
      status: 'registration',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      Type_ID: 2,
      name: 'Giải bóng đá 7 người mùa hè 2025',
      start_date: new Date('2025-09-15'),
      end_date: new Date('2025-09-20'),
      signup_deadline: new Date('2025-09-10'),
      location: 'Sân bóng đá mini TP.HCM',
      rules: 'Thi đấu theo luật bóng đá 7 người',
      prize: '30,000,000 VND',
      max_teams: 8,
      banner_url: 'https://via.placeholder.com/800x400',
      description: 'Giải đấu bóng đá 7 người mùa hè',
      status: 'registration',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      Type_ID: 3,
      name: 'Giải futsal sinh viên 2025',
      start_date: new Date('2025-09-15'),
      end_date: new Date('2025-09-20'),
      signup_deadline: new Date('2025-09-10'),
      location: 'Sân futsal Quận 1',
      rules: 'Thi đấu theo luật futsal FIFA',
      prize: '25,000,000 VND',
      max_teams: 12,
      banner_url: 'https://via.placeholder.com/800x400',
      description: 'Giải đấu bóng đá 5 người trong nhà',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      Type_ID: 4,
      name: 'Giải chạy bộ TP.HCM 2025',
      start_date: new Date('2025-09-15'),
      end_date: new Date('2025-09-20'),
      signup_deadline: new Date('2025-09-10'),
      location: 'Công viên Tao Đàn',
      rules: 'Chạy bộ đường trường 5km',
      prize: '15,000,000 VND',
      max_teams: 50,
      banner_url: 'https://via.placeholder.com/800x400',
      description: 'Giải chạy bộ TP.HCM 2024',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      Type_ID: 4,
      name: 'Giải chạy bộ sinh viên 2024',
      start_date: new Date('2024-05-01'),
      end_date: new Date('2024-05-03'),
      signup_deadline: new Date('2024-04-15'),
      location: 'Công viên 23/9',
      rules: 'Chạy bộ đường trường 3km',
      prize: '10,000,000 VND',
      max_teams: 30,
      banner_url: 'https://via.placeholder.com/800x400',
      description: 'Giải chạy bộ sinh viên 2024',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      Type_ID: 5,
      name: 'Giải cầu lông sinh viên TP.HCM 2024',
      start_date: new Date('2024-04-15'),
      end_date: new Date('2024-05-15'),
      signup_deadline: new Date('2024-04-01'),
      location: 'Nhà thi đấu TDTT TP.HCM',
      rules: 'Thi đấu đơn nam, đơn nữ, đôi nam, đôi nữ',
      prize: '20,000,000 VND',
      max_teams: 8,
      banner_url: 'https://via.placeholder.com/800x400',
      description: 'Giải cầu lông sinh viên TP.HCM 2024',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      Type_ID: 5,
      name: 'Giải cầu lông mùa xuân 2024',
      start_date: new Date('2024-03-15'),
      end_date: new Date('2024-04-15'),
      signup_deadline: new Date('2024-03-01'),
      location: 'Nhà thi đấu Quận 1',
      rules: 'Thi đấu đơn nam, đơn nữ, đôi nam, đôi nữ',
      prize: '15,000,000 VND',
      max_teams: 8,
      banner_url: 'https://via.placeholder.com/800x400',
      description: 'Giải cầu lông mùa xuân 2024',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Registrations data
  registrations: [
    // Giải bóng đá 1 (6 đội)
    {
      id: 1,
      Tournament_ID: 1,
      Team_ID: 1,
      points: 9,
      wins: 3,
      draws: 0,
      losses: 0,
      goals_for: 8,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      Tournament_ID: 1,
      Team_ID: 2,
      points: 6,
      wins: 2,
      draws: 0,
      losses: 1,
      goals_for: 5,
      goals_against: 3,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      Tournament_ID: 1,
      Team_ID: 3,
      points: 4,
      wins: 1,
      draws: 1,
      losses: 1,
      goals_for: 4,
      goals_against: 4,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      Tournament_ID: 1,
      Team_ID: 4,
      points: 3,
      wins: 1,
      draws: 0,
      losses: 2,
      goals_for: 3,
      goals_against: 5,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      Tournament_ID: 1,
      Team_ID: 5,
      points: 1,
      wins: 0,
      draws: 1,
      losses: 2,
      goals_for: 2,
      goals_against: 6,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      Tournament_ID: 1,
      Team_ID: 6,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 3,
      goals_for: 1,
      goals_against: 7,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 2 (6 đội)
    {
      id: 7,
      Tournament_ID: 2,
      Team_ID: 1,
      points: 6,
      wins: 2,
      draws: 0,
      losses: 0,
      goals_for: 5,
      goals_against: 1,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      Tournament_ID: 2,
      Team_ID: 2,
      points: 4,
      wins: 1,
      draws: 1,
      losses: 0,
      goals_for: 3,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      Tournament_ID: 2,
      Team_ID: 3,
      points: 3,
      wins: 1,
      draws: 0,
      losses: 1,
      goals_for: 2,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      Tournament_ID: 2,
      Team_ID: 4,
      points: 2,
      wins: 0,
      draws: 2,
      losses: 0,
      goals_for: 2,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      Tournament_ID: 2,
      Team_ID: 5,
      points: 1,
      wins: 0,
      draws: 1,
      losses: 1,
      goals_for: 1,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      Tournament_ID: 2,
      Team_ID: 6,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 2,
      goals_for: 0,
      goals_against: 4,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 3 (6 đội)
    {
      id: 13,
      Tournament_ID: 3,
      Team_ID: 1,
      points: 7,
      wins: 2,
      draws: 1,
      losses: 0,
      goals_for: 6,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 14,
      Tournament_ID: 3,
      Team_ID: 2,
      points: 6,
      wins: 2,
      draws: 0,
      losses: 1,
      goals_for: 4,
      goals_against: 3,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 15,
      Tournament_ID: 3,
      Team_ID: 3,
      points: 4,
      wins: 1,
      draws: 1,
      losses: 1,
      goals_for: 3,
      goals_against: 3,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 16,
      Tournament_ID: 3,
      Team_ID: 4,
      points: 3,
      wins: 1,
      draws: 0,
      losses: 2,
      goals_for: 2,
      goals_against: 4,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 17,
      Tournament_ID: 3,
      Team_ID: 5,
      points: 1,
      wins: 0,
      draws: 1,
      losses: 2,
      goals_for: 1,
      goals_against: 3,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 18,
      Tournament_ID: 3,
      Team_ID: 6,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 3,
      goals_for: 0,
      goals_against: 5,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 1 (4 đội)
    {
      id: 19,
      Tournament_ID: 6,
      Team_ID: 9,
      points: 6,
      wins: 2,
      draws: 0,
      losses: 0,
      goals_for: 4,
      goals_against: 1,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 20,
      Tournament_ID: 6,
      Team_ID: 10,
      points: 4,
      wins: 1,
      draws: 1,
      losses: 0,
      goals_for: 3,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      Tournament_ID: 6,
      Team_ID: 11,
      points: 1,
      wins: 0,
      draws: 1,
      losses: 1,
      goals_for: 2,
      goals_against: 3,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 22,
      Tournament_ID: 6,
      Team_ID: 12,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 2,
      goals_for: 1,
      goals_against: 4,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 2 (4 đội)
    {
      id: 23,
      Tournament_ID: 7,
      Team_ID: 9,
      points: 5,
      wins: 1,
      draws: 2,
      losses: 0,
      goals_for: 3,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 24,
      Tournament_ID: 7,
      Team_ID: 10,
      points: 4,
      wins: 1,
      draws: 1,
      losses: 0,
      goals_for: 3,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 25,
      Tournament_ID: 7,
      Team_ID: 11,
      points: 2,
      wins: 0,
      draws: 2,
      losses: 0,
      goals_for: 2,
      goals_against: 2,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 26,
      Tournament_ID: 7,
      Team_ID: 12,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 2,
      goals_for: 1,
      goals_against: 3,
      approval_status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Matches data
  matches: [
    // Giải bóng đá 1 - Vòng bảng (15 trận)
    {
      id: 1,
      Tournament_ID: 1,

      match_date: new Date('2024-03-15T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu mở màn giải đấu',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      Tournament_ID: 1,

      match_date: new Date('2024-03-16T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 2 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      Tournament_ID: 1,

      match_date: new Date('2024-03-17T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 3 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      Tournament_ID: 1,

      match_date: new Date('2024-03-18T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 4 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      Tournament_ID: 1,

      match_date: new Date('2024-03-19T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 5 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      Tournament_ID: 1,

      match_date: new Date('2024-03-20T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 6 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      Tournament_ID: 1,

      match_date: new Date('2024-03-21T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 7 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      Tournament_ID: 1,

      match_date: new Date('2024-03-22T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 8 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      Tournament_ID: 1,

      match_date: new Date('2024-03-23T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 9 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      Tournament_ID: 1,

      match_date: new Date('2024-03-24T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 10 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      Tournament_ID: 1,

      match_date: new Date('2024-03-25T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 11 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      Tournament_ID: 1,

      match_date: new Date('2024-03-26T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 12 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 13,
      Tournament_ID: 1,

      match_date: new Date('2024-03-27T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 13 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 14,
      Tournament_ID: 1,

      match_date: new Date('2024-03-28T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 14 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 15,
      Tournament_ID: 1,

      match_date: new Date('2024-03-29T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 15 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 1 - Tứ kết (4 trận)
    {
      id: 16,
      Tournament_ID: 1,

      match_date: new Date('2024-04-01T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận tứ kết 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 17,
      Tournament_ID: 1,

      match_date: new Date('2024-04-02T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận tứ kết 2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 18,
      Tournament_ID: 1,

      match_date: new Date('2024-04-03T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận tứ kết 3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 19,
      Tournament_ID: 1,

      match_date: new Date('2024-04-04T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận tứ kết 4',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 1 - Bán kết (2 trận)
    {
      id: 20,
      Tournament_ID: 1,

      match_date: new Date('2024-04-15T14:00:00.000Z'),
      location: 'Sân A',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      Tournament_ID: 1,

      match_date: new Date('2024-04-16T14:00:00.000Z'),
      location: 'Sân B',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 1 - Chung kết (1 trận)
    {
      id: 22,
      Tournament_ID: 1,

      match_date: new Date('2024-04-30T15:00:00.000Z'),
      location: 'Sân chính',
      status: 'scheduled',
      result: null,
      description: 'Trận chung kết',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 2 - Vòng bảng (15 trận)
    {
      id: 23,
      Tournament_ID: 2,

      match_date: new Date('2024-06-01T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu mở màn giải đấu 7 người',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 24,
      Tournament_ID: 2,

      match_date: new Date('2024-06-02T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 2 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 25,
      Tournament_ID: 2,

      match_date: new Date('2024-06-03T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 3 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 26,
      Tournament_ID: 2,

      match_date: new Date('2024-06-04T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 4 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 27,
      Tournament_ID: 2,

      match_date: new Date('2024-06-05T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 5 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 28,
      Tournament_ID: 2,

      match_date: new Date('2024-06-06T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 6 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 29,
      Tournament_ID: 2,

      match_date: new Date('2024-06-07T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 7 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 30,
      Tournament_ID: 2,

      match_date: new Date('2024-06-08T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 8 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 31,
      Tournament_ID: 2,

      match_date: new Date('2024-06-09T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 9 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 32,
      Tournament_ID: 2,

      match_date: new Date('2024-06-10T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 10 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 33,
      Tournament_ID: 2,

      match_date: new Date('2024-06-11T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 11 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 34,
      Tournament_ID: 2,

      match_date: new Date('2024-06-12T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 12 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 35,
      Tournament_ID: 2,

      match_date: new Date('2024-06-13T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 13 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 36,
      Tournament_ID: 2,

      match_date: new Date('2024-06-14T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 14 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 37,
      Tournament_ID: 2,

      match_date: new Date('2024-06-15T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 15 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 2 - Bán kết (2 trận)
    {
      id: 38,
      Tournament_ID: 2,

      match_date: new Date('2024-07-01T14:00:00.000Z'),
      location: 'Sân mini A',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 39,
      Tournament_ID: 2,

      match_date: new Date('2024-07-02T14:00:00.000Z'),
      location: 'Sân mini B',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 2 - Chung kết (1 trận)
    {
      id: 40,
      Tournament_ID: 2,

      match_date: new Date('2024-07-31T15:00:00.000Z'),
      location: 'Sân mini chính',
      status: 'scheduled',
      result: null,
      description: 'Trận chung kết',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 3 - Vòng bảng (15 trận)
    {
      id: 41,
      Tournament_ID: 3,

      match_date: new Date('2024-05-01T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu mở màn giải futsal',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 42,
      Tournament_ID: 3,

      match_date: new Date('2024-05-02T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 2 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 43,
      Tournament_ID: 3,

      match_date: new Date('2024-05-03T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 3 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 44,
      Tournament_ID: 3,

      match_date: new Date('2024-05-04T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 4 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 45,
      Tournament_ID: 3,

      match_date: new Date('2024-05-05T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 5 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 46,
      Tournament_ID: 3,

      match_date: new Date('2024-05-06T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 6 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 47,
      Tournament_ID: 3,

      match_date: new Date('2024-05-07T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 7 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 48,
      Tournament_ID: 3,

      match_date: new Date('2024-05-08T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 8 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 49,
      Tournament_ID: 3,

      match_date: new Date('2024-05-09T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 9 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 50,
      Tournament_ID: 3,

      match_date: new Date('2024-05-10T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 10 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 51,
      Tournament_ID: 3,

      match_date: new Date('2024-05-11T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 11 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 52,
      Tournament_ID: 3,

      match_date: new Date('2024-05-12T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 12 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 53,
      Tournament_ID: 3,

      match_date: new Date('2024-05-13T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 13 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 54,
      Tournament_ID: 3,

      match_date: new Date('2024-05-14T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 14 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 55,
      Tournament_ID: 3,

      match_date: new Date('2024-05-15T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu thứ 15 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 3 - Bán kết (2 trận)
    {
      id: 56,
      Tournament_ID: 3,

      match_date: new Date('2024-06-01T14:00:00.000Z'),
      location: 'Sân futsal A',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 57,
      Tournament_ID: 3,

      match_date: new Date('2024-06-02T14:00:00.000Z'),
      location: 'Sân futsal B',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 3 - Chung kết (1 trận)
    {
      id: 58,
      Tournament_ID: 3,

      match_date: new Date('2024-06-30T15:00:00.000Z'),
      location: 'Sân futsal chính',
      status: 'scheduled',
      result: null,
      description: 'Trận chung kết',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải chạy bộ 1 (3 trận, mỗi ngày 1 trận)
    {
      id: 59,
      Tournament_ID: 4,

      match_date: new Date('2024-04-01T06:00:00.000Z'),
      location: 'Công viên Tao Đàn',
      status: 'scheduled',
      result: null,
      description: 'Trận chạy bộ ngày 1 - 5km',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 60,
      Tournament_ID: 4,

      match_date: new Date('2024-04-02T06:00:00.000Z'),
      location: 'Công viên Tao Đàn',
      status: 'scheduled',
      result: null,
      description: 'Trận chạy bộ ngày 2 - 5km',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 61,
      Tournament_ID: 4,

      match_date: new Date('2024-04-03T06:00:00.000Z'),
      location: 'Công viên Tao Đàn',
      status: 'scheduled',
      result: null,
      description: 'Trận chạy bộ ngày 3 - 5km',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải chạy bộ 2 (3 trận, mỗi ngày 1 trận)
    {
      id: 62,
      Tournament_ID: 5,

      match_date: new Date('2024-05-01T06:00:00.000Z'),
      location: 'Công viên 23/9',
      status: 'scheduled',
      result: null,
      description: 'Trận chạy bộ ngày 1 - 3km',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 63,
      Tournament_ID: 5,

      match_date: new Date('2024-05-02T06:00:00.000Z'),
      location: 'Công viên 23/9',
      status: 'scheduled',
      result: null,
      description: 'Trận chạy bộ ngày 2 - 3km',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 64,
      Tournament_ID: 5,

      match_date: new Date('2024-05-03T06:00:00.000Z'),
      location: 'Công viên 23/9',
      status: 'scheduled',
      result: null,
      description: 'Trận chạy bộ ngày 3 - 3km',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 1 - Vòng bảng (6 trận)
    {
      id: 65,
      Tournament_ID: 6,

      match_date: new Date('2024-04-15T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 1 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 66,
      Tournament_ID: 6,

      match_date: new Date('2024-04-16T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 2 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 67,
      Tournament_ID: 6,

      match_date: new Date('2024-04-17T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 3 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 68,
      Tournament_ID: 6,

      match_date: new Date('2024-04-18T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 4 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 69,
      Tournament_ID: 6,

      match_date: new Date('2024-04-19T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 5 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 70,
      Tournament_ID: 6,

      match_date: new Date('2024-04-20T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 6 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 1 - Bán kết (2 trận)
    {
      id: 71,
      Tournament_ID: 6,

      match_date: new Date('2024-05-01T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 72,
      Tournament_ID: 6,

      match_date: new Date('2024-05-02T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 1 - Chung kết (1 trận)
    {
      id: 73,
      Tournament_ID: 6,

      match_date: new Date('2024-05-15T15:00:00.000Z'),
      location: 'Sân cầu lông chính',
      status: 'scheduled',
      result: null,
      description: 'Trận chung kết',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 2 - Vòng bảng (6 trận)
    {
      id: 74,
      Tournament_ID: 7,

      match_date: new Date('2024-03-15T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 1 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 75,
      Tournament_ID: 7,

      match_date: new Date('2024-03-16T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 2 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 76,
      Tournament_ID: 7,

      match_date: new Date('2024-03-17T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 3 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 77,
      Tournament_ID: 7,

      match_date: new Date('2024-03-18T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 4 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 78,
      Tournament_ID: 7,

      match_date: new Date('2024-03-19T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 5 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 79,
      Tournament_ID: 7,

      match_date: new Date('2024-03-20T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận đấu cầu lông 6 vòng bảng',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 2 - Bán kết (2 trận)
    {
      id: 80,
      Tournament_ID: 7,

      match_date: new Date('2024-04-01T14:00:00.000Z'),
      location: 'Sân cầu lông 1',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 81,
      Tournament_ID: 7,

      match_date: new Date('2024-04-02T14:00:00.000Z'),
      location: 'Sân cầu lông 2',
      status: 'scheduled',
      result: null,
      description: 'Trận bán kết 2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 2 - Chung kết (1 trận)
    {
      id: 82,
      Tournament_ID: 7,

      match_date: new Date('2024-04-15T15:00:00.000Z'),
      location: 'Sân cầu lông chính',
      status: 'scheduled',
      result: null,
      description: 'Trận chung kết',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Match_Teams data (many-to-many relationship)
  matchTeams: [
    // Giải bóng đá 1 - Vòng bảng (15 trận)
    {
      id: 1,
      Match_ID: 1,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      Match_ID: 1,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      Match_ID: 2,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      Match_ID: 2,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      Match_ID: 3,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      Match_ID: 3,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      Match_ID: 4,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      Match_ID: 4,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      Match_ID: 5,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      Match_ID: 5,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      Match_ID: 6,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      Match_ID: 6,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 13,
      Match_ID: 7,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 14,
      Match_ID: 7,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 15,
      Match_ID: 8,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 16,
      Match_ID: 8,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 17,
      Match_ID: 9,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 18,
      Match_ID: 9,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 19,
      Match_ID: 10,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 20,
      Match_ID: 10,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      Match_ID: 11,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 22,
      Match_ID: 11,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 23,
      Match_ID: 12,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 24,
      Match_ID: 12,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 25,
      Match_ID: 13,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 26,
      Match_ID: 13,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 27,
      Match_ID: 14,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 28,
      Match_ID: 14,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 29,
      Match_ID: 15,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 30,
      Match_ID: 15,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 1 - Tứ kết (4 trận)
    {
      id: 31,
      Match_ID: 16,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 32,
      Match_ID: 16,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 33,
      Match_ID: 17,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 34,
      Match_ID: 17,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 35,
      Match_ID: 18,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 36,
      Match_ID: 18,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 37,
      Match_ID: 19,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 38,
      Match_ID: 19,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 1 - Bán kết (2 trận)
    {
      id: 39,
      Match_ID: 20,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 40,
      Match_ID: 20,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 41,
      Match_ID: 21,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 42,
      Match_ID: 21,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 1 - Chung kết (1 trận)
    {
      id: 43,
      Match_ID: 22,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 44,
      Match_ID: 22,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 2 - Vòng bảng (15 trận)
    {
      id: 45,
      Match_ID: 23,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 46,
      Match_ID: 23,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 47,
      Match_ID: 24,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 48,
      Match_ID: 24,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 49,
      Match_ID: 25,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 50,
      Match_ID: 25,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 51,
      Match_ID: 26,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 52,
      Match_ID: 26,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 53,
      Match_ID: 27,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 54,
      Match_ID: 27,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 55,
      Match_ID: 28,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 56,
      Match_ID: 28,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 57,
      Match_ID: 29,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 58,
      Match_ID: 29,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 59,
      Match_ID: 30,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 60,
      Match_ID: 30,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 61,
      Match_ID: 31,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 62,
      Match_ID: 31,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 63,
      Match_ID: 32,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 64,
      Match_ID: 32,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 65,
      Match_ID: 33,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 66,
      Match_ID: 33,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 67,
      Match_ID: 34,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 68,
      Match_ID: 34,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 69,
      Match_ID: 35,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 70,
      Match_ID: 35,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 71,
      Match_ID: 36,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 72,
      Match_ID: 36,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 73,
      Match_ID: 37,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 74,
      Match_ID: 37,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 2 - Bán kết (2 trận)
    {
      id: 75,
      Match_ID: 38,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 76,
      Match_ID: 38,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 77,
      Match_ID: 39,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 78,
      Match_ID: 39,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 2 - Chung kết (1 trận)
    {
      id: 79,
      Match_ID: 40,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 80,
      Match_ID: 40,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 3 - Vòng bảng (15 trận)
    {
      id: 81,
      Match_ID: 41,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 82,
      Match_ID: 41,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 83,
      Match_ID: 42,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 84,
      Match_ID: 42,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 85,
      Match_ID: 43,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 86,
      Match_ID: 43,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 87,
      Match_ID: 44,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 88,
      Match_ID: 44,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 89,
      Match_ID: 45,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 90,
      Match_ID: 45,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 91,
      Match_ID: 46,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 92,
      Match_ID: 46,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 93,
      Match_ID: 47,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 94,
      Match_ID: 47,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 95,
      Match_ID: 48,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 96,
      Match_ID: 48,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 97,
      Match_ID: 49,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 98,
      Match_ID: 49,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 99,
      Match_ID: 50,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 100,
      Match_ID: 50,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 101,
      Match_ID: 51,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 102,
      Match_ID: 51,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 103,
      Match_ID: 52,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 104,
      Match_ID: 52,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 105,
      Match_ID: 53,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 106,
      Match_ID: 53,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 107,
      Match_ID: 54,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 108,
      Match_ID: 54,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 109,
      Match_ID: 55,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 110,
      Match_ID: 55,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 3 - Bán kết (2 trận)
    {
      id: 111,
      Match_ID: 56,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 112,
      Match_ID: 56,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 113,
      Match_ID: 57,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 114,
      Match_ID: 57,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải bóng đá 3 - Chung kết (1 trận)
    {
      id: 115,
      Match_ID: 58,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 116,
      Match_ID: 58,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải chạy bộ 1 (3 trận)
    {
      id: 117,
      Match_ID: 59,
      Team_ID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 118,
      Match_ID: 60,
      Team_ID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 119,
      Match_ID: 61,
      Team_ID: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải chạy bộ 2 (3 trận)
    {
      id: 120,
      Match_ID: 62,
      Team_ID: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 121,
      Match_ID: 63,
      Team_ID: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 122,
      Match_ID: 64,
      Team_ID: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 1 - Vòng bảng (6 trận)
    {
      id: 123,
      Match_ID: 65,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 124,
      Match_ID: 65,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 125,
      Match_ID: 66,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 126,
      Match_ID: 66,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 127,
      Match_ID: 67,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 128,
      Match_ID: 67,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 129,
      Match_ID: 68,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 130,
      Match_ID: 68,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 131,
      Match_ID: 69,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 132,
      Match_ID: 69,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 133,
      Match_ID: 70,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 134,
      Match_ID: 70,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 1 - Bán kết (2 trận)
    {
      id: 135,
      Match_ID: 71,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 136,
      Match_ID: 71,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 137,
      Match_ID: 72,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 138,
      Match_ID: 72,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 1 - Chung kết (1 trận)
    {
      id: 139,
      Match_ID: 73,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 140,
      Match_ID: 73,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 2 - Vòng bảng (6 trận)
    {
      id: 141,
      Match_ID: 74,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 142,
      Match_ID: 74,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 143,
      Match_ID: 75,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 144,
      Match_ID: 75,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 145,
      Match_ID: 76,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 146,
      Match_ID: 76,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 147,
      Match_ID: 77,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 148,
      Match_ID: 77,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 149,
      Match_ID: 78,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 150,
      Match_ID: 78,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 151,
      Match_ID: 79,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 152,
      Match_ID: 79,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 2 - Bán kết (2 trận)
    {
      id: 153,
      Match_ID: 80,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 154,
      Match_ID: 80,
      Team_ID: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 155,
      Match_ID: 81,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 156,
      Match_ID: 81,
      Team_ID: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Giải cầu lông 2 - Chung kết (1 trận)
    {
      id: 157,
      Match_ID: 82,
      Team_ID: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 158,
      Match_ID: 82,
      Team_ID: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Notifications data
  notifications: [
    {
      id: 1,
      User_ID: 1,
      Tournament_ID: 1,
      title: 'Thông báo giải đấu mới',
      message: 'Giải đấu mùa xuân 2024 sẽ bắt đầu vào ngày 15/03/2024',
      type: 'tournament_announcement',
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      User_ID: 2,
      Tournament_ID: 1,
      title: 'Thông báo giải đấu mới',
      message: 'Giải đấu mùa xuân 2024 sẽ bắt đầu vào ngày 15/03/2024',
      type: 'tournament_announcement',
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      User_ID: 1,
      Tournament_ID: 1,
      Registration_ID: 1,
      title: 'Đăng ký tham gia thành công',
      message: 'Đội bóng của bạn đã được chấp nhận tham gia giải đấu mùa xuân 2024',
      type: 'registration_approved',
      is_read: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Team_Members data
  teamMembers: [
    // Đội bóng ĐH KHTN (Team ID: 1)
    {
      id: 1,
      Team_ID: 1,
      name: 'Nguyễn Văn An',
      age: 20,
      gender: 'Nam',
      phone: '0123456789',
      dateOfBirth: new Date('2004-01-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      Team_ID: 1,
      name: 'Trần Thị Bình',
      age: 19,
      gender: 'Nữ',
      phone: '0123456790',
      dateOfBirth: new Date('2005-03-20'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      Team_ID: 1,
      name: 'Lê Văn Cường',
      age: 21,
      gender: 'Nam',
      phone: '0123456791',
      dateOfBirth: new Date('2003-07-10'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      Team_ID: 1,
      name: 'Phạm Thị Dung',
      age: 20,
      gender: 'Nữ',
      phone: '0123456792',
      dateOfBirth: new Date('2004-11-25'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      Team_ID: 1,
      name: 'Hoàng Văn Em',
      age: 22,
      gender: 'Nam',
      phone: '0123456793',
      dateOfBirth: new Date('2002-09-05'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      Team_ID: 1,
      name: 'Vũ Thị Phương',
      age: 19,
      gender: 'Nữ',
      phone: '0123456794',
      dateOfBirth: new Date('2005-12-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội bóng ĐH Bách khoa (Team ID: 2)
    {
      id: 7,
      Team_ID: 2,
      name: 'Đỗ Văn Giang',
      age: 21,
      gender: 'Nam',
      phone: '0123456795',
      dateOfBirth: new Date('2003-04-12'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      Team_ID: 2,
      name: 'Ngô Thị Hoa',
      age: 20,
      gender: 'Nữ',
      phone: '0123456796',
      dateOfBirth: new Date('2004-08-18'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      Team_ID: 2,
      name: 'Bùi Văn Ích',
      age: 22,
      gender: 'Nam',
      phone: '0123456797',
      dateOfBirth: new Date('2002-06-22'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      Team_ID: 2,
      name: 'Lý Thị Kim',
      age: 19,
      gender: 'Nữ',
      phone: '0123456798',
      dateOfBirth: new Date('2005-01-08'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      Team_ID: 2,
      name: 'Mai Văn Lâm',
      age: 21,
      gender: 'Nam',
      phone: '0123456799',
      dateOfBirth: new Date('2003-10-14'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      Team_ID: 2,
      name: 'Đinh Thị Mai',
      age: 20,
      gender: 'Nữ',
      phone: '0123456800',
      dateOfBirth: new Date('2004-05-03'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội bóng ĐH Sư phạm (Team ID: 3)
    {
      id: 13,
      Team_ID: 3,
      name: 'Hồ Văn Nam',
      age: 22,
      gender: 'Nam',
      phone: '0123456801',
      dateOfBirth: new Date('2002-02-28'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 14,
      Team_ID: 3,
      name: 'Tô Thị Ngọc',
      age: 19,
      gender: 'Nữ',
      phone: '0123456802',
      dateOfBirth: new Date('2005-07-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 15,
      Team_ID: 3,
      name: 'Võ Văn Oanh',
      age: 21,
      gender: 'Nam',
      phone: '0123456803',
      dateOfBirth: new Date('2003-12-01'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 16,
      Team_ID: 3,
      name: 'Trương Thị Phương',
      age: 20,
      gender: 'Nữ',
      phone: '0123456804',
      dateOfBirth: new Date('2004-09-20'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 17,
      Team_ID: 3,
      name: 'Lâm Văn Quân',
      age: 22,
      gender: 'Nam',
      phone: '0123456805',
      dateOfBirth: new Date('2002-11-11'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 18,
      Team_ID: 3,
      name: 'Châu Thị Rạng',
      age: 19,
      gender: 'Nữ',
      phone: '0123456806',
      dateOfBirth: new Date('2005-04-25'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội bóng ĐH Y Dược (Team ID: 4)
    {
      id: 19,
      Team_ID: 4,
      name: 'Nguyễn Văn Sinh',
      age: 21,
      gender: 'Nam',
      phone: '0123456807',
      dateOfBirth: new Date('2003-03-18'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 20,
      Team_ID: 4,
      name: 'Lê Thị Tâm',
      age: 20,
      gender: 'Nữ',
      phone: '0123456808',
      dateOfBirth: new Date('2004-06-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      Team_ID: 4,
      name: 'Trần Văn Uy',
      age: 22,
      gender: 'Nam',
      phone: '0123456809',
      dateOfBirth: new Date('2002-08-05'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 22,
      Team_ID: 4,
      name: 'Phạm Thị Vân',
      age: 19,
      gender: 'Nữ',
      phone: '0123456810',
      dateOfBirth: new Date('2005-01-12'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 23,
      Team_ID: 4,
      name: 'Hoàng Văn Xuân',
      age: 21,
      gender: 'Nam',
      phone: '0123456811',
      dateOfBirth: new Date('2003-10-22'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 24,
      Team_ID: 4,
      name: 'Vũ Thị Yến',
      age: 20,
      gender: 'Nữ',
      phone: '0123456812',
      dateOfBirth: new Date('2004-12-08'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội bóng ĐH Kinh tế (Team ID: 5)
    {
      id: 25,
      Team_ID: 5,
      name: 'Đỗ Văn Anh',
      age: 22,
      gender: 'Nam',
      phone: '0123456813',
      dateOfBirth: new Date('2002-05-14'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 26,
      Team_ID: 5,
      name: 'Ngô Thị Bảo',
      age: 19,
      gender: 'Nữ',
      phone: '0123456814',
      dateOfBirth: new Date('2005-09-03'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 27,
      Team_ID: 5,
      name: 'Bùi Văn Cường',
      age: 21,
      gender: 'Nam',
      phone: '0123456815',
      dateOfBirth: new Date('2003-11-17'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 28,
      Team_ID: 5,
      name: 'Lý Thị Dung',
      age: 20,
      gender: 'Nữ',
      phone: '0123456816',
      dateOfBirth: new Date('2004-02-25'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 29,
      Team_ID: 5,
      name: 'Mai Văn Em',
      age: 22,
      gender: 'Nam',
      phone: '0123456817',
      dateOfBirth: new Date('2002-07-08'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 30,
      Team_ID: 5,
      name: 'Đinh Thị Phương',
      age: 19,
      gender: 'Nữ',
      phone: '0123456818',
      dateOfBirth: new Date('2005-12-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội bóng ĐH Nông Lâm (Team ID: 6)
    {
      id: 31,
      Team_ID: 6,
      name: 'Hồ Văn Giang',
      age: 21,
      gender: 'Nam',
      phone: '0123456819',
      dateOfBirth: new Date('2003-01-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 32,
      Team_ID: 6,
      name: 'Tô Thị Hoa',
      age: 20,
      gender: 'Nữ',
      phone: '0123456820',
      dateOfBirth: new Date('2004-04-12'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 33,
      Team_ID: 6,
      name: 'Võ Văn Ích',
      age: 22,
      gender: 'Nam',
      phone: '0123456821',
      dateOfBirth: new Date('2002-10-05'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 34,
      Team_ID: 6,
      name: 'Trương Thị Kim',
      age: 19,
      gender: 'Nữ',
      phone: '0123456822',
      dateOfBirth: new Date('2005-06-18'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 35,
      Team_ID: 6,
      name: 'Lâm Văn Lâm',
      age: 21,
      gender: 'Nam',
      phone: '0123456823',
      dateOfBirth: new Date('2003-08-22'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 36,
      Team_ID: 6,
      name: 'Châu Thị Mai',
      age: 20,
      gender: 'Nữ',
      phone: '0123456824',
      dateOfBirth: new Date('2004-03-07'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội chạy bộ ĐH KHTN (Team ID: 7)
    {
      id: 37,
      Team_ID: 7,
      name: 'Nguyễn Văn Nam',
      age: 23,
      gender: 'Nam',
      phone: '0123456825',
      dateOfBirth: new Date('2001-05-20'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 38,
      Team_ID: 7,
      name: 'Trần Thị Oanh',
      age: 21,
      gender: 'Nữ',
      phone: '0123456826',
      dateOfBirth: new Date('2003-09-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 39,
      Team_ID: 7,
      name: 'Lê Văn Phương',
      age: 22,
      gender: 'Nam',
      phone: '0123456827',
      dateOfBirth: new Date('2002-12-03'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội chạy bộ ĐH Bách khoa (Team ID: 8)
    {
      id: 40,
      Team_ID: 8,
      name: 'Phạm Văn Quân',
      age: 24,
      gender: 'Nam',
      phone: '0123456828',
      dateOfBirth: new Date('2000-07-10'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 41,
      Team_ID: 8,
      name: 'Hoàng Thị Rạng',
      age: 20,
      gender: 'Nữ',
      phone: '0123456829',
      dateOfBirth: new Date('2004-11-25'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 42,
      Team_ID: 8,
      name: 'Vũ Văn Sinh',
      age: 21,
      gender: 'Nam',
      phone: '0123456830',
      dateOfBirth: new Date('2003-03-18'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội cầu lông ĐH KHTN (Team ID: 9)
    {
      id: 43,
      Team_ID: 9,
      name: 'Đỗ Văn Tâm',
      age: 20,
      gender: 'Nam',
      phone: '0123456831',
      dateOfBirth: new Date('2004-01-08'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 44,
      Team_ID: 9,
      name: 'Ngô Thị Uy',
      age: 19,
      gender: 'Nữ',
      phone: '0123456832',
      dateOfBirth: new Date('2005-04-12'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội cầu lông ĐH Bách khoa (Team ID: 10)
    {
      id: 45,
      Team_ID: 10,
      name: 'Bùi Văn Vân',
      age: 21,
      gender: 'Nam',
      phone: '0123456833',
      dateOfBirth: new Date('2003-08-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 46,
      Team_ID: 10,
      name: 'Lý Thị Xuân',
      age: 20,
      gender: 'Nữ',
      phone: '0123456834',
      dateOfBirth: new Date('2004-12-05'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội cầu lông ĐH Sư phạm (Team ID: 11)
    {
      id: 47,
      Team_ID: 11,
      name: 'Mai Văn Yến',
      age: 22,
      gender: 'Nam',
      phone: '0123456835',
      dateOfBirth: new Date('2002-06-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 48,
      Team_ID: 11,
      name: 'Đinh Thị Anh',
      age: 19,
      gender: 'Nữ',
      phone: '0123456836',
      dateOfBirth: new Date('2005-10-22'),
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Đội cầu lông ĐH Y Dược (Team ID: 12)
    {
      id: 49,
      Team_ID: 12,
      name: 'Hồ Văn Bảo',
      age: 21,
      gender: 'Nam',
      phone: '0123456837',
      dateOfBirth: new Date('2003-02-14'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 50,
      Team_ID: 12,
      name: 'Tô Thị Cường',
      age: 20,
      gender: 'Nữ',
      phone: '0123456838',
      dateOfBirth: new Date('2004-07-28'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

}; 
