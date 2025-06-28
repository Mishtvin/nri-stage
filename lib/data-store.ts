'use client';

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  limit,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

import { User, Condition, ReferenceItem, Character, Item, Spell, RuleCategory, Background, ClassFeature, Feat, Invitation } from '@/components/shared/types';
import { Monster } from '@/components/bestiary/types';
import { Campaign } from '@/components/campaigns/types';
import { Quest } from '@/components/shared/types';
import { MapLocation } from '@/components/shared/types';
import { SystemSettings } from '@/components/settings/types';

// Firestore collection names
const COLLECTIONS = {
  USERS: 'users',
  MONSTERS: 'monsters',
  CAMPAIGNS: 'campaigns',
  CHARACTERS: 'characters',
  ITEMS: 'items',
  SPELLS: 'spells',
  QUESTS: 'quests',
  LOCATIONS: 'locations',
  SETTINGS: 'settings',
  CONDITIONS: 'conditions',
  REFERENCE_ITEMS: 'reference_items',
  RULE_CATEGORIES: 'rule_categories',
  BACKGROUNDS: 'backgrounds',
  CLASS_FEATURES: 'class_features',
  FEATS: 'feats',
  INVITATIONS: 'invitations',
};

// Generic store factory
const createStore = <T extends { id?: string }>(collectionName: string) => ({
  async getAll(): Promise<T[]> {
    const col = collection(db, collectionName);
    const snapshot = await getDocs(col);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  },
  
  async get(id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  },

  async add(item: Omit<T, 'id'>): Promise<T> {
    const col = collection(db, collectionName);
    const docRef = await addDoc(col, item);
    return { id: docRef.id, ...item } as T;
  },
  
  async set(id: string, data: Omit<T, 'id'>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data);
  },

  async update(id: string, updates: Partial<Omit<T, 'id'>>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  onChange(callback: (items: T[]) => void): () => void {
    const col = collection(db, collectionName);
    const q = query(col);
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      callback(items);
    });
  }
});

export const userStore = createStore<User>(COLLECTIONS.USERS);
export const monsterStore = createStore<Monster>(COLLECTIONS.MONSTERS);
export const campaignStore = createStore<Campaign>(COLLECTIONS.CAMPAIGNS);
export const characterStore = createStore<Character>(COLLECTIONS.CHARACTERS);
export const itemStore = createStore<Item>(COLLECTIONS.ITEMS);
export const spellStore = createStore<Spell>(COLLECTIONS.SPELLS);
export const questStore = createStore<Quest>(COLLECTIONS.QUESTS);
export const locationStore = createStore<MapLocation>(COLLECTIONS.LOCATIONS);
export const conditionStore = createStore<Condition>(COLLECTIONS.CONDITIONS);
export const invitationStore = createStore<Invitation>(COLLECTIONS.INVITATIONS);
export const ruleCategoryStore = {
  ...createStore<RuleCategory>(COLLECTIONS.RULE_CATEGORIES),
  async delete(id: string): Promise<void> { // Override delete to handle cascading deletes
    const rules = await referenceItemStore.getAll();
    const rulesToDelete = rules.filter(rule => rule.categoryId === id);
    await Promise.all(rulesToDelete.map(rule => referenceItemStore.delete(rule.id)));
    
    const docRef = doc(db, COLLECTIONS.RULE_CATEGORIES, id);
    await deleteDoc(docRef);
  },
};
export const referenceItemStore = createStore<ReferenceItem>(COLLECTIONS.REFERENCE_ITEMS);
export const backgroundStore = createStore<Background>(COLLECTIONS.BACKGROUNDS);
export const classFeatureStore = createStore<ClassFeature>(COLLECTIONS.CLASS_FEATURES);
export const featStore = createStore<Feat>(COLLECTIONS.FEATS);

const createSingletonStore = <T extends { id?: string }>(collectionName: string, singletonId: string) => {
  const baseStore = createStore<T>(collectionName);
  return {
    ...baseStore,
    async getSettings(): Promise<T | null> {
      return baseStore.get(singletonId);
    },
    async saveSettings(settings: Omit<T, 'id'>): Promise<void> {
      return baseStore.set(singletonId, settings);
    },
    onSettingsChange(callback: (settings: T | null) => void): () => void {
        const docRef = doc(db, collectionName, singletonId);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...docSnap.data() } as T);
            } else {
                callback(null);
            }
        });
    }
  };
};

export const settingsStore = createSingletonStore<SystemSettings>(COLLECTIONS.SETTINGS, 'global-settings');
