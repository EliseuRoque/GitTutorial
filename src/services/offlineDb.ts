import { openDB } from 'idb';import type { Activity, Category, Draft, ReadingLog, Project } from '../types';
export const dbPromise=openDB('planner-360-local',1,{upgrade(db){['activities','categories','drafts','reading_logs','projects'].forEach(s=>db.createObjectStore(s,{keyPath:'id'}))}});
export async function putOffline(store:'activities'|'categories'|'drafts'|'reading_logs'|'projects',value:Activity|Category|Draft|ReadingLog|Project){const db=await dbPromise;await db.put(store,value)}
export async function listOffline<T>(store:'activities'|'categories'|'drafts'|'reading_logs'|'projects'){return (await dbPromise).getAll(store) as Promise<T[]>}
export async function clearOffline(store:'activities'|'categories'|'drafts'|'reading_logs'|'projects'){const db=await dbPromise;await db.clear(store)}
