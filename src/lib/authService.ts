import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLoginAt?: string;
  createdAt?: string;
}

/**
 * Save or update user profile document in Firestore (`users/{uid}`)
 */
export async function syncUserProfileToFirestore(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const nowStr = new Date().toISOString();

  const profileData: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'مستخدم جديد',
    photoURL: user.photoURL,
    lastLoginAt: nowStr,
  };

  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...profileData,
        createdAt: nowStr,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        userRef,
        {
          ...profileData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Error syncing user profile to Firestore:', error);
  }

  return profileData;
}

/**
 * Sign in using Google Auth popup (Gmail)
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfileToFirestore(result.user);
      return result.user;
    }
    return null;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    // Throw error so caller can handle or show fallback
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

/**
 * Listen to auth state changes
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await syncUserProfileToFirestore(user);
    }
    callback(user);
  });
}
