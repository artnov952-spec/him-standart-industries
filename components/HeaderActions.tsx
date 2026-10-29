"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function HeaderActions() {
  const { count, hydrated } = useStore();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const outside = (event: PointerEvent | FocusEvent) => {
      if (event.target instanceof Node && !actions.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 801px)");
    const resize = () => { if (desktop.matches) setOpen(false); };
    window.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    desktop.addEventListener("change", resize);
    return () => {
      window.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);
  const amount = hydrated ? count : 0;
  const units = amount % 10 === 1 && amount % 100 !== 11 ? "упаковка" : amount % 10 >= 2 && amount % 10 <= 4 && (amount % 100 < 12 || amount % 100 > 14) ? "упаковки" : "упаковок";
  return <div ref={actions} className="header-actions">
    <a href="/cart" className="header-cart" aria-label={`Заявка, ${amount} ${units}`}><ShoppingBag size={20} strokeWidth={1.5} /><span>Заявка</span><span className="header-cart-count">{amount}</span></a>
    <button ref={toggle} type="button" className="mobile-menu-toggle icon-button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen(previous => !previous)}>{open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}</button>
    {open ? <nav id="mobile-navigation" className="mobile-navigation" aria-label="Мобильное меню"><a href="/catalog">Каталог</a><a href="/about">О компании</a><a href="/documents">Документы</a><a href="/articles">Статьи</a><a href="/reviews">Отзывы о компании</a><a href="/contacts">Контакты</a></nav> : null}
  </div>;
}
