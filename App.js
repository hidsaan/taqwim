import React, {useState, useEffect} from 'react';
import CalenderPage from './components/CalenderPage';
import SplashScreen from './components/SplashScreen';
import NotificationService from './services/NotificationService';
import ramadanData from './components/data.json';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Request notification permissions and schedule notifications
    const setupNotifications = async () => {
      await NotificationService.requestPermissions();
      await NotificationService.scheduleRamadanNotifications(ramadanData);
    };
    
    setupNotifications();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <CalenderPage />;
}

export default App;
