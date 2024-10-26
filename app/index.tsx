import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import id from "./details/[id]";

const IndexPage = () => {
  const [asteroidId, setAsteroidId] = useState("");
  const [ids, setIds] = useState<number[]>([]);

  const apiKey = "RMRLHHe5rQmM2ESuw4b4PcWHLaHDrTIi5wQu5foU";

  const handleSubmit = () => {
    router.push(`/details/${asteroidId}`);
  };

  const handleRandomAsteroid = () => {
    if (ids.length === 0) {
      console.log("No IDs available");
      return;
    }
    console.log(ids.length);
    const randomIndex = Math.floor(Math.random() * ids.length);
    const randomId = ids[randomIndex];
    console.log("Random ID:", randomId);
    router.push(`/details/${randomId}`);
  };

  useEffect(() => {
    const getIds = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`
        );

        if (!response.ok) {
          console.error("Failed to fetch data, status:", response.status);
          return;
        }

        const data = await response.json();

        if (data && data.near_earth_objects) {
          const idList = data.near_earth_objects.map(
            (asteroid: { id: any }) => asteroid.id
          );
          setIds(idList);
        } else {
          console.log("No near_earth_objects data found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getIds();
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://plus.unsplash.com/premium_photo-1679526019856-72bd880632e0?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>NASA Asteroid Tracker</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter Asteroid ID"
            placeholderTextColor="#A0A0A0"
            value={asteroidId}
            onChangeText={setAsteroidId}
            keyboardType="numeric"
          />
          <TouchableOpacity
            disabled={asteroidId === ""}
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.randomButton]}
            onPress={handleRandomAsteroid}
          >
            <Text style={styles.buttonText}>Random Asteroid</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4B0082",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  randomButton: { backgroundColor: "#909090" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
