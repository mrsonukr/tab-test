import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SLIDER_HEIGHT = 200;
const IMAGE_PADDING = 16;

const images = [
  'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/f13c94afb17bc9ba.jpeg?q=60',
  'https://rukminim2.flixcart.com/fk-p-flap/1984/968/image/4129256db1490942.jpg?q=60',
  'https://rukminim2.flixcart.com/fk-p-flap/960/460/image/b6c2fd1bc250976f.jpeg?q=60',
];

export default function Tab() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % images.length;
      scrollRef.current?.scrollTo({ x: currentIndex.current * width, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Sonu Kumar 👋</Text>
          </View>
          <Image
            source={require('../../assets/images/male.png')}
            style={styles.avatar}
          />
        </View>

        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          >
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Animated.ScrollView>
        </View>

        {/* Recent Complaints Header + Cards */}
        <View style={styles.recentComplaintsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Recent Complaints</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.complaintCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.iconWrapper}>
                <MaterialIcons name="lightbulb-outline" size={20} color="#3b82f6" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.complaintCategory}>Electricity</Text>
                <Text style={styles.complaintIssue}>Power fluctuation in room 304</Text>
                <Text style={styles.submittedText}>Submitted on 2024-02-15</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#fde68a' }]}>
                <Text style={[styles.statusText, { color: '#92400e' }]}>Pending</Text>
              </View>
            </View>
          </View>

          <View style={styles.complaintCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.iconWrapper}>
                <FontAwesome5 name="water" size={20} color="#3b82f6" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.complaintCategory}>Plumbing</Text>
                <Text style={styles.complaintIssue}>Water leakage in bathroom</Text>
                <Text style={styles.submittedText}>Submitted on 2024-02-14</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#bfdbfe' }]}>
                <Text style={[styles.statusText, { color: '#1e40af' }]}>In Progress</Text>
              </View>
            </View>
          </View>

          <View style={styles.complaintCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.iconWrapper}>
                <FontAwesome name="wrench" size={20} color="#3b82f6" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.complaintCategory}>Maintenance</Text>
                <Text style={styles.complaintIssue}>AC not working properly</Text>
                <Text style={styles.submittedText}>Submitted on 2024-02-13</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#bbf7d0' }]}>
                <Text style={[styles.statusText, { color: '#065f46' }]}>Resolved</Text>
              </View>
            </View>
          </View>

          {/* Raise New Complaint Button */}
          <TouchableOpacity style={styles.raiseButton}>
            <Text style={styles.raiseButtonText}>+ Raise New Complaint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24, // ensures no white gap at bottom
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sliderWrapper: {
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
  },
  imageContainer: {
    width: width,
    paddingHorizontal: IMAGE_PADDING,
  },
  image: {
    width: width - IMAGE_PADDING * 2,
    height: SLIDER_HEIGHT,
    borderRadius: 12,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  complaintCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginHorizontal: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    marginRight: 12,
    marginTop: 2,
  },
  cardInfo: {
    flex: 1,
  },
  complaintCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  complaintIssue: {
    fontSize: 13,
    color: '#374151',
    marginTop: 2,
  },
  submittedText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  raiseButton: {
    backgroundColor: '#2563eb',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  raiseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentComplaintsContainer: {
    backgroundColor: '#f2f2f7',
    marginTop: 24,
  },
});
