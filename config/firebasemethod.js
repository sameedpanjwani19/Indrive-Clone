import {
  getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import app from "./firebaseconfig.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";
  
  import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
  
  const auth = getAuth(app);
  
  // Initialize Firestore database
  const db = getFirestore(app);
  
  // Initialize Firebase storage
  const storage = getStorage(app);
  
  // Register user
  let signUpUser = (obj) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, obj.email, obj.password, obj.fullName, obj.profileImage)
        .then(async (res) => {
          obj.id = res.user.uid;
          await addDoc(collection(db, "users"), obj)
            .then(() => {
              console.log("User added to database successfully");
              resolve(obj);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  };
  
  // Login user
  let loginUser = (obj) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, obj.email, obj.password)
        .then(async () => {
          const q = query(
            collection(db, "users"),
            where("id", "==", auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const userData = [];
          querySnapshot.forEach((doc) => {
            userData.push(doc.data());
          });
          resolve(userData[0]); // Resolve the first user data found
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  
  // Sign out user
  const signOutUser = () => {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          resolve("User signed out successfully");
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  // Send data to Firestore
  const sendData = (obj, colName) => {
    return new Promise((resolve, reject) => {
      addDoc(collection(db, colName), obj)
        .then(() => {
          resolve("Data sent to DB successfully");
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  
  // Get data with ID from Firestore
  const getData = (colName, uid) => {
    return new Promise(async (resolve, reject) => {
      try {
        const dataArr = [];
        const q = query(collection(db, colName), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        
        // Push each document data to the array
        querySnapshot.forEach((doc) => {
          dataArr.push({ id: doc.id, ...doc.data() }); // Includes document ID
        });
  
        resolve(dataArr); // Resolve after collecting all data
      } catch (error) {
        reject(`Error occurred: ${error.message}`);
      }
    });
  };
  
  export default getData;
  
  // Get all data
  const getAllData = (colName) => {
    return new Promise(async (resolve, reject) => {
      const dataArr = [];
      try {
        const querySnapshot = await getDocs(collection(db, colName));
        querySnapshot.forEach((doc) => {
          const obj = { ...doc.data(), documentId: doc.id };
          dataArr.push(obj);
        });
        resolve(dataArr); // Resolve after looping through all documents
      } catch (error) {
        reject("Error occurred: " + error.message);
      }
    });
  };
  
  // Delete document by ID
  const deleteDocument = async (id, colName) => {
    return new Promise(async (resolve, reject) => {
      try {
        await deleteDoc(doc(db, colName, id));
        resolve("Document deleted successfully");
      } catch (error) {
        reject("Error occurred: " + error.message);
      }
    });
  };
  
  // Update document by ID
  const updateDocument = async (obj, id, colName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateRef = doc(db, colName, id);
        await updateDoc(updateRef, obj);
        resolve("Document updated successfully");
      } catch (error) {
        reject("Error occurred: " + error.message);
      }
    });
  };
  
  // Upload image to Firebase Storage
  async function uploadImage(file, email) {
    const storageRef = ref(storage, email);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  
  async function uploadBlogImage(file) {
    if (!file) {
      throw new Error("No file provided for upload");
    }
  
    try {
      // Create a reference to a specific folder and file in Firebase Storage
      const storageRef = ref(storage, `blogImages/${Date.now()}_${file.name}`);
      
      // Upload the file to this non-root reference
      const uploadResult = await uploadBytes(storageRef, file);
      
      // Retrieve the download URL after the upload is complete
      const url = await getDownloadURL(uploadResult.ref);
      
      console.log("File available at:", url);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(error.message);
    }
  }

  
  
  
  export {
    auth,
    db,
    signUpUser,
    loginUser,
    signOutUser,
    sendData,
    getData,
    getAllData,
    deleteDocument,
    updateDocument,
    uploadImage,
    collection,
    doc,
    getDocs,
    uploadBlogImage
  };
  