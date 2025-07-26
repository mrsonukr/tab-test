import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  secure?: boolean;
  options?: string[];
  value: string;
  onChangeText: (value: string) => void;
  error?: string; // ✅ Added error prop
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  secure = false,
  options,
  value,
  onChangeText,
  error,
  ...props
}) => {
  const isOptionsField = Array.isArray(options);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {isOptionsField ? (
        <View style={styles.optionsRow}>
          {options!.map((option) => {
            const selected = value === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => onChangeText(option)}
                style={[
                  styles.optionButton,
                  selected && styles.optionSelected,
                  error && styles.optionErrorBorder, // red border if error
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <TextInput
          style={[
            styles.input,
            error && styles.inputError, // red border if error
          ]}
          secureTextEntry={secure}
          placeholderTextColor="#979797ff"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#434343ff',
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    backgroundColor: '#f5f9ffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#f5f9ffff',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#0D0D0D',
    borderColor: '#0D0D0D',
  },
  optionErrorBorder: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 6,
  },
});

export default InputField;
