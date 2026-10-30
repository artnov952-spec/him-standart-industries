export type PhotoPresentation = { src: string; width?: number; height?: number; alt?: string; caption?: string; credit?: { name: string; url: string; license: string; licenseUrl?: string } };

// 18 source-derived background edits plus 2 unchanged neutral photographs.
// Editing and attribution: IMAGE-SOURCES.md and public/assets/products/ATTRIBUTION-studio-v3.txt.
// Product-level generic illustration alt/captions must take precedence.
export const productPhotoPresentation: Record<string, PhotoPresentation> = {
  "/assets/products/ethanol-96.webp": {
    "src": "/assets/products/ethanol-form-studio-v3.webp",
    "credit": {
      "name": "LHcheM; цветокоррекция Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Absolute_Ethanol.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "alt": "Бесцветная жидкость в прозрачной стеклянной бутылке без товарной этикетки, иллюстрация формы вещества",
    "caption": "Иллюстрация жидкой формы этанола, не фото поставляемого товара. В исходнике абсолютный этанол; концентрация 96% и фасовка выбранной позиции по фото не подтверждаются. Фон обработан."
  },
  "/assets/products/sodium-chloride.webp": {
    "src": "/assets/products/sodium-chloride-studio-v2.webp",
    "credit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    }
  },
  "/assets/products/isopropanol.webp": {
    "src": "/assets/products/isopropanol-studio-v2.webp",
    "credit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "/assets/products/acetone.webp": {
    "src": "/assets/products/acetone.webp",
    "width": 768,
    "height": 1000,
    "credit": {
      "name": "Antonkneeyo",
      "url": "https://commons.wikimedia.org/wiki/File:Acetone_Bottle.png",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "/assets/products/glycerol.webp": {
    "src": "/assets/products/glycerol-sample-studio-v3.webp",
    "credit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Glycerine.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "alt": "Бесцветная жидкость в лабораторной колбе, иллюстрация глицерина без товарной этикетки",
    "caption": "Глицерин в лабораторной колбе. Иллюстрация вещества, не фото поставляемого товара. Маркировка стеклянной посуды не обозначает фасовку позиции. Фон обработан."
  },
  "/assets/products/sodium-hydroxide.webp": {
    "src": "/assets/products/sodium-hydroxide-studio-v2.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:SodiumHydroxide.jpg",
      "license": "Public domain"
    }
  },
  "/assets/products/potassium-hydroxide.webp": {
    "src": "/assets/products/potassium-hydroxide-studio-v2.webp",
    "credit": {
      "name": "Pań w żółtym kapeluszu",
      "url": "https://commons.wikimedia.org/wiki/File:Potassium_hydrooxide_flakes.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    }
  },
  "/assets/products/copper-sulfate-pentahydrate.webp": {
    "src": "/assets/products/copper-sulfate-pentahydrate-studio-v2.webp",
    "credit": {
      "name": "W. Oelen",
      "url": "https://commons.wikimedia.org/wiki/File:Copper_sulfate_pentahydrate_crystals.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "/assets/products/trisodium-citrate-dihydrate.webp": {
    "src": "/assets/products/trisodium-citrate-dihydrate-studio-v2.webp",
    "credit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    }
  },
  "/assets/products/boric-acid.webp": {
    "src": "/assets/products/boric-acid-studio-v2.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    }
  },
  "/assets/products/calcium-carbonate.webp": {
    "src": "/assets/products/calcium-carbonate-studio-v2.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Calcium_carbonate.jpg",
      "license": "Public domain"
    }
  },
  "/assets/products/iron-sulfate-heptahydrate.webp": {
    "src": "/assets/products/iron-sulfate-heptahydrate-studio-v3.webp",
    "credit": {
      "name": "Benjah-bmm27",
      "url": "https://commons.wikimedia.org/wiki/File:Iron(II)-sulfate-heptahydrate-sample.jpg",
      "license": "Public domain"
    }
  },
  "/assets/products/iron-chloride-hexahydrate.webp": {
    "src": "/assets/products/iron-chloride-hexahydrate.webp",
    "width": 1000,
    "height": 702,
    "credit": {
      "name": "Benjah-bmm27",
      "url": "https://commons.wikimedia.org/wiki/File:Iron(III)-chloride-hexahydrate-sample.jpg",
      "license": "Public domain"
    }
  },
  "/assets/products/zinc-oxide.webp": {
    "src": "/assets/products/zinc-oxide-studio-v2.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Zinc_oxide.jpg",
      "license": "Public domain"
    }
  },
  "/assets/products/magnesium-oxide.webp": {
    "src": "/assets/products/magnesium-oxide-studio-v3.webp",
    "credit": {
      "name": "Adam Rędzikowski",
      "url": "https://commons.wikimedia.org/wiki/File:Magnesium_oxide_sample.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "/assets/products/urea.webp": {
    "src": "/assets/products/urea-studio-v2.webp",
    "credit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Urea.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    }
  },
  "/assets/products/glycine.webp": {
    "src": "/assets/products/glycine-studio-v2.webp",
    "credit": {
      "name": "SPOTzillah",
      "url": "https://commons.wikimedia.org/wiki/File:Glycin.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "/assets/products/sucrose.webp": {
    "src": "/assets/products/sucrose-studio-v2.webp",
    "credit": {
      "name": "Nachovfranco",
      "url": "https://commons.wikimedia.org/wiki/File:Sucrose_crystals.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    }
  },
  "/assets/products/citric-acid-anhydrous.webp": {
    "src": "/assets/products/citric-acid-anhydrous-studio-v2.webp",
    "credit": {
      "name": "Renate90",
      "url": "https://commons.wikimedia.org/wiki/File:Citronens%C3%A4ure.JPG",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "alt": "Мелкие бесцветные кристаллы лимонной кислоты",
    "caption": "Лимонная кислота. Иллюстрация вещества; форму гидрата подтверждаем в предложении."
  },
  "/assets/products/sodium-bicarbonate.webp": {
    "src": "/assets/products/sodium-bicarbonate-studio-v2.webp",
    "credit": {
      "name": "Thavox",
      "url": "https://commons.wikimedia.org/wiki/File:Sodium_bicarbonate.jpg",
      "license": "Public domain"
    }
  }
};
