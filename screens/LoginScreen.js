import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "7e3c5cf127e541c7a6e4596e605dcab2",
      scopes: ["user-read-email", "playlist-modify-public"],

      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: "exp://192.168.0.12:8081",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(response);
      if (response) {
        navigation.replace("Main");
      }
    }
  }, [response]);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80, marginBottom: "10%" }} />
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={100}
          color="white"
        />
        <Text
          style={{
            color: "white",
            fontSize: 35,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Millions of songs Free on Spotify.
        </Text>

        <View style={{ height: 80 }} />

        <Pressable
          onPress={() => {
            //promptAsync();
            navigation.replace("Main");
          }}
          style={{
            backgroundColor: "#4CAF50",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: "90%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 6,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
        
            Sign up free
          </Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: "90%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 6,
            borderWidth: 0.8,
            borderColor: "white",
          }}
        >
          <MaterialIcons name="phone-iphone" size={24} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 17,
              flex: 1,
            }}
          >
            Continue with phone number
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: "90%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 6,
            borderWidth: 0.8,
            borderColor: "white",
          }}
        >
          <Image source={require("../src/img/Google.png")} />

          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 17,
              flex: 1,
            }}
          >
            Continue with Google
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: "90%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 6,
            borderWidth: 0.8,
            borderColor: "white",
          }}
        >
          <Image source={require("../src/img/Facebook.png")} />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 17,
              flex: 1,
            }}
          >
            Continue with facebook
          </Text>
        </Pressable>

        <Pressable
          style={{
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: "90%",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 6,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 17,
              flex: 1,
            }}
          >
            Log in
          </Text>
       
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
