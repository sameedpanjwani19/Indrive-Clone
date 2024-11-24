import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebasemethod';
import { collection, query, where, getDocs } from "firebase/firestore";

const profile = () => {
  const [singleUserData, setSingleUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const q = query(collection(db, "users"), where("id", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              setSingleUserData(userData);
            } else {
              setError("No user profile found");
            }
          } catch (error) {
            console.error(error);
            setError("Failed to fetch user profile");
          } finally {
            setLoading(false);
          }
        } else {
          console.log('User logged out');
          setLoading(false);
        }
      });
    };

    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  if (error) return <Text style={[styles.message, styles.error]}>{error}</Text>;

  return (
    <View style={styles.container}>
      {singleUserData ? (
        <>
          <Image
            style={styles.profileImage}
            source={{ uri: singleUserData.profileImage }}
          />
          <Text style={styles.name}>Name: {singleUserData.fullName}</Text>
          <Text style={styles.email}>Email: {singleUserData.email}</Text>
        </>
      ) : (
        <Text style={styles.message}>No profile data found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    color: 'red',
  },
});

export default profile;
