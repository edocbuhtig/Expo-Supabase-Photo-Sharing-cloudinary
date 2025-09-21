import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertAsset } from '@/services/assets';
import { useAuth } from '@/providers/AuthProvider';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const insertAssetMutation = useMutation({
    mutationFn: (assetId: string) =>
      insertAsset({ event_id: id, user_id: user?.id, asset_id: assetId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', id] });
    },
  });

  const camera = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    const photo = await camera.current?.takePictureAsync();
    if (!photo?.uri) return;

    const cloudinaryResponse = await uploadToCloudinary(photo.uri);
    console.log(JSON.stringify(cloudinaryResponse, null, 2));

    insertAssetMutation.mutate(cloudinaryResponse.public_id);
    // save it to the database assets table
  }

  return (
    <View style={styles.container}>
      <CameraView ref={camera} style={styles.camera} facing={facing}>
        <View className='absolute bottom-0 bg-neutral-900/20 w-full p-4'>
          <Ionicons
            name='camera-reverse'
            size={24}
            color='white'
            onPress={toggleCameraFacing}
          />
        </View>
      </CameraView>

      {/* Footer */}
      <SafeAreaView
        edges={['bottom']}
        className='flex-row bg-transparent w-full p-4 justify-center items-center'
      >
        <Pressable
          onPress={takePhoto}
          className='bg-white rounded-full w-20 h-20'
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    backgroundColor: 'red',
  },

  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
