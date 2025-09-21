import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
  FlatList,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { getEvent } from '@/services/events';
import { useQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AssetItem from '@/components/AssetItem';

import { Galeria } from '@nandorojo/galeria';
import { cloudinary } from '@/lib/cloudinary';
import { artisticFilter } from '@cloudinary/url-gen/actions/effect';

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: event,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['events', id],
    queryFn: () => getEvent(id),
  });

  const urls = (event?.assets || []).map((asset) =>
    cloudinary.image(asset.asset_id!).effect(artisticFilter('al_dente')).toURL()
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: event.name,
          headerRight: () => (
            <Link href={`/events/${id}/share`} asChild>
              <Ionicons
                name='share-outline'
                size={24}
                color='white'
                className='mr-2 ml-2'
              />
            </Link>
          ),
        }}
      />

      <Galeria urls={urls} theme='dark'>
        {/* {event.assets.map((asset, index) => (
          <Galeria.Image key={asset.id} index={index}>
            <AssetItem asset={asset} />
          </Galeria.Image>
        ))} */}
        <FlatList
          data={event.assets}
          numColumns={2}
          contentContainerClassName='gap-1 p-4'
          columnWrapperClassName='gap-1'
          renderItem={({ item, index }) => (
            <View className='flex-1 max-w-[50%]'>
              <Galeria.Image key={item.id} index={index}>
                <AssetItem asset={item} />
              </Galeria.Image>
            </View>
          )}
          contentInsetAdjustmentBehavior='automatic'
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      </Galeria>

      {/* <FlatList
        data={event.assets}
        numColumns={2}
        contentContainerClassName='gap-1 p-4'
        columnWrapperClassName='gap-1'
        renderItem={({ item }) => <AssetItem asset={item} />}
        contentInsetAdjustmentBehavior='automatic'
        refreshing={isRefetching}
        onRefresh={refetch}
      /> */}

      <Link href={`/events/${id}/camera`} asChild>
        <Pressable className='absolute bottom-12 right-4 flex-row items-center justify-center bg-white p-6 rounded-full'>
          <Ionicons name='camera-outline' size={40} color='black' />
        </Pressable>
      </Link>
    </>
  );
}
