export type PhotoPresentation = { src: string; width?: number; srcSet?: string; height?: number; alt?: string; caption?: string; credit?: { name: string; url: string; license: string; licenseUrl?: string } };

// Individual alpha cutouts on a shared CSS stage; replacements: assets/products/unique-v6/SOURCES.json.
// Editing and attribution: IMAGE-SOURCES.md and public/assets/products/ATTRIBUTION-cutout-v4.txt.
// Isopropanol and glycerol v5 remove printed glassware markings; see their ATTRIBUTION files.
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
    "srcSet": "/assets/products/thumbnails-v6/ethanol-96-320.webp 320w, /assets/products/ethanol-cutout-v4-480.webp 480w, /assets/products/ethanol-cutout-v4-720.webp 720w, /assets/products/ethanol-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/sodium-chloride-320.webp 320w, /assets/products/sodium-chloride-cutout-v4-480.webp 480w, /assets/products/sodium-chloride-cutout-v4-720.webp 720w, /assets/products/sodium-chloride-cutout-v4.webp 960w"
  },
  "/assets/products/isopropanol.webp": {
    "src": "/assets/products/isopropanol-unmarked-v5.webp",
    "credit": {
      "name": "Danny S.; переработка Jacek Halicki",
      "url": "https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/thumbnails-v6/isopropanol-320.webp 320w, /assets/products/isopropanol-unmarked-v5-480.webp 480w, /assets/products/isopropanol-unmarked-v5-720.webp 720w, /assets/products/isopropanol-unmarked-v5.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/acetone-320.webp 320w, /assets/products/acetone-cutout-v4-480.webp 480w, /assets/products/acetone-cutout-v4-720.webp 720w, /assets/products/acetone-cutout-v4.webp 960w"
  },
  "/assets/products/glycerol.webp": {
    "src": "/assets/products/glycerol-unmarked-v5.webp",
    "credit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Glycerine.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "alt": "Бесцветная жидкость в лабораторной колбе, иллюстрация глицерина без товарной этикетки",
    "caption": "Глицерин в лабораторной колбе. Иллюстрация вещества, не фото поставляемого товара.",
    "width": 960,
    "height": 960,
    "srcSet": "/assets/products/thumbnails-v6/glycerol-320.webp 320w, /assets/products/glycerol-unmarked-v5-480.webp 480w, /assets/products/glycerol-unmarked-v5-720.webp 720w, /assets/products/glycerol-unmarked-v5.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/sodium-hydroxide-320.webp 320w, /assets/products/sodium-hydroxide-cutout-v4-480.webp 480w, /assets/products/sodium-hydroxide-cutout-v4-720.webp 720w, /assets/products/sodium-hydroxide-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/potassium-hydroxide-320.webp 320w, /assets/products/potassium-hydroxide-cutout-v4-480.webp 480w, /assets/products/potassium-hydroxide-cutout-v4-720.webp 720w, /assets/products/potassium-hydroxide-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/copper-sulfate-pentahydrate-320.webp 320w, /assets/products/copper-sulfate-pentahydrate-cutout-v4-480.webp 480w, /assets/products/copper-sulfate-pentahydrate-cutout-v4-720.webp 720w, /assets/products/copper-sulfate-pentahydrate-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/trisodium-citrate-dihydrate-320.webp 320w, /assets/products/trisodium-citrate-dihydrate-cutout-v4-480.webp 480w, /assets/products/trisodium-citrate-dihydrate-cutout-v4-720.webp 720w, /assets/products/trisodium-citrate-dihydrate-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/boric-acid-320.webp 320w, /assets/products/boric-acid-cutout-v4-480.webp 480w, /assets/products/boric-acid-cutout-v4-720.webp 720w, /assets/products/boric-acid-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/calcium-carbonate-320.webp 320w, /assets/products/calcium-carbonate-cutout-v4-480.webp 480w, /assets/products/calcium-carbonate-cutout-v4-720.webp 720w, /assets/products/calcium-carbonate-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/iron-sulfate-heptahydrate-320.webp 320w, /assets/products/iron-sulfate-heptahydrate-cutout-v4-480.webp 480w, /assets/products/iron-sulfate-heptahydrate-cutout-v4-720.webp 720w, /assets/products/iron-sulfate-heptahydrate-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/iron-chloride-hexahydrate-320.webp 320w, /assets/products/iron-chloride-hexahydrate-cutout-v4-480.webp 480w, /assets/products/iron-chloride-hexahydrate-cutout-v4-720.webp 720w, /assets/products/iron-chloride-hexahydrate-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/zinc-oxide-320.webp 320w, /assets/products/zinc-oxide-cutout-v4-480.webp 480w, /assets/products/zinc-oxide-cutout-v4-720.webp 720w, /assets/products/zinc-oxide-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/magnesium-oxide-320.webp 320w, /assets/products/magnesium-oxide-cutout-v4-480.webp 480w, /assets/products/magnesium-oxide-cutout-v4-720.webp 720w, /assets/products/magnesium-oxide-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/urea-320.webp 320w, /assets/products/urea-cutout-v4-480.webp 480w, /assets/products/urea-cutout-v4-720.webp 720w, /assets/products/urea-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/glycine-320.webp 320w, /assets/products/glycine-cutout-v4-480.webp 480w, /assets/products/glycine-cutout-v4-720.webp 720w, /assets/products/glycine-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/sucrose-320.webp 320w, /assets/products/sucrose-cutout-v4-480.webp 480w, /assets/products/sucrose-cutout-v4-720.webp 720w, /assets/products/sucrose-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/citric-acid-anhydrous-320.webp 320w, /assets/products/citric-acid-anhydrous-cutout-v4-480.webp 480w, /assets/products/citric-acid-anhydrous-cutout-v4-720.webp 720w, /assets/products/citric-acid-anhydrous-cutout-v4.webp 960w"
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
    "srcSet": "/assets/products/thumbnails-v6/sodium-bicarbonate-320.webp 320w, /assets/products/sodium-bicarbonate-cutout-v4-480.webp 480w, /assets/products/sodium-bicarbonate-cutout-v4-720.webp 720w, /assets/products/sodium-bicarbonate-cutout-v4.webp 960w"
  },
  "/assets/products/unique-v6/sodium-carbonate.webp": {
    "src": "/assets/products/unique-v6/sodium-carbonate.webp",
    "width": 960,
    "height": 960,
    "alt": "Натрий углекислый: отдельный лабораторный образец",
    "caption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "credit": {
      "name": "Chemicalinterest",
      "url": "https://commons.wikimedia.org/wiki/File:Sodium_carbonate.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Sodium_carbonate.JPG#Licensing"
    },
    "srcSet": "/assets/products/thumbnails-v6/sodium-carbonate-320.webp 320w, /assets/products/unique-v6/sodium-carbonate-480.webp 480w, /assets/products/unique-v6/sodium-carbonate-720.webp 720w, /assets/products/unique-v6/sodium-carbonate.webp 960w"
  },
  "/assets/products/unique-v6/potassium-chloride.webp": {
    "src": "/assets/products/unique-v6/potassium-chloride.webp",
    "width": 960,
    "height": 960,
    "alt": "Калий хлористый: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Pań w żółtym kapeluszu",
      "url": "https://commons.wikimedia.org/wiki/File:Potassium_chloride_podwer.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    },
    "srcSet": "/assets/products/thumbnails-v6/potassium-chloride-320.webp 320w, /assets/products/unique-v6/potassium-chloride-480.webp 480w, /assets/products/unique-v6/potassium-chloride-720.webp 720w, /assets/products/unique-v6/potassium-chloride.webp 960w"
  },
  "/assets/products/unique-v6/calcium-chloride-dihydrate.webp": {
    "src": "/assets/products/unique-v6/calcium-chloride-dihydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Кальций хлористый: отдельный лабораторный образец",
    "caption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "credit": {
      "name": "Roi.Frvr",
      "url": "https://commons.wikimedia.org/wiki/File:Petri_Dish_containing_Calcium_Chloride.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en"
    },
    "srcSet": "/assets/products/thumbnails-v6/calcium-chloride-dihydrate-320.webp 320w, /assets/products/unique-v6/calcium-chloride-dihydrate-480.webp 480w, /assets/products/unique-v6/calcium-chloride-dihydrate-720.webp 720w, /assets/products/unique-v6/calcium-chloride-dihydrate.webp 960w"
  },
  "/assets/products/unique-v6/magnesium-sulfate-heptahydrate.webp": {
    "src": "/assets/products/unique-v6/magnesium-sulfate-heptahydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Магний сернокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Chemicalinterest  at  en.wikipedia",
      "url": "https://commons.wikimedia.org/wiki/File:Magnesium_sulfate.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Magnesium_sulfate.JPG#Licensing"
    },
    "srcSet": "/assets/products/thumbnails-v6/magnesium-sulfate-heptahydrate-320.webp 320w, /assets/products/unique-v6/magnesium-sulfate-heptahydrate-480.webp 480w, /assets/products/unique-v6/magnesium-sulfate-heptahydrate-720.webp 720w, /assets/products/unique-v6/magnesium-sulfate-heptahydrate.webp 960w"
  },
  "/assets/products/unique-v6/sodium-sulfate.webp": {
    "src": "/assets/products/unique-v6/sodium-sulfate.webp",
    "width": 960,
    "height": 960,
    "alt": "Натрий сернокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "credit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_sodn%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_sodn%C3%BD.JPG#Licensing"
    },
    "srcSet": "/assets/products/thumbnails-v6/sodium-sulfate-320.webp 320w, /assets/products/unique-v6/sodium-sulfate-480.webp 480w, /assets/products/unique-v6/sodium-sulfate-720.webp 720w, /assets/products/unique-v6/sodium-sulfate.webp 960w"
  },
  "/assets/products/unique-v6/potassium-sulfate.webp": {
    "src": "/assets/products/unique-v6/potassium-sulfate.webp",
    "width": 960,
    "height": 960,
    "alt": "Калий сернокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_draseln%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_draseln%C3%BD.JPG#Licensing"
    },
    "srcSet": "/assets/products/thumbnails-v6/potassium-sulfate-320.webp 320w, /assets/products/unique-v6/potassium-sulfate-480.webp 480w, /assets/products/unique-v6/potassium-sulfate-720.webp 720w, /assets/products/unique-v6/potassium-sulfate.webp 960w"
  },
  "/assets/products/unique-v6/ammonium-sulfate.webp": {
    "src": "/assets/products/unique-v6/ammonium-sulfate.webp",
    "width": 960,
    "height": 960,
    "alt": "Аммоний сернокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Kapitánka Nemo",
      "url": "https://commons.wikimedia.org/wiki/File:S%C3%ADran_amonn%C3%BD.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/ammonium-sulfate-320.webp 320w, /assets/products/unique-v6/ammonium-sulfate-480.webp 480w, /assets/products/unique-v6/ammonium-sulfate-720.webp 720w, /assets/products/unique-v6/ammonium-sulfate.webp 960w"
  },
  "/assets/products/unique-v6/sodium-acetate-trihydrate.webp": {
    "src": "/assets/products/unique-v6/sodium-acetate-trihydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Натрий уксуснокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "credit": {
      "name": "Milda 444",
      "url": "https://commons.wikimedia.org/wiki/File:Octan_sodn%C3%BD_vzorek.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/sodium-acetate-trihydrate-320.webp 320w, /assets/products/unique-v6/sodium-acetate-trihydrate-480.webp 480w, /assets/products/unique-v6/sodium-acetate-trihydrate-720.webp 720w, /assets/products/unique-v6/sodium-acetate-trihydrate.webp 960w"
  },
  "/assets/products/unique-v6/ammonium-acetate.webp": {
    "src": "/assets/products/unique-v6/ammonium-acetate.webp",
    "width": 960,
    "height": 960,
    "alt": "Аммоний уксуснокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Vidak",
      "url": "https://commons.wikimedia.org/wiki/File:Ammonium-acetate.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/File:Ammonium-acetate.JPG#Licensing"
    },
    "srcSet": "/assets/products/thumbnails-v6/ammonium-acetate-320.webp 320w, /assets/products/unique-v6/ammonium-acetate-480.webp 480w, /assets/products/unique-v6/ammonium-acetate-720.webp 720w, /assets/products/unique-v6/ammonium-acetate.webp 960w"
  },
  "/assets/products/unique-v6/potassium-dihydrogen-phosphate.webp": {
    "src": "/assets/products/unique-v6/potassium-dihydrogen-phosphate.webp",
    "width": 960,
    "height": 960,
    "alt": "Калий фосфорнокислый однозамещенный: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Bahmtec",
      "url": "https://commons.wikimedia.org/wiki/File:Kaliumdihydrogenphosphat.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/potassium-dihydrogen-phosphate-320.webp 320w, /assets/products/unique-v6/potassium-dihydrogen-phosphate-480.webp 480w, /assets/products/unique-v6/potassium-dihydrogen-phosphate-720.webp 720w, /assets/products/unique-v6/potassium-dihydrogen-phosphate.webp 960w"
  },
  "/assets/products/unique-v6/dipotassium-hydrogen-phosphate.webp": {
    "src": "/assets/products/unique-v6/dipotassium-hydrogen-phosphate.webp",
    "width": 960,
    "height": 960,
    "alt": "Калий фосфорнокислый двузамещенный: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:Hydrogenfosfore%C4%8Dnan_draseln%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    },
    "srcSet": "/assets/products/thumbnails-v6/dipotassium-hydrogen-phosphate-320.webp 320w, /assets/products/unique-v6/dipotassium-hydrogen-phosphate-480.webp 480w, /assets/products/unique-v6/dipotassium-hydrogen-phosphate-720.webp 720w, /assets/products/unique-v6/dipotassium-hydrogen-phosphate.webp 960w"
  },
  "/assets/products/unique-v6/sodium-dihydrogen-phosphate-monohydrate.webp": {
    "src": "/assets/products/unique-v6/sodium-dihydrogen-phosphate-monohydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Натрий фосфорнокислый однозамещенный: отдельный лабораторный образец",
    "caption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "credit": {
      "name": "Ondřej Mangl",
      "url": "https://commons.wikimedia.org/wiki/File:Dihydrogenfosfore%C4%8Dnan_sodn%C3%BD.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    },
    "srcSet": "/assets/products/thumbnails-v6/sodium-dihydrogen-phosphate-monohydrate-320.webp 320w, /assets/products/unique-v6/sodium-dihydrogen-phosphate-monohydrate-480.webp 480w, /assets/products/unique-v6/sodium-dihydrogen-phosphate-monohydrate-720.webp 720w, /assets/products/unique-v6/sodium-dihydrogen-phosphate-monohydrate.webp 960w"
  },
  "/assets/products/unique-v6/disodium-hydrogen-phosphate-dodecahydrate.webp": {
    "src": "/assets/products/unique-v6/disodium-hydrogen-phosphate-dodecahydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Натрий фосфорнокислый двузамещенный: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Leiem",
      "url": "https://commons.wikimedia.org/wiki/File:Disodium_phosphate_dodecahydrate.JPG",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    },
    "srcSet": "/assets/products/thumbnails-v6/disodium-hydrogen-phosphate-dodecahydrate-320.webp 320w, /assets/products/unique-v6/disodium-hydrogen-phosphate-dodecahydrate-480.webp 480w, /assets/products/unique-v6/disodium-hydrogen-phosphate-dodecahydrate-720.webp 720w, /assets/products/unique-v6/disodium-hydrogen-phosphate-dodecahydrate.webp 960w"
  },
  "/assets/products/unique-v6/sodium-thiosulfate-pentahydrate.webp": {
    "src": "/assets/products/unique-v6/sodium-thiosulfate-pentahydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Натрий тиосульфат: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Walkerma (Martin Walker)",
      "url": "https://commons.wikimedia.org/wiki/File:Sodium_thiosulfate_pentahydrate.jpg",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    },
    "srcSet": "/assets/products/thumbnails-v6/sodium-thiosulfate-pentahydrate-320.webp 320w, /assets/products/unique-v6/sodium-thiosulfate-pentahydrate-480.webp 480w, /assets/products/unique-v6/sodium-thiosulfate-pentahydrate-720.webp 720w, /assets/products/unique-v6/sodium-thiosulfate-pentahydrate.webp 960w"
  },
  "/assets/products/unique-v6/potassium-sodium-tartrate-tetrahydrate.webp": {
    "src": "/assets/products/unique-v6/potassium-sodium-tartrate-tetrahydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Калий-натрий виннокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "ERS ROHU",
      "url": "https://commons.wikimedia.org/wiki/File:Potassium_Sodium_Tartrate_Tetrahydrate.jpg",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
    },
    "srcSet": "/assets/products/thumbnails-v6/potassium-sodium-tartrate-tetrahydrate-320.webp 320w, /assets/products/unique-v6/potassium-sodium-tartrate-tetrahydrate-480.webp 480w, /assets/products/unique-v6/potassium-sodium-tartrate-tetrahydrate-720.webp 720w, /assets/products/unique-v6/potassium-sodium-tartrate-tetrahydrate.webp 960w"
  },
  "/assets/products/unique-v6/aluminum-sulfate-octadecahydrate.webp": {
    "src": "/assets/products/unique-v6/aluminum-sulfate-octadecahydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Алюминий сернокислый: отдельный лабораторный образец",
    "caption": "Иллюстрация образца соединения. Гидратная форма и фасовка по фото не подтверждаются.",
    "credit": {
      "name": "Chemicalinterest",
      "url": "https://commons.wikimedia.org/wiki/File:Aluminium_sulfate_crystals.JPG",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain"
    },
    "srcSet": "/assets/products/thumbnails-v6/aluminum-sulfate-octadecahydrate-320.webp 320w, /assets/products/unique-v6/aluminum-sulfate-octadecahydrate-480.webp 480w, /assets/products/unique-v6/aluminum-sulfate-octadecahydrate-720.webp 720w, /assets/products/unique-v6/aluminum-sulfate-octadecahydrate.webp 960w"
  },
  "/assets/products/unique-v6/tris-base.webp": {
    "src": "/assets/products/unique-v6/tris-base.webp",
    "width": 960,
    "height": 960,
    "alt": "Демонстрационная иллюстрация белого кристаллического порошка Трис-основания",
    "caption": "Демонстрационная иллюстрация физической формы Трис-основания. Не фотография образца или поставляемого товара.",
    "credit": {
      "name": "Описание физической формы: Thermo Fisher",
      "url": "https://assets.thermofisher.com/chem-specs-pdf/retrievePdf?rootSku=A18494&sku=A18494.0E",
      "license": "Оригинальная демонстрационная иллюстрация"
    },
    "srcSet": "/assets/products/thumbnails-v6/tris-base-320.webp 320w, /assets/products/unique-v6/tris-base-480.webp 480w, /assets/products/unique-v6/tris-base-720.webp 720w, /assets/products/unique-v6/tris-base.webp 960w"
  },
  "/assets/products/unique-v6/citric-acid-monohydrate.webp": {
    "src": "/assets/products/unique-v6/citric-acid-monohydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "Кислота лимонная: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Milda444",
      "url": "https://commons.wikimedia.org/wiki/File:Kyselina_citronov%C3%A1_monohydr%C3%A1t.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    },
    "srcSet": "/assets/products/thumbnails-v6/citric-acid-monohydrate-320.webp 320w, /assets/products/unique-v6/citric-acid-monohydrate-480.webp 480w, /assets/products/unique-v6/citric-acid-monohydrate-720.webp 720w, /assets/products/unique-v6/citric-acid-monohydrate.webp 960w"
  },
  "/assets/products/unique-v6/succinic-acid.webp": {
    "src": "/assets/products/unique-v6/succinic-acid.webp",
    "width": 960,
    "height": 960,
    "alt": "Кислота янтарная: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_succinic_acid.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
    },
    "srcSet": "/assets/products/thumbnails-v6/succinic-acid-320.webp 320w, /assets/products/unique-v6/succinic-acid-480.webp 480w, /assets/products/unique-v6/succinic-acid-720.webp 720w, /assets/products/unique-v6/succinic-acid.webp 960w"
  },
  "/assets/products/unique-v6/tartaric-acid.webp": {
    "src": "/assets/products/unique-v6/tartaric-acid.webp",
    "width": 960,
    "height": 960,
    "alt": "Кислота L(+)-винная: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Rei at English Wikipedia",
      "url": "https://commons.wikimedia.org/wiki/File:CommercialTartaric.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
    },
    "srcSet": "/assets/products/thumbnails-v6/tartaric-acid-320.webp 320w, /assets/products/unique-v6/tartaric-acid-480.webp 480w, /assets/products/unique-v6/tartaric-acid-720.webp 720w, /assets/products/unique-v6/tartaric-acid.webp 960w"
  },
  "/assets/products/unique-v6/acetic-acid.webp": {
    "src": "/assets/products/unique-v6/acetic-acid.webp",
    "width": 960,
    "height": 960,
    "alt": "Кислота уксусная: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "W. Oelen",
      "url": "https://commons.wikimedia.org/wiki/File:Acetic_acid.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/acetic-acid-320.webp 320w, /assets/products/unique-v6/acetic-acid-480.webp 480w, /assets/products/unique-v6/acetic-acid-720.webp 720w, /assets/products/unique-v6/acetic-acid.webp 960w"
  },
  "/assets/products/unique-v6/ascorbic-acid.webp": {
    "src": "/assets/products/unique-v6/ascorbic-acid.webp",
    "width": 960,
    "height": 960,
    "alt": "Кислота L-аскорбиновая: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "LHcheM",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_ascorbic_acid.jpg",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/ascorbic-acid-320.webp 320w, /assets/products/unique-v6/ascorbic-acid-480.webp 480w, /assets/products/unique-v6/ascorbic-acid-720.webp 720w, /assets/products/unique-v6/ascorbic-acid.webp 960w"
  },
  "/assets/products/unique-v6/benzoic-acid.webp": {
    "src": "/assets/products/unique-v6/benzoic-acid.webp",
    "width": 960,
    "height": 960,
    "alt": "Кислота бензойная: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Devon Fyson",
      "url": "https://commons.wikimedia.org/wiki/File:Pile_of_benzoic_acid_crystals.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/benzoic-acid-320.webp 320w, /assets/products/unique-v6/benzoic-acid-480.webp 480w, /assets/products/unique-v6/benzoic-acid-720.webp 720w, /assets/products/unique-v6/benzoic-acid.webp 960w"
  },
  "/assets/products/unique-v6/d-glucose.webp": {
    "src": "/assets/products/unique-v6/d-glucose.webp",
    "width": 960,
    "height": 960,
    "alt": "Демонстрационная иллюстрация белого порошка безводной D-глюкозы",
    "caption": "Демонстрационная иллюстрация физической формы. Не фотография образца или поставляемого товара.",
    "credit": {
      "name": "Описание физической формы: Thermo Fisher",
      "url": "https://assets.thermofisher.com/chem-specs-pdf/retrievePdf?rootSku=A16828&sku=A16828.0E",
      "license": "Оригинальная демонстрационная иллюстрация"
    },
    "srcSet": "/assets/products/thumbnails-v6/d-glucose-320.webp 320w, /assets/products/unique-v6/d-glucose-480.webp 480w, /assets/products/unique-v6/d-glucose-720.webp 720w, /assets/products/unique-v6/d-glucose.webp 960w"
  },
  "/assets/products/unique-v6/edta-disodium-dihydrate.webp": {
    "src": "/assets/products/unique-v6/edta-disodium-dihydrate.webp",
    "width": 960,
    "height": 960,
    "alt": "ЭДТА динатриевая соль: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Leiem",
      "url": "https://commons.wikimedia.org/wiki/File:EDTA-2Na-dihydrate.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/edta-disodium-dihydrate-320.webp 320w, /assets/products/unique-v6/edta-disodium-dihydrate-480.webp 480w, /assets/products/unique-v6/edta-disodium-dihydrate-720.webp 720w, /assets/products/unique-v6/edta-disodium-dihydrate.webp 960w"
  },
  "/assets/products/unique-v6/propylene-glycol.webp": {
    "src": "/assets/products/unique-v6/propylene-glycol.webp",
    "width": 960,
    "height": 960,
    "alt": "Демонстрационная иллюстрация бесцветного пропиленгликоля в лабораторной емкости",
    "caption": "Демонстрационная иллюстрация физической формы. Не фотография образца или поставляемого товара.",
    "credit": {
      "name": "Описание физической формы: TCI",
      "url": "https://www.tcichemicals.com/CA/en/p/P0485",
      "license": "Оригинальная демонстрационная иллюстрация"
    },
    "srcSet": "/assets/products/thumbnails-v6/propylene-glycol-320.webp 320w, /assets/products/unique-v6/propylene-glycol-480.webp 480w, /assets/products/unique-v6/propylene-glycol-720.webp 720w, /assets/products/unique-v6/propylene-glycol.webp 960w"
  },
  "/assets/products/unique-v6/ethyl-acetate.webp": {
    "src": "/assets/products/unique-v6/ethyl-acetate.webp",
    "width": 960,
    "height": 960,
    "alt": "Этилацетат: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Danny S.",
      "url": "https://commons.wikimedia.org/wiki/File:Essigs%C3%A4ureethylester_by_Danny_S._-_001.JPG",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/ethyl-acetate-320.webp 320w, /assets/products/unique-v6/ethyl-acetate-480.webp 480w, /assets/products/unique-v6/ethyl-acetate-720.webp 720w, /assets/products/unique-v6/ethyl-acetate.webp 960w"
  },
  "/assets/products/unique-v6/dimethyl-sulfoxide.webp": {
    "src": "/assets/products/unique-v6/dimethyl-sulfoxide.webp",
    "width": 960,
    "height": 960,
    "alt": "Диметилсульфоксид: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Σ64",
      "url": "https://commons.wikimedia.org/wiki/File:Sample_of_Dimethyl_sulfoxide_01.jpg",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/dimethyl-sulfoxide-320.webp 320w, /assets/products/unique-v6/dimethyl-sulfoxide-480.webp 480w, /assets/products/unique-v6/dimethyl-sulfoxide-720.webp 720w, /assets/products/unique-v6/dimethyl-sulfoxide.webp 960w"
  },
  "/assets/products/unique-v6/n-butanol.webp": {
    "src": "/assets/products/unique-v6/n-butanol.webp",
    "width": 960,
    "height": 960,
    "alt": "н-Бутанол: отдельный лабораторный образец",
    "caption": "Иллюстрация вещества, не фото поставляемого товара.",
    "credit": {
      "name": "Daemon Canchig",
      "url": "https://commons.wikimedia.org/wiki/File:Butanol._Etiqueta_de_seguridad.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/n-butanol-320.webp 320w, /assets/products/unique-v6/n-butanol-480.webp 480w, /assets/products/unique-v6/n-butanol-720.webp 720w, /assets/products/unique-v6/n-butanol.webp 960w"
  },
  "/assets/products/unique-v6/deionized-water.webp": {
    "src": "/assets/products/unique-v6/deionized-water.webp",
    "width": 960,
    "height": 960,
    "alt": "Вода деионизованная: отдельный лабораторный образец",
    "caption": "Лабораторная вода. Способ очистки и характеристики по фотографии не подтверждаются.",
    "credit": {
      "name": "أمين",
      "url": "https://commons.wikimedia.org/wiki/File:Distilled_water_001.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
    },
    "srcSet": "/assets/products/thumbnails-v6/deionized-water-320.webp 320w, /assets/products/unique-v6/deionized-water-480.webp 480w, /assets/products/unique-v6/deionized-water-720.webp 720w, /assets/products/unique-v6/deionized-water.webp 960w"
  }
};
