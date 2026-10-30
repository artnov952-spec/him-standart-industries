export type PhotoPresentation = { src: string; width?: number; srcSet?: string; height?: number; alt?: string; caption?: string; credit?: { name: string; url: string; license: string; licenseUrl?: string } };

// 20 source-derived alpha cutouts on a shared CSS stage.
// Editing and attribution: IMAGE-SOURCES.md and public/assets/products/ATTRIBUTION-cutout-v4.txt.
// Product-level generic illustration alt/captions must take precedence.
export const productPhotoPresentation: Record<string, PhotoPresentation> = {
  "/assets/products/ethanol-96.webp": {
    "src": "/assets/products/ethanol-cutout-v4.webp",
    "credit": {
      "name": "LHcheM; цветокоррекция Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Absolute_Ethanol.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "alt": "Бесцветная жидкость в прозрачной стеклянной бутылке без товарной этикетки, иллюстрация формы вещества",
    "caption": "Иллюстрация жидкой формы этанола, не фото поставляемого товара. В исходнике абсолютный этанол; концентрация 96% и фасовка выбранной позиции по фото не подтверждаются. Фон обработан.",
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/ethanol-cutout-v4-480.webp 480w, /assets/products/ethanol-cutout-v4-720.webp 720w, /assets/products/ethanol-cutout-v4.webp 960w"
  },
  "/assets/products/sodium-chloride.webp": {
    "src": "/assets/products/sodium-chloride-cutout-v4.webp",
    "credit": {
      "name": "Alessandro e Damiano",
      "url": "https://commons.wikimedia.org/wiki/File:Crystals_of_NaCl.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/sodium-chloride-cutout-v4-480.webp 480w, /assets/products/sodium-chloride-cutout-v4-720.webp 720w, /assets/products/sodium-chloride-cutout-v4.webp 960w"
  },
  "/assets/products/isopropanol.webp": {
    "src": "/assets/products/isopropanol-cutout-v4.webp",
    "credit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/isopropanol-cutout-v4-480.webp 480w, /assets/products/isopropanol-cutout-v4-720.webp 720w, /assets/products/isopropanol-cutout-v4.webp 960w"
  },
  "/assets/products/acetone.webp": {
    "src": "/assets/products/acetone-cutout-v4.webp",
    "width": 960,
    "height": 960,
    "credit": {
      "name": "Antonkneeyo",
      "url": "https://commons.wikimedia.org/wiki/File:Acetone_Bottle.png",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "srcSet": "/assets/products/acetone-cutout-v4-480.webp 480w, /assets/products/acetone-cutout-v4-720.webp 720w, /assets/products/acetone-cutout-v4.webp 960w"
  },
  "/assets/products/glycerol.webp": {
    "src": "/assets/products/glycerol-cutout-v4.webp",
    "credit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Glycerine.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "alt": "Бесцветная жидкость в лабораторной колбе, иллюстрация глицерина без товарной этикетки",
    "caption": "Глицерин в лабораторной колбе. Иллюстрация вещества, не фото поставляемого товара. Маркировка стеклянной посуды не обозначает фасовку позиции. Фон обработан.",
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/glycerol-cutout-v4-480.webp 480w, /assets/products/glycerol-cutout-v4-720.webp 720w, /assets/products/glycerol-cutout-v4.webp 960w"
  },
  "/assets/products/sodium-hydroxide.webp": {
    "src": "/assets/products/sodium-hydroxide-cutout-v4.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:SodiumHydroxide.jpg",
      "license": "Public domain"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/sodium-hydroxide-cutout-v4-480.webp 480w, /assets/products/sodium-hydroxide-cutout-v4-720.webp 720w, /assets/products/sodium-hydroxide-cutout-v4.webp 960w"
  },
  "/assets/products/potassium-hydroxide.webp": {
    "src": "/assets/products/potassium-hydroxide-cutout-v4.webp",
    "credit": {
      "name": "Pań w żółtym kapeluszu",
      "url": "https://commons.wikimedia.org/wiki/File:Potassium_hydrooxide_flakes.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/potassium-hydroxide-cutout-v4-480.webp 480w, /assets/products/potassium-hydroxide-cutout-v4-720.webp 720w, /assets/products/potassium-hydroxide-cutout-v4.webp 960w"
  },
  "/assets/products/copper-sulfate-pentahydrate.webp": {
    "src": "/assets/products/copper-sulfate-pentahydrate-cutout-v4.webp",
    "credit": {
      "name": "W. Oelen",
      "url": "https://commons.wikimedia.org/wiki/File:Copper_sulfate_pentahydrate_crystals.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/copper-sulfate-pentahydrate-cutout-v4-480.webp 480w, /assets/products/copper-sulfate-pentahydrate-cutout-v4-720.webp 720w, /assets/products/copper-sulfate-pentahydrate-cutout-v4.webp 960w"
  },
  "/assets/products/trisodium-citrate-dihydrate.webp": {
    "src": "/assets/products/trisodium-citrate-dihydrate-cutout-v4.webp",
    "credit": {
      "name": "Toffel (атрибуция Wikimedia Commons)",
      "url": "https://commons.wikimedia.org/wiki/File:Natriumcitrat_Kristalle.JPG",
      "license": "Public domain"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/trisodium-citrate-dihydrate-cutout-v4-480.webp 480w, /assets/products/trisodium-citrate-dihydrate-cutout-v4-720.webp 720w, /assets/products/trisodium-citrate-dihydrate-cutout-v4.webp 960w"
  },
  "/assets/products/boric-acid.webp": {
    "src": "/assets/products/boric-acid-cutout-v4.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Boric_acid.jpg",
      "license": "Public domain"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/boric-acid-cutout-v4-480.webp 480w, /assets/products/boric-acid-cutout-v4-720.webp 720w, /assets/products/boric-acid-cutout-v4.webp 960w"
  },
  "/assets/products/calcium-carbonate.webp": {
    "src": "/assets/products/calcium-carbonate-cutout-v4.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Calcium_carbonate.jpg",
      "license": "Public domain"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/calcium-carbonate-cutout-v4-480.webp 480w, /assets/products/calcium-carbonate-cutout-v4-720.webp 720w, /assets/products/calcium-carbonate-cutout-v4.webp 960w"
  },
  "/assets/products/iron-sulfate-heptahydrate.webp": {
    "src": "/assets/products/iron-sulfate-heptahydrate-cutout-v4.webp",
    "credit": {
      "name": "Benjah-bmm27",
      "url": "https://commons.wikimedia.org/wiki/File:Iron(II)-sulfate-heptahydrate-sample.jpg",
      "license": "Public domain"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/iron-sulfate-heptahydrate-cutout-v4-480.webp 480w, /assets/products/iron-sulfate-heptahydrate-cutout-v4-720.webp 720w, /assets/products/iron-sulfate-heptahydrate-cutout-v4.webp 960w"
  },
  "/assets/products/iron-chloride-hexahydrate.webp": {
    "src": "/assets/products/iron-chloride-hexahydrate-cutout-v4.webp",
    "width": 960,
    "height": 960,
    "credit": {
      "name": "Benjah-bmm27",
      "url": "https://commons.wikimedia.org/wiki/File:Iron(III)-chloride-hexahydrate-sample.jpg",
      "license": "Public domain"
    },
    "srcSet": "/assets/products/iron-chloride-hexahydrate-cutout-v4-480.webp 480w, /assets/products/iron-chloride-hexahydrate-cutout-v4-720.webp 720w, /assets/products/iron-chloride-hexahydrate-cutout-v4.webp 960w"
  },
  "/assets/products/zinc-oxide.webp": {
    "src": "/assets/products/zinc-oxide-cutout-v4.webp",
    "credit": {
      "name": "Walkerma",
      "url": "https://commons.wikimedia.org/wiki/File:Zinc_oxide.jpg",
      "license": "Public domain"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/zinc-oxide-cutout-v4-480.webp 480w, /assets/products/zinc-oxide-cutout-v4-720.webp 720w, /assets/products/zinc-oxide-cutout-v4.webp 960w"
  },
  "/assets/products/magnesium-oxide.webp": {
    "src": "/assets/products/magnesium-oxide-cutout-v4.webp",
    "credit": {
      "name": "Adam Rędzikowski",
      "url": "https://commons.wikimedia.org/wiki/File:Magnesium_oxide_sample.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/magnesium-oxide-cutout-v4-480.webp 480w, /assets/products/magnesium-oxide-cutout-v4-720.webp 720w, /assets/products/magnesium-oxide-cutout-v4.webp 960w"
  },
  "/assets/products/urea.webp": {
    "src": "/assets/products/urea-cutout-v4.webp",
    "credit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Urea.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/urea-cutout-v4-480.webp 480w, /assets/products/urea-cutout-v4-720.webp 720w, /assets/products/urea-cutout-v4.webp 960w"
  },
  "/assets/products/glycine.webp": {
    "src": "/assets/products/glycine-cutout-v4.webp",
    "credit": {
      "name": "SPOTzillah",
      "url": "https://commons.wikimedia.org/wiki/File:Glycin.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/glycine-cutout-v4-480.webp 480w, /assets/products/glycine-cutout-v4-720.webp 720w, /assets/products/glycine-cutout-v4.webp 960w"
  },
  "/assets/products/sucrose.webp": {
    "src": "/assets/products/sucrose-cutout-v4.webp",
    "credit": {
      "name": "Nachovfranco",
      "url": "https://commons.wikimedia.org/wiki/File:Sucrose_crystals.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/sucrose-cutout-v4-480.webp 480w, /assets/products/sucrose-cutout-v4-720.webp 720w, /assets/products/sucrose-cutout-v4.webp 960w"
  },
  "/assets/products/citric-acid-anhydrous.webp": {
    "src": "/assets/products/citric-acid-anhydrous-cutout-v4.webp",
    "credit": {
      "name": "Renate90",
      "url": "https://commons.wikimedia.org/wiki/File:Citronens%C3%A4ure.JPG",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "alt": "Мелкие бесцветные кристаллы лимонной кислоты",
    "caption": "Лимонная кислота. Иллюстрация вещества; форму гидрата подтверждаем в предложении.",
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/citric-acid-anhydrous-cutout-v4-480.webp 480w, /assets/products/citric-acid-anhydrous-cutout-v4-720.webp 720w, /assets/products/citric-acid-anhydrous-cutout-v4.webp 960w"
  },
  "/assets/products/sodium-bicarbonate.webp": {
    "src": "/assets/products/sodium-bicarbonate-cutout-v4.webp",
    "credit": {
      "name": "Thavox",
      "url": "https://commons.wikimedia.org/wiki/File:Sodium_bicarbonate.jpg",
      "license": "Public domain"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/sodium-bicarbonate-cutout-v4-480.webp 480w, /assets/products/sodium-bicarbonate-cutout-v4-720.webp 720w, /assets/products/sodium-bicarbonate-cutout-v4.webp 960w"
  }
};
