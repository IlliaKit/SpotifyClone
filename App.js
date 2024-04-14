import { StyleSheet, Text, View, Image} from "react-native";
import React, { useState, useEffect } from 'react';
import Navigation from "./StackNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { AudioProvider } from "./components/AudioContext";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {

    setTimeout(() => {
      setIsLoaded(true);
    }, 2000); 


    return () => clearTimeout();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoaded ? (
           <>
           <AudioProvider>
             <Navigation />
           </AudioProvider>
         </>
      ) : (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
       <View style={styles.container}>
        <Image  source={require("./src/img/Spotify.png")}/>
    
       </View>
        </LinearGradient>
 
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
