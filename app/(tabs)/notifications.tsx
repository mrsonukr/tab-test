import { StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';

export default function Tab() {
  return (
    <>
      <CustomHeader title="Notifications" />
      <View style={styles.container}>
        <Text>Tab [Home|Settings]</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
