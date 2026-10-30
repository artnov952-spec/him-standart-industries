import type { Product } from "./catalog";

// Individual illustrations for all extra products; attribution and limitations: IMAGE-SOURCES.md.
// No shared physical-form fallback: every product has its own source image.
export const productPhotoMap: Record<string, Pick<Product, "image" | "imageAlt" | "imageCaption" | "imageCredit">> = {
  "boric-acid": {
    "image": "/assets/products/boric-acid.webp",
    "imageAlt": "Образец борной кислоты на часовом стекле",
    "imageCaption": "Борная кислота. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    }
  },
  "calcium-carbonate": {
    "image": "/assets/products/calcium-carbonate.webp",
    "imageAlt": "Белый порошок карбоната кальция",
    "imageCaption": "Карбонат кальция. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Calcium_carbonate.jpg",
      "license": "Public domain"
    }
  },
  "iron-sulfate-heptahydrate": {
    "image": "/assets/products/iron-sulfate-heptahydrate.webp",
    "imageAlt": "Зеленые кристаллы сульфата железа II гептагидрата",
    "imageCaption": "Сульфат железа(II) гептагидрат. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Benjah-bmm27",
      "url": "https://commons.wikimedia.org/wiki/File:Iron(II)-sulfate-heptahydrate-sample.jpg",
      "license": "Public domain"
    }
  },
  "iron-chloride-hexahydrate": {
    "image": "/assets/products/iron-chloride-hexahydrate.webp",
    "imageAlt": "Желто-коричневый образец хлорида железа III гексагидрата",
    "imageCaption": "Хлорид железа(III) гексагидрат. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Benjah-bmm27",
      "url": "https://commons.wikimedia.org/wiki/File:Iron(III)-chloride-hexahydrate-sample.jpg",
      "license": "Public domain"
    }
  },
  "zinc-oxide": {
    "image": "/assets/products/zinc-oxide.webp",
    "imageAlt": "Белый порошок оксида цинка на часовом стекле",
    "imageCaption": "Оксид цинка. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Zinc_oxide.jpg",
      "license": "Public domain"
    }
  },
  "magnesium-oxide": {
    "image": "/assets/products/magnesium-oxide.webp",
    "imageAlt": "Образец белого порошка оксида магния",
    "imageCaption": "Оксид магния. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Adam Rędzikowski",
      "url": "https://commons.wikimedia.org/wiki/File:Magnesium_oxide_sample.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "urea": {
    "image": "/assets/products/urea.webp",
    "imageAlt": "Белые гранулы карбамида в лабораторном сосуде",
    "imageCaption": "Гранулы карбамида. Иллюстрация вещества.",
    "imageCredit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Urea.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "glycine": {
    "image": "/assets/products/glycine.webp",
    "imageAlt": "Образец глицина на часовом стекле",
    "imageCaption": "Глицин. Иллюстрация вещества.",
    "imageCredit": {
      "name": "SPOTzillah",
      "url": "https://commons.wikimedia.org/wiki/File:Glycin.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "sucrose": {
    "image": "/assets/products/sucrose.webp",
    "imageAlt": "Крупные прозрачные кристаллы сахарозы",
    "imageCaption": "Кристаллы сахарозы. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Nachovfranco",
      "url": "https://commons.wikimedia.org/wiki/File:Sucrose_crystals.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "citric-acid-anhydrous": {
    "image": "/assets/products/citric-acid-anhydrous.webp",
    "imageAlt": "Кристаллы лимонной кислоты под поляризационным микроскопом",
    "imageCaption": "Лимонная кислота под микроскопом, увеличение 250x. Форму гидрата согласуем отдельно.",
    "imageCredit": {
      "name": "Doc. RNDr. Josef Reischig, CSc.",
      "url": "https://commons.wikimedia.org/wiki/File:Citric_acid_crystals.jpg",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
    }
  },
  "sodium-bicarbonate": {
    "image": "/assets/products/sodium-bicarbonate.webp",
    "imageAlt": "Образец белого порошка гидрокарбоната натрия",
    "imageCaption": "Гидрокарбонат натрия. Иллюстрация вещества.",
    "imageCredit": {
      "name": "Thavox",
      "url": "https://commons.wikimedia.org/wiki/File:Sodium_bicarbonate.jpg",
      "license": "Public domain"
    }
  },
  "citric-acid-monohydrate": {
    "image": "/assets/products/unique-v6/citric-acid-monohydrate.webp",
    "imageAlt": "Кислота лимонная: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Milda444",
      "url": "https://commons.wikimedia.org/wiki/File:Kyselina_citronov%C3%A1_monohydr%C3%A1t.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  "sodium-carbonate": {
    "image": "/assets/products/unique-v6/sodium-carbonate.webp",
    "imageAlt": "Натрий углекислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "imageCredit": {
      "name": "Chemicalinterest",
      "url": "https://commons.wikimedia.org/wiki/File:Sodium_carbonate.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Sodium_carbonate.JPG#Licensing"
    }
  },
  "potassium-chloride": {
    "image": "/assets/products/unique-v6/potassium-chloride.webp",
    "imageAlt": "Калий хлористый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Pań w żółtym kapeluszu",
      "url": "https://commons.wikimedia.org/wiki/File:Potassium_chloride_podwer.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "calcium-chloride-dihydrate": {
    "image": "/assets/products/unique-v6/calcium-chloride-dihydrate.webp",
    "imageAlt": "Кальций хлористый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "imageCredit": {
      "name": "Roi.Frvr",
      "url": "https://commons.wikimedia.org/wiki/File:Petri_Dish_containing_Calcium_Chloride.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "magnesium-sulfate-heptahydrate": {
    "image": "/assets/products/unique-v6/magnesium-sulfate-heptahydrate.webp",
    "imageAlt": "Магний сернокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Chemicalinterest  at  en.wikipedia",
      "url": "https://commons.wikimedia.org/wiki/File:Magnesium_sulfate.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Magnesium_sulfate.JPG#Licensing"
    }
  },
  "sodium-sulfate": {
    "image": "/assets/products/unique-v6/sodium-sulfate.webp",
    "imageAlt": "Натрий сернокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "imageCredit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_sodn%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_sodn%C3%BD.JPG#Licensing"
    }
  },
  "potassium-sulfate": {
    "image": "/assets/products/unique-v6/potassium-sulfate.webp",
    "imageAlt": "Калий сернокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_draseln%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_draseln%C3%BD.JPG#Licensing"
    }
  },
  "ammonium-sulfate": {
    "image": "/assets/products/unique-v6/ammonium-sulfate.webp",
    "imageAlt": "Аммоний сернокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Kapitánka Nemo",
      "url": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_amonn%C3%BD.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "sodium-acetate-trihydrate": {
    "image": "/assets/products/unique-v6/sodium-acetate-trihydrate.webp",
    "imageAlt": "Натрий уксуснокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "imageCredit": {
      "name": "Milda 444",
      "url": "https://commons.wikimedia.org/wiki/File:Octan_sodn%C3%BD_vzorek.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "ammonium-acetate": {
    "image": "/assets/products/unique-v6/ammonium-acetate.webp",
    "imageAlt": "Аммоний уксуснокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Vidak",
      "url": "https://commons.wikimedia.org/wiki/File:Ammonium-acetate.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Ammonium-acetate.JPG#Licensing"
    }
  },
  "potassium-dihydrogen-phosphate": {
    "image": "/assets/products/unique-v6/potassium-dihydrogen-phosphate.webp",
    "imageAlt": "Калий фосфорнокислый однозамещенный: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Bahmtec",
      "url": "https://commons.wikimedia.org/wiki/File:Kaliumdihydrogenphosphat.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "dipotassium-hydrogen-phosphate": {
    "image": "/assets/products/unique-v6/dipotassium-hydrogen-phosphate.webp",
    "imageAlt": "Калий фосфорнокислый двузамещенный: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:Hydrogenfosfore%C4%8Dnan_draseln%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    }
  },
  "sodium-dihydrogen-phosphate-monohydrate": {
    "image": "/assets/products/unique-v6/sodium-dihydrogen-phosphate-monohydrate.webp",
    "imageAlt": "Натрий фосфорнокислый однозамещенный: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "imageCredit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:Dihydrogenfosfore%C4%8Dnan_sodn%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    }
  },
  "disodium-hydrogen-phosphate-dodecahydrate": {
    "image": "/assets/products/unique-v6/disodium-hydrogen-phosphate-dodecahydrate.webp",
    "imageAlt": "Натрий фосфорнокислый двузамещенный: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Leiem",
      "url": "https://commons.wikimedia.org/wiki/File:Disodium_phosphate_dodecahydrate.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    }
  },
  "sodium-thiosulfate-pentahydrate": {
    "image": "/assets/products/unique-v6/sodium-thiosulfate-pentahydrate.webp",
    "imageAlt": "Натрий тиосульфат: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Walkerma (Martin Walker)",
      "url": "https://commons.wikimedia.org/wiki/File:Sodium_thiosulfate_pentahydrate.jpg",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    }
  },
  "potassium-sodium-tartrate-tetrahydrate": {
    "image": "/assets/products/unique-v6/potassium-sodium-tartrate-tetrahydrate.webp",
    "imageAlt": "Калий-натрий виннокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "ERS ROHU",
      "url": "https://commons.wikimedia.org/wiki/File:Potassium_Sodium_Tartrate_Tetrahydrate.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    }
  },
  "aluminum-sulfate-octadecahydrate": {
    "image": "/assets/products/unique-v6/aluminum-sulfate-octadecahydrate.webp",
    "imageAlt": "Алюминий сернокислый: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "imageCredit": {
      "name": "Chemicalinterest",
      "url": "https://commons.wikimedia.org/wiki/File:Aluminium_sulfate_crystals.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    }
  },
  "tris-base": {
    "image": "/assets/products/unique-v6/tris-base.webp",
    "imageAlt": "Демонстрационная иллюстрация белого кристаллического порошка Трис-основания",
    "imageCaption": "Демонстрационная иллюстрация физической формы Трис-основания. Не фотография образца или поставляемого товара.",
    "imageCredit": {
      "name": "Описание физической формы: Thermo Fisher",
      "url": "https://assets.thermofisher.com/chem-specs-pdf/retrievePdf?rootSku=A18494&sku=A18494.0E",
      "license": "Оригинальная демонстрационная иллюстрация"
    }
  },
  "acetic-acid": {
    "image": "/assets/products/unique-v6/acetic-acid.webp",
    "imageAlt": "Кислота уксусная: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "W. Oelen",
      "url": "https://commons.wikimedia.org/wiki/File:Acetic_acid.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "succinic-acid": {
    "image": "/assets/products/unique-v6/succinic-acid.webp",
    "imageAlt": "Кислота янтарная: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_succinic_acid.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
    }
  },
  "tartaric-acid": {
    "image": "/assets/products/unique-v6/tartaric-acid.webp",
    "imageAlt": "Кислота L(+)-винная: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Rei at English Wikipedia",
      "url": "https://commons.wikimedia.org/wiki/File:CommercialTartaric.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
    }
  },
  "ascorbic-acid": {
    "image": "/assets/products/unique-v6/ascorbic-acid.webp",
    "imageAlt": "Кислота L-аскорбиновая: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_ascorbic_acid.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "benzoic-acid": {
    "image": "/assets/products/unique-v6/benzoic-acid.webp",
    "imageAlt": "Кислота бензойная: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Devon Fyson",
      "url": "https://commons.wikimedia.org/wiki/File:Pile_of_benzoic_acid_crystals.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "d-glucose": {
    "image": "/assets/products/unique-v6/d-glucose.webp",
    "imageAlt": "Демонстрационная иллюстрация белого порошка безводной D-глюкозы",
    "imageCaption": "Демонстрационная иллюстрация физической формы. Не фотография образца или поставляемого товара.",
    "imageCredit": {
      "name": "Описание физической формы: Thermo Fisher",
      "url": "https://assets.thermofisher.com/chem-specs-pdf/retrievePdf?rootSku=A16828&sku=A16828.0E",
      "license": "Оригинальная демонстрационная иллюстрация"
    }
  },
  "edta-disodium-dihydrate": {
    "image": "/assets/products/unique-v6/edta-disodium-dihydrate.webp",
    "imageAlt": "ЭДТА динатриевая соль: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Leiem",
      "url": "https://commons.wikimedia.org/wiki/File:EDTA-2Na-dihydrate.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "propylene-glycol": {
    "image": "/assets/products/unique-v6/propylene-glycol.webp",
    "imageAlt": "Демонстрационная иллюстрация бесцветного пропиленгликоля в лабораторной емкости",
    "imageCaption": "Демонстрационная иллюстрация физической формы. Не фотография образца или поставляемого товара.",
    "imageCredit": {
      "name": "Описание физической формы: TCI",
      "url": "https://www.tcichemicals.com/CA/en/p/P0485",
      "license": "Оригинальная демонстрационная иллюстрация"
    }
  },
  "ethyl-acetate": {
    "image": "/assets/products/unique-v6/ethyl-acetate.webp",
    "imageAlt": "Этилацетат: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Danny S.",
      "url": "https://commons.wikimedia.org/wiki/File:Essigs%C3%A4ureethylester_by_Danny_S._-_001.JPG",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "dimethyl-sulfoxide": {
    "image": "/assets/products/unique-v6/dimethyl-sulfoxide.webp",
    "imageAlt": "Диметилсульфоксид: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Σ64",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Dimethyl_sulfoxide_01.jpg",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
    }
  },
  "n-butanol": {
    "image": "/assets/products/unique-v6/n-butanol.webp",
    "imageAlt": "н-Бутанол: отдельный лабораторный образец",
    "imageCaption": "Иллюстрация вещества, не фото поставляемого товара.",
    "imageCredit": {
      "name": "Daemon Canchig",
      "url": "https://commons.wikimedia.org/wiki/File:Butanol._Etiqueta_de_seguridad.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "deionized-water": {
    "image": "/assets/products/unique-v6/deionized-water.webp",
    "imageAlt": "Вода деионизованная: отдельный лабораторный образец",
    "imageCaption": "Лабораторная вода. Способ очистки и характеристики по фотографии не подтверждаются.",
    "imageCredit": {
      "name": "أمين",
      "url": "https://commons.wikimedia.org/wiki/File:Distilled_water_001.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  }
};
