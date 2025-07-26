import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.content}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="#000000" />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          
          <View style={styles.rightSpace} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
 container: {
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'ios' ? 44 : 0, // Don't use StatusBar.currentHeight
},

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  rightSpace: {
    width: 32,
  },
});

export default CustomHeader;