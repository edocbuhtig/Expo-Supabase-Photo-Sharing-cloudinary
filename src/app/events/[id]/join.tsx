import { View, Text, Button } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEvent, joinEvent } from '@/services/events';
import { useAuth } from '@/providers/AuthProvider';

export default function Join() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: event } = useQuery({
    queryKey: ['events', id],
    queryFn: () => getEvent(id),
  });

  const joinEventMutation = useMutation({
    mutationFn: () => joinEvent(id, user.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', id] });
      router.replace(`/events/${id}`);
    },
  });

  return (
    <View className='flex-1 p-4 gap-6 items-center justify-center'>
      <Text className='text-neutral-400 text-lg font-bold'>
        Your are invited to join
      </Text>
      <Text className='text-white text-5xl font-bold'>{event?.name}</Text>

      <Button title='Join Event' onPress={() => joinEventMutation.mutate()} />
    </View>
  );
}
