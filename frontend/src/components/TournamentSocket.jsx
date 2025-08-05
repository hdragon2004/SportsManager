import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const TournamentSocket = ({ tournamentId }) => {
  const { joinTournament, leaveTournament } = useSocket();

  useEffect(() => {
    if (tournamentId) {
      // Join tournament room when component mounts
      joinTournament(tournamentId);
      
      // Leave tournament room when component unmounts
      return () => {
        leaveTournament(tournamentId);
      };
    }
  }, [tournamentId, joinTournament, leaveTournament]);

  return null; // This component doesn't render anything
};

export default TournamentSocket; 