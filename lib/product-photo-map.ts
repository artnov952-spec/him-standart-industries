import type { Product } from "./catalog";

// 20 unique real photographs; attribution and limitations: IMAGE-SOURCES.md.
// Exact illustrations and explicitly captioned physical-form fallbacks for all 41 extra products.
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
  "sodium-carbonate": {
    "image": "/assets/products/calcium-carbonate.webp",
    "imageAlt": "Белый порошок на лабораторном стекле, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Calcium_carbonate.jpg",
      "license": "Public domain"
    }
  },
  "potassium-chloride": {
    "image": "/assets/products/sodium-chloride.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "calcium-chloride-dihydrate": {
    "image": "/assets/products/trisodium-citrate-dihydrate.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "magnesium-sulfate-heptahydrate": {
    "image": "/assets/products/boric-acid.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    }
  },
  "sodium-sulfate": {
    "image": "/assets/products/trisodium-citrate-dihydrate.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "potassium-sulfate": {
    "image": "/assets/products/sodium-chloride.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "ammonium-sulfate": {
    "image": "/assets/products/trisodium-citrate-dihydrate.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "sodium-acetate-trihydrate": {
    "image": "/assets/products/sucrose.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Nachovfranco",
      "url": "https://commons.wikimedia.org/wiki/File:Sucrose_crystals.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "ammonium-acetate": {
    "image": "/assets/products/sodium-chloride.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "potassium-dihydrogen-phosphate": {
    "image": "/assets/products/boric-acid.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    }
  },
  "dipotassium-hydrogen-phosphate": {
    "image": "/assets/products/sodium-chloride.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "sodium-dihydrogen-phosphate-monohydrate": {
    "image": "/assets/products/sucrose.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Nachovfranco",
      "url": "https://commons.wikimedia.org/wiki/File:Sucrose_crystals.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "disodium-hydrogen-phosphate-dodecahydrate": {
    "image": "/assets/products/trisodium-citrate-dihydrate.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "sodium-thiosulfate-pentahydrate": {
    "image": "/assets/products/sodium-chloride.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "potassium-sodium-tartrate-tetrahydrate": {
    "image": "/assets/products/boric-acid.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    }
  },
  "aluminum-sulfate-octadecahydrate": {
    "image": "/assets/products/trisodium-citrate-dihydrate.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "tris-base": {
    "image": "/assets/products/sucrose.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Nachovfranco",
      "url": "https://commons.wikimedia.org/wiki/File:Sucrose_crystals.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "acetic-acid": {
    "image": "/assets/products/isopropanol.webp",
    "imageAlt": "Лабораторная колба с бесцветной жидкостью, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "succinic-acid": {
    "image": "/assets/products/trisodium-citrate-dihydrate.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "tartaric-acid": {
    "image": "/assets/products/trisodium-citrate-dihydrate.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "ascorbic-acid": {
    "image": "/assets/products/boric-acid.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    }
  },
  "benzoic-acid": {
    "image": "/assets/products/sucrose.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Nachovfranco",
      "url": "https://commons.wikimedia.org/wiki/File:Sucrose_crystals.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "d-glucose": {
    "image": "/assets/products/sodium-chloride.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "edta-disodium-dihydrate": {
    "image": "/assets/products/boric-acid.webp",
    "imageAlt": "Белые или бесцветные кристаллы, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    }
  },
  "propylene-glycol": {
    "image": "/assets/products/isopropanol.webp",
    "imageAlt": "Лабораторная колба с бесцветной жидкостью, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "ethyl-acetate": {
    "image": "/assets/products/isopropanol.webp",
    "imageAlt": "Лабораторная колба с бесцветной жидкостью, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "dimethyl-sulfoxide": {
    "image": "/assets/products/isopropanol.webp",
    "imageAlt": "Лабораторная колба с бесцветной жидкостью, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "n-butanol": {
    "image": "/assets/products/isopropanol.webp",
    "imageAlt": "Лабораторная колба с бесцветной жидкостью, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "deionized-water": {
    "image": "/assets/products/isopropanol.webp",
    "imageAlt": "Лабораторная колба с бесцветной жидкостью, иллюстрация формы вещества",
    "imageCaption": "Иллюстрация формы вещества. Не фотография выбранного продукта.",
    "imageCredit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  }
};
