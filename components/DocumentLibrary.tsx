"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { documentSamples } from "@/lib/document-samples";

type SampleSlug = typeof documentSamples[number]["slug"];

export default function DocumentLibrary() {
  const [selectedSlug, setSelectedSlug] = useState<SampleSlug>("quality");
  const selectedIndex = documentSamples.findIndex(sample => sample.slug === selectedSlug);
  const selected = documentSamples[selectedIndex];

  return <section className="document-browser" aria-labelledby="document-browser-title">
    <div className="document-browser-chooser">
      <h2 id="document-browser-title">Выберите тип документа</h2>
      <div className="document-options" role="group" aria-label="Тип документа">
        {documentSamples.map((sample, index) => <button
          type="button"
          className="document-option"
          key={sample.slug}
          aria-pressed={selectedSlug === sample.slug}
          aria-controls="document-sample-preview"
          onClick={() => setSelectedSlug(sample.slug)}
        >
          <span className="document-option-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span className="document-option-copy"><span className="document-option-title">{sample.title}</span><span className="document-option-purpose">{sample.eyebrow}</span></span>
          <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>)}
      </div>
      <div className="document-context">
        {documentSamples.map(sample => <div className="document-context-panel" key={sample.slug} aria-hidden={selectedSlug !== sample.slug}>
          <p>{sample.description}</p>
          <ul>{sample.checks.map(check => <li key={check}>{check}</li>)}</ul>
        </div>)}
      </div>
      <a className="button button-dark document-browser-open" href={`/documents/samples/${selected.slug}`}>
        <span>Открыть: {selected.title.toLocaleLowerCase("ru")}</span><ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
      </a>
      <p className="sr-only" role="status">Выбран образец: {selected.title}</p>
    </div>
    <figure className="document-sample-stage" id="document-sample-preview" aria-label={`Превью: ${selected.title}`}>
      <div className="document-sample-topline"><span>{String(selectedIndex + 1).padStart(2, "0")} / 03</span><span>Образец оформления</span></div>
      <a className="document-sample-paper" href={`/documents/samples/${selected.slug}`} aria-label={`Открыть крупно: ${selected.title}`}>
        {documentSamples.map(sample => <img key={sample.slug} src={sample.file} width={840} height={1080} decoding="async" hidden={selectedSlug !== sample.slug} alt={`Макет: ${sample.title}. Недействующий документ.`} />)}
      </a>
      <figcaption>Демонстрационный образец. Недействующий документ.</figcaption>
    </figure>
  </section>;
}
