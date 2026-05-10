import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDFHqosxCqFx3g41MPxJ76GDESq-oPqmZE",
  authDomain: "precode-mvp.firebaseapp.com",
  projectId: "precode-mvp",
  storageBucket: "precode-mvp.firebasestorage.app",
  messagingSenderId: "216078307416",
  appId: "1:216078307416:web:b327477c8fe34249fc3a2d",
  measurementId: "G-S3Y44VEQ6L"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics is only supported in browser environments
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const githubProvider = new GithubAuthProvider();

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with GitHub", error);
    throw error;
  }
};
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export { app, analytics };
