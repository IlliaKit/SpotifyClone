import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { AudioContext } from "../components/AudioContext";

const HomeScreen = () => {
  const { isPlaying, setIsPlaying, sound, setSound, trackData, setTrackData } =
    useContext(AudioContext);

  const [trendingTracks, setTrendingTracks] = useState([]);
  const [trendingTracksRock, setTrendingTracksRock] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const showAlert = () => {
    Alert.alert(
      "Help",
      "Hello! If you need help, I'm here to support you. Below are some examples of topics I can help you with: ...",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const playNewTrack = async (newTrack) => {
    await stopTrack();
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: newTrack.preview,
    });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
    setTrackData(newTrack);
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);
      }
    });
  };

  const playPreviousTrack = async () => {
    await stopTrack();
    const currentIndex = trendingTracks.findIndex(
      (item) => item.id === trackData.id
    );
    const previousTrack = trendingTracks[currentIndex - 1];
    if (previousTrack) {
      await playNewTrack(previousTrack);
    }
  };

  const playNextTrack = async () => {
    await stopTrack();
    const currentIndex = trendingTracks.findIndex(
      (item) => item.id === trackData.id
    );
    const nextTrack = trendingTracks[currentIndex + 1];
    if (nextTrack) {
      await playNewTrack(nextTrack);
    }
  };

  const formatTime = (millis) => {
    if (!millis) {
      return "00:00";
    }

    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const playTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: trackData.preview,
    });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);
      }
    });
  };

  const pauseTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopTrack = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const openModal = async (track) => {
    await stopTrack();
    setTrackData(track);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      try {
        const response = await axios.get("https://api.deezer.com/chart");
        setTrendingTracks(response.data.tracks.data);
        ``;
        const responseRock = await axios.get("https://api.deezer.com/search", {
          params: {
            q: "genre:lofi",
            limit: 10,
          },
        });
        setTrendingTracksRock(responseRock.data.data);
      } catch (error) {
        console.error("Error fetching trending tracks:", error);
      }
    };

    fetchTrendingTracks();
  }, []);

  const renderTrackItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={{ marginRight: 20, width: 150 }}>
        <Image
          source={{ uri: item.album.cover_medium }}
          style={{ width: 150, height: 150, borderRadius: 10 }}
        />
        <Text
          style={{
            color: "#A8A8A8",
            fontSize: 14,
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ color: "#A8A8A8", fontSize: 12 }}>
          {item.artist.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const BottomPlayer = () => {
    if (!trackData) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.bottomPlayer}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: trackData.album.cover_medium }}
          style={styles.bottomPlayerImage}
        />
        <Text
          style={{
            color: "#A8A8A8",
            fontSize: 14,
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          {trackData.title}
        </Text>
        <View style={styles.bottomPlayerControls}>
          <TouchableOpacity onPress={isPlaying ? pauseTrack : playTrack}>
            <Text>
              {isPlaying ? (
                <AntDesign name="pausecircleo" size={30} color="white" />
              ) : (
                <AntDesign name="playcircleo" size={30} color="white" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: "20%", marginBottom: "30%" }}>
        <View
          style={{
            color: "#A8A8A8",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>
              Made for you
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "30%",
              justifyContent: "space-between",
            }}
          >
            <AntDesign name="bells" size={30} color="white" />
            <FontAwesome5
              style={{ paddingLeft: 5 }}
              name="history"
              size={24}
              color="white"
            />
            <Ionicons
              style={{ paddingLeft: 5 }}
              name="settings-outline"
              size={30}
              color="white"
            />

            <TouchableOpacity onPress={showAlert}>
              <Text>
                <AntDesign
                  style={{ paddingLeft: 5 }}
                  name="questioncircleo"
                  size={24}
                  color="white"
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            paddingTop: "10%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              flexDirection: "column",

              width: "35%",
            }}
          >
            <Image source={require("../src/img/Ed_Sheeran.png")} />
            <Text style={{ color: "#A8A8A8", fontSize: 10 }}>
              Ed Sheeran, Katy Perry, Pitbull and more
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",

              width: "35%",
            }}
          >
            <Image source={require("../src/img/Justin_Bieber.png")} />
            <Text style={{ color: "#A8A8A8", fontSize: 10 }}>
              Catch the Latest Playlist made just for you...
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            paddingTop: 20,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Trending now
          </Text>
          <FlatList
            data={trendingTracks}
            renderItem={renderTrackItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Trending now Lofi
          </Text>
          <FlatList
            data={trendingTracksRock}
            renderItem={renderTrackItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <BottomPlayer isPlaying={isPlaying} pauseTrack={pauseTrack} />

      {trackData && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: trackData.album.cover_medium }}
              style={styles.modalTrackImage}
            />
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Text style={styles.modalTrackTitle}>
                {trackData.title.length > 13
                  ? trackData.title.substring(0, 13) + "..."
                  : trackData.title}{" "}
                ({trackData.artist.name})
              </Text>
              <AntDesign name="hearto" size={24} color="white" />
            </View>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={(value) => setPosition(value)}
              disabled
              thumbTintColor="white"
              minimumTrackTintColor="white"
              maximumTrackTintColor="white"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <Text style={{ color: "white" }}>{formatTime(position)}</Text>
              <Text style={{ color: "white" }}>{formatTime(duration)}</Text>
            </View>
            <View style={styles.controls}>
              <Foundation name="shuffle" size={30} color="white" />
              <MaterialIcons
                style={{ paddingHorizontal: 35 }}
                name="skip-previous"
                size={40}
                color="white"
                onPress={playPreviousTrack}
              />
              <TouchableOpacity onPress={isPlaying ? pauseTrack : playTrack}>
                <Text>
                  {isPlaying ? (
                    <AntDesign name="pausecircleo" size={50} color="white" />
                  ) : (
                    <AntDesign name="playcircleo" size={50} color="white" />
                  )}
                </Text>
              </TouchableOpacity>
              <MaterialIcons
                style={{ paddingHorizontal: 35 }}
                name="skip-next"
                size={40}
                color="white"
                onPress={playNextTrack}
              />
              <SimpleLineIcons name="loop" size={30} color="white" />
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#131624",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTrackImage: {
    width: "85%",
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTrackTitle: {
    color: "white",
    fontSize: 15,

    fontWeight: "bold",
  },
  slider: {
    width: 300,
    height: 40,
    thumbTintColor: "white",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  bottomPlayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.9,
    paddingBottom: "15%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
  },
  bottomPlayerImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  bottomPlayerControls: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HomeScreen;
