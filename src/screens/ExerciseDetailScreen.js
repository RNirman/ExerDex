import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';

export default function ExerciseDetailScreen({ route }) {
  const { exercise } = route.params;
  useKeepAwake();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
      let interval = null;
      if (isActive) {
        interval = setInterval(() => {
          setSeconds(seconds => seconds + 1);
        }, 1000);
      } else if (!isActive && seconds !== 0) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isActive, seconds]);

    const toggleTimer = () => {
      setIsActive(!isActive);
    };

    const resetTimer = () => {
      setIsActive(false);
      setSeconds(0);
    };

    const formatTime = (totalSeconds) => {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Large Hero Image */}
      <Image source={{ uri: exercise.image }} style={styles.image} />

      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title}>{exercise.name}</Text>

        {/* Divider Line */}
        <View style={styles.separator} />

        {/* Full Description */}
        <Text style={styles.sectionHeader}>Technique & Instructions</Text>
        <Text style={styles.description}>
          {exercise.description}
        </Text>

        <View style={styles.timerSection}>
                  <Text style={styles.sectionHeader}>Practice Timer</Text>

                  <View style={styles.timerCard}>
                    <Text style={styles.timerText}>{formatTime(seconds)}</Text>

                    <View style={styles.timerControls}>
                      {/* Play/Pause Button */}
                      <TouchableOpacity
                        style={[styles.controlBtn, isActive ? styles.pauseBtn : styles.startBtn]}
                        onPress={toggleTimer}
                      >
                        <Ionicons
                          name={isActive ? "pause" : "play"}
                          size={24}
                          color="#fff"
                        />
                        <Text style={styles.btnText}>
                          {isActive ? "Pause" : "Start"}
                        </Text>
                      </TouchableOpacity>

                      {/* Reset Button */}
                      <TouchableOpacity
                        style={[styles.controlBtn, styles.resetBtn]}
                        onPress={resetTimer}
                      >
                        <Ionicons name="refresh" size={24} color="#333" />
                        <Text style={[styles.btnText, { color: '#333' }]}>Reset</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  image: { width: '100%', height: 350, resizeMode: 'cover', opacity: 0.9 },
  contentContainer: {
    padding: 24,
    marginTop: -30,
    backgroundColor: '#121212',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  separator: { height: 1, backgroundColor: '#333', marginVertical: 20 },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: '#0A84FF', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  description: { fontSize: 16, lineHeight: 26, color: '#CCCCCC' },

  timerSection: { marginTop: 40, marginBottom: 20 },
  timerCard: {
    backgroundColor: '#1E1E1E',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  timerText: { fontSize: 56, fontWeight: 'bold', color: '#FFFFFF', fontVariant: ['tabular-nums'], marginBottom: 24 },
  timerControls: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  controlBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, minWidth: 110, justifyContent: 'center' },
  startBtn: { backgroundColor: '#32D74B' },
  pauseBtn: { backgroundColor: '#FF9F0A' },
  resetBtn: { backgroundColor: '#3A3A3C' },
  btnText: { fontWeight: '700', fontSize: 16, color: '#fff', marginLeft: 8 },
});