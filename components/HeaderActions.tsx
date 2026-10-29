"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function HeaderActions() {
  const { count, hydrated } = useStore();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return <div className="header-actions"><a href="/cart" className="header-cart" aria-label={`Заявка, ${hydrated ? count : 0} единиц`}><ShoppingBag size={20} strokeWidth={1.5} /><span>Заявка</span><span className="header-cart-count">{hydrated ? count : 0}</span></a><button ref={toggle} type="button" className="mobile-menu-toggle icon-button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen(p => !p)}>{open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}</button>{open ? <nav id="mobile-navigation" className="mobile-navigation" aria-label="Мобильное меню"><a href="/catalog">Каталог</a><a href="/about">О компании</a><a href="/documents">Документы</a><a href="/articles">Статьи</a><a href="/reviews">Отзывы о компании</a><a href="/contacts">Контакты</a></nav> : null}</div>;
}
