// Offline storage via IndexedDB (Dexie wrapper).
// Pattern: generate/fetch while online -> store here -> read from here when offline.

import Dexie, { type Table } from "dexie";
import type { Facility } from "../types";

interface CacheEntry<T> {
  key: string;
  value: T;
  cachedAt: number;
}

class TyphoonDB extends Dexie {
  facilities!: Table<Facility, number>;
  cache!: Table<CacheEntry<unknown>, string>;

  constructor() {
    super("typhoon-app");
    this.version(1).stores({
      facilities: "id, type",
      cache: "key",
    });
  }
}

export const db = new TyphoonDB();

// ---- Facilities ----

export async function cacheFacilities(facilities: Facility[]) {
  await db.facilities.clear();
  await db.facilities.bulkAdd(facilities);
}

export async function getCachedFacilities(): Promise<Facility[]> {
  return db.facilities.toArray();
}

// ---- Generic cache (weather, prep plan, etc.) ----

export async function setCache<T>(key: string, value: T) {
  await db.cache.put({ key, value, cachedAt: Date.now() });
}

export async function getCache<T>(key: string): Promise<T | undefined> {
  const entry = await db.cache.get(key);
  return entry?.value as T | undefined;
}

export const CACHE_KEYS = {
  weather: "weather:latest",
  weatherExplainer: "ai:weather_explainer:latest",
  prepPlan: "ai:prep_plan:latest",
} as const;
