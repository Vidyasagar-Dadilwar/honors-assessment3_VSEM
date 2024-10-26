import React, {useEffect, useState} from 'react';
import {router, useLocalSearchParams} from "expo-router";
import {Alert, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Clipboard from "expo-clipboard";

export type AsteroidData = {
    name: string;
    nasaJplUrl: string;
    isHazardous: boolean;
}

const DetailsPage = () => {
    const { id }  = useLocalSearchParams();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const apiKey = "RMRLHHe5rQmM2ESuw4b4PcWHLaHDrTIi5wQu5foU";

    const [asteroidData, setAsteroidData] = useState<AsteroidData | null>(null);

    const handleUrlPress = () => {
    }

    const fetchAsteroidData = async (id: string | string[]) : Promise<AsteroidData | null> => {
        console.log(id);

        setLoading(true);
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${apiKey}`);
        setLoading(false);

        if(!response) {
            setError('Response not received');
            return null;
        }

        let data = await response.json();

        if(!data) {
            console.log("Failed to convert data to json")
            return null;
        }

        if(!data.name) {
            console.log("Name is not found")
            return null;
        }

        if(!data.nasa_jpl_url) {
            console.log("NASA url is not found");
            return null;
        }

        if(!Object.hasOwn(data, "is_potentially_hazardous_asteroid")) {
            console.log("Hazard status is not found");
            return null;
        }

        // Mock data - replace with actual API response
        return {
            name: data.name,
            nasaJplUrl: data.nasa_jpl_url,
            isHazardous: data.is_potentially_hazardous_asteroid
        };
    }

    useEffect(() => {
        const loadAsteroidData = async () => {
            try {
                const data = await fetchAsteroidData(id);
                console.log(data);
                setAsteroidData(data);
            } 
            catch (err) {
                setError('Failed to fetch asteroid data. Please try again.');
                console.error(err);
            } 
            finally {
                setLoading(false);
            }
        };

        loadAsteroidData();
    }, [id]);

    return (
      <ImageBackground
        source={{
          uri: "https://plus.unsplash.com/premium_photo-1679526019856-72bd880632e0?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.background}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Asteroid Details
          </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>

            <Text style={styles.value}>
              {loading && "Loading..."}
              {asteroidData?.name}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>NASA JPL URL:</Text>
            <TouchableOpacity onPress={() => {
                if (asteroidData?.nasaJplUrl) {
                  Clipboard.setString(asteroidData.nasaJplUrl);
                  Alert.alert("Success", "NASA JPL URL copied to clipboard");
                }
            }}>
              <Text style={[styles.value, styles.link]}>
                {loading && "Loading..."}
                {asteroidData?.nasaJplUrl}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Potentially Hazardous:</Text>
            <Text
              style={[
                styles.value,
                asteroidData?.isHazardous ? styles.hazardous : styles.safe,
              ]}
            >
              {loading && "Loading..."}
              {asteroidData?.isHazardous ? "Yes" : "No"}
            </Text>
          </View>
          {error && (
            <View style={styles.infoContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: "cover" },
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor:'#000000',
        textAlign: 'center',
        marginBottom: 20,
        paddingVertical: 10,
        borderRadius: 10
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4B0082',
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        color: '#333333',
    },
    link: {
        color: '#0000EE',
        textDecorationLine: 'underline',
    },
    hazardous: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
    safe: {
        color: '#008000',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#4B0082',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        margin: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#FF0000',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});

    export default DetailsPage;