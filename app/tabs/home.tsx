import { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

interface SinglePlace {
  latitude: number;
  longitude: number;
}

interface AllPlaces {
  fsq_id: string;
  name: string;
}

export default function App() {
  const [location, setLocation] = useState<null | any>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState<null | AllPlaces[]>(null);
  const [singlesearchPlace, setsinglesearchPlace] = useState<null | SinglePlace>(null);
  const [region, setRegion] = useState<any>(null);
  const [direction, setDirection] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // search places
  const searchPlaces = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3Ev6u2tm0afrjVgLszFoPMsmBVQMoMVnsWHVj1E0cDgo=",
      },
    };

    fetch(
      `https://api.foursquare.com/v3/places/search?query=${search}&ll=${location?.coords.latitude}%2C${location?.coords.longitude}&radius=100000`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setPlaces(res.results);
      })
      .catch((err) => console.error(err));
  };

  // single place
  const singlePlace = (item: any) => {
    setPlaces(null);
    setsinglesearchPlace({
      latitude: item.geocodes.main.latitude,
      longitude: item.geocodes.main.longitude,
    });
    setRegion({
      latitude: item.geocodes.main.latitude,
      longitude: item.geocodes.main.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <>
      <View style={styles.container1}>
        {location && (
          <MapView
            region={region}
            onRegionChangeComplete={setRegion}
            style={styles.map}
          >
            {/* User Location Marker */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />

            {/* Search Place Marker */}
            {singlesearchPlace && (
              <Marker
                coordinate={{
                  latitude: singlesearchPlace.latitude,
                  longitude: singlesearchPlace.longitude,
                }}
                title="Selected Place"
              />
            )}

            {/* Direction Polyline */}
            {singlesearchPlace && direction && (
              <Polyline
                coordinates={[
                  {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  },
                  {
                    latitude: singlesearchPlace.latitude,
                    longitude: singlesearchPlace.longitude,
                  },
                ]}
                strokeWidth={5}
                strokeColor="#000000"
              />
            )}
          </MapView>
        )}

        <TouchableOpacity
          onPress={() => setDirection(!direction)}
          style={styles.button}
        >
          <Text>{direction ? "Hide Direction" : "Show Direction"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container2}>
        <TextInput
          style={styles.input}
          onChangeText={setSearch}
          value={search}
          placeholder="Search"
        />
        <TouchableOpacity onPress={searchPlaces} style={styles.buttonS}>
          <Text>Search</Text>
        </TouchableOpacity>
      </View>

      <View>
        {places && (
          <FlatList
            data={places}
            renderItem={({ item }) => {
              return (
                <View style={styles.list}>
                  <Text onPress={() => singlePlace(item)}>{item.name}</Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.fsq_id}
          />
        )}
      </View>
      <View style={styles.price}>
        <Text style={styles.priceText}>RS:150</Text>
      </View>
      <View style={styles.requestBtn}>
        <Text style={styles.requestText}>Request Ride</Text>
      </View>


    </>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: "80%",
  },
  input: {
    height: 40,
    width: "70%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#C3F224",
    padding: 10,
    width: "100%",
  },
  buttonS: {
    alignItems: "center",
    backgroundColor: "#C3F224",
    width: "20%",
    padding: 10,
    borderRadius: 10,
  },
  list: {
    backgroundColor: "gray",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 5,
    width: 280,
  },
  price:{
    flex:0.3,
    width:'100%',
    alignItems: "center",
  },
  priceText:{
    alignItems: "center",
    fontSize:30,
  },
  requestBtn:{
    flex:0.2,
    alignItems: "center",
    backgroundColor: "#C3F224",
    width: "100%",
    padding: 10,
    borderRadius: 10,
  },
  requestText:{
    alignItems: "center",
    fontSize:20,
  }
});
