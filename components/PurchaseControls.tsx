"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { useStore } from "./StoreProvider";
export default function PurchaseControls({ product }: { product: Product }) {
  const [packaging, setPackaging] = useState(product.packages[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem, hydrated } = useStore();
  return <div className="purchase-controls"><fieldset className="purchase-packaging" disabled={!hydrated}><legend>Фасовка</legend><div className="purchase-packaging-options">{product.packages.map(value => <label key={value} className={packaging === value ? "is-selected" : ""}><input type="radio" name={`packaging-${product.id}`} value={value} checked={packaging === value} onChange={() => setPackaging(value)} /><span>{value}</span></label>)}</div></fieldset><label className="purchase-quantity-label" htmlFor={`quantity-${product.id}`}>Количество упаковок</label><div className="purchase-row"><div className="quantity-control"><button type="button" className="icon-button" aria-label="Уменьшить количество" disabled={!hydrated || quantity <= 1} onClick={() => setQuantity(p => Math.max(1, p - 1))}><Minus size={20} strokeWidth={1.5} /></button><input disabled={!hydrated} id={`quantity-${product.id}`} type="number" min="1" max="999" inputMode="numeric" value={quantity} onChange={event => setQuantity(Math.max(1, Math.min(999, Math.floor(Number(event.target.value) || 1))))} /><button type="button" className="icon-button" aria-label="Увеличить количество" disabled={!hydrated || quantity >= 999} onClick={() => setQuantity(p => Math.min(999, p + 1))}><Plus size={20} strokeWidth={1.5} /></button></div><button className="button button-dark" type="button" disabled={!hydrated} onClick={() => addItem(product.id, packaging, quantity)}>Добавить в заявку<Plus size={20} strokeWidth={1.5} /></button></div><p className="field-hint">Стоимость, наличие и срок поставки уточним по составу заявки.</p></div>;
}
export { PurchaseControls };
