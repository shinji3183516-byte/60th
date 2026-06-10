"use strict";

/*
  編集方法
  ------------------------------------------------------------
  1) 年代シートを増やす:
     timelineData に { year, era, title, visual, image, content } を追加します。
     削除したい場合は、その年代の { ... } を丸ごと削除します。

  2) 下段3コンテナの画像:
     content.car / content.plant / content.society の中へ
     { type: "image", src: "images/フォルダ/画像名.jpg", alt: "説明" } を追加します。
     各コンテナの画像は最大3枚まで表示します。

  3) 画像 → 文 → 画像 のように並べる:
     blocks の順番どおりに表示されます。

     例:
     content: {
       car: [
         { type: "image", src: "images/car/01.jpg", alt: "1枚目" },
         { type: "text", text: "ここに説明文を書きます。" },
         { type: "image", src: "images/car/02.jpg", alt: "2枚目" }
       ],
       plant: [],
       society: []
     }
*/

const MAX_IMAGES_PER_SECTION = 3;
const LOOP_COUNT = 3;
const STORAGE_KEY = "takaokaTimelineLocalAdditions_v2";

const timelineData = [
  {
    "year": "1966",
    "era": "昭和41年",
    "title": "高岡工場スタート",
    "visual": "PLANT",
    "image": "images/1960/1966Corolla.JPG",
    "spec1": "創業期",
    "spec2": "生産開始",
    "spec3": "60年の起点",
    "content": {
      "car1": [
        {
          "type": "text",
          "text": "初代カローラ数年後をこのように予測したトヨタ自動車は、高岡（愛知県豊田市）に1km四方にも及ぶカローラの専用工場を建設。翌年、元町工場から「パプリカ」の生産を移管。1968年には「スプリンター」の生産開始。"
        },
        {
          "type": "image",
          "src": "images/1960/1966publica.JPG",
          "alt": "パブリカ"
        },
        {
          "type":"image",
          "src" :"images/1960/publicaVan.JPG",
          "art" :"パブリカバン",
        }
      ],
      "car2": [
        {
          "src": "images/1960/1966publicaPickup.JPG",
          "text": "工場の歩みの起点。生産車種と工場の歴史をここから紹介します。高岡工場はカローラの専用工場として建設され、月間3万台を生産すると記者会見で発表。"
        },
        {
          "type": "image",
          "src": "images/1960/1966Corolla1.JPG",
          "alt": "カローラ"
        }
      ],
      "Plant": [
        {
          "type": "text",
          "text": "高度経済成長の中で、家庭に車が広がっていく時代でした。初代トヨタ・カローラ発売、日本の総人口1億人突破、いざなぎ景気の始まりなどが重なります。"
        },
        {
          "type": "image",
          "src": "images/society/ビートルズ.jpg",
          "alt": "1966年 社会"
        }
      ]
    }
  },
  {
    "year": "1969",
    "era": "昭和44年",
    "title": "追加シート：1969",
    "visual": "ADD",
    "image": "",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ここに1969年の車紹介を入力してください。画像は下のアップローダー、または script.js の content.car に追加できます。"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "ここに1969年の工場の出来事を入力してください。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "ここに1969年の社会の出来事を入力してください。"
        }
      ]
    }
  },
  {
    "year": "1978",
    "era": "昭和53年",
    "title": "カローラ生産拡大",
    "visual": "COROLLA",
    "image": "images/3.jpg",
    "spec1": "カローラ",
    "spec2": "量産",
    "spec3": "大衆車",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "カローラを中心に、小型で扱いやすい車づくりが広がりました。また、トヨタ初の前輪駆動（FF）車である「ターセル」「コルサ」の生産を開始。1982年カローラⅡ生産開始。"
        },
        {
          "type": "image",
          "src": "images/car/コルサ.jpg",
          "alt": "コルサ"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "量産体制を強め、高岡工場の存在感が高まっていきました。1980年トヨタ国内車両生産累計3,000万台を記念して時計塔設置。"
        },
        {
          "type": "image",
          "src": "images/factory/img01.jpg",
          "alt": "工場写真"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "生活の中に自動車が定着し、大衆車の需要が拡大しました。成田空港開港、沖縄の交通方法変更、キャンディーズ解散など、昭和の社会・流行も話題に。"
        },
        {
          "type": "image",
          "src": "images/society/okinawa.png",
          "alt": "沖縄交通方法変更"
        }
      ]
    }
  },
  {
    "year": "1980",
    "era": "昭和55年",
    "title": "追加シート：1980",
    "visual": "ADD",
    "image": "",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ここに1980年の車紹介を入力してください。"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "ここに1980年の工場の出来事を入力してください。写真は最大3枚まで表示できます。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "ここに1980年の社会の出来事を入力してください。"
        }
      ]
    }
  },
  {
    "year": "1984",
    "era": "昭和59年",
    "title": "品質向上とグローバル対応",
    "visual": "QUALITY",
    "image": "images/5.jpg",
    "spec1": "品質",
    "spec2": "効率化",
    "spec3": "海外支援",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "カローラFXなど、使いやすさと品質を重視した車種が登場しました。"
        },
        {
          "type": "image",
          "src": "images/car/FX.jpg",
          "alt": "カローラFX"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "品質・生産性向上に取り組み、グローバルな車づくりへつながりました。米国GMとの合弁会社「NUMMI」の立ち上げでは、親工場として現地従業員の研修など生産ノウハウを支援。"
        },
        {
          "type": "image",
          "src": "images/car/1000man.jpg",
          "alt": "1000万台"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "省エネ志向や小型車需要が高まりました。ファミコン人気拡大、ロサンゼルスオリンピック開催。"
        },
        {
          "type": "image",
          "src": "images/society/Olympic.jpg",
          "alt": "ロサンゼルスオリンピック"
        }
      ]
    }
  },
  {
    "year": "1989",
    "era": "平成1年",
    "title": "追加シート：1989",
    "visual": "ADD",
    "image": "",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ここに1989年の車紹介を入力してください。"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "ここに1989年の工場の出来事を入力してください。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "ここに1989年の社会の出来事を入力してください。"
        }
      ]
    }
  },
  {
    "year": "1997",
    "era": "平成9年",
    "title": "プリウス生産開始",
    "visual": "PRIUS",
    "image": "images/prius.jpg",
    "spec1": "HV",
    "spec2": "環境技術",
    "spec3": "新時代",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "世界初の量産ハイブリッド車プリウスの生産により、環境技術の時代へ進みました。SUV初代ハリアー登場。"
        },
        {
          "type": "image",
          "src": "images/car/shodaiharr.jpg",
          "alt": "初代ハリアー"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "初代プリウスの生産を開始しました。高岡工場にとって、環境技術と新しい車づくりへの大きな転機となりました。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "環境性能と技術革新への関心が高まりました。金融危機、京都議定書の採択、東京湾アクアライン開通、消費税5％など、社会の転換点となる出来事が続きました。"
        },
        {
          "type": "image",
          "src": "images/Aqua.jpg",
          "alt": "東京湾アクアライン"
        }
      ]
    }
  },
  {
    "year": "1999",
    "era": "平成11年",
    "title": "ヴィッツ・ファンカーゴ・プラッツ",
    "visual": "VITZ",
    "image": "images/vit.jpg",
    "spec1": "コンパクト",
    "spec2": "多車種",
    "spec3": "実用性",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "コンパクトカーのラインアップが広がりました。e-かんばん導入。ターセル、コルサ、サイノス生産終了。"
        },
        {
          "type": "image",
          "src": "images/car/fan.jpg",
          "alt": "ファンカーゴ"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "多車種生産への対応力を高めました。ヴィッツ生産開始、ボデー工程にトヨタ初のGBL導入。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "暮らしにフィットする車が注目されました。NTTドコモ i-mode開始。東海村JCO臨界事故。"
        },
        {
          "type": "image",
          "src": "images/society/mail.jpg",
          "alt": "i-mode"
        }
      ]
    }
  },
  {
    "year": "2001",
    "era": "平成13年",
    "title": "工場生産累計2,000万台",
    "visual": "20M",
    "image": "images/corolla_runx.jpg",
    "spec1": "2,000万台",
    "spec2": "高効率",
    "spec3": "品質強化",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "カローラ ランクス・アレックスなど、日常の使いやすさを重視したモデルが生産されました。"
        },
        {
          "type": "image",
          "src": "images/car/01.jpg",
          "alt": "ランクス・アレックス"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "累計生産台数の節目を迎え、生産体制の強化が進みました。支援先のTMMF（フランス）生産開始。工場生産累計2,000万台達成。"
        },
        {
          "type": "image",
          "src": "images/car/inher.jpg",
          "alt": "2000万台"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "品質と実用性の両立が求められました。小泉内閣発足、アメリカ同時多発テロ、翌年の日韓FIFAワールドカップ、ユーロ流通など、世界の動きが大きく変化。"
        }
      ]
    }
  },
  {
    "year": "2006",
    "era": "平成18年",
    "title": "追加シート：2006",
    "visual": "ADD",
    "image": "",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ここに2006年の車紹介を入力してください。"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "ここに2006年の工場の出来事を入力してください。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "ここに2006年の社会の出来事を入力してください。"
        }
      ]
    }
  },
  {
    "year": "2007",
    "era": "平成19年",
    "title": "新第1ライン・オーリス時代",
    "visual": "AURIS",
    "image": "images/Au.jpg",
    "spec1": "新ライン",
    "spec2": "能力向上",
    "spec3": "品質向上",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "2月カローラ ランクス、アレックス生産終了。8月：新第1ライン生産開始。10月第3ライン生産終了。"
        },
        {
          "type": "image",
          "src": "images/car/viz.png",
          "alt": "ヴィッツ"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "新ラインにより、生産能力と品質をさらに高めました。"
        },
        {
          "type": "image",
          "src": "images/car/オーリス.png",
          "alt": "オーリス"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "世界市場での競争が強まりました。Apple初代iPhone発売。翌年、リーマンショックにより世界金融危機が発生。"
        },
        {
          "type": "image",
          "src": "images/society/iphone.jpg",
          "alt": "初代iPhone"
        }
      ]
    }
  },
  {
    "year": "2010",
    "era": "平成22年",
    "title": "追加シート：2010",
    "visual": "ADD",
    "image": "",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ここに2010年の車紹介を入力してください。"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "ここに2010年の工場の出来事を入力してください。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "ここに2010年の社会の出来事を入力してください。"
        }
      ]
    }
  },
  {
    "year": "2013",
    "era": "平成25年",
    "title": "第2ライン再開・SUV対応",
    "visual": "SUV",
    "image": "images/harrier.jpg",
    "spec1": "SUV",
    "spec2": "第2ライン",
    "spec3": "多様化",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ハリアー、RAV4など、SUVラインへの対応が進みました。"
        },
        {
          "type": "image",
          "src": "images/car/rav4_.jpg",
          "alt": "RAV4"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "多様なニーズに対応する生産体制を強化しました。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "SUVへの関心が高まりました。翌年、市販型燃料電池車、初代MIRAI発売。"
        },
        {
          "type": "image",
          "src": "images/car/22956_2.jpg",
          "alt": "MIRAI"
        }
      ]
    }
  },
  {
    "year": "2019",
    "era": "令和1年",
    "title": "追加シート：2019",
    "visual": "ADD",
    "image": "",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ここに2019年の車紹介を入力してください。"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "ここに2019年の工場の出来事を入力してください。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "ここに2019年の社会の出来事を入力してください。"
        }
      ]
    }
  },
  {
    "year": "2022",
    "era": "令和4年",
    "title": "追加シート：2022",
    "visual": "ADD",
    "image": "",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "ここに2022年の車紹介を入力してください。"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "ここに2022年の工場の出来事を入力してください。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "ここに2022年の社会の出来事を入力してください。"
        }
      ]
    }
  },
  {
    "year": "2026",
    "era": "令和8年",
    "title": "高岡工場60周年",
    "visual": "60TH",
    "image": "images/bzr4.jpg",
    "spec1": "60周年",
    "spec2": "未来",
    "spec3": "DX",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "60年の歩みを振り返り、次の時代の車づくりへつなげます。"
        },
        {
          "type": "image",
          "src": "images/RAV42.jpg",
          "alt": "RAV4"
        }
      ],
      "plant": [
        {
          "type": "text",
          "text": "これまでの改善・品質・生産技術の積み重ねを未来へつなげます。高岡工場60周年。1ラインbZ4X、C-HR+の生産開始、新型RAV4オールHV化。"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "デジタル化や環境対応など、新しい価値づくりが求められています。TOYOTA RACINGは、液体水素を燃料とする「TR LH2 Racing Prototype」の一般公開デモンストレーション走行を実施。"
        },
        {
          "type": "image",
          "src": "images/society/85562.jpg",
          "alt": "水素レーシング"
        }
      ]
    }
  }
];

const timelineFrame = document.getElementById("timelineFrame");
const timelineTrack = document.getElementById("timelineTrack");
const selectedYear = document.getElementById("selectedYear");
const selectedEra = document.getElementById("selectedEra");
const selectedTitle = document.getElementById("selectedTitle");
const mainPhoto = document.getElementById("mainPhoto");
const photoLink = document.getElementById("photoLink");
const visualTitle = document.getElementById("visualTitle");
const carContent = document.getElementById("carContent");
const factoryContent = document.getElementById("factoryContent");
const societyContent = document.getElementById("societyContent");
const speedButtons = document.querySelectorAll(".speed-button");
const editorTarget = document.getElementById("editorTarget");
const editorImages = document.getElementById("editorImages");
const editorText = document.getElementById("editorText");
const addEditorText = document.getElementById("addEditorText");
const clearEditorAdditions = document.getElementById("clearEditorAdditions");
const editorYearLabel = document.getElementById("editorYearLabel");

const sectionConfig = {
  car: {
    container: carContent,
    emptyText: "車紹介の文章または写真を追加してください。"
  },
  plant: {
    container: factoryContent,
    emptyText: "工場の出来事の文章または写真を追加してください。"
  },
  society: {
    container: societyContent,
    emptyText: "社会の出来事の文章または写真を追加してください。"
  }
};

let offset = 0;
let paused = false;
let activeIndex = 0;
let localAdditions = loadLocalAdditions();

const speedMap = {
  verySlow: 0.1,
  slow: 0.18,
  normal: 0.38
};
let speed = speedMap.normal;

function loadLocalAdditions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    console.warn("一時追加データを読み込めませんでした。", error);
    return {};
  }
}

function saveLocalAdditions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localAdditions));
    return true;
  } catch (error) {
    console.warn("画像データが大きいため、ブラウザ内に保存できませんでした。", error);
    return false;
  }
}

function getCurrentItem() {
  return timelineData[activeIndex];
}

function normalizeSectionKey(sectionKey) {
  if (sectionKey === "car1") return "car";
  if (sectionKey === "car2") return "plant";
  if (sectionKey === "Plant") return "society";
  return sectionKey;
}

function getEditorSectionKey() {
  const selectedOption = editorTarget.options[editorTarget.selectedIndex];
  const labelText = selectedOption ? selectedOption.textContent : "";

  if (labelText.includes("車")) return "car";
  if (labelText.includes("工場")) return "plant";
  if (labelText.includes("社会")) return "society";

  return normalizeSectionKey(editorTarget.value);
}

function getSectionAliases(sectionKey) {
  const normalizedKey = normalizeSectionKey(sectionKey);

  if (normalizedKey === "car") {
    return ["car", "car1"];
  }

  if (normalizedKey === "plant") {
    return ["plant", "car2"];
  }

  if (normalizedKey === "society") {
    return ["society", "Plant"];
  }

  return [normalizedKey];
}

function getBaseBlocks(item, sectionKey) {
  if (!item.content) return [];

  return getSectionAliases(sectionKey).flatMap(function(key) {
    if (Array.isArray(item.content[key])) {
      return item.content[key];
    }
    return [];
  });
}

function getLocalBlocks(item, sectionKey) {
  const yearKey = String(item.year);
  if (!localAdditions[yearKey]) return [];

  return getSectionAliases(sectionKey).flatMap(function(key) {
    if (Array.isArray(localAdditions[yearKey][key])) {
      return localAdditions[yearKey][key];
    }
    return [];
  });
}

function getMergedBlocks(item, sectionKey) {
  return [
    ...getBaseBlocks(item, sectionKey),
    ...getLocalBlocks(item, sectionKey)
  ];
}

function countImages(blocks) {
  return blocks.filter(function(block) {
    return block && block.type === "image";
  }).length;
}

function ensureLocalSection(year, sectionKey) {
  const yearKey = String(year);
  if (!localAdditions[yearKey]) {
    localAdditions[yearKey] = {};
  }
  if (!Array.isArray(localAdditions[yearKey][sectionKey])) {
    localAdditions[yearKey][sectionKey] = [];
  }
  return localAdditions[yearKey][sectionKey];
}

function makeTextBlock(text) {
  const paragraph = document.createElement("p");
  paragraph.className = "content-text";
  paragraph.textContent = text || "";
  return paragraph;
}

function makeImageBlock(block) {
  const figure = document.createElement("figure");
  figure.className = "image-block";

  const image = document.createElement("img");
  image.className = "info-photo";
  image.src = block.src;
  image.alt = block.alt || "";
  image.loading = "lazy";

  image.addEventListener("error", function() {
    figure.classList.add("image-missing");
    figure.textContent = "画像が見つかりません: " + block.src;
  });

  figure.appendChild(image);

  if (block.caption) {
    const caption = document.createElement("figcaption");
    caption.textContent = block.caption;
    figure.appendChild(caption);
  }

  return figure;
}

function renderContent(sectionKey, item) {
  const config = sectionConfig[sectionKey];
  const container = config.container;
  const blocks = getMergedBlocks(item, sectionKey);
  let renderedImageCount = 0;

  container.innerHTML = "";

  blocks.forEach(function(block) {
    if (!block) return;

    const blockType = block.type || (block.src ? "image" : block.text ? "text" : "");

    if (blockType === "text") {
      if (block.text && block.text.trim() !== "") {
        container.appendChild(makeTextBlock(block.text));
      }
      return;
    }

    if (blockType === "image") {
      if (!block.src || renderedImageCount >= MAX_IMAGES_PER_SECTION) return;
      renderedImageCount += 1;
      container.appendChild(makeImageBlock(block));

      if (block.text && block.text.trim() !== "") {
        container.appendChild(makeTextBlock(block.text));
      }
    }
  });

  if (container.children.length === 0) {
    const empty = document.createElement("p");
    empty.className = "content-text empty-content";
    empty.textContent = config.emptyText;
    container.appendChild(empty);
  }
}

function setMainPhoto(item) {
  if (item.image) {
    mainPhoto.src = item.image;
    mainPhoto.alt = item.year + " " + item.title;
    mainPhoto.hidden = false;
    photoLink.classList.remove("empty");
    photoLink.dataset.placeholder = "";
  } else {
    mainPhoto.removeAttribute("src");
    mainPhoto.alt = "";
    mainPhoto.hidden = true;
    photoLink.classList.add("empty");
    photoLink.dataset.placeholder = item.year + "年のメイン写真を追加してください";
  }
}

function updateEditorYear(item) {
  if (editorYearLabel) {
    editorYearLabel.textContent = item.year + "年に追加";
  }
}

function showData(index) {
  const item = timelineData[index];
  if (!item) return;

  selectedYear.textContent = item.year;
  selectedEra.textContent = item.era;
  selectedTitle.textContent = item.title;
  visualTitle.textContent = item.visual;

  setMainPhoto(item);
  renderContent("car", item);
  renderContent("plant", item);
  renderContent("society", item);


  updateEditorYear(item);

  document.querySelectorAll(".year-node").forEach(function(node) {
    node.classList.toggle("active", Number(node.dataset.index) === index);
  });
}

function createNode(item, index, loopIndex) {
  const button = document.createElement("button");
  button.className = "year-node";
  button.type = "button";
  button.dataset.index = index;
  button.dataset.loop = loopIndex;

  const era = document.createElement("span");
  era.className = "era";
  era.textContent = item.era || "";

  const wheel = document.createElement("span");
  wheel.className = "wheel";

  const year = document.createElement("strong");
  year.textContent = item.year || "";
  wheel.appendChild(year);

  const nodePhoto = document.createElement("span");
  nodePhoto.className = "node-photo";

  if (item.image) {
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.year || "";
    image.addEventListener("error", function() {
      nodePhoto.classList.add("empty");
      nodePhoto.textContent = "NO IMAGE";
    });
    nodePhoto.appendChild(image);
  } else {
    nodePhoto.classList.add("empty");
    nodePhoto.textContent = "NO IMAGE";
  }

  button.appendChild(era);
  button.appendChild(wheel);
  button.appendChild(nodePhoto);

  button.addEventListener("click", function() {
    activeIndex = index;
    showData(index);
    centerElement(button);
  });

  return button;
}

function buildTimeline() {
  timelineTrack.innerHTML = "";

  for (let loop = 0; loop < LOOP_COUNT; loop += 1) {
    timelineData.forEach(function(item, index) {
      timelineTrack.appendChild(createNode(item, index, loop));
    });
  }

  showData(0);
}

function centerElement(element) {
  const frameCenter = timelineFrame.clientWidth / 2;
  const nodeCenter = element.offsetLeft + element.offsetWidth / 2;
  offset = frameCenter - nodeCenter;
  timelineTrack.style.transform = "translateX(" + offset + "px)";
}

function centerNode(index) {
  const nodes = Array.from(document.querySelectorAll(".year-node"));
  const target =
    nodes.find(function(node) {
      return Number(node.dataset.index) === index && Number(node.dataset.loop) === 1;
    }) ||
    nodes.find(function(node) {
      return Number(node.dataset.index) === index;
    });

  if (target) {
    centerElement(target);
  }
}

function updateSelectedByCenter() {
  const frameRect = timelineFrame.getBoundingClientRect();
  const centerX = frameRect.left + frameRect.width / 2;
  const nodes = Array.from(document.querySelectorAll(".year-node"));
  let nearestNode = null;
  let nearestDistance = Infinity;

  nodes.forEach(function(node) {
    const rect = node.getBoundingClientRect();
    const nodeCenter = rect.left + rect.width / 2;
    const distance = Math.abs(centerX - nodeCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestNode = node;
    }
  });

  if (!nearestNode) return;

  const newIndex = Number(nearestNode.dataset.index);
  if (newIndex !== activeIndex) {
    activeIndex = newIndex;
    showData(activeIndex);
  }
}

function keepEndlessLoop() {
  const oneSetWidth = timelineTrack.scrollWidth / LOOP_COUNT;
  if (!oneSetWidth) return;

  if (offset <= -oneSetWidth * 2) {
    offset += oneSetWidth;
  }

  if (offset >= 0) {
    offset -= oneSetWidth;
  }
}

function animate() {
  if (!paused) {
    offset -= speed;
    keepEndlessLoop();
    timelineTrack.style.transform = "translateX(" + offset + "px)";
    updateSelectedByCenter();
  }

  requestAnimationFrame(animate);
}

function addTextToCurrentYear() {
  const item = getCurrentItem();
  const text = editorText.value.trim();
  const sectionKey = getEditorSectionKey();

  if (!text) {
    alert("追加する文章を入力してください。");
    return;
  }

  ensureLocalSection(item.year, sectionKey).push({
    type: "text",
    text: text
  });

  saveLocalAdditions();
  editorText.value = "";
  showData(activeIndex);
}

function readFileAsDataURL(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();

    reader.addEventListener("load", function() {
      resolve(reader.result);
    });

    reader.addEventListener("error", function() {
      reject(reader.error);
    });

    reader.readAsDataURL(file);
  });
}

async function addImagesToCurrentYear(files) {
  const item = getCurrentItem();
  const sectionKey = getEditorSectionKey();
  const fileList = Array.from(files || []);

  if (fileList.length === 0) return;

  const currentImageCount = countImages(getMergedBlocks(item, sectionKey));
  const remaining = MAX_IMAGES_PER_SECTION - currentImageCount;

  if (remaining <= 0) {
    alert("このコンテナは画像が最大3枚です。不要な画像をJSから削除するか、一時追加をリセットしてください。");
    editorImages.value = "";
    return;
  }

  const targetFiles = fileList.slice(0, remaining);
  const localSection = ensureLocalSection(item.year, sectionKey);

  for (const file of targetFiles) {
    const dataURL = await readFileAsDataURL(file);
    localSection.push({
      type: "image",
      src: dataURL,
      alt: file.name,
      caption: file.name
    });
  }

  const saved = saveLocalAdditions();
  editorImages.value = "";
  showData(activeIndex);

  if (!saved) {
    alert("画像が大きいため、ブラウザ保存できませんでした。表示はされていますが、再読み込み後に消える場合があります。正式保存は images フォルダへ入れて script.js にパスを追加してください。");
  }

  if (fileList.length > targetFiles.length) {
    alert("最大3枚までのため、入りきらない画像は追加していません。");
  }
}

function clearCurrentLocalAdditions() {
  const item = getCurrentItem();
  const yearKey = String(item.year);

  if (!localAdditions[yearKey]) {
    alert("この年代には一時追加データがありません。");
    return;
  }

  const ok = confirm(item.year + "年の一時追加データを削除しますか？");
  if (!ok) return;

  delete localAdditions[yearKey];
  saveLocalAdditions();
  showData(activeIndex);
}

timelineFrame.addEventListener("mouseenter", function() {
  paused = true;
});

timelineFrame.addEventListener("mouseleave", function() {
  paused = false;
});

speedButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const nextSpeed = button.dataset.speed;
    speed = speedMap[nextSpeed] || speedMap.normal;

    speedButtons.forEach(function(item) {
      item.classList.toggle("active", item === button);
    });
  });
});

photoLink.addEventListener("click", function() {
  const item = getCurrentItem();

  if (item.image) {
    window.open(item.image, "_blank");
  } else {
    alert(item.year + "年のメイン写真は未設定です。script.js の image に画像パスを入れてください。");
  }
});

editorImages.addEventListener("change", function(event) {
  addImagesToCurrentYear(event.target.files).catch(function(error) {
    console.error(error);
    alert("画像の追加に失敗しました。");
  });
});

addEditorText.addEventListener("click", addTextToCurrentYear);
clearEditorAdditions.addEventListener("click", clearCurrentLocalAdditions);

window.addEventListener("resize", function() {
  centerNode(activeIndex);
});

buildTimeline();
centerNode(0);
animate();
