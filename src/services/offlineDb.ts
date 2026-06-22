import { openDB } from 'idb';import type { Activity, Category, Draft } from '../types';
export const dbPromise=openDB('planner-360-local',2,{upgrade(db){['activities','categories','drafts'].forEach(s=>{if(!db.objectStoreNames.contains(s))db.createObjectStore(s,{keyPath:'id'})})}});
export async function putOffline(store:'activities'|'categories'|'drafts',value:Activity|Category|Draft){const db=await dbPromise;await db.put(store,value)}
export async function listOffline<T>(store:'activities'|'categories'|'drafts'){return (await dbPromise).getAll(store) as Promise<T[]>}
export async function clearOffline(store:'activities'|'categories'|'drafts'){const db=await dbPromise;await db.clear(store)}
