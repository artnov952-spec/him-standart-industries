/** Navigation topics describe laboratory contexts, never approval of a demo grade. */
export const tagDefinitions = [
  { id: "analytics", label: "Аналитика", description: "Реактивы для лабораторных аналитических методик. Требования к чистоте определяет методика; медицинский допуск не подразумевается.", aliases: ["аналитика", "аналитический анализ", "лабораторный анализ", "для анализа", "для лаборатории", "лабораторные методики", "медицинская лаборатория", "медицинской лаборатории", "для медицинской лаборатории", "analytical chemistry", "laboratory analysis"] },
  { id: "quality-control", label: "Контроль качества", description: "Подбор реактивов для контроля сырья, растворов и продукции по утвержденной методике.", aliases: ["контроль качества", "контроля качества", "quality control", "qc"] },
  { id: "solution-preparation", label: "Подготовка растворов", description: "Компоненты лабораторных растворов. Концентрацию и квалификацию согласуют отдельно.", aliases: ["подготовка растворов", "подготовки растворов", "приготовление растворов", "приготовления растворов", "solution preparation"] },
  { id: "agrochemistry", label: "Агрохимический анализ", description: "Реактивы для анализа почв и питательных элементов. Это не рекомендации по удобрению, внесению в почву или обработке растений.", aliases: ["агрохимия", "агрохимический анализ", "анализ почвы", "анализа почвы", "для анализа почвы", "для почвы", "анализ почв", "анализа почв", "анализ удобрений", "анализа удобрений", "для растений", "для удобрений", "реактивы для растений", "реактивы для удобрений", "soil analysis", "fertilizer analysis", "for plants", "for fertilizers"] },
  { id: "buffers", label: "Буферные системы", description: "Компоненты буферов для поддержания pH. Состав и форму гидрата выбирают по методике.", aliases: ["буфер", "буферы", "буферные системы", "буферных систем", "буферные растворы", "буферных растворов", "buffer", "buffers", "buffer solutions"] },
  { id: "water-treatment", label: "Контроль воды", description: "Лабораторный контроль воды и процессов водоподготовки. Тег не подтверждает допуск к обработке питьевой воды.", aliases: ["водоподготовка", "водоподготовки", "контроль воды", "контроля воды", "анализ воды", "анализа воды", "для анализа воды", "реактивы для воды", "для воды", "water treatment", "water analysis"] },
  { id: "microbiology", label: "Микробиология", description: "Компоненты лабораторных сред и исследований. Пригодность конкретной квалификации и партии требуется подтвердить.", aliases: ["микробиология", "микробиологии", "питательные среды", "питательных сред", "microbiology", "culture media"] },
] as const;

export type TagId = (typeof tagDefinitions)[number]["id"];
export type ProductSearchMetadata = { aliases: string[]; tags: TagId[] };

/**
 * Sources checked 2026-10-29. These sources establish uses of the compound,
 * not equivalence of HIM's unconfirmed grade to a manufacturer's product.
 * The agrochemistry subset is deliberately restricted to soil extraction/analysis.
 */
export const applicationEvidence = [
  { tagId: "agrochemistry", productIds: ["calcium-chloride-dihydrate"], title: "Merck: pH and nitrate analysis of soil with calcium chloride", url: "https://www.merckmillipore.com/SO/en/technical-documents/protocol/analytical-chemistry/photometry-and-reflectometry/colorimetric-determination-of-ph-of-soil" },
  { tagId: "agrochemistry", productIds: ["potassium-chloride"], title: "SCP SCIENCE: potassium chloride stock solution for soil analysis", url: "https://www.scpscience.com/en/products/details?id=250-240-661&name=potassium-chloride-stock-solution" },
  { tagId: "agrochemistry", productIds: ["ammonium-acetate", "potassium-chloride"], title: "USDA: Kellogg Soil Survey Laboratory Methods Manual, section 4B1a", url: "https://www.nrcs.usda.gov/sites/default/files/2022-10/SSIR42-v6-pt1.pdf" },
  { tagId: "buffers", productIds: ["sodium-bicarbonate", "sodium-carbonate", "sodium-acetate-trihydrate", "acetic-acid", "citric-acid-monohydrate", "citric-acid-anhydrous", "trisodium-citrate-dihydrate", "potassium-dihydrogen-phosphate", "dipotassium-hydrogen-phosphate", "sodium-dihydrogen-phosphate-monohydrate", "disodium-hydrogen-phosphate-dodecahydrate"], title: "Sigma-Aldrich: Buffer Reference Center", url: "https://www.sigmaaldrich.com/US/en/technical-documents/protocol/protein-biology/protein-concentration-and-buffer-exchange/buffer-reference-center" },
  { tagId: "buffers", productIds: ["tris-base", "glycine", "boric-acid", "edta-disodium-dihydrate"], title: "Sigma-Aldrich: Trizma base, mixed buffer formulations", url: "https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/product/documents/248/089/t1503pis.pdf" },
  { tagId: "water-treatment", productIds: ["edta-disodium-dihydrate"], title: "Merck: EDTA disodium salt in determination of water hardness", url: "https://www.merckmillipore.com/BO/en/product/saj/091480" },
  { tagId: "water-treatment", productIds: ["sodium-thiosulfate-pentahydrate"], title: "Sigma-Aldrich: sodium thiosulfate for chlorine neutralization in water samples", url: "https://www.sigmaaldrich.com/US/en/product/sigma/wpb01601" },
  { tagId: "microbiology", productIds: ["d-glucose", "sodium-thiosulfate-pentahydrate"], title: "Sigma-Aldrich: Dey-Engley Neutralizing Agar components", url: "https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/product/documents/341/507/d3185dat.pdf" },
] as const;

// Synonyms complement, rather than replace, each product's name/CAS/formula.
export const productSearchMetadata: Record<string, ProductSearchMetadata> = {
  "ethanol-96": { aliases: ["этиловый спирт", "спирт этиловый", "этанол", "ethanol", "ethyl alcohol", "C2H5OH"], tags: ["analytics", "solution-preparation"] },
  "sodium-chloride": { aliases: ["хлорид натрия", "поваренная соль", "sodium chloride", "натрий хлорид"], tags: ["analytics", "quality-control", "solution-preparation"] },
  "isopropanol": { aliases: ["изопропиловый спирт", "изопропанол", "2 пропанол", "пропан 2 ол", "isopropanol", "isopropyl alcohol", "ipa"], tags: ["analytics", "solution-preparation"] },
  "acetone": { aliases: ["ацетон", "пропанон", "acetone", "propanone", "dimethyl ketone"], tags: ["analytics", "quality-control"] },
  "glycerol": { aliases: ["глицерин", "глицерол", "glycerol", "glycerin", "glycerine"], tags: ["solution-preparation", "quality-control"] },
  "sodium-hydroxide": { aliases: ["гидроксид натрия", "едкий натр", "каустическая сода", "каустик", "sodium hydroxide", "caustic soda"], tags: ["analytics", "quality-control", "solution-preparation"] },
  "potassium-hydroxide": { aliases: ["гидроксид калия", "едкое кали", "potassium hydroxide", "caustic potash"], tags: ["analytics", "quality-control", "solution-preparation"] },
  "copper-sulfate-pentahydrate": { aliases: ["сульфат меди пентагидрат", "сульфат меди 5 водный", "медный купорос", "copper sulfate pentahydrate", "copper sulphate pentahydrate"], tags: ["analytics", "quality-control"] },
  "trisodium-citrate-dihydrate": { aliases: ["цитрат натрия", "натрий лимоннокислый", "тринатрийцитрат", "trisodium citrate dihydrate", "sodium citrate"], tags: ["analytics", "buffers", "solution-preparation"] },
  "sodium-bicarbonate": { aliases: ["бикарбонат натрия", "гидрокарбонат натрия", "пищевая сода", "sodium bicarbonate", "sodium hydrogen carbonate", "baking soda"], tags: ["analytics", "buffers", "solution-preparation"] },
  "sodium-carbonate": { aliases: ["карбонат натрия", "кальцинированная сода", "sodium carbonate", "soda ash", "безводный карбонат натрия"], tags: ["analytics", "quality-control", "buffers"] },
  "potassium-chloride": { aliases: ["хлорид калия", "калий хлорид", "potassium chloride"], tags: ["analytics", "agrochemistry", "solution-preparation"] },
  "calcium-chloride-dihydrate": { aliases: ["хлорид кальция дигидрат", "кальций хлористый двухводный", "calcium chloride dihydrate", "хлорид кальция 2 водный"], tags: ["analytics", "agrochemistry", "solution-preparation"] },
  "magnesium-sulfate-heptahydrate": { aliases: ["сульфат магния гептагидрат", "магний сернокислый семиводный", "английская соль", "magnesium sulfate heptahydrate", "magnesium sulphate"], tags: ["analytics", "solution-preparation"] },
  "sodium-sulfate": { aliases: ["сульфат натрия безводный", "sodium sulfate anhydrous", "sodium sulphate"], tags: ["analytics", "quality-control"] },
  "potassium-sulfate": { aliases: ["сульфат калия", "potassium sulfate", "potassium sulphate"], tags: ["analytics", "solution-preparation"] },
  "ammonium-sulfate": { aliases: ["сульфат аммония", "ammonium sulfate", "ammonium sulphate"], tags: ["analytics", "solution-preparation"] },
  "sodium-acetate-trihydrate": { aliases: ["ацетат натрия тригидрат", "натрий уксуснокислый трехводный", "sodium acetate trihydrate", "CH3COONa 3H2O"], tags: ["analytics", "buffers", "solution-preparation"] },
  "ammonium-acetate": { aliases: ["ацетат аммония", "ammonium acetate", "CH3COONH4"], tags: ["analytics", "agrochemistry", "solution-preparation"] },
  "potassium-dihydrogen-phosphate": { aliases: ["дигидрофосфат калия", "монофосфат калия", "калий фосфат однозамещенный", "potassium dihydrogen phosphate", "monopotassium phosphate", "potassium phosphate monobasic"], tags: ["analytics", "buffers", "solution-preparation"] },
  "dipotassium-hydrogen-phosphate": { aliases: ["гидрофосфат калия", "дикалийфосфат", "калий фосфат двузамещенный", "dipotassium hydrogen phosphate", "potassium phosphate dibasic"], tags: ["analytics", "buffers", "solution-preparation"] },
  "sodium-dihydrogen-phosphate-monohydrate": { aliases: ["дигидрофосфат натрия моногидрат", "натрий фосфат однозамещенный", "sodium dihydrogen phosphate monohydrate", "monosodium phosphate", "sodium phosphate monobasic"], tags: ["analytics", "buffers", "solution-preparation"] },
  "disodium-hydrogen-phosphate-dodecahydrate": { aliases: ["гидрофосфат натрия додекагидрат", "натрий фосфат двузамещенный", "disodium hydrogen phosphate dodecahydrate", "sodium phosphate dibasic"], tags: ["analytics", "buffers", "solution-preparation"] },
  "sodium-thiosulfate-pentahydrate": { aliases: ["тиосульфат натрия пентагидрат", "гипосульфит натрия", "sodium thiosulfate pentahydrate", "sodium thiosulphate"], tags: ["analytics", "quality-control", "water-treatment", "microbiology"] },
  "potassium-sodium-tartrate-tetrahydrate": { aliases: ["тартрат калия натрия тетрагидрат", "сегнетова соль", "калий натрий тартрат", "potassium sodium tartrate tetrahydrate", "rochelle salt"], tags: ["analytics", "quality-control"] },
  "calcium-carbonate": { aliases: ["карбонат кальция", "углекислый кальций", "calcium carbonate"], tags: ["analytics", "quality-control"] },
  "magnesium-oxide": { aliases: ["оксид магния", "окись магния", "magnesium oxide", "magnesia"], tags: ["analytics", "quality-control"] },
  "zinc-oxide": { aliases: ["оксид цинка", "окись цинка", "zinc oxide"], tags: ["analytics", "quality-control"] },
  "iron-sulfate-heptahydrate": { aliases: ["сульфат железа ii гептагидрат", "железный купорос", "ferrous sulfate heptahydrate", "iron ii sulfate", "ferrous sulphate"], tags: ["analytics", "quality-control"] },
  "iron-chloride-hexahydrate": { aliases: ["хлорид железа iii гексагидрат", "хлорное железо", "ferric chloride hexahydrate", "iron iii chloride"], tags: ["analytics", "quality-control"] },
  "aluminum-sulfate-octadecahydrate": { aliases: ["сульфат алюминия октадекагидрат", "алюминий сернокислый восемнадцативодный", "aluminum sulfate octadecahydrate", "aluminium sulphate"], tags: ["analytics", "quality-control"] },
  "tris-base": { aliases: ["трис основание", "трис гидроксиметил аминометан", "трометамол", "tris base", "trizma", "trometamol", "tris hydroxymethyl aminomethane"], tags: ["analytics", "buffers", "solution-preparation"] },
  "citric-acid-monohydrate": { aliases: ["лимонная кислота моногидрат", "лимонная кислота одноводная", "citric acid monohydrate"], tags: ["analytics", "buffers", "solution-preparation"] },
  "citric-acid-anhydrous": { aliases: ["лимонная кислота безводная", "citric acid anhydrous"], tags: ["analytics", "buffers", "quality-control"] },
  "acetic-acid": { aliases: ["уксусная кислота", "acetic acid", "ethanoic acid", "CH3COOH"], tags: ["analytics", "buffers", "solution-preparation"] },
  "succinic-acid": { aliases: ["янтарная кислота", "бутандиовая кислота", "succinic acid", "butanedioic acid"], tags: ["analytics", "quality-control"] },
  "tartaric-acid": { aliases: ["винная кислота", "виннокаменная кислота", "tartaric acid", "l tartaric acid"], tags: ["analytics", "quality-control"] },
  "ascorbic-acid": { aliases: ["аскорбиновая кислота", "витамин c", "витамин с", "ascorbic acid", "vitamin c"], tags: ["analytics", "quality-control"] },
  "benzoic-acid": { aliases: ["бензойная кислота", "benzoic acid", "benzenecarboxylic acid"], tags: ["analytics", "quality-control"] },
  "boric-acid": { aliases: ["борная кислота", "ортоборная кислота", "boric acid", "orthoboric acid"], tags: ["analytics", "buffers"] },
  "d-glucose": { aliases: ["глюкоза", "декстроза", "глюкоза безводная", "d glucose", "dextrose", "glucose anhydrous"], tags: ["analytics", "quality-control", "microbiology"] },
  "sucrose": { aliases: ["сахароза", "сахар", "sucrose", "saccharose"], tags: ["analytics", "quality-control"] },
  "glycine": { aliases: ["глицин", "аминоуксусная кислота", "glycine", "aminoacetic acid"], tags: ["analytics", "buffers"] },
  "urea": { aliases: ["мочевина", "карбамид", "urea", "carbamide"], tags: ["analytics", "quality-control"] },
  "edta-disodium-dihydrate": { aliases: ["трилон б", "трилон b", "эдта", "динатриевая соль эдта", "комплексон iii", "edta", "edta disodium dihydrate", "disodium edetate", "trilon b"], tags: ["analytics", "buffers", "water-treatment"] },
  "propylene-glycol": { aliases: ["пропиленгликоль", "пропан 1 2 диол", "propylene glycol", "1 2 propanediol"], tags: ["solution-preparation", "quality-control"] },
  "ethyl-acetate": { aliases: ["этилацетат", "уксусноэтиловый эфир", "ethyl acetate", "ethyl ethanoate"], tags: ["analytics", "quality-control"] },
  "dimethyl-sulfoxide": { aliases: ["дмсо", "диметилсульфоксид", "dimethyl sulfoxide", "dimethyl sulphoxide", "dmso"], tags: ["analytics", "solution-preparation"] },
  "n-butanol": { aliases: ["бутанол", "бутиловый спирт", "н бутанол", "butan 1 ol", "n butanol", "butyl alcohol"], tags: ["analytics", "quality-control"] },
  "deionized-water": { aliases: ["деионизованная вода", "деминерализованная вода", "deionized water", "demineralized water", "di water"], tags: ["analytics", "solution-preparation"] },
};
