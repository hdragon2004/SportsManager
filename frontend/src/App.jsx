import React from 'react';
import AppRoutes from './routes/AppRoutes';
import RealtimeNotification from './components/RealtimeNotification';
import TournamentRealtimeListener from './components/TournamentRealtimeListener';
import TodayTournamentNotification from './components/TodayTournamentNotification';
import './index.css';

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <RealtimeNotification />
      <TournamentRealtimeListener />
      <TodayTournamentNotification />
    </div>
  );
}

export default App;