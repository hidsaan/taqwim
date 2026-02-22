import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ramadanData from './data.json';
import eventsData from './events.json';
import NotificationService from '../services/NotificationService';

function CalenderPage() {
  const [currentDay, setCurrentDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteDayNumber, setNoteDayNumber] = useState(null);
  const [dayNotes, setDayNotes] = useState({});

  useEffect(() => {
    // Function to get current Ramadan day
    const getCurrentRamadanDay = () => {
      const today = new Date().toISOString().split('T')[0];
      const todayData = ramadanData.find(item => item.date === today);
      setCurrentDay(todayData);
      if (!selectedDay) {
        setSelectedDay(todayData); // Set selected day to today initially
      }
    };

    // Initial load
    getCurrentRamadanDay();
    loadNotes();

    // Set up interval to check for day change at midnight
    const checkForDayChange = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      return setTimeout(() => {
        getCurrentRamadanDay();
        // Set up next check
        const intervalId = setInterval(getCurrentRamadanDay, 24 * 60 * 60 * 1000); // Check every 24 hours
        return () => clearInterval(intervalId);
      }, timeUntilMidnight);
    };

    const timeoutId = checkForDayChange();
    
    return () => clearTimeout(timeoutId);
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('ramadanNotes');
      if (storedNotes) {
        setDayNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNote = async () => {
    if (!noteDayNumber) return;
    
    try {
      const updatedNotes = {
        ...dayNotes,
        [noteDayNumber]: noteText.trim(),
      };
      
      // Remove empty notes
      if (!noteText.trim()) {
        delete updatedNotes[noteDayNumber];
      }
      
      await AsyncStorage.setItem('ramadanNotes', JSON.stringify(updatedNotes));
      setDayNotes(updatedNotes);
      setNoteModalVisible(false);
      setNoteText('');
      setNoteDayNumber(null);
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  const openNoteModal = (dayNumber) => {
    setNoteDayNumber(dayNumber);
    setNoteText(dayNotes[dayNumber] || '');
    setNoteModalVisible(true);
  };

  const deleteNote = async () => {
    if (!noteDayNumber) return;
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedNotes = {...dayNotes};
              delete updatedNotes[noteDayNumber];
              await AsyncStorage.setItem('ramadanNotes', JSON.stringify(updatedNotes));
              setDayNotes(updatedNotes);
              setNoteModalVisible(false);
              setNoteText('');
              setNoteDayNumber(null);
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          },
        },
      ]
    );
  };

  const getEventsForDay = (ramadanDay) => {
    const dayEvents = eventsData.filter(event => event.ramadan === ramadanDay);
    
    // Check for recurring Lailat-ul-Qadr events
    const recurringEvent = eventsData.find(event => event.type === 'recurring' && event.recurring);
    if (recurringEvent && ramadanDay > recurringEvent.recurring.after_ramadan) {
      if (recurringEvent.recurring.odd_nights_only && ramadanDay % 2 !== 0) {
        dayEvents.push(recurringEvent);
      }
    }
    
    return dayEvents;
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'revelation': return '📖';
      case 'death': return '🕊️';
      case 'birth': return '🌟';
      case 'battle': return '⚔️';
      case 'martyrdom': return '🌹';
      case 'historic': return '🏛️';
      case 'special': return '✨';
      case 'recurring': return '🌙';
      default: return '📅';
    }
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const getTodayIndex = () => {
    const today = new Date().toISOString().split('T')[0];
    return ramadanData.findIndex(item => item.date === today);
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      'Notification Settings',
      'Manage your Ramadan prayer time notifications',
      [
        {
          text: 'Reschedule All',
          onPress: () => {
            NotificationService.scheduleRamadanNotifications(ramadanData);
            Alert.alert('Success', 'All notifications have been rescheduled!');
          },
        },
        {
          text: 'Cancel All',
          onPress: () => {
            NotificationService.cancelAllNotifications();
            Alert.alert('Cancelled', 'All notifications have been cancelled.');
          },
          style: 'destructive',
        },
        {
          text: 'View Scheduled',
          onPress: () => {
            NotificationService.getScheduledNotifications((notifications) => {
              Alert.alert(
                'Scheduled Notifications',
                `You have ${notifications.length} notifications scheduled.`
              );
            });
          },
        },
        {text: 'Close', style: 'cancel'},
      ]
    );
  };

  const todayIndex = getTodayIndex();

  return (
    <ImageBackground 
      source={require('../assets/bg.png')} 
      style={styles.backgroundImage}
      resizeMode="cover">
      <StatusBar barStyle="dark-content" backgroundColor="#fde9f0" translucent={false} />
      <SafeAreaView style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✨ Ramadan 2026 ✨</Text>
          <Text style={styles.headerSubtitle}>رمضان مبارك</Text>
          {/* <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationSettings}>
            <Icon name="bell-ring" size={24} color="#8B5A8E" />
          </TouchableOpacity> */}
        </View>

      {selectedDay && (
        <View style={styles.todayCard}>
          {currentDay && selectedDay.ramadan === currentDay.ramadan && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>TODAY</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.addNoteButton}
            onPress={() => openNoteModal(selectedDay.ramadan)}
            activeOpacity={0.7}>
            <Icon name="plus" size={20} color="#8B5A8E" />
          </TouchableOpacity>
          <Text style={styles.todayRamadan}>Day {selectedDay.ramadan}</Text>
          <Text style={styles.gregorianDate}>
            {new Date(selectedDay.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <View style={styles.todayTimes}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>🌙 Sehri</Text>
              <Text style={styles.timeValue}>{selectedDay.sehri}</Text>
              {/* <Text style={styles.notificationHint}>🔔 -15, -10, -5 min</Text> */}
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>🌅 Iftar</Text>
              <Text style={styles.timeValue}>{selectedDay.iftar}</Text>
              {/* <Text style={styles.notificationHint}>🔔 -15, -10, -5 min</Text> */}
            </View>
          </View>
          
          {dayNotes[selectedDay.ramadan] && (
            <View style={styles.noteSection}>
              <View style={styles.noteDivider} />
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>📝 Your Note:</Text>
              </View>
              <Text style={styles.noteText}>{dayNotes[selectedDay.ramadan]}</Text>
            </View>
          )}
          
          {(() => {
            const dayEvents = getEventsForDay(selectedDay.ramadan);
            if (dayEvents.length === 0) return null;
            
            return (
              <View style={styles.eventsSection}>
                <View style={styles.eventsDivider} />
                <Text style={styles.eventsTitle}>About today:</Text>
                {dayEvents.map((event, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.eventCard,
                      event.highlight && styles.eventCardHighlight
                    ]}>
                    <View style={styles.eventRow}>
                      <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
                      <Text style={[
                        styles.eventTitle,
                        event.highlight && styles.eventTitleHighlight
                      ]}>
                        {event.title}
                      </Text>
                      <TouchableOpacity 
                        style={styles.knowMoreButton}
                        onPress={() => handleEventPress(event)}
                        activeOpacity={0.7}>
                        <Text style={styles.knowMoreText}>Know More</Text>
                        <Icon name="chevron-right" size={16} color="#8B5A8E" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          })()}
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Full Calendar</Text>
          <TouchableOpacity 
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}>
            <Icon 
              name={viewMode === 'list' ? 'calendar-month' : 'format-list-bulleted'} 
              size={24} 
              color="#8B5A8E" 
            />
          </TouchableOpacity>
        </View>
        
        {viewMode === 'list' ? (
          // List View
          ramadanData.map((item, index) => {
          const isToday = index === todayIndex;
          const isPast = index < todayIndex;
          const isSelected = selectedDay && selectedDay.ramadan === item.ramadan;
          
          return (
            <TouchableOpacity
              key={item.ramadan}
              onPress={() => setSelectedDay(item)}
              activeOpacity={0.7}>
              <View 
                style={[
                  styles.dayCard,
                  isToday && styles.dayCardToday,
                  isPast && styles.dayCardPast,
                  isSelected && styles.dayCardSelected,
                ]}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayNumberContainer}>
                    <Text style={[styles.dayNumber, isPast && styles.textPast]}>
                      {item.ramadan}
                    </Text>
                    {dayNotes[item.ramadan] && (
                      <View style={styles.noteIndicator}>
                        <Icon name="note-text" size={12} color="#8B5A8E" />
                      </View>
                    )}
                  </View>
                  <View style={styles.dateInfo}>
                    <Text style={[styles.dayName, isPast && styles.textPast]}>
                      {item.day}
                    </Text>
                    <Text style={[styles.dateText, isPast && styles.textPast]}>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.dayAddNoteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      openNoteModal(item.ramadan);
                    }}
                    activeOpacity={0.7}>
                    <Icon name="plus-circle-outline" size={24} color="#8B5A8E" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.timesContainer}>
                  <View style={styles.timeItem}>
                    <Text style={[styles.timeItemLabel, isPast && styles.textPast]}>
                      Sehri
                    </Text>
                    <Text style={[styles.timeItemValue, isPast && styles.textPast]}>
                      {item.sehri}
                    </Text>
                  </View>
                  <View style={styles.timeItem}>
                    <Text style={[styles.timeItemLabel, isPast && styles.textPast]}>
                      Iftar
                    </Text>
                    <Text style={[styles.timeItemValue, isPast && styles.textPast]}>
                      {item.iftar}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
        ) : (
          // Calendar Grid View
          <View style={styles.calendarGridContainer}>
            <View style={styles.weekDaysHeader}>
              {['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'].map((day, index) => (
                <Text 
                  key={day} 
                  style={[
                    styles.weekDayText,
                    index === 0 && styles.weekDaySunday
                  ]}>
                  {day}
                </Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {(() => {
                // Get the first day of Ramadan and calculate offset
                const firstDay = ramadanData[0];
                const dayMap = {SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6};
                const startOffset = dayMap[firstDay.day];
                
                // Create empty cells for days before Ramadan starts
                const emptyCells = Array(startOffset).fill(null);
                
                return [...emptyCells, ...ramadanData].map((item, index) => {
                  if (!item) {
                    return <View key={`empty-${index}`} style={styles.calendarDay} />;
                  }
                  
                  const dataIndex = ramadanData.findIndex(d => d.ramadan === item.ramadan);
                  const isToday = dataIndex === todayIndex;
                  const isPast = dataIndex < todayIndex;
                  const isSunday = item.day === 'SUN';
                  const isSelected = selectedDay && selectedDay.ramadan === item.ramadan;
                  
                  return (
                    <TouchableOpacity
                      key={item.ramadan}
                      onPress={() => setSelectedDay(item)}
                      activeOpacity={0.7}
                      style={styles.calendarDay}>
                      <Text 
                        style={[
                          styles.calendarDayNumber,
                          isSunday && styles.calendarDaySunday,
                          isPast && styles.calendarDayPast,
                          isToday && styles.calendarDayToday,
                        ]}>
                        {item.ramadan}
                      </Text>
                      {isToday && <View style={styles.todayUnderline} />}
                      {isSelected && !isToday && <View style={styles.selectedUnderline} />}
                    </TouchableOpacity>
                  );
                });
              })()}
            </View>
            
            {/* <View style={styles.calendarFooter}>
              <Text style={styles.footerTitle}>Prayer Times</Text>
              {ramadanData.slice(0, 5).map((item) => (
                <Text key={item.ramadan} style={styles.footerText}>
                  {item.ramadan}  Sehri: {item.sehri} • Iftar: {item.iftar}
                </Text>
              ))}
            </View> */}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}>
              <Icon name="close" size={24} color="#8B5A8E" />
            </TouchableOpacity>
            
            {selectedEvent && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalIcon}>{getEventIcon(selectedEvent.type)}</Text>
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={styles.modalDescription}>{selectedEvent.description}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={noteModalVisible}
        onRequestClose={() => setNoteModalVisible(false)}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}>
          <View style={styles.noteModalContent}>
            <View style={styles.noteModalHeader}>
              <Text style={styles.noteModalTitle}>
                Add Your Personal Note for Day {noteDayNumber}
              </Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  setNoteModalVisible(false);
                  setNoteText('');
                  setNoteDayNumber(null);
                }}
                activeOpacity={0.7}>
                <Icon name="close" size={24} color="#8B5A8E" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.noteInput}
              multiline
              placeholder="Write your thoughts, reflections, or reminders for this day..."
              placeholderTextColor="#B388B3"
              value={noteText}
              onChangeText={setNoteText}
              textAlignVertical="top"
            />
            
            <Text style={styles.noteDisclaimer}>
              * Notes are device-specific until login functionality is created
            </Text>
            
            <View style={styles.noteModalActions}>
              {dayNotes[noteDayNumber] && (
                <TouchableOpacity 
                  style={styles.deleteNoteButton}
                  onPress={deleteNote}
                  activeOpacity={0.7}>
                  <Icon name="delete-outline" size={20} color="#FF6B6B" />
                  <Text style={styles.deleteNoteText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.saveNoteButton}
                onPress={saveNote}
                activeOpacity={0.7}>
                <Icon name="content-save" size={20} color="#FFFFFF" />
                <Text style={styles.saveNoteText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 245, 247, 0.85)',
    position: 'relative',
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B5A8E',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 20,
    color: '#B388B3',
    marginTop: 5,
    fontWeight: '600',
  },
  todayCard: {
    margin: 20,
    marginBottom: 10,
    padding: 25,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#FFE5EC',
  },
  todayBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  todayBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  todayRamadan: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B5A8E',
    textAlign: 'center',
    marginBottom: 8,
  },
  gregorianDate: {
    fontSize: 15,
    fontWeight: '500',
    color: '#B388B3',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  todayTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeDivider: {
    width: 2,
    height: 50,
    backgroundColor: '#F3E5F5',
  },
  timeLabel: {
    fontSize: 16,
    color: '#B388B3',
    marginBottom: 8,
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#8B5A8E',
  },
  notificationHint: {
    fontSize: 11,
    color: '#B388B3',
    marginTop: 5,
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B5A8E',
  },
  viewToggle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  dayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(230, 213, 245, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dayCardToday: {
    borderLeftColor: 'rgba(255, 182, 193, 0.8)',
    backgroundColor: 'rgba(255, 251, 252, 0.35)',
    borderWidth: 2,
    borderColor: 'rgba(255, 229, 236, 0.5)',
  },
  dayCardSelected: {
    borderLeftColor: 'rgba(139, 90, 142, 0.8)',
    backgroundColor: 'rgba(243, 229, 245, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(179, 136, 179, 0.5)',
  },
  dayCardPast: {
    opacity: 0.5,
    backgroundColor: '#F9F9F9',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayNumberContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B5A8E',
  },
  dateInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5A8E',
  },
  dateText: {
    fontSize: 14,
    color: '#B388B3',
    marginTop: 2,
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3E5F5',
  },
  timeItem: {
    alignItems: 'center',
  },
  timeItemLabel: {
    fontSize: 13,
    color: '#B388B3',
    marginBottom: 4,
    fontWeight: '600',
  },
  timeItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5A8E',
  },
  textPast: {
    color: '#AAAAAA',
  },
  calendarGridContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingBottom: 15,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    width: '14.28%',
    textAlign: 'center',
  },
  weekDaySunday: {
    color: '#FF69B4',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarDayNumber: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  calendarDaySunday: {
    color: '#FF69B4',
    fontWeight: '600',
  },
  calendarDayToday: {
    fontWeight: '700',
  },
  calendarDayPast: {
    opacity: 0.5,
  },
  todayUnderline: {
    width: 30,
    height: 3,
    backgroundColor: '#FFD700',
    marginTop: 3,
    borderRadius: 2,
  },
  selectedUnderline: {
    width: 30,
    height: 3,
    backgroundColor: '#B388B3',
    marginTop: 3,
    borderRadius: 2,
  },
  calendarFooter: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    fontWeight: '500',
  },
  gridCell: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#E6D5F5',
  },
  gridCellToday: {
    borderLeftColor: '#FFB6C1',
    backgroundColor: 'rgba(255, 251, 252, 0.95)',
    borderWidth: 2,
    borderColor: '#FFE5EC',
  },
  gridCellPast: {
    opacity: 0.5,
    backgroundColor: '#F9F9F9',
  },
  gridDay: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5A8E',
    textAlign: 'center',
    marginBottom: 5,
  },
  gridDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B388B3',
    textAlign: 'center',
    marginBottom: 8,
  },
  gridTimes: {
    borderTopWidth: 1,
    borderTopColor: '#F3E5F5',
    paddingTop: 8,
  },
  gridTime: {
    fontSize: 11,
    color: '#8B5A8E',
    fontWeight: '600',
    marginBottom: 3,
  },
  eventsSection: {
    marginTop: 20,
  },
  eventsDivider: {
    height: 1,
    backgroundColor: '#F3E5F5',
    marginBottom: 15,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5A8E',
    marginBottom: 12,
    textAlign: 'center',
  },
  eventCard: {
    paddingVertical: 12,
    marginBottom: 8,
  },
  eventCardHighlight: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#8B5A8E',
    flex: 1,
  },
  eventTitleHighlight: {
    color: '#D4AF37',
    fontWeight: '500',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 34,
  },
  knowMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  knowMoreText: {
    fontSize: 13,
    color: '#8B5A8E',
    fontWeight: '600',
    marginRight: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 40,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B5A8E',
    textAlign: 'center',
  },
  modalBody: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3E5F5',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  addNoteButton: {
    position: 'absolute',
    top: 25,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dayAddNoteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  noteIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFE5EC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  noteSection: {
    marginTop: 20,
  },
  noteDivider: {
    height: 1,
    backgroundColor: '#F3E5F5',
    marginBottom: 15,
  },
  noteHeader: {
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5A8E',
  },
  noteText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  noteModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    width: '100%',
    maxHeight: '80%',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  noteModalHeader: {
    marginBottom: 20,
    paddingRight: 40,
  },
  noteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5A8E',
    textAlign: 'center',
    lineHeight: 28,
  },
  noteInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#F3E5F5',
    marginBottom: 10,
  },
  noteDisclaimer: {
    fontSize: 12,
    color: '#B0B0B0',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveNoteButton: {
    flexDirection: 'row',
    backgroundColor: '#8B5A8E',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  saveNoteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  deleteNoteButton: {
    flexDirection: 'row',
    backgroundColor: '#FFE5E5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteNoteText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default CalenderPage;
