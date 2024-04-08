import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform, ToastAndroid } from 'react-native';
import { captureRef } from 'react-native-view-shot'; // To capture a view as an image

const downloadQRCode = async (ref) => {
  // Request permissions using Expo's MediaLibrary
  const permissionResult = await MediaLibrary.requestPermissionsAsync();
  if (permissionResult.status !== 'granted') {
    console.log('Media library permission denied');
    return;
  }

  // Capture the QR code view as an image
  captureRef(ref, {
    format: 'jpg',
    quality: 0.8,
  }).then(async (uri) => {
    try {
      // Save the captured image to the camera roll/gallery
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
      console.log('QR Code saved to Photos');
      if (Platform.OS === 'android') {
       ToastAndroid.show('QR Code saved to Gallery', ToastAndroid.SHORT);
     } else {
       // For iOS, you might use a custom toast component or a library
       alert('QR Code saved to Gallery'); // Simple fallback
     }
    } catch (error) {
      console.error('Failed to save QR Code', error);
    }
  }).catch((error) => {
    console.error('Snapshot failed', error);
  });
};

export default downloadQRCode;
