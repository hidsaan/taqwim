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
} from 'react-native';
import ramadanData from './data.json';

function CalenderPage() {
  const [currentDay, setCurrentDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = ramadanData.find(item => item.date === today);
    setCurrentDay(todayData);
    setSelectedDay(todayData); // Set selected day to today initially
  }, []);

  const getTodayIndex = () => {
    const today = new Date().toISOString().split('T')[0];
    return ramadanData.findIndex(item => item.date === today);
  };

  const todayIndex = getTodayIndex();

  return (
    <ImageBackground 
      source={require('../assets/bg.png')} 
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✨ Ramadan 2026 ✨</Text>
          <Text style={styles.headerSubtitle}>رمضان مبارك</Text>
        </View>

      {selectedDay && (
        <View style={styles.todayCard}>
          {currentDay && selectedDay.ramadan === currentDay.ramadan && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>TODAY</Text>
            </View>
          )}
          <Text style={styles.todayRamadan}>Day {selectedDay.ramadan}</Text>
          <View style={styles.todayTimes}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>🌙 Sehri</Text>
              <Text style={styles.timeValue}>{selectedDay.sehri}</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>🌅 Iftar</Text>
              <Text style={styles.timeValue}>{selectedDay.iftar}</Text>
            </View>
          </View>
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
            <Text style={styles.viewToggleIcon}>
              {viewMode === 'list' ? '📅' : '📋'}
            </Text>
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
    marginBottom: 20,
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
  viewToggleIcon: {
    fontSize: 22,
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
});

export default CalenderPage;
