import { Feather } from '@expo/vector-icons';
import React from 'react';
import type { DimensionValue } from 'react-native';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  color?: string;
  width?: DimensionValue;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  color = '#0D0D0D',
  width = '100%',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: color, width: width as DimensionValue },
        (loading || disabled) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.content}>
          {icon && <Feather name={icon} size={18} color="#fff" style={styles.icon} />}
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.8,
  },
});

export default SubmitButton;
