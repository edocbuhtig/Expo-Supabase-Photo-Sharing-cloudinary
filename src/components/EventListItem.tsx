import { Text, View, Pressable } from 'react-native';
import { Tables } from '../types/database.types';
import { Link } from 'expo-router';
import { getAssetsForEvent } from '@/services/assets';
import { useQuery } from '@tanstack/react-query';
import AssetItem from './AssetItem';
import { Ionicons } from '@expo/vector-icons';

type Event = Tables<'events'>;

type EventListItemProps = {
  event: Event;
};

export default function EventListItem({ event }: EventListItemProps) {
  const { data: assets } = useQuery({
    queryKey: ['assets', event.id],
    queryFn: () => getAssetsForEvent(event.id),
  });

  return (
    <Link href={`/events/${event.id}`} asChild>
      <Pressable className='bg-neutral-800 p-4 rounded-lg gap-4'>
        <Text className='text-neutral-200 text-3xl font-bold'>
          {event.name}
        </Text>

        <View className='flex-row items-center gap-1'>
          <Ionicons name='person-outline' size={16} color='gainsboro' />
          <Text className='text-neutral-200 text-lg '>
            {/* @ts-ignore */}
            {event.event_memberships?.[0]?.count}
          </Text>
        </View>

        {assets && assets.length > 0 && (
          <View className='flex-row gap-1'>
            {assets?.slice(0, 4).map((asset) => (
              <View key={asset.id} className='flex-1'>
                <AssetItem asset={asset} />
              </View>
            ))}
          </View>
        )}
      </Pressable>
    </Link>
  );
}
