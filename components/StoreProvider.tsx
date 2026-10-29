"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { products } from "@/lib/catalog";

export type CartItem = { productId: string; packaging: string; quantity: number };
type Store = {
  items: CartItem[]; hydrated: boolean; count: number; toast: string;
  addItem: (productId: string, packaging: string, quantity?: number) => void;
  setQuantity: (productId: string, packaging: string, quantity: number) => void;
  removeItem: (productId: string, packaging: string) => void;
  clearCart: () => void;
};
const Context = createContext<Store | null>(null);
const STORAGE_KEY = "him-standart-cart-v1";
const bounded = (n: number) => Math.min(999, Math.max(1, Math.floor(Number(n) || 1)));

function validItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const collected: CartItem[] = [];
  for (const candidate of value.slice(0, 30)) {
    if (!candidate || typeof candidate !== "object") continue;
    const item = candidate as Partial<CartItem>;
    const product = products.find(p => p.id === item.productId);
    if (!product || typeof item.packaging !== "string" || !product.packages.includes(item.packaging)) continue;
    const duplicate = collected.find(p => p.productId === item.productId && p.packaging === item.packaging);
    if (duplicate) duplicate.quantity = bounded(duplicate.quantity + Number(item.quantity));
    else collected.push({ productId: product.id, packaging: item.packaging, quantity: bounded(Number(item.quantity)) });
  }
  return collected;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState({ message: "", sequence: 0 });
  const toast = notice.message;
  const itemsRef = useRef<CartItem[]>([]);
  const updateItems = useCallback((update: (previous: CartItem[]) => CartItem[]) => {
    const next = update(itemsRef.current);
    itemsRef.current = next;
    setItems(next);
  }, []);
  const setToast = useCallback((message: string) => setNotice(previous => ({ message, sequence: previous.sequence + 1 })), []);
  useEffect(() => {
    try { updateItems(() => validItems(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"))); } catch { /* A damaged local draft starts empty. */ }
    setHydrated(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try { updateItems(() => validItems(JSON.parse(event.newValue || "[]"))); } catch { updateItems(() => []); }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [updateItems]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* The in-session cart remains available. */ }
  }, [items, hydrated]);
  useEffect(() => {
    if (!notice.message) return;
    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice, setToast]);
  const addItem = useCallback((productId: string, packaging: string, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.packages.includes(packaging)) return;
    if (!itemsRef.current.some(item => item.productId === productId && item.packaging === packaging) && itemsRef.current.length >= 30) {
      setToast("В заявке уже 30 позиций. Дополнительные реактивы можно указать в комментарии.");
      return;
    }
    updateItems(previous => {
      const existing = previous.find(p => p.productId === productId && p.packaging === packaging);
      if (existing) return previous.map(p => p === existing ? { ...p, quantity: bounded(p.quantity + quantity) } : p);
      return [...previous, { productId, packaging, quantity: bounded(quantity) }];
    });
    setToast(`${product.name}: добавлено в заявку`);
  }, [setToast, updateItems]);
  const setQuantity = useCallback((productId: string, packaging: string, quantity: number) => {
    updateItems(previous => previous.map(p => p.productId === productId && p.packaging === packaging ? { ...p, quantity: bounded(quantity) } : p));
  }, [updateItems]);
  const removeItem = useCallback((productId: string, packaging: string) => {
    updateItems(previous => previous.filter(p => p.productId !== productId || p.packaging !== packaging));
  }, [updateItems]);
  const clearCart = useCallback(() => updateItems(() => []), [updateItems]);
  const value = useMemo(() => ({ items, hydrated, count: items.reduce((total, item) => total + item.quantity, 0), toast, addItem, setQuantity, removeItem, clearCart }), [items, hydrated, toast, addItem, setQuantity, removeItem, clearCart]);
  return <Context.Provider value={value}>{children}<div className="store-toast-region" aria-live="polite" aria-atomic="true">{toast ? <div className="store-toast"><span>{toast}</span><a href="/cart">К заявке</a><button className="icon-button" type="button" aria-label="Закрыть уведомление" onClick={() => setToast("")}><X size={20} strokeWidth={1.5} /></button></div> : null}</div></Context.Provider>;
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}
export default StoreProvider;
