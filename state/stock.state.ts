import { db } from '@/lib/firebase';
import { TStockCard } from '@/type/stock.model';
import { collection, getDocs } from 'firebase/firestore';
import { atom } from 'jotai';

export const stockAtom = atom<TStockCard[]>([]);
export const getStockAtom = atom((get) => get(stockAtom));
export const setStockAtom = atom(null, (get, set, payload: TStockCard[]) => {
  set(stockAtom, payload);
});

export const fetchStockAllAtom = atom(null, async (get, set) => {
  const snapshot = await getDocs(collection(db, 'stocks'));
  const data = snapshot.docs.map((doc) => doc.data() as TStockCard);
  set(stockAtom, data);
});
