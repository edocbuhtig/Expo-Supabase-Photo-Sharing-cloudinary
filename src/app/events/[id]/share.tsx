import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function Share() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className='flex-1 p-4 gap-4 items-center '>
      <Text className='text-white text-2xl font-bold'>
        Share Event with your friends
      </Text>

      {/* <QRCode value={`photosharing://events/${id}/join`} size={200} /> */}
      <QRCode
        value={`exp://192.168.1.144:8081/--/events/${id}/join`}
        size={200}
      />
    </View>
  );
}
