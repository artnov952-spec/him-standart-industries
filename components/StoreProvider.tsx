"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { products } from "@/lib/catalog";
import { FORM_LIMITS, normalizeLineRequirements } from "@/lib/form-contract.mjs";
import { changeDraftPackaging, combineDraft, restoreDraft, type CartItem, type LineRequirements } from "@/lib/quote-draft";
export type { CartItem } from "@/lib/quote-draft";

type Store = {
  items: CartItem[]; hydrated: boolean; count: number; toast: string; storageWarning: string;
  addItem: (productId: string, packaging: string, quantity?: number) => void;
  setQuantity: (productId: string, packaging: string, quantity: number) => void;
  changePackaging: (productId: string, from: string, to: string) => string | null;
  setRequirements: (productId: string, packaging: string, requirements: LineRequirements) => void;
  importItems: (items: CartItem[], replace: boolean) => string | null;
  removeItem: (productId: string, packaging: string) => void;
  clearCart: () => void;
};
const Context = createContext<Store | null>(null);
const STORAGE_KEY = "him-standart-cart-v1";
const bounded = (n: number) => Math.min(FORM_LIMITS.quantityMax, Math.max(1, Math.floor(Number(n) || 1)));

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");
  const [notice, setNotice] = useState({ message: "", sequence: 0 });
  const itemsRef = useRef<CartItem[]>([]);
  const persistAllowed = useRef(true);
  const storageErrorShown = useRef(false);
  const setToast = useCallback((message: string) => setNotice(previous => ({ message, sequence: previous.sequence + 1 })), []);
  const install = useCallback((next: CartItem[], userAction = false) => {
    if (userAction) persistAllowed.current = true;
    itemsRef.current = next; setItems(next);
  }, []);
  useEffect(() => {
    const read = (raw: string | null) => {
      try {
        const restored = restoreDraft(JSON.parse(raw || "[]"), products);
        persistAllowed.current = !restored.warning;
        setStorageWarning(restored.warning || "");
        if (JSON.stringify(restored.items) !== JSON.stringify(itemsRef.current)) install(restored.items);
      } catch {
        persistAllowed.current = false;
        setStorageWarning("Не удалось прочитать сохраненный список. Он не перезаписан; можно загрузить свой CSV или TSV.");
      }
    };
    try { read(localStorage.getItem(STORAGE_KEY)); }
    catch { persistAllowed.current = false; setStorageWarning("Хранилище браузера недоступно. Сохраните список в CSV или TSV перед закрытием страницы."); }
    setHydrated(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      read(event.key === null ? null : event.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [install]);
  useEffect(() => {
    if (!hydrated || !persistAllowed.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); setStorageWarning(""); }
    catch {
      const message = "Список доступен в этой вкладке, но не сохранен на устройстве. Скачайте CSV или TSV перед закрытием страницы.";
      setStorageWarning(message);
      if (!storageErrorShown.current) { storageErrorShown.current = true; setToast(message); }
    }
  }, [items, hydrated, setToast]);
  useEffect(() => {
    if (!notice.message) return;
    const timer = window.setTimeout(() => setToast(""), 6500);
    return () => window.clearTimeout(timer);
  }, [notice, setToast]);
  const addItem = useCallback((productId: string, packaging: string, quantity = 1) => {
    const product = products.find(item => item.id === productId);
    if (!product || !product.packages.includes(packaging)) return;
    const existing = itemsRef.current.find(item => item.productId === productId && item.packaging === packaging);
    const result = combineDraft(itemsRef.current, [{ productId, packaging, quantity, ...(existing?.requirements ? { requirements: existing.requirements } : {}) }], products);
    if (!result.ok) { setToast(result.error); return; }
    install(result.items, true); setToast(`${product.name}: добавлено в заявку`);
  }, [install, setToast]);
  const setQuantity = useCallback((productId: string, packaging: string, quantity: number) => {
    install(itemsRef.current.map(item => item.productId === productId && item.packaging === packaging ? { ...item, quantity: bounded(quantity) } : item), true);
  }, [install]);
  const changePackaging = useCallback((productId: string, from: string, to: string) => {
    const result = changeDraftPackaging(itemsRef.current, productId, from, to, products);
    if (!result.ok) { setToast(result.error); return result.error; }
    install(result.items, true); return null;
  }, [install, setToast]);
  const setRequirements = useCallback((productId: string, packaging: string, requirements: LineRequirements) => {
    try { normalizeLineRequirements(requirements); }
    catch (error) { setToast(error instanceof Error ? error.message : "Проверьте требования к позиции."); return; }
    install(itemsRef.current.map(item => item.productId === productId && item.packaging === packaging ? { ...item, requirements } : item), true);
  }, [install, setToast]);
  const importItems = useCallback((incoming: CartItem[], replace: boolean) => {
    const result = combineDraft(replace ? [] : itemsRef.current, incoming, products);
    if (!result.ok) { setToast(result.error); return result.error; }
    install(result.items, true); setToast("Список загружен. Проверьте фасовку, количество и требования перед отправкой."); return null;
  }, [install, setToast]);
  const removeItem = useCallback((productId: string, packaging: string) => install(itemsRef.current.filter(item => item.productId !== productId || item.packaging !== packaging), true), [install]);
  const clearCart = useCallback(() => install([], true), [install]);
  const toast = notice.message;
  const value = useMemo(() => ({ items, hydrated, count: items.reduce((total, item) => total + item.quantity, 0), toast, storageWarning, addItem, setQuantity, changePackaging, setRequirements, importItems, removeItem, clearCart }), [items, hydrated, toast, storageWarning, addItem, setQuantity, changePackaging, setRequirements, importItems, removeItem, clearCart]);
  return <Context.Provider value={value}>{children}<div className="store-toast-region" aria-live="polite" aria-atomic="true">{toast ? <div className="store-toast"><span>{toast}</span><a href="/cart">К заявке</a><button className="icon-button" type="button" aria-label="Закрыть уведомление" onClick={() => setToast("")}><X size={20} strokeWidth={1.5} /></button></div> : null}</div></Context.Provider>;
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}
export default StoreProvider;
