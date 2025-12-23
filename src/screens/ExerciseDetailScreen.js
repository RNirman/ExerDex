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

export default function ExerciseDetailScreen({ route }) {
  const { exercise } = route.params;

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

    // Helper to format 65 seconds into "01:05"
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  // --- TIMER STYLES ---
  timerSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  timerCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    fontVariant: ['tabular-nums'], // Keeps numbers monospaced (prevents jumping)
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    minWidth: 120,
    justifyContent: 'center',
  },
  startBtn: {
    backgroundColor: '#34C759', // Green
  },
  pauseBtn: {
    backgroundColor: '#FF9500', // Orange
  },
  resetBtn: {
    backgroundColor: '#e5e5ea',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  }
});