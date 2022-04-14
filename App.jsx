import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { weatherAPIKey } from './env';

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weather, setWeather] = useState('00℃');
  /* eslint-disable-next-line */
  const [errorMsg, setErrorMsg] = useState(null);

  const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';
  // const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=35.51101&lon=139.56712&lang=ja&appid=57e4ad1e13407946c7dcc2f1dd7d8009';

  // 緯度経度取得
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const nowlocation = await Location.getCurrentPositionAsync({});
      setLatitude(JSON.stringify(nowlocation.coords.latitude));
      setLongitude(JSON.stringify(nowlocation.coords.longitude));
    })();
  }, []);
  console.log(latitude, longitude);

  // 緯度経度情報からAPIで気温を取得
  const fetchWeather = async () => {
    try {
      const lat = latitude;
      const lon = longitude;
      const response = await axios.get(`${weatherURL}?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`);
      const { data } = response;
      console.log(data);
      return (((data.main.temp) * 100) - 27315) / 100;
    } catch (error) {
      return '天気情報の取得に失敗しました。';
    }
  };
  // 現在地の温度を取得
  async function handlePress() {
    const currentWeather = await fetchWeather();
    setWeather(`${currentWeather} ℃`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.textcont}>
        <Text style={styles.maintitle}>ココ今何度？？</Text>
        <Text style={styles.temp}>{weather}</Text>
      </View>
      {/* eslint-disable-next-line */}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>調べる</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textcont: {
    marginBottom: 80,
  },
  maintitle: {
    fontSize: 24,
    marginBottom: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  temp: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 24,
    width: '60%',
    backgroundColor: 'green',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
