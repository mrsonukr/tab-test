import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';

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
    <>
      <CustomHeader title="Home" />
      <View style={styles.container}>
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

        {/* Two Boxes Below Slider */}
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hostel Mess</Text>
            <Text style={styles.cardDesc}>Check todays menu and timings</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Room Maintenance</Text>
            <Text style={styles.cardDesc}>Report issues or track status</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 16,

  },
  card: {
    flex: 1,
    backgroundColor: '#a8ffb8ff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#4b5563',
  },
});
