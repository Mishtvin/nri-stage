
'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  linkWithCredential,
  deleteUser,
} from 'firebase/auth';
import { app } from './firebase';
import { User } from '@/components/shared/types';
import { userStore } from './data-store';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const getOrCreateUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  if (!firebaseUser.email) return null;

  const userDoc = await userStore.get(firebaseUser.uid);

  if (userDoc) {
    return userDoc;
  }

  const newUser: Omit<User, 'id'> = {
    name: firebaseUser.displayName || 'Anonymous User',
    email: firebaseUser.email,
    role: 'player',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  if (firebaseUser.photoURL) {
    (newUser as any).avatar = firebaseUser.photoURL;
  }


  await userStore.set(firebaseUser.uid, newUser);

  return {
    id: firebaseUser.uid,
    ...newUser,
  } as User;
};

export const authService = {
  signIn: async (): Promise<void> => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Authentication Error:', error);
      throw error;
    }
  },

  signInWithEmail: async (email: string, password: string): Promise<FirebaseUser | null> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  signUpWithEmail: async (name: string, email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await sendEmailVerification(userCredential.user);
    // User creation in Firestore will be handled by onAuthStateChange
    return userCredential.user;
  },

  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  onAuthStateChange: (callback: (user: User | null) => void): (() => void) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await getOrCreateUser(firebaseUser);
        callback(appUser);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  },
  
  isPasswordProvider: (): boolean => {
    const user = auth.currentUser;
    if (!user) return false;
    return user.providerData.some(
      (provider) => provider.providerId === 'password'
    );
  },

  updateUserPassword: async (newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Пользователь не авторизован.");
    }
    
    if (!authService.isPasswordProvider()) {
        throw new Error("Нельзя сменить пароль для аккаунта, созданного через соцсеть.");
    }

    await updatePassword(user, newPassword);
  },

  addPasswordToAccount: async (newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Пользователь не авторизован.");
    }
    if (authService.isPasswordProvider()) {
        throw new Error("У этого аккаунта уже есть пароль.");
    }
    if (!user.email) {
        throw new Error("У аккаунта нет email для привязки пароля.");
    }

    const credential = EmailAuthProvider.credential(user.email, newPassword);
    await linkWithCredential(user, credential);
  },
  
  updateUserProfile: async (updates: { name?: string; avatar?: string }): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Пользователь не авторизован.");
    }
    
    const profileUpdates: { displayName?: string, photoURL?: string } = {};
    if (updates.name) profileUpdates.displayName = updates.name;
    // Use photoURL for avatar, but handle empty string to remove avatar
    if (updates.avatar !== undefined) profileUpdates.photoURL = updates.avatar;

    // Update Firebase Auth profile
    if (Object.keys(profileUpdates).length > 0) {
      await updateProfile(user, profileUpdates);
    }

    // Update Firestore user document
    const firestoreUpdates: Partial<User> = {};
    if (updates.name) firestoreUpdates.name = updates.name;
    if (updates.avatar !== undefined) firestoreUpdates.avatar = updates.avatar;

    if (Object.keys(firestoreUpdates).length > 0) {
      await userStore.update(user.uid, firestoreUpdates);
    }
  },

  updateUserSettings: async (updates: Partial<Pick<User, 'notifications' | 'preferences'>>): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Пользователь не авторизован.");
    }
    await userStore.update(user.uid, updates);
  },
  
  deleteUserAccount: async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Пользователь не авторизован.");
    }
    
    await userStore.delete(user.uid);
    await deleteUser(user);
  },
};
