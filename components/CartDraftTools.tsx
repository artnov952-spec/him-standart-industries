"use client";
import { useState, type ChangeEvent } from "react";
import { Download, Upload } from "lucide-react";
import { products } from "@/lib/catalog";
import { FORM_LIMITS } from "@/lib/form-contract.mjs";
import { exportQuoteFile, parseQuoteFile, type CartItem } from "@/lib/quote-draft";
import { useStore } from "./StoreProvider";

export default function CartDraftTools({ disabled = false }: { disabled?: boolean }) {
  const { items, hydrated, storageWarning, importItems } = useStore();
  const [preview, setPreview] = useState<CartItem[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [replace, setReplace] = useState(false);
  const [filename, setFilename] = useState("");
  async function load(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    setPreview(null); setErrors([]); setReplace(false);
    if (!file) return;
    setFilename(file.name);
    if (!/\.(csv|tsv)$/i.test(file.name)) { setErrors(["Поддерживаются CSV и TSV. Для Excel сохраните список в одном из этих форматов."]); return; }
    if (file.size > FORM_LIMITS.importBytesMax) { setErrors(["Файл больше 64 КБ. Разделите список на части."]); return; }
    try {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
      const result = parseQuoteFile(text, /\.tsv$/i.test(file.name) ? "tsv" : "csv", products);
      setErrors(result.errors); if (!result.errors.length) setPreview(result.items);
    } catch { setErrors(["Не удалось прочитать файл в UTF-8. Выберите в Excel CSV UTF-8 или TSV UTF-8. Корзина не изменена."]); }
  }
  function download(format: "csv" | "tsv") {
    const url = URL.createObjectURL(new Blob([exportQuoteFile(items, products, format)], { type: format === "csv" ? "text/csv;charset=utf-8" : "text/tab-separated-values;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `him-standart-request.${format}`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function apply(replaceItems: boolean) {
    if (!preview) return;
    const error = importItems(preview, replaceItems);
    if (error) { setErrors([error]); return; }
    setPreview(null); setErrors([]); setReplace(false);
  }
  return <section className="cart-draft-tools" aria-label="Сохранение и загрузка списка"><h3>Список для повторной закупки</h3><p className="field-hint">Сохраните состав в CSV или TSV и загрузите его при следующем обращении. Файл обрабатывается на устройстве, без аккаунта и CRM. До 30 строк; артикулы и фасовки сверяются с демо-каталогом.</p>{storageWarning ? <p className="demo-notice" role="status">{storageWarning}</p> : null}<fieldset className="form-fieldset" disabled={!hydrated || disabled}><div className="cart-import-actions"><button className="button button-secondary" type="button" onClick={() => download("csv")}><Download />{items.length ? "Скачать CSV" : "Шаблон CSV"}</button><button className="button button-secondary" type="button" onClick={() => download("tsv")}><Download />{items.length ? "Скачать TSV" : "Шаблон TSV"}</button></div><label className="cart-import"><span><Upload />Загрузить CSV или TSV</span><input type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" onChange={load} /></label></fieldset>{errors.length ? <div className="form-error" role="alert"><p>Список не изменен</p><ul>{errors.map((error, index) => <li key={index}>{error}</li>)}</ul></div> : null}{preview ? <div className="cart-import-preview"><p><strong>{filename}</strong>: строк после проверки {preview.length}.</p><ol>{preview.map(item => <li key={`${item.productId}:${item.packaging}`}>{products.find(product => product.id === item.productId)?.sku}: {item.packaging}, {item.quantity} уп.</li>)}</ol><div className="cart-import-actions"><button className="button button-dark" disabled={disabled} type="button" onClick={() => apply(false)}>Добавить к заявке</button><button className="button button-secondary" disabled={disabled} type="button" onClick={() => items.length ? setReplace(true) : apply(true)}>Заменить состав</button><button className="text-button" type="button" onClick={() => { setPreview(null); setReplace(false); setErrors([]); }}>Отмена</button></div>{replace ? <div className="cart-clear-confirm" role="group" aria-label="Подтверждение замены состава"><p>Заменить текущие {items.length} строк проверенным списком из файла?</p><button className="button" type="button" disabled={disabled} onClick={() => apply(true)}>Подтвердить замену</button><button className="text-button" type="button" onClick={() => setReplace(false)}>Оставить текущий состав</button></div> : null}</div> : null}</section>;
}
