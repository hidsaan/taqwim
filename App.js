import React, {useState, useEffect, useRef} from 'react';
import CalenderPage from './components/CalenderPage';
import DuaDisplay from './components/DuaDisplay';
import SplashScreen from './components/SplashScreen';
import NotificationService from './services/NotificationService';
import ramadanData from './components/data.json';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('Calendar');
  const [screenParams, setScreenParams] = useState(null);
  
  // Create a navigation ref for notification handler
  const navigationRef = useRef({
    current: {
      navigate: (screen, params) => {
        setCurrentScreen(screen);
        setScreenParams(params);
      },
    },
  });

  useEffect(() => {
    // Request notification permissions and schedule notifications
    const setupNotifications = async () => {
      await NotificationService.requestPermissions();
      await NotificationService.scheduleRamadanNotifications(ramadanData);
      
      // Set up notification press handler
      NotificationService.setupNotificationHandler(navigationRef);
    };
    
    setupNotifications();
    // Splash screen will handle its own timing based on animations
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Simple navigation without React Navigation library
  if (currentScreen === 'DuaDisplay') {
    return <DuaDisplay route={{ params: screenParams }} navigation={{ goBack: () => setCurrentScreen('Calendar') }} />;
  }

  return <CalenderPage />;
}

export default App;
