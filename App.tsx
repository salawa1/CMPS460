import React, { useRef, useState } from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function App() {
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [photo, setPhoto] = useState('');
  const [photoCount, setPhotoCount] = useState(0);
  const [cameraMessage, setCameraMessage] = useState('');

  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  async function openCamera() {
    setCameraMessage('');

    try {
      const response = permission?.granted
        ? permission
        : await requestPermission();

      if (!response.granted) {
        setCameraMessage(
          'Camera permission denied. Enable access in device settings.',
        );
        return;
      }

      setCameraReady(false);
      setShowCamera(true);
    } catch {
      setCameraMessage('Could not open the camera.');
    }
  }

  async function takePhoto() {
    if (!camera.current || !cameraReady || takingPhoto) return;

    setTakingPhoto(true);
    setCameraMessage('Taking photo...');

    try {
      const result = await camera.current.takePictureAsync({
        base64: true,
        skipProcessing: true,
      });

      if (!result?.uri) {
        setCameraMessage('No photo was returned. Please try again.');
        return;
      }

      const imageSource = result.base64
        ? `data:image/jpeg;base64,${result.base64}`
        : result.uri;

      setPhoto(imageSource);
      setPhotoCount(current => current + 1);
      setShowCamera(false);
      setCameraReady(false);
      setCameraMessage('Photo captured.');
    } catch (error) {
      console.log('Camera error:', error);
      setCameraMessage(
        error instanceof Error
          ? error.message
          : 'Could not take a photo.',
      );
    } finally {
      setTakingPhoto(false);
    }
  }

  async function getLocation() {
    setGettingLocation(true);
    setLocationMessage('Getting location...');
    setCoords(null);

    try {
      const response =
        await Location.requestForegroundPermissionsAsync();

      if (response.status !== 'granted') {
        setLocationMessage(
          'Location permission denied. Enable access in device settings.',
        );
        return;
      }

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: false,
      });

      setCoords({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      });
      setLocationMessage('');
    } catch (error) {
      console.log('Location error:', error);
      setLocationMessage(
        error instanceof Error
          ? error.message
          : 'Could not get location.',
      );
    } finally {
      setGettingLocation(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Camera & Location</Text>

      {!showCamera ? (
        <Button
          title={photo ? 'Take Another Photo' : 'Open Camera'}
          onPress={openCamera}
          disabled={!permission}
        />
      ) : (
        <View>
          <CameraView
            ref={camera}
            style={styles.camera}
            facing="back"
            onCameraReady={() => setCameraReady(true)}
            onMountError={error => {
              setShowCamera(false);
              setCameraReady(false);
              setCameraMessage(error.message);
            }}
          />

          <Button
            title={takingPhoto ? 'Taking Photo...' : 'Take Photo'}
            onPress={takePhoto}
            disabled={!cameraReady || takingPhoto}
          />

          <Button
            title="Cancel"
            disabled={takingPhoto}
            onPress={() => {
              setShowCamera(false);
              setCameraReady(false);
            }}
          />
        </View>
      )}

      <Text style={styles.message}>{cameraMessage}</Text>

      {photo !== '' && (
        <View>
          <Text style={styles.message}>
            Photos captured: {photoCount}
          </Text>

          <Image
            source={{ uri: photo }}
            style={styles.thumbnail}
            resizeMode="contain"
            onError={() =>
              setCameraMessage('The captured photo could not be displayed.')
            }
          />
        </View>
      )}

      <Text style={styles.subheading}>Current Location</Text>

      <Button
        title="Get Current Location"
        onPress={getLocation}
        disabled={gettingLocation}
      />

      <Text style={styles.message}>{locationMessage}</Text>

      {coords && (
        <View>
          <Text>Latitude: {coords.latitude.toFixed(5)}</Text>
          <Text>Longitude: {coords.longitude.toFixed(5)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  camera: {
    height: 260,
    marginVertical: 12,
  },
  thumbnail: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  message: {
    marginVertical: 12,
  },
});