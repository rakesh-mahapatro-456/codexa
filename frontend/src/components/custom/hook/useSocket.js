import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket } from '../../../config/socket.config';
import { updateUserStatsRealtime, updateDailyProgressRealtime } from '../../../store/feature/auth/authSlice';
import { updateProblemStatusRealtime } from '../../../store/feature/dsa/dsaSlice';
import { toast } from 'sonner';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated, user } = useSelector(state => state.auth);
  const socketRef = useRef(null);
  const listenersSetup = useRef(false);

  useEffect(() => {
    // ✅ Early return if conditions not met
    if (!isAuthenticated || !token || !user) {
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
        listenersSetup.current = false;
      }
      return;
    }

    try {
      const socket = connectSocket(token);
      socketRef.current = socket;

      if (!listenersSetup.current && socket) {
        // User stats updated
        socket.on('user_stats_updated', (data) => {
          console.log('📊 Real-time stats update:', data);
          dispatch(updateUserStatsRealtime(data));
          
          // Calculate XP gained safely
          const xpGained = data.xp - (user?.xp || 0);
          if (xpGained > 0) {
            toast.success(`🎉 Great job! +${xpGained} XP`);
          }
        });

        // Problem status updated  
        socket.on('problem_status_updated', (data) => {
          console.log('🎯 Real-time problem update:', data);
          dispatch(updateProblemStatusRealtime(data));
        });

        // Daily progress updated
        socket.on('daily_progress_updated', (data) => {
          console.log('📈 Real-time progress update:', data);
          dispatch(updateDailyProgressRealtime(data));
        });

        // ✅ Handle connection events
        socket.on('connect', () => {
          console.log('✅ Socket connected successfully');
        });

        socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          toast.error('Connection lost. Trying to reconnect...');
        });

        socket.on('reconnect', () => {
          console.log('🔄 Socket reconnected');
          toast.success('Connection restored!');
        });

        listenersSetup.current = true;
      }
    } catch (error) {
      console.error('Socket initialization error:', error);
      toast.error('Failed to connect to real-time updates');
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off('user_stats_updated');
        socketRef.current.off('problem_status_updated');
        socketRef.current.off('daily_progress_updated');
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.off('reconnect');
        
        disconnectSocket();
        socketRef.current = null;
        listenersSetup.current = false;
      }
    };
  }, [isAuthenticated, token, user?._id, dispatch]); // ✅ Depend on user._id instead of user.xp

  return socketRef.current;
};