"use client";
import { useState } from "react";
import { Download, Maximize2, Minimize2 } from "lucide-react";

export default function DocumentPreview({ file, title }: { file: string; title: string }) {
  const [fit, setFit] = useState(true);
  return <section className="document-preview" aria-label={`Просмотр: ${title}`}>
    <div className="document-preview-toolbar">
      <button type="button" className="button button-secondary" aria-pressed={!fit} onClick={() => setFit(value => !value)}>{fit ? <Maximize2 size={20} /> : <Minimize2 size={20} />}{fit ? "Увеличить документ" : "По ширине экрана"}</button>
      <a href={file} download className="text-link"><Download size={20} />Скачать макет</a>
    </div>
    <p className="field-hint" id="document-preview-hint">{fit ? "Документ показан целиком. Увеличьте его, чтобы прочитать мелкие поля." : "Исходный масштаб. Перемещайте документ внутри области просмотра."}</p>
    <div className="document-preview-stage" tabIndex={0} role="region" aria-label="Область документа" aria-describedby="document-preview-hint">
      <img src={file} alt={`${title}. Демонстрационный образец, не действующий документ.`} width={840} height={1080} className={fit ? "is-fit" : "is-zoomed"} />
    </div>
  </section>;
}
