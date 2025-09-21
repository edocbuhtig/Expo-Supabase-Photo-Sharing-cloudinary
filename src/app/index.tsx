import {
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getEventsForUser } from '../services/events';
import EventListItem from '../components/EventListItem';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEventsForUser(user!.id),
  });

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data}
      contentContainerClassName='gap-4 p-4'
      renderItem={({ item }) => <EventListItem event={item} />}
      contentInsetAdjustmentBehavior='automatic'
      ListHeaderComponent={() => (
        <Link href='/events/create' asChild>
          <Pressable className='bg-purple-800 p-4 rounded-lg items-center justify-center flex-row gap-2'>
            <Ionicons name='add-outline' size={24} color='white' />
            <Text className='text-white text-lg font-semibold'>
              Create Event
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
}
