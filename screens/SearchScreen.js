import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { AudioContext } from "../components/AudioContext";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const API_URL = "https://api.deezer.com/search";

const SearchScreen = () => {
  const { isPlaying, setIsPlaying, sound, setSound, trackData, setTrackData } =
    useContext(AudioContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState([]);

  const searchTracks = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: searchQuery,
        },
      });
      setTracks(response.data.data);
    } catch (error) {
      console.error("Error searching tracks:", error);
    }
  };

  const BottomPlayer = () => {
    if (!isPlaying || !trackData) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.bottomPlayer}
        
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
        <Entypo name="dots-three-vertical" size={24} color="white" />
        </View>
      </TouchableOpacity>
    );
  };

  const pauseTrack = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };
  const playTrack = async (track) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: track.preview,
    });
    setSound(newSound);
    await newSound.playAsync();
    setTrackData(track);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => playTrack(item)}>
      <View style={styles.trackItem}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Image
            source={{ uri: item.album.cover_medium }}
            style={styles.trackImage}
          />
          <View
            style={{ flexDirection: "column", justifyContent: "flex-start" }}
          >
            <Text style={styles.trackTitle}>
              {item.title.length > 15
                ? item.title.substring(0, 15) + "..."
                : item.title}
            </Text>

            <View style={{ flexDirection: "row", alignItems:"center"}}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#C4C4C4",
                  fontSize: 12,
                  borderRadius: 5,
                  paddingHorizontal: 5,
                }}
              >
                LYRICS
              </Text>
              <Text style={{ color: "#A8A8A8", fontSize: 12, paddingLeft:10}}>
                {item.artist.name}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => playTrack(item)}>
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
          Search
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Artist, songs or podcasts"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchTracks}
        />

        <FlatList
          data={tracks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomPlayer isPlaying={isPlaying} pauseTrack={pauseTrack} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    width: "100%",
    flexShrink: 1,
  },
  trackImage: {
    width: 70,
    height: 70,

    marginRight: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    backgroundColor: "white",

    color: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  trackItem: {
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
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
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SearchScreen;
