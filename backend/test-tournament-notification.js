// Test script để kiểm tra thông báo tạo tournament
const { TournamentEvents } = require('./src/socket/tournamentEvents');

async function testTournamentNotification() {
  try {
    console.log('Bắt đầu test thông báo tạo tournament...');
    
    const tournamentEvents = new TournamentEvents();
    
    // Test data
    const testData = {
      tournamentId: 999,
      tournamentName: 'Giải đấu Test',
      createdBy: 'Admin Test'
    };
    
    console.log('Gửi thông báo với data:', testData);
    
    // Gửi thông báo
    await tournamentEvents.emitTournamentCreated(testData);
    
    console.log('✅ Test thành công! Thông báo đã được gửi.');
    
  } catch (error) {
    console.error('❌ Test thất bại:', error);
  }
}

// Chạy test
testTournamentNotification(); 