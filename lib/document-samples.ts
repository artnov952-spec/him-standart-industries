export const documentSamples = [
  { slug: "quality", title: "Паспорт качества", eyebrow: "На конкретную партию", description: "Сведения о продукте, партии и результатах контроля. Помогает сверить предложенный реактив с вашей спецификацией.", checks: ["Наименование и квалификация", "Партия и показатели качества"], file: "/assets/docs/quality-sample-v2.svg" },
  { slug: "safety", title: "Паспорт безопасности", eyebrow: "Для обращения с веществом", description: "SDS содержит сведения об опасностях, мерах предосторожности и условиях хранения выбранного продукта.", checks: ["Опасности и меры предосторожности", "Обращение и хранение"], file: "/assets/docs/safety-sample-v1.svg" },
  { slug: "license", title: "Документы компании", eyebrow: "Для согласования поставщика", description: "Реквизиты и подтверждающие файлы поставщика. Необходимый состав документов согласуется с вашей организацией.", checks: ["Реквизиты поставщика", "Подтверждающие файлы по запросу"], file: "/assets/docs/company-sample-v2.svg" },
] as const;

export function getDocumentSample(slug: string) {
  return documentSamples.find(sample => sample.slug === slug);
}
