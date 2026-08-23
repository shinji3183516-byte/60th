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

const MAX_IMAGES_PER_SECTION = Number.POSITIVE_INFINITY;
const LOOP_COUNT = 3;
const STORAGE_KEY = "takaokaTimelineLocalAdditions_v2";

const THEME_STORAGE_KEY = "takaokaTimelineTheme_v1";
const AVAILABLE_THEMES = new Set(["toyota", "blueprint", "anime", "colorful", "healing", "monotone","country",]);

function applyTheme(themeName, persist = true) {
  const safeTheme = AVAILABLE_THEMES.has(themeName) ? themeName : "toyota";
  const stylesheet = document.getElementById("themeStylesheet");
  if (stylesheet) stylesheet.href = `css/theme-${safeTheme}.css?v=blueprint-v2-2`;
  document.documentElement.dataset.theme = safeTheme;
  document.querySelectorAll("[data-theme]").forEach((button) => {
    const active = button.dataset.theme === safeTheme;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
    } catch (_) {}
  }
}

function initializeThemeSelector() {

  let savedTheme = "toyota";
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "toyota";
  } catch (_) {}
  if (!AVAILABLE_THEMES.has(savedTheme)) {
    savedTheme = "toyota";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, "toyota");
    } catch (_) {}
  }
  applyTheme(savedTheme, false);
  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.theme));
  });
}


// RUN-CAR 年代別背景
let eraBackgrounds = {
  1960: "images/run-bg/run-bg-1960.jpg",
  1970: "images/run-bg/run-bg-1970.jpg",
  1980: "images/run-bg/run-bg-1980.jpg",
  1990: "images/run-bg/run-bg-1990.jpg",
  2000: "images/run-bg/run-bg-2000.jpg",
  2010: "images/run-bg/run-bg-2010.jpg",
  2020: "images/run-bg/run-bg-2020.jpg"
};

let currentDriveBackgroundEra = null;
let activeDriveBackgroundLayer = 0;

// 年代別に年表の上を走る車画像
// 1960年代: corolla-60th / 1970年代: corolla-green / 1980年代: levin
// 1990年代: prius / 2000年代: iQ / 2010年代: hayy / 2020年代: rav4-silver
//
// 【調整ポイント】
// width    : 車画像の大きさ
// top      : 車全体の走行高さ。数字を大きくすると車が下がります。
// lightTop : ヘッドライトだけの高さ。車の top とは別に調整できます。
// stopOffset: 中央線停止位置の横補正。通常は "0px"。車画像の透明余白がある場合だけ調整します。
//            %の数字を大きくするとライトが下がり、小さくすると上がります。
//            Levinは画像の形状が他車と違うため、専用に大きめの値にしています。
let ERA_RUNNER_CARS = [
  {
    from: 1960,
    to: 1969,
    src: "images/run-cars/corolla-60th.png",
    alt: "Corolla 60th",
    width: "clamp(210px, 20vw, 340px)",
    top: "22px",
    lightTop: "48%",
    stopOffset: "0px"
  },
  {
    from: 1970,
    to: 1979,
    src: "images/run-cars/corolla-green.png",
    alt: "Classic Corolla",
    width: "clamp(210px, 20vw, 340px)",
    top: "24px",
    // 1970年カローラ：前回より少し下げ、ライトを車体前端の高さに合わせます。
    // 微調整：高い場合は +18px、低い場合は +10px に戻してください。
    lightTop: "calc(48% + 15px)",
    stopOffset: "0px"
  },
  {
    from: 1980,
    to: 1989,
    src: "images/run-cars/levin.png",
    alt: "Levin",
    width: "clamp(210px, 20vw, 340px)",
    top: "28px",
    lightTop: "64%",
    stopOffset: "0px"
  },
  {
    from: 1990,
    to: 1999,
    src: "images/run-cars/prius.png",
    alt: "Prius",
    width: "clamp(210px, 20vw, 340px)",
    top: "26px",
    lightTop: "48%",
    stopOffset: "0px"
  },
  {
    from: 2000,
    to: 2009,
    src: "images/run-cars/iQ.png",
    alt: "iQ",
    width: "clamp(90px, 8.5vw, 145px)",
    top: "34px",
    lightTop: "48%",
    stopOffset: "0px"
  },
  {
    from: 2010,
    to: 2019,
    src: "images/run-cars/hayy.png",
    alt: "Harrier 60th",
    width: "clamp(190px, 17vw, 290px)",
    top: "24px",
    // hayy：SUVボディでライトが高く見えやすいため、前回よりさらに下げます。
    // 微調整：まだ高い場合は +25px、低い場合は +18px にしてください。
    lightTop: "calc(48% + 22px)",
    stopOffset: "0px"
  },
  {
    from: 2020,
    to: 2026,
    src: "images/run-cars/rav4-silver.png",
    alt: "RAV4 Silver",
    width: "clamp(190px, 17vw, 290px)",
    top: "24px",
    lightTop: "48%",
    stopOffset: "0px"
  }
];

const TOYOTA_MARK_IMAGE = "images/toyotamark.jpg";

let timelineData = [
  {
    "year": "1966",
    "era": "昭和41年",
    "title": "高岡工場完成",
    "visual": "PLANT",
    "image": "images/1960/1966Corolla.jpg",
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
          "src": "images/1960/1966Corolla1.JPG",
          "alt": "カローラ"
        },
        {
          "type":"image",
          "src":"images/1960/123.png",
          "art" :"スペック"
        }
      ],
      "car2": [
        {
          "type":"text",
          "text":"高岡工場と操業",
        },
        {
          "type": "image",
          "src": "images/factory/1号.JPG",
          "alt":"1号車"
        },
        {
          "type": "image",
          "src":"images/factory/img01.jpg",
          "alt": "操業"
        },
      ],
      "Plant": [
        {
          "type": "text",
          "text": "1966年（昭和41年）は、日本の総人口が初めて1億人を突破し、「いざなぎ景気」の幕開けとなった年です。社会現象としては、ザ・ビートルズの来日やミニスカートの流行、出生数が激減した「ひのえうま（丙午）」の年としても広く知られています。",

        },
        {
          "type":"text",
          "text":"ビートルズ初来日",
        },

        {
          "type": "image",
          "src": "images/factory/ビートルズ.png",
          "alt": "著作権フリー画像"
        }
      ]
    }
  },
  {
    "year": "1967",
    "era": "昭和41年",
    "title": "追加シート：1967",
    "visual": "パブリカ生産開始",
    "image": "images/1960/1967CrollaVan.JPG",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
           "text": "1967年 元町工場よりパブリカの生産移管、ミニエースは｢パブリカ｣のコンポーネンツを用いた小型商用車。当初「トラック（低床／高床）」と「パネルバン」のラインナップ 1968年8月に「バン」と乗用車登録の「コーチ（7名乗り）」を追加。エンジンを運転席の下に搭載する、キャブ・オーバー・ザ・エンジン型(いわゆるキャブオーバー)のデザインにして、限られた全長の中で荷台寸法を最長にとり、軽トラックより150kg多い500kgの最大積載量を確保した。" ,   
          
        },
        {
          "type":"image",
          "src" : "images/1960/1967miniace.JPG",
          "alt" :"miniace"
        },
        

      ],
      "plant": [
        {
          "type":"image",
          "src":"images/1960/",
          "alt":"ミニエース"

        },
        {
          "type": "image",
           "src": "images/1960/ミニエーストラック.jpg",
           "alt" : "miniace"
        },
        {
          "type" : "text",
          "text" : "スペック  エンジンは空冷水平対向2気筒OHV800cc・36PS (2U-B)。トランスミッションは4速MTコラムシフト。サスペンションは、フロントがダブルウィッシュボーン/トーションバーの独立式、リヤがリジッドアクスル/リーフスプリング"
        },
       ],
      "society": [
        {
          "type": "image",
           "src": "images/1960/1968miniace.JPG",
           "alt":"miniace"
        },
        {
          "type": "image",
          "src" : "images/1960/カタログエース.jpg",
          "alt" : "ミニエース"
        },
        {
          "type": "text",
          "text" : "パブリカの部品を流用したトヨタ最小のキャブオーバー車として1967年に登場。愛嬌あるデザインと実用性で人気を集め、トラック・バンに加え乗用登録のコーチも展開。空冷2気筒ながら販売は好調で、競合車と互角に戦った。1971年にライトエースへバトンタッチ後も改良されつつ1975年まで生産が続いた。",
          
        },
      ]
    }
  },
  {
    "year": "1969",
    "era": "昭和44年",
    "title": "高岡工場オンライン生産指示",
    "visual": "2代目パブリカ",
    "image": "images/1960/1969p.jpg",
    "spec1": "パブリカ",
    "spec2": "量産",
    "spec3": "大衆車",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "2代目パブリカ発売　1969年4月に発売した2代目。社会環境の変化に合わせて高性能化と上級化を実施。ラインナップは2ドアセダン、2ドアバン、ピックアップ（1969年10月追加）の3種類でコンバーチブルとディタッチャブルトップは継続しなかった。ボデーをひとまわり大きくし、エンジンは、800ccエンジンを残しながら、「カローラ」用の1100c（9月に1200ccに変更）と、それを縮小した1000ccの2種の水冷4気筒エンジンを追加",　
        },


        {
          "type": "image",
          "src": "images/1960/spec.png",
          "alt": "スペック"
        },
      ],
      "plant": [
        {
          "type": "image",
          "src": "images/1960/sheet.jpg",
          "alt": "内装",
        },
        {
          "type":"image",
          "src" :"images/1960/1969-P2.jpg",
          "alt" :"p2"
        },


        {
          "type": "image",
          "src": "images/1960/inpane.jpg",
          "alt": "インパネ"
        },
      ],
      "society": [
        {
          "type": "image",
          "src": "images/1960/pickup.jpg",
          "alt":"トラック"
        },
        {
          "type": "image",
          "src": "images/1960/1969publicaVan.JPG",
          "alt": "Van"
        },
        {
          "type":"image",
          "src":"images/1960/1966オープン.jpg",
          "alt":"open"
        },
      ],
    }
  },
  {
    "year": "1970~1972",
    "era": "昭和45年",
    "title": "追加シート：1970",
    "visual": "2代目カローラ発売",
    "image": "images/1970/1970co.JPG",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "1966年の誕生以来、日本の小型大衆車市場を牽引してきた「カローラ」の2代目。1970年5月のモデルチェンジを機に、「カローラ　スプリンター」は「トヨタ　スプリンター」（販売はカローラ店ではなくオート店）として独立させた。そして新スプリンターのクーペとボデーを共有する、「カローラ　クーペ」を新設した.エンジンは当初、前代から引き継いだ直列4気筒OHV1200cc（3K）でスタートし、モデルライフ中にT系エンジン（OHV1400cc、1600cc、DOHC1600cc）を加え、最終的にはカローラ系として3種類6仕様のエンジンを用意した。その他の機構も先代から受け継ぐが、フロント・サスペンションからは横置リーフスプリングを使わない、一般的なマクファーソンストラット式とした。"
        }
      ],
      "plant": [
        {
          "type": "image",
          "src": "images/1970/sedan.jpg",
          "alt" :"クーペ"
        },
        {
          "type": "image",
          "src" :"images/1970/darkblue.jpg",
          "alt" : "バン"
        },
        {
          "type": "image",
          "src" :"images/1970/sedan.jpg",
          "alt": "スプリンター"
        },



      ],
      "society": [
        {
          "type": "image",
          "src": "images/1970/カリーナHT.JPG",
          "alt":"カリーナ"
        },
        {
          "type":"image",
          "src":"images/1970/2000gt_1977.jpg",
          "alt":"カリーナ",
        },
        {
          "type":"image",
          "src" :"images/1970/interior_small.jpg",
          "alt":"内装"
        },
      ]
    }
  },
  {
    "year": "1975~",
    "era": "昭和50年",
    "title": "1000湖ラリー",
    "visual": "3代目カローラ",
    "image": "images/1970/1975ラリー.jpg",
    "SPEC1":  "",
    "spec1": "",
    "spec2": "効率化",
    "spec3": "海外支援",
    "content": {
      "car": [
        {
          "type": "image",
          "src": "images/1970/78コルサ.JPG",
          "alt": "コルサ"
        },
        {
          "type": "image",
          "src": "images/1970/78コルサクーペ.jpg",
          "alt": "コルサ"
        },
        {
          "type":"image",
          "src" :"images/1970/79クーペ.jpg",
          "alt" :"HT"
        },
      ],
      "plant": [
        {
          "type": "image",
          "src": "images/1970/78.jpg",
          "alt": "wagon"
        },
        {
          "type": "image",
          "src": "images/1970/79カローラ.jpg",
          "alt": "1000万台"
        },
        {
          "type":"image",
          "src": "images/1970/1979カローラ.jpg",
          "alt": "カローラ"
        }
      ],
      "society": [
        {
          "type": "image",
          "src": "images/1970/cb8.jpg",
          "alt":"ラリー"
        },
        {
          "type": "image",
          "src": "images/1970/Rally75.jpg",
          "alt": "ラリー"
        },
        {
          "type":"image",
          "src":"images/1970/1974トレノ.jpg",
          "alt":"トレノ"
        },
      ],
    }
  },
  {
    "year": "1982",
    "era": "昭和57年",
    "title": "追加シート：1,000万台",
    "visual": "カローラが販売の中心",
    "image": "images/1980/10000000.jpg",
    "spec1": "追加枠",
    "spec2": "写真追加",
    "spec3": "編集用",
    "content": {
      "car": [
        {
          "type": "image",
          "src": "images/1980/レビン.jpg",
          "alt": "Levin"
        },
        {
          "type":"image",
          "src": "images/1980/トレノ.jpg",
          "alt":"トレノ"
        },
        {
          "type":"image",
          "src":"images/1980/4AG.jpg",
          "alt":"4AG"
        },
      ],
      "plant": [
        {
          "type": "image",
          "src": "images/1980/1984カローラFX.jpg",
          "alt": "FX"
        },
        {
          "type":"image",
          "src" :"images/1980/1982コルサ.jpg",
          "alt":"コルサ"
        },
        {
          "type":"image",
          "src": "images/1980/1982カローラワゴン.jpg",
          "alt":"wagon"
        },
      ],
      "society": [
        {
          "type": "image",
          "src": "images/1980/1982スプリンター.jpg",
          "alt":"スプリンター"
        },
        {
          "type":"image",
          "src" :"images/1980/1982コルサハッチバック.jpg",
          "alt" :"コルサ"
        },
        {
          "type":"image",
          "src" :"images/1980/1987カローラSD.jpg",
          "alt": "カローラ"
        },
      ],
    }
  },
  {
    "year": "1987",
    "era": "昭和62年",
    "title": "フレキシブルボデーライン",
    "visual": "4WD",
    "image": "images/1980/1987カローラレビン.jpg",
    "spec1": "HV",
    "spec2": "環境技術",
    "spec3": "新時代",
    "content": {
      "car": [
        {
          "type": "text",
          "text": "「カローラ」「スプリンター」ラインオフに伴い、ボデー工程にFBL（フレキシブルボデーライン）導入",
        },
        {
          "type": "image",
          "src": "images/1980/1982carib.jpg",
          "alt": "カリブ"
        },
        {
          "type":"image",
          "src":"images/1980/1987カロ.jpg",
          "alt":"sedan"

        },
      ],
      "plant": [
        {
          "type": "image",
          "src": "images/1980/87トレノ.jpg",
          "alt": "FFレビン"
        },
        {
          "type":"image",
          "src" :"images/1980/1987カローラワゴン.jpg",
          "alt":"wagon"
        
        },
        {
          "type":"image",
          "src":"images/1980/1987スプリンター.jpg",
        },
      ],
      "society": [
        {
          "type": "image",
          "src": "images/1980/1987FX.jpg",
          "alt":"FX"
        },
        {
          "type": "image",
          "src": "images/1980/1986コルサハッチバック.jpg",
          "alt": "コルサ"
        },
       {
        "type":"image",
        "src":"images/1980/1987シエロ.jpg",
        "alt":"シエロ"
       }
      ],
    }
  }, 
  {
    "year": "1991",
    "era": "平成3年",
    "title": "7代目カローラ",
    "visual": "カローラ",
    "image": "images/1990/1991カローラ.jpg",
    "spec1": "コンパクト",
    "spec2": "多車種",
    "spec3": "実用性",
    "content": {
      "car": [
        {
          "type": "image",
          "src": "images/1990/1991サイノス.jpg",
          "alt":"サイノス"
        },
        {
          "type": "image",
          "src": "images/1990/1990バン.jpg",
          "alt": "カローラ"
        },
        {
          "type":"image",
          "src":"images/1990/wagon.jpg",
          "alt":"wagon"
        },
      ],
      "plant": [
        {
          "type": "image",
          "src": "images/1990/1991スプリンター.jpg",
          "alt":"スプリンター"
        },
        {
          "type":"image",
          "src":"images/1990/1992カローラセレス.jpg",
          "alt":"セレス"
        },
        {
          "type":"image",
          "src":"images/1990/1990コルサハッチバック.jpg",
          "alt":"コルサ"
        }
      ],
      "society": [
        {
          "type": "text",
          "text": "1991年6月に発売した7代目。ホイールベース・全長・全幅・全高ともに拡大、ボデーデザインのボリューム感を増すことで、さらに高級感を増した。1966年の誕生以来、高級化路線を進んできて頂点に達したモデルであり、あらゆる面にわたって高品質な大衆車となった。ワゴンとバンは約3カ月遅れてモデルチェンジした。"
        },
        {
          "type": "image",
          "src": "images/1990/fx111.jpg",
          "alt": "FX"
        },
      ]
    }
  },
  {
    "year": "1999",
    "era": "平成11年",
    "title": "Vitz",
    "visual": "Vitz Fun Cargo ",
    "image": "images/1990/1999ヴィッツ.JPG",
    "spec1": "2,000万台",
    "spec2": "高効率",
    "spec3": "品質強化",
    "content": {
      "car": [
        {
          "type": "image",
          "src": "images/1990/1998対米.jpg",
          "alt": "アメリカ"
        },
        {
          "type": "image",
          "src": "images/1990/1999ファンカーゴ.JPG",
          "alt": "ファンカーゴ"
        },
        {
          "type":"image",
          "src":"images/1990/1999プラッツ.JPG",
          "alt":"プラッツ"
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
    "year": "2000~",
    "era": "平成12年",
    "title": "追加シート：2006",
    "visual": "",
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
let excelTimelineData = [];

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
const pauseButton = document.getElementById("pauseButton");
const playButton = document.getElementById("playButton");
const prevPageButton = document.getElementById("prevPageButton");
const nextPageButton = document.getElementById("nextPageButton");
const editorTarget = document.getElementById("editorTarget");
const editorImages = document.getElementById("editorImages");
const editorText = document.getElementById("editorText");
const addEditorText = document.getElementById("addEditorText");
const clearEditorAdditions = document.getElementById("clearEditorAdditions");
const editorYearLabel = document.getElementById("editorYearLabel");
const cycleRemainingSeconds = document.getElementById("cycleRemainingSeconds");

// SELECTED YEAR の年度色：移動中は白、下段4コンテナ停止時はゴールド。
function setSelectedYearStopped(isStopped) {
  const stopped = Boolean(isStopped);

  if (selectedYear) {
    selectedYear.classList.toggle("year-stopped", stopped);
  }

  // ヘッダー下のセンター年表カードも停止状態に連動させます。
  // 停止中のみ年度・年号をゴールドにし、外周のゴールド光は維持します。
  document.body.classList.toggle("timeline-year-stopped", stopped);
}

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
let manualPaused = false;
let hoverPaused = false;
let activeIndex = 0;
let localAdditions = loadLocalAdditions();
let allCarsParadeRunning = false;
let centerHoldUntil = 0;
const HOLD_TIME_MS_BY_SPEED = {
  verySlow: 20000,
  slow: 17500,
  normal: 15000
};
const LOOP_RESET_HOLD_MS = 6600;

const speedMap = {
  verySlow: 0.1,
  slow: 0.14,
  normal: 0.18
};
let speed = speedMap.normal;
let currentSpeedMode = "normal";

function getCenterHoldMs() {
  return HOLD_TIME_MS_BY_SPEED[currentSpeedMode] || HOLD_TIME_MS_BY_SPEED.normal;
}

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
  return excelTimelineData[activeIndex];
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

function makeTitleBlock(text) {
  const title = document.createElement("h3");
  title.className = "content-block-title";
  title.textContent = text || "";
  title.style.margin = "0.35em 0 0.25em";
  title.style.fontSize = "1.08em";
  title.style.fontWeight = "700";
  title.style.lineHeight = "1.35";
  return title;
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

    if (blockType === "title") {
      if (block.text && block.text.trim() !== "") {
        container.appendChild(makeTitleBlock(block.text));
      }
      return;
    }

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

const lowerSlideState = {
  running: false,
  pendingIndex: null,
  phaseDuration: 1400
};

// 選択カードは進行方向側から中央線を越えず、少し手前で停止します。
// 年表カードの停止基準。
// 選択カードの「左端」を中央線に合わせる（以前の見え方）。
const YEAR_CARD_LINE_GAP_PX = 0;

/*
  年表カードが「隣の年との中間点」から中央線へ到着する時間に、
  下段4コンテナの退出＋入場が完了するよう同期します。
  2段階（退出／入場）なので、到着までの時間を半分ずつ使用します。
*/
function getSynchronizedSlidePhaseDuration() {
  const nodes = Array.from(document.querySelectorAll(
    '.year-node[data-loop="1"]'
  ));

  let nodeStep = 140;
  if (nodes.length >= 2) {
    const measured = Math.abs(nodes[1].offsetLeft - nodes[0].offsetLeft);
    if (measured > 0) nodeStep = measured;
  }

  const pixelsPerSecond = Math.max(speed * 60, 1);
  const boundaryToCenterMs = (nodeStep / 2 / pixelsPerSecond) * 1000;
  const phaseMs = boundaryToCenterMs / 2;

  // 極端に速い・遅い切替を防ぎ、展示として自然な範囲に限定します。
  return Math.round(Math.min(5800, Math.max(900, phaseMs)));
}

const presentationFallbackImages = [
  "images/run-cars/corolla-60th.png",
  "images/run-cars/corolla-green.png",
  "images/run-cars/levin.png",
  "images/run-cars/prius.png",
  "images/run-cars/hayy.png"
];

function getPresentationFallback(index) {
  return presentationFallbackImages[index % presentationFallbackImages.length];
}

function applyData(index, options) {
  options = options || {};
  const item = excelTimelineData[index];
  if (!item) return;

  selectedYear.textContent = item.year;
  selectedEra.textContent = item.era;
  selectedTitle.textContent = item.title;
  if (visualTitle) visualTitle.textContent = item.visual;
  if (!options.skipDrive) updateDriveStage(item);

  setMainPhoto(item);
  mainPhoto.addEventListener("error", function fallbackOnce() {
    mainPhoto.removeEventListener("error", fallbackOnce);
    mainPhoto.src = getPresentationFallback(index);
    mainPhoto.alt = item.year + " プレゼン用車両画像";
  });

  renderContent("car", item);
  renderContent("plant", item);
  renderContent("society", item);

  updateEditorYear(item);
  rotateLuxuryPanel();

  if (!options.skipActive) {
    document.querySelectorAll(".year-node").forEach(function(node) {
      node.classList.toggle("active", Number(node.dataset.index) === index);
    });
  }
}

function showData(index, immediate) {
  // 直接選択・初期表示では、表示内容が確定しているためゴールドにします。
  setSelectedYearStopped(true);

  const card = document.querySelector(".main-card");
  if (card) {
    card.classList.remove("slide-out-to-left", "slide-in-from-right", "slide-in-active");
    card.style.removeProperty("transform");
    card.style.removeProperty("opacity");
    card.style.removeProperty("filter");
    card.dataset.slideReady = "true";
  }
  applyData(index);
}

const continuousLowerSlide = {
  running: false,
  fromIndex: 0,
  toIndex: 0,
  direction: 1,
  startOffset: 0,
  distance: 1,
  startTime: 0,
  duration: 1,
  outgoing: null
};

function getNodeStep() {
  const nodes = Array.from(timelineTrack.querySelectorAll('.year-node[data-loop="1"]'));
  if (nodes.length > 1) {
    const measured = Math.abs(nodes[1].offsetLeft - nodes[0].offsetLeft);
    if (measured > 0) return measured;
  }
  return 140;
}

function prepareContinuousLowerSlide(direction, startTime) {
  if (continuousLowerSlide.running) return;

  // 年表と下段4コンテナが動き始める瞬間に年度を白へ戻します。
  setSelectedYearStopped(false);

  const card = document.querySelector(".main-card");
  const page = document.querySelector(".page");
  if (!card || !page) return;

  const nextIndex =
    (activeIndex + direction + timelineData.length) % timelineData.length;

  const outgoing = card.cloneNode(true);
  outgoing.removeAttribute("id");
  outgoing.querySelectorAll("[id]").forEach(function(element) {
    element.removeAttribute("id");
  });
  outgoing.classList.add("lower-slide-snapshot");
  outgoing.setAttribute("aria-hidden", "true");
  outgoing.style.top = card.offsetTop + "px";
  outgoing.style.left = card.offsetLeft + "px";
  outgoing.style.width = card.offsetWidth + "px";
  outgoing.style.height = card.offsetHeight + "px";
  page.appendChild(outgoing);

  applyData(nextIndex, { skipDrive: true, skipActive: true });

  card.classList.add("lower-slide-live");
  card.style.transform = "translateX(" + (direction * 100) + "%)";
  card.style.opacity = "1";
  card.style.filter = "none";

  continuousLowerSlide.running = true;
  continuousLowerSlide.fromIndex = activeIndex;
  continuousLowerSlide.toIndex = nextIndex;
  continuousLowerSlide.direction = direction;
  continuousLowerSlide.startOffset = offset;
  continuousLowerSlide.distance = getNodeStep();
  continuousLowerSlide.startTime = Number.isFinite(startTime) ? startTime : performance.now();
  continuousLowerSlide.duration = 7000;
  continuousLowerSlide.outgoing = outgoing;
}

function updateContinuousLowerSlide(currentTime) {
  if (!continuousLowerSlide.running) return false;

  const card = document.querySelector(".main-card");
  const outgoing = continuousLowerSlide.outgoing;
  if (!card || !outgoing) return false;

  // 上段と完全同期：同じ開始時刻・同じ所要時間・同じ進行率を使用します。
  const now = Number.isFinite(currentTime) ? currentTime : performance.now();
  const elapsed = Math.max(0, now - continuousLowerSlide.startTime);
  const progress = upperCardMove.running
    ? upperCardMove.progress
    : Math.min(1, elapsed / continuousLowerSlide.duration);
  const direction = continuousLowerSlide.direction;

  outgoing.style.transform =
    "translateX(" + (-direction * progress * 100) + "%)";
  card.style.transform =
    "translateX(" + (direction * (1 - progress) * 100) + "%)";

  if (progress < 1) return false;

  outgoing.remove();
  card.classList.remove("lower-slide-live");
  card.style.removeProperty("transform");
  card.style.removeProperty("opacity");
  card.style.removeProperty("filter");

  // 上段が停止位置へ到着する同じフレームで、下段も定位置へ到着します。
  continuousLowerSlide.running = false;
  continuousLowerSlide.outgoing = null;

  // 下段4コンテナが停止位置に到着した瞬間、年度をゴールドへ変更します。
  setSelectedYearStopped(true);

  return true;
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

console.log("年表件数");
console.log(timelineData.length);

console.log("Excel件数");
console.log(excelTimelineData.length);

timelineTrack.innerHTML = "";

  for (let loop = 0; loop < LOOP_COUNT; loop += 1) {
    timelineData.forEach(function(item, index) {
      timelineTrack.appendChild(createNode(item, index, loop));
    });
  }

  // Excel読込後にDOMを作り直した場合も、必ず1966年へ再同期します。
  lockInitialCardToCenter(true);
}

function centerElement(element, direction) {
  const trackMask = timelineTrack.parentElement;
  const maskCenter = trackMask.clientWidth / 2;
  const moveDirection = direction || 1;

  // 以前の停止位置に合わせます。
  // 通常の右→左移動では、選択カードの左端を中央線へ合わせます。
  // 逆方向では、カードの右端を中央線へ合わせます。
  const targetEdge = moveDirection > 0
    ? element.offsetLeft
    : element.offsetLeft + element.offsetWidth;
  const lineGap = moveDirection > 0
    ? YEAR_CARD_LINE_GAP_PX
    : -YEAR_CARD_LINE_GAP_PX;

  offset = maskCenter + lineGap - targetEdge;
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
    centerElement(target, 1);
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
    
    const previousIndex = activeIndex;
    activeIndex = newIndex;
    showData(activeIndex);
   //中央線で年表停止したタイミングでrun-carを走らせる
    runRav4Once();
    const isLoopReset =
      previousIndex === timelineData.length - 1 && newIndex === 0;

    // 通常は少し長めに停止。2026→1966の周回時は、
    // 全車退出と初代カローラ復帰が完了するまで年表を止めます。
    centerHoldUntil = performance.now() +
      (isLoopReset ? LOOP_RESET_HOLD_MS : getCenterHoldMs());

    if (isLoopReset) {
      runAllCarsParade();
    }
  }
}

function getOneSetWidth() {
  const firstLoop0 = timelineTrack.querySelector(
    '.year-node[data-loop="0"][data-index="0"]'
  );
  const firstLoop1 = timelineTrack.querySelector(
    '.year-node[data-loop="1"][data-index="0"]'
  );

  if (!firstLoop0 || !firstLoop1) return 0;

  /*
    scrollWidth ÷ 3 では、カード間のgap分だけ微妙な誤差が出ます。
    先頭カード同士の実際の距離を使うことで、
    2026→1966の切替位置を完全に一致させます。
  */
  return firstLoop1.offsetLeft - firstLoop0.offsetLeft;
}

function keepEndlessLoop() {
  const oneSetWidth = getOneSetWidth();
  if (!oneSetWidth) return;

  const middleFirst = timelineTrack.querySelector(
    '.year-node[data-loop="1"][data-index="0"]'
  );
  if (!middleFirst) return;

  /*
    中央コピーの1966が画面中央に来るoffsetを基準にします。
    右側コピーの1966まで進んだ瞬間に、
    見た目が同じ中央コピーへ1セット分だけ戻します。
    画面上のカード配置は変わらないため、切れ目は見えません。
  */
  const anchorOffset =
    timelineFrame.clientWidth / 2 -
    (middleFirst.offsetLeft + middleFirst.offsetWidth / 2);

  if (offset <= anchorOffset - oneSetWidth) {
    offset += oneSetWidth;
  } else if (offset >= anchorOffset + oneSetWidth) {
    offset -= oneSetWidth;
  }
}

function updatePlayButtons() {
  if (!pauseButton || !playButton) return;

  pauseButton.classList.toggle("active", manualPaused);
  playButton.classList.toggle("active", !manualPaused);
}

function isPaused() {
  return manualPaused || hoverPaused;
}

const upperCardMove = {
  running: false,
  armed: false,
  direction: 1,
  startOffset: 0,
  targetOffset: 0,
  targetIndex: 0,
  startTime: 0,
  duration: 1,
  progress: 0
};

function getExactUpperTarget(direction) {
  const nodes = Array.from(timelineTrack.querySelectorAll(".year-node"));
  if (!nodes.length) return null;

  const trackMask = timelineTrack.parentElement;
  const maskRect = trackMask.getBoundingClientRect();
  const centerX = maskRect.left + maskRect.width / 2;

  // 現在、左端が中央線に最も近いカードを基準にします。
  let currentDomIndex = 0;
  let nearestDistance = Infinity;
  nodes.forEach(function(node, index) {
    const rect = node.getBoundingClientRect();
    const referenceEdge = rect.left;
    const distance = Math.abs(centerX - referenceEdge);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      currentDomIndex = index;
    }
  });

  let targetDomIndex = currentDomIndex + direction;
  if (targetDomIndex < 0) targetDomIndex = nodes.length - 1;
  if (targetDomIndex >= nodes.length) targetDomIndex = 0;

  const target = nodes[targetDomIndex];

  // スクリーンショットで確認した以前の停止位置：
  // 右→左へ進むときは、選択カードの左端を中央線へ一致させます。
  // 左→右へ戻るときは、選択カードの右端を中央線へ一致させます。
  const targetEdge = direction > 0
    ? target.offsetLeft
    : target.offsetLeft + target.offsetWidth;
  const lineGap = direction > 0
    ? YEAR_CARD_LINE_GAP_PX
    : -YEAR_CARD_LINE_GAP_PX;
  const exactOffset =
    trackMask.clientWidth / 2 + lineGap - targetEdge;

  return {
    offset: exactOffset,
    index: Number(target.dataset.index)
  };
}

function beginUpperCardMove(direction, currentTime) {
  if (upperCardMove.running || upperCardMove.armed || continuousLowerSlide.running) return false;

  const exactTarget = getExactUpperTarget(direction);
  if (!exactTarget) return false;

  // 先に下段の新旧コンテナを画面外へ準備します。
  // このフレームでは上下とも動かさず、次のrequestAnimationFrameから同時に開始します。
  prepareContinuousLowerSlide(direction, currentTime);

  upperCardMove.armed = true;
  upperCardMove.direction = direction;
  upperCardMove.startOffset = offset;
  upperCardMove.targetOffset = exactTarget.offset;
  upperCardMove.targetIndex = exactTarget.index;
  upperCardMove.startTime = currentTime;
  upperCardMove.progress = 0;
  return true;
}

function finishUpperCardMove(currentTime) {
  const previousIndex = activeIndex;
  activeIndex = upperCardMove.targetIndex;
  upperCardMove.running = false;
  upperCardMove.armed = false;

  // 上段カードは中央線を越えず、指定した手前位置へ正確にスナップします。
  offset = upperCardMove.targetOffset;
  keepEndlessLoop();
  timelineTrack.style.transform = "translateX(" + offset + "px)";

  document.querySelectorAll(".year-node").forEach(function(node) {
    node.classList.toggle("active", Number(node.dataset.index) === activeIndex);
  });
  updateDriveStage(
      excelTimelineData[activeIndex]
  );
  runRav4Once();

  const isLoopReset =
    previousIndex === timelineData.length - 1 && activeIndex === 0;
  centerHoldUntil = currentTime +
    (isLoopReset ? LOOP_RESET_HOLD_MS : getCenterHoldMs());
  if (isLoopReset) runAllCarsParade();
}

function advanceUpperCard(currentTime) {
  if (!upperCardMove.running) return;

  const elapsed = Math.max(0, currentTime - upperCardMove.startTime);
  const progress = Math.min(1, elapsed / upperCardMove.duration);
  upperCardMove.progress = progress;

  // 上段は開始位置から停止位置までを時間基準で補間します。
  // 下段も同じ開始時刻・同じduration・同じprogressを使うため完全同期します。
  offset = upperCardMove.startOffset +
    (upperCardMove.targetOffset - upperCardMove.startOffset) * progress;
  timelineTrack.style.transform = "translateX(" + offset + "px)";

  if (progress >= 1) {
    finishUpperCardMove(currentTime);
  }
}


function getEstimatedCardMoveMs() {
  // 実際のカード幅＋間隔をDOMから取得し、現在の速度で1カード分の移動時間を求めます。
  const distancePx = Math.max(1, getNodeStep());
  const pixelsPerSecond = Math.max(1, speed * 60);
  return distancePx / pixelsPerSecond * 1000;
}

function getRemainingCycleMs(now) {
  if (!timelineData.length) return 0;

  let remaining = 0;
  let baseIndex = activeIndex;

  if (upperCardMove.running) {
    // 現在進行中の移動は、開始時に確定した実時間をそのまま使用します。
    remaining += Math.max(0, upperCardMove.duration - (now - upperCardMove.startTime));
    baseIndex = upperCardMove.targetIndex;
  } else if (upperCardMove.armed) {
    // 次フレーム開始待ち。予定される1カード分の時間を加えます。
    remaining += getEstimatedCardMoveMs();
    baseIndex = upperCardMove.targetIndex;
  } else {
    // 現在の年代で停止中なら、その残り停止時間を加えます。
    remaining += Math.max(0, centerHoldUntil - now);
  }

  // 最終カードから1966年へ戻る移動中は、その到着が現在サイクルの終了です。
  if ((upperCardMove.running || upperCardMove.armed) && baseIndex === 0) {
    return Math.max(0, remaining);
  }

  const moveMs = getEstimatedCardMoveMs();
  let index = baseIndex;

  // 現在（または移動先）から次の1966年到着まで、実際の登録カード数を数えます。
  // 1966年への到着時点を1サイクル終了とするため、到着後の停止時間は含めません。
  for (let guard = 0; guard < timelineData.length; guard += 1) {
    const nextIndex = (index + 1) % timelineData.length;
    remaining += moveMs;
    if (nextIndex === 0) break;
    remaining += HOLD_TIME_MS_BY_SPEED[currentSpeedMode] || HOLD_TIME_MS_BY_SPEED.normal;
    index = nextIndex;
  }

  return Math.max(0, remaining);
}

let lastCycleTimerSecond = null;
function updateCycleTimer(now) {
  if (!cycleRemainingSeconds) return;
  const seconds = Math.max(0, Math.ceil(getRemainingCycleMs(now) / 1000));
  if (seconds !== lastCycleTimerSecond) {
    cycleRemainingSeconds.textContent = String(seconds);
    cycleRemainingSeconds.parentElement.setAttribute(
      "aria-label",
      "1サイクル残り" + seconds + "秒。登録年代数" + timelineData.length + "件"
    );
    lastCycleTimerSecond = seconds;
  }
}

function animate(currentTime) {
  updateCycleTimer(currentTime);
  const centerHolding = currentTime < centerHoldUntil;

  if (!isPaused()) {
    if (!centerHolding && !upperCardMove.running && !upperCardMove.armed && !continuousLowerSlide.running) {
      beginUpperCardMove(1, currentTime);
    } else if (upperCardMove.armed) {
      // DOM準備の次フレーム。ここを上下共通の本当の開始時刻にします。
      upperCardMove.armed = false;
      upperCardMove.running = true;
      upperCardMove.startTime = currentTime;
      upperCardMove.startOffset = offset;

      // 現在の速度設定から「上段1カード分の実移動時間」を算出します。
      const distancePx = Math.abs(upperCardMove.targetOffset - upperCardMove.startOffset);
      const pixelsPerSecond = Math.max(1, speed * 60);
      upperCardMove.duration = Math.max(1, distancePx / pixelsPerSecond * 1000);

      // 下段は上段と同じ開始時刻・同じ所要時間を使用します。
      continuousLowerSlide.startTime = currentTime;
      continuousLowerSlide.duration = upperCardMove.duration;
    }

    // 同じフレーム・同じcurrentTimeで上下を更新します。
    if (upperCardMove.running) advanceUpperCard(currentTime);
    updateContinuousLowerSlide(currentTime);
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


/* ===== 追加：トヨタマーク復元・RAV4走り抜けアニメーション ===== */
function restoreToyotaMark() {
  const titleArea = document.querySelector(".title-area");
  if (!titleArea) return;

  let mark = titleArea.querySelector(".toyota-mark");

  if (!mark) {
    mark = document.createElement("img");
    mark.className = "toyota-mark";
    mark.alt = "TOYOTA";
    titleArea.insertBefore(mark, titleArea.firstChild);
  }

  mark.src = TOYOTA_MARK_IMAGE;
}

let RUN_CAR_MAX_ACTIVE = 7;
let RUN_CAR_BY_ID = new Map();
let activeExcelRunCars = [];
let runCarSerial = 0;

function normalizeRunFlag(value, fallback = false) {
  return normalizeExcelBoolean(value, fallback);
}

function getRunCarForItem(item) {
  if (!item) return null;
  return item.runnerCar || RUN_CAR_BY_ID.get(String(item.id || "")) || null;
}

function ensureExcelRunnerLayer() {
  const stage = document.getElementById("driveStage");
  if (!stage) return null;

  let layer = stage.querySelector("#excelRunnerLayer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "excelRunnerLayer";
    layer.setAttribute("aria-hidden", "true");
    Object.assign(layer.style, {
      position: "absolute", inset: "0", overflow: "hidden",
      pointerEvents: "none", zIndex: "6"
    });
    stage.appendChild(layer);
  }

  // 旧固定RUN-CARだけを非表示。背景などは残します。
  Array.from(stage.children).forEach((child) => {
    if (child === layer || child.classList.contains("drive-bg")) return;
    const classText = String(child.className || "");
    if (/car|runner/i.test(classText)) child.style.display = "none";
  });

  if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
  return layer;
}

function removeActiveRunCar(entry, animated = true) {
  if (!entry) return;
  const index = activeExcelRunCars.indexOf(entry);
  if (index >= 0) activeExcelRunCars.splice(index, 1);

  if (!entry.element) return;
  if (entry.animation) {
    try { entry.animation.cancel(); } catch (_) {}
  }

  const el = entry.element;
  if (!animated) { el.remove(); return; }

  // 先頭車両は左側へ前進して退出する。
  el.style.transition = "transform 1.15s cubic-bezier(.2,.7,.25,1), opacity .8s";
  el.style.transform = `translateX(${-Math.max(window.innerWidth, 1800)}px)`;
  el.style.opacity = "0";
  window.setTimeout(() => el.remove(), 1250);
}

function chooseRunCarToEvict() {
  // push入替方式：8台目以降を最後尾へ追加する前に、常に先頭車両を押し出す。
  // これにより走行中の2台目が新しい先頭になる。
  return activeExcelRunCars[0] || null;
}

function layoutRunCarQueue() {
  const stage = document.getElementById("driveStage");
  if (!stage) return;
  const width = Math.max(stage.clientWidth, 1200);
  const count = Math.max(1, activeExcelRunCars.length);
  const leftMargin = Math.max(20, width * 0.04);
  const rightMargin = Math.max(80, width * 0.08);
  const usable = Math.max(200, width - leftMargin - rightMargin);
  const step = count > 1 ? usable / Math.max(6, count - 1) : 0;

  activeExcelRunCars.forEach((entry, i) => {
    if (!entry.element) return;
    const x = leftMargin + i * step;
    entry.element.style.transition = "transform 1.0s cubic-bezier(.2,.7,.25,1)";
    entry.element.style.transform = `translateX(${x}px)`;
  });
}

function startRunCarMotion(entry) {
  const stage = document.getElementById("driveStage");
  if (!stage || !entry || !entry.element) return;
  const width = Math.max(stage.clientWidth, 1200);
  const carWidth = entry.config.width || 260;

  // 新しい車だけを右側から左向きに前進させる。
  const startX = width + carWidth + 80;
  entry.element.style.transition = "none";
  entry.element.style.transform = `translateX(${startX}px)`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => layoutRunCarQueue());
  });
}


function getRunCarImageKey(src) {
  return String(src || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/[?#].*$/, "")
    .toLowerCase();
}

function addRunCarToStage(config) {
  if (!config || !config.enabled || !config.src) return;

  const imageKey = getRunCarImageKey(config.src);

  // 同じ画像の車が確認エリアに既にいる場合は追加しない。
  // Excelで別IDに同じ車画像が指定されていても、同一車両を二重表示しません。
  if (activeExcelRunCars.some((entry) =>
    getRunCarImageKey(entry.config.src) === imageKey
  )) {
    return;
  }

  while (activeExcelRunCars.length >= RUN_CAR_MAX_ACTIVE) {
    const evict = chooseRunCarToEvict();
    if (!evict) break;
    removeActiveRunCar(evict, true);
  }

  const layer = ensureExcelRunnerLayer();
  const stage = document.getElementById("driveStage");
  if (!layer || !stage) return;

  const img = document.createElement("img");
  img.src = config.src;
  img.alt = config.alt || "走行車両";
  img.draggable = false;
  img.dataset.runCarId = String(config.id);
  img.dataset.runCarImageKey = imageKey;

  const requestedTop = Math.max(0, Number(config.top ?? 24));
  const requestedWidth = Math.max(80, Number(config.width || 260));

  Object.assign(img.style, {
    position: "absolute",
    left: "0",
    top: "auto",
    bottom: "6px",
    width: "auto",
    height: "auto",
    maxWidth: "none",
    maxHeight: "none",
    objectFit: "contain",
    userSelect: "none",
    willChange: "transform",
    zIndex: String(10 + (runCarSerial % 7)),
    visibility: "hidden"
  });

  layer.appendChild(img);

  const fitInsideRunCarArea = () => {
    const stageHeight = Math.max(80, stage.clientHeight);
    const stageWidth = Math.max(600, stage.clientWidth);
    const naturalWidth = Math.max(1, img.naturalWidth || requestedWidth);
    const naturalHeight = Math.max(1, img.naturalHeight || 1);
    const aspect = naturalWidth / naturalHeight;

    // Excelのサイズ値は「大きさの微調整」としてだけ使い、
    // 画像ファイルごとのキャンバス差で極端な大小にならないよう制限します。
    const sizeScale = Math.min(1.08, Math.max(0.92, requestedWidth / 260));
    const targetHeight = stageHeight * 0.50 * sizeScale;

    // 7台並んでも重なりにくい最大幅。
    const maxWidthPerCar = stageWidth / 7.35;
    const widthFromHeight = targetHeight * aspect;
    const fittedWidth = Math.min(widthFromHeight, maxWidthPerCar);
    const fittedHeight = fittedWidth / aspect;

    // 「走行高さ(px)」は24pxを基準に小さな上下補正として使う。
    // 数字が大きいほど車を下げる既存の意味を維持します。
    const verticalDelta = Math.min(12, Math.max(-12, requestedTop - 24));
    const bottomMargin = Math.min(
      18,
      Math.max(2, 8 - verticalDelta)
    );

    // 最終フェイルセーフ：上下に必ず余白を残す。
    const maxHeight = Math.max(36, stageHeight - bottomMargin - 8);
    const safeHeight = Math.min(fittedHeight, maxHeight);
    const safeWidth = safeHeight * aspect;

    img.style.width = `${Math.max(60, Math.round(safeWidth))}px`;
    img.style.height = `${Math.round(safeHeight)}px`;
    img.style.bottom = `${Math.round(bottomMargin)}px`;
    img.style.visibility = "visible";
  };

  if (img.complete && img.naturalWidth > 0) {
    fitInsideRunCarArea();
  } else {
    img.addEventListener("load", fitInsideRunCarArea, { once: true });
    img.addEventListener("error", () => {
      img.style.visibility = "visible";
    }, { once: true });
  }

  const entry = {
    config,
    element: img,
    animation: null,
    serial: runCarSerial++,
    imageKey
  };

  activeExcelRunCars.push(entry);
  startRunCarMotion(entry);
}

function syncRunCarsForItem(item) {
  if (allCarsParadeRunning) return;
  const config = getRunCarForItem(item);
  if (config && config.enabled) addRunCarToStage(config);
}

function clearAllExcelRunCars(animated = false) {
  const entries = [...activeExcelRunCars];
  entries.forEach((entry) => removeActiveRunCar(entry, animated));
  activeExcelRunCars = [];
}

function getRunnerCarConfigByYear(year) {
  // 「1970~1972」「1975~」のような表記でも先頭の年を取得します。
  const targetYear = parseInt(year, 10);

  if (Number.isNaN(targetYear)) {
    return ERA_RUNNER_CARS[0];
  }

  return ERA_RUNNER_CARS.find(function(car) {
    return targetYear >= car.from && targetYear <= car.to;
  }) || ERA_RUNNER_CARS[ERA_RUNNER_CARS.length - 1];
}

function getCurrentRunnerCarConfig() {
  const item = getCurrentItem();
  const linked = getRunCarForItem(item);
  if (linked) return linked.enabled ? linked : null;
  const year = item ? item.year : timelineData[0].year;
  return getRunnerCarConfigByYear(year);
}

function createRav4Runner() {
  if (!timelineFrame) return;
  if (timelineFrame.querySelector(".rav4-runner")) return;

  const runner = document.createElement("div");
  runner.className = "rav4-runner";
  runner.setAttribute("aria-hidden", "true");

  const light = document.createElement("span");
  light.className = "rav4-speed-light";

  const car = document.createElement("img");
  const initialCar = getCurrentRunnerCarConfig();

  car.src = initialCar ? initialCar.src : "";
  car.alt = initialCar ? initialCar.alt : "";
  car.draggable = false;

  if (initialCar && initialCar.width) {
    runner.style.setProperty("--runner-width", initialCar.width);
  }

  if (initialCar && initialCar.top) {
    runner.style.setProperty("--rav4-top", initialCar.top);
  }

  // ライトの高さは車の高さとは別管理にします。
  // これにより、Levinのように画像形状が違う車でもライト位置だけ単独調整できます。
  if (initialCar && initialCar.lightTop) {
    runner.style.setProperty("--runner-light-top", initialCar.lightTop);
  }

  // 車画像の中心を年表中央線へ合わせます。透明余白がある画像だけ stopOffset で微調整できます。
  runner.style.setProperty("--runner-stop-offset", (initialCar && initialCar.stopOffset) || "0px");

  runner.appendChild(light);
  runner.appendChild(car);
  timelineFrame.appendChild(runner);

  runner.addEventListener("animationend", function() {
    runner.classList.remove("is-running");
  });
}

function runRav4Once() {
  const runner = timelineFrame ? timelineFrame.querySelector(".rav4-runner") : null;
  if (!runner || runner.classList.contains("is-running") || isPaused() || allCarsParadeRunning) return;

  const selectedCar = getCurrentRunnerCarConfig();
  const car = runner.querySelector("img");
  if (!selectedCar) return;

  if (selectedCar && car) {
    car.src = selectedCar.src;
    car.alt = selectedCar.alt || "";

    if (selectedCar.width) {
      runner.style.setProperty("--runner-width", selectedCar.width);
    }

    // 車画像ごとの透明余白・トリミング差を補正し、毎回同じ高さを走らせます。
    runner.style.setProperty("--rav4-top", selectedCar.top || "24px");

    // ヘッドライトだけの高さを単独で反映します。
    // selectedCar.lightTop がない車は、従来どおり 48% を使います。
    runner.style.setProperty("--runner-light-top", selectedCar.lightTop || "48%");

    // 停止時、車画像の中心を年表の中央線へ正確に合わせます。
    runner.style.setProperty("--runner-stop-offset", selectedCar.stopOffset || "0px");
  }

  // 同じアニメーションを確実に再スタートさせます。
  runner.classList.remove("is-running");
  void runner.offsetWidth;
  runner.classList.add("is-running");
}

// 2026年から1966年へ戻る際に、run-car内の全車が一斉に走り抜け、
// 最後に初代カローラだけが右側から戻って先頭位置で停止します。
function runAllCarsParade() {
  const driveStage = document.getElementById("driveStage");
  if (!driveStage || allCarsParadeRunning || isPaused()) return;

  allCarsParadeRunning = true;
  const normalRunner = timelineFrame ? timelineFrame.querySelector(".rav4-runner") : null;
  if (normalRunner) normalRunner.classList.remove("is-running");

  // 現在走っている全車を一斉に加速退出。
  const departing = [...activeExcelRunCars];
  departing.forEach((entry, index) => {
    window.setTimeout(() => removeActiveRunCar(entry, true), index * 90);
  });

  window.setTimeout(function() {
    clearAllExcelRunCars(false);
    allCarsParadeRunning = false;
    const current = getCurrentItem();
    updateDriveStage(current);
  }, Math.min(LOOP_RESET_HOLD_MS - 200, 2600));
}

function scheduleRav4Run() {
  const nextDelay = 7000 + Math.floor(Math.random() * 5000);

  window.setTimeout(function() {
    runRav4Once();
    scheduleRav4Run();
  }, nextDelay);
}

timelineFrame.addEventListener("mouseenter", function() {
  hoverPaused = true;
});

timelineFrame.addEventListener("mouseleave", function() {
  hoverPaused = false;
});

if (pauseButton) {
  pauseButton.addEventListener("click", function() {
    manualPaused = true;
    updatePlayButtons();
  });
}

if (playButton) {
  playButton.addEventListener("click", function() {
    manualPaused = false;
    updatePlayButtons();
  });
}

speedButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const nextSpeed = button.dataset.speed;
    currentSpeedMode = speedMap[nextSpeed] ? nextSpeed : "normal";
    speed = speedMap[currentSpeedMode] || speedMap.normal;

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

// 左上の余分なTOYOTA文字を出さないため、JSでロゴを追加しません。
// restoreToyotaMark();
//buildTimeline();

const INITIAL_1966_HOLD_MS = 30000;
let initial1966Locked = false;

function lockInitialCardToCenter(restartHold = false) {
  // 起動時の状態を完全にリセットし、1966年を基準位置へ固定します。
  upperCardMove.running = false;
  upperCardMove.armed = false;
  upperCardMove.progress = 0;
  continuousLowerSlide.running = false;
  if (continuousLowerSlide.outgoing) {
    continuousLowerSlide.outgoing.remove();
    continuousLowerSlide.outgoing = null;
  }

  activeIndex = 0;
  showData(0, true);
  centerNode(0);

  // 初期配置が終わるまで年表を非表示にし、位置飛びを見せません。
  timelineTrack.style.visibility = "visible";

  if (restartHold || !initial1966Locked) {
    centerHoldUntil = performance.now() + INITIAL_1966_HOLD_MS;
    initial1966Locked = true;
  }
}

function stabilizeInitial1966Position() {
  // Safariではフォント・画像・レイアウト確定時刻がずれるため、
  // 複数回実測して1966年の停止位置を固定します。
  timelineTrack.style.visibility = "hidden";
  [0, 60, 180, 420, 900].forEach(function(delay, index) {
    window.setTimeout(function() {
      lockInitialCardToCenter();
      if (index === 4) timelineTrack.style.visibility = "visible";
    }, delay);
  });
}

requestAnimationFrame(function() {
  stabilizeInitial1966Position();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(stabilizeInitial1966Position);
  }
  window.addEventListener("load", stabilizeInitial1966Position, { once: true });
  createRav4Runner();
  updatePlayButtons();
  animate();
  //scheduleRav4Run();
});


/* ===== 追加：高級感のあるタイトル帯アニメーション ===== */
function rotateLuxuryPanel() {
  const target = document.querySelector(".visual-title-box");
  if (!target) return;

  target.classList.remove("luxury-rotate");

  void target.offsetWidth;

  target.classList.add("luxury-rotate");
}



/* ===== 背景だけ流し、車はコンテナ内で隊列合流 ===== */
function getDriveYearNumber(yearText) {
  const match = String(yearText || "").match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function getDriveBackgroundEra(year) {
  if (year >= 2020) return 2020;
  if (year >= 2010) return 2010;
  if (year >= 2000) return 2000;
  if (year >= 1990) return 1990;
  if (year >= 1980) return 1980;
  if (year >= 1970) return 1970;
  return 1960;
}

function ensureDriveBackgroundLayers() {
  const background = document.querySelector("#driveStage .drive-bg");
  if (!background) return [];

  let layers = Array.from(background.querySelectorAll(".era-bg-layer"));
  if (layers.length === 2) return layers;

  background.replaceChildren();

  layers = [0, 1].map(function(index) {
    const layer = document.createElement("div");
    layer.className = "era-bg-layer era-bg-layer-" + index;
    background.appendChild(layer);
    return layer;
  });

  return layers;
}

function updateDriveBackground(year, immediate) {
  const era = getDriveBackgroundEra(year);
  if (era === currentDriveBackgroundEra) return;

  const layers = ensureDriveBackgroundLayers();
  if (layers.length !== 2) return;

  const nextLayerIndex = currentDriveBackgroundEra === null
    ? activeDriveBackgroundLayer
    : 1 - activeDriveBackgroundLayer;
  const nextLayer = layers[nextLayerIndex];
  const previousLayer = layers[activeDriveBackgroundLayer];

  nextLayer.style.backgroundImage = 'url("' + eraBackgrounds[era] + '")';
  nextLayer.dataset.era = String(era);

  if (immediate || currentDriveBackgroundEra === null) {
    layers.forEach(function(layer, index) {
      layer.classList.toggle("is-visible", index === nextLayerIndex);
    });
  } else {
    nextLayer.classList.add("is-visible");
    previousLayer.classList.remove("is-visible");
  }

  activeDriveBackgroundLayer = nextLayerIndex;
  currentDriveBackgroundEra = era;
}

function updateDriveStage(item) {
  const stage = document.getElementById("driveStage");
  if (!stage || !item) return;

  const year = getDriveYearNumber(item.year);
  updateDriveBackground(year, currentDriveBackgroundEra === null);

  stage.classList.toggle("show-1970", year >= 1970);
  stage.classList.toggle("show-1980", year >= 1980);
  stage.classList.toggle("show-1990", year >= 1990);
  stage.classList.toggle("show-2000", year >= 2000);
  stage.classList.toggle("show-2010", year >= 2010);
  stage.classList.toggle("show-2020", year >= 2020);

  syncRunCarsForItem(item);
}


/* =========================================================
   RUN-CAR 背景横流れ・昼夜サイクル
   - 横流れは速度ボタンに同期
   - 昼夜サイクルは120秒固定
   ========================================================= */
(function syncRunCarBackgroundSpeed() {
  const bgPanDurations = {
    verySlow: "34s",
    slow: "29s",
    normal: "24s"
  };
  const DAY_CYCLE_DURATION = "120s";

  function applyBgSpeed(mode) {
    const stage = document.getElementById("driveStage");
    if (!stage) return;

    const speedMode = bgPanDurations[mode] ? mode : "normal";
    stage.dataset.bgSpeed = speedMode;
    stage.style.setProperty("--run-bg-pan-duration", bgPanDurations[speedMode]);
    stage.style.setProperty("--run-bg-day-duration", DAY_CYCLE_DURATION);
  }

  applyBgSpeed("normal");

  document.querySelectorAll(".speed-button").forEach(function(button) {
    button.addEventListener("click", function() {
      applyBgSpeed(button.dataset.speed || "normal");
    });
  });
})();


/* =========================================================
   RUN-CAR 背景移動 v3：requestAnimationFrame制御
   - 年表停止・centerHoldとは完全に別で動かす
   - CSS animationではなくJSで --run-bg-x を更新
   - 夜は40秒→60秒へ延長
   ========================================================= */
(function runCarBackgroundMotionRAF() {
  const stage = document.getElementById("driveStage");
  if (!stage) return;

  const bgSpeedPxPerSec = {
    // 新しい「普通」は従来の「遅い」と同じ速度。
    verySlow: 24,
    slow: 29,
    normal: 34
  };

  let bgSpeedMode = "normal";
  let bgX = 0;
  let lastTime = null;
  const DAY_MS = 120000;

  function setSpeedMode(mode) {
    bgSpeedMode = bgSpeedPxPerSec[mode] ? mode : "normal";
    stage.dataset.bgSpeed = bgSpeedMode;
  }

  setSpeedMode("normal");

  document.querySelectorAll(".speed-button").forEach(function(button) {
    button.addEventListener("click", function() {
      setSpeedMode(button.dataset.speed || "normal");
    });
  });

  function getDayFilter(era, now) {
    const eraNumber = Number(era || 0);

    // 1979年までは昼固定
    if (eraNumber < 1980) {
      return "saturate(.98) contrast(.96) brightness(1.12)";
    }

    const t = (now % DAY_MS) / DAY_MS;

    // 120秒中、前半60秒を夜にする
    if (t < 0.50) {
      return "saturate(.58) contrast(.86) brightness(.38)";
    }

    // 朝 60〜75秒
    if (t < 0.625) {
      const p = (t - 0.50) / 0.125;
      const b = 0.38 + (0.92 - 0.38) * p;
      const s = 0.58 + (0.88 - 0.58) * p;
      const c = 0.86 + (0.96 - 0.86) * p;
      return "saturate(" + s.toFixed(2) + ") contrast(" + c.toFixed(2) + ") brightness(" + b.toFixed(2) + ")";
    }

    // 昼 75〜100秒
    if (t < 0.833) {
      return "saturate(1.06) contrast(1.00) brightness(1.18)";
    }

    // 夕方 100〜120秒
    const p = (t - 0.833) / 0.167;
    const b = 1.02 + (0.38 - 1.02) * p;
    const s = 0.94 + (0.58 - 0.94) * p;
    const c = 0.96 + (0.86 - 0.96) * p;
    return "saturate(" + s.toFixed(2) + ") contrast(" + c.toFixed(2) + ") brightness(" + b.toFixed(2) + ")";
  }

  function step(now) {
    if (lastTime === null) {
      lastTime = now;
    }

    const dt = Math.min(0.08, (now - lastTime) / 1000);
    lastTime = now;

    // 背景は左から右へ流す。つなぎ目は許容して大きく動かす。
    bgX += bgSpeedPxPerSec[bgSpeedMode] * dt;

    const wrapWidth = Math.max(900, stage.clientWidth * 1.4);
    if (bgX > wrapWidth) {
      bgX -= wrapWidth;
    }

    const layers = stage.querySelectorAll(".era-bg-layer");
    let visibleEra = 0;

    layers.forEach(function(layer) {
      if (layer.classList.contains("is-visible")) {
        visibleEra = Number(layer.dataset.era || 0);
      }

      // inline important で、過去CSSの transform:...!important に必ず勝たせる
      layer.style.setProperty("--run-bg-x", bgX.toFixed(1) + "px");
      layer.style.setProperty("--run-bg-filter", getDayFilter(layer.dataset.era, now));
      layer.style.setProperty("transform", "translateX(var(--run-bg-x))", "important");
      layer.style.setProperty("animation", "none", "important");
      layer.style.setProperty("background-repeat", "repeat-x", "important");
      layer.style.setProperty("background-size", "auto 100%", "important");
    });

    // 1980年以降の夜だけ、RUN-CARのライトを点灯
    const dayPhase = (now % DAY_MS) / DAY_MS;
    const isNight = visibleEra >= 1980 && dayPhase < 0.50;
    stage.classList.toggle("is-bg-night", isNight);

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();


function movePresentationPage(direction) {
  if (upperCardMove.running || continuousLowerSlide.running) return;
  centerHoldUntil = 0;
  beginUpperCardMove(direction, performance.now());
}

if (prevPageButton) {
  prevPageButton.addEventListener("click", function() {
    movePresentationPage(-1);
  });
}
if (nextPageButton) {
  nextPageButton.addEventListener("click", function() {
    movePresentationPage(1);
  });
}

window.addEventListener("keydown", function(event) {
  if (event.key === "ArrowLeft") movePresentationPage(-1);
  if (event.key === "ArrowRight") movePresentationPage(1);
});

/* v8: 上段の停止位置はカード実測値から毎回再計算し、必ず中央線へ固定。 */

/* v9 完全同期：上下は同一開始時刻・同一duration・同一progress。起動時1966位置をSafari向け多段固定。 */

/* =========================================================
   Excel「設定」シート連動 BGM制御
   ========================================================= */
const bgmSettings = {
  enabled: false,
  file: "",
  volume: 0.25,
  loop: true,
  fadeInSeconds: 0
};

function normalizeExcelBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  const text = String(value ?? "").trim().toUpperCase();
  if (["TRUE", "1", "YES", "ON", "有効", "はい"].includes(text)) return true;
  if (["FALSE", "0", "NO", "OFF", "無効", "いいえ"].includes(text)) return false;
  return fallback;
}

function readSystemSettings(workbook) {
  const sheet = workbook.Sheets["設定"];
  if (!sheet) {
    console.info('Excelに「設定」シートがないため、BGMは使用しません。');
    return;
  }
  const rows = XLSX.utils.sheet_to_json(sheet, { range: 1, defval: "" });
  const settings = new Map();
  rows.forEach((row) => {
    const key = String(row["設定キー"] || "").trim();
    if (key) settings.set(key, row["設定値"]);
  });

  bgmSettings.enabled = normalizeExcelBoolean(settings.get("BGM_USE"), false);
  bgmSettings.file = String(settings.get("BGM_FILE") || "").trim();

  const volume = Number(settings.get("BGM_VOLUME"));
  bgmSettings.volume = Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : 0.25;
  bgmSettings.loop = normalizeExcelBoolean(settings.get("BGM_LOOP"), true);

  const fadeIn = Number(settings.get("BGM_FADE_IN"));
  bgmSettings.fadeInSeconds = Number.isFinite(fadeIn) ? Math.max(0, fadeIn) : 0;

  const bgm = document.getElementById("bgm");
  if (bgm && bgmSettings.file) {
    bgm.src = `./audio/${bgmSettings.file}`;
    bgm.loop = bgmSettings.loop;
    bgm.preload = "auto";
  }
  console.info("ExcelのBGM設定を読み込みました。", { ...bgmSettings });
}

async function startTimelineBgm() {
  const bgm = document.getElementById("bgm");
  if (!bgmSettings.enabled || !bgmSettings.file || !bgm) {
    console.info("BGMは無効、またはBGMファイルが未設定です。");
    return;
  }

  bgm.pause();
  bgm.currentTime = 0;
  bgm.src = `./audio/${bgmSettings.file}`;
  bgm.loop = bgmSettings.loop;

  const targetVolume = bgmSettings.volume;
  const fadeSeconds = bgmSettings.fadeInSeconds;
  bgm.volume = fadeSeconds > 0 ? 0 : targetVolume;

  try {
    await bgm.play();
  } catch (error) {
    console.error("BGMの再生に失敗しました。", error);
    alert(`BGMを再生できませんでした。\naudio/${bgmSettings.file} を確認してください。`);
    return;
  }

  if (fadeSeconds <= 0 || targetVolume <= 0) return;
  const startedAt = performance.now();
  const fadeDurationMs = fadeSeconds * 1000;
  function fadeStep(now) {
    const progress = Math.min(1, (now - startedAt) / fadeDurationMs);
    bgm.volume = targetVolume * progress;
    if (progress < 1 && !bgm.paused) requestAnimationFrame(fadeStep);
  }
  requestAnimationFrame(fadeStep);
}

/* =========================================================
   デジタル年表 オープニング制御
   ========================================================= */
 (() => {
  const openingPage = document.getElementById("openingPage");
  const startButton = document.getElementById("openingStartButton");
  const meterProgress = document.getElementById("openingMeterProgress");
  const meterNeedle = document.getElementById("openingMeterNeedle");
  const meterValue = document.getElementById("openingMeterValue");
  const meterLabel = document.getElementById("openingMeterLabel");

  if (
    !openingPage ||
    !startButton ||
    !meterProgress ||
    !meterNeedle ||
    !meterValue ||
    !meterLabel
  ) {
    console.error("オープニングに必要な要素が見つかりません。");
    return;
  }

  /*
   * TOP動画をJavaScriptで作成します。
   * HTML側へvideoタグを追加する必要はありません。
   */
  const openingMovie = document.createElement("video");

  openingMovie.id = "openingMovie";
  openingMovie.src = "./movie/top.mp4";
  openingMovie.preload = "auto";
  openingMovie.muted = true;
  openingMovie.playsInline = true;

  openingMovie.style.position = "absolute";
  openingMovie.style.inset = "0";
  openingMovie.style.width = "100%";
  openingMovie.style.height = "100%";
  openingMovie.style.objectFit = "cover";
  openingMovie.style.backgroundColor = "#000000";
  openingMovie.style.zIndex = "0";

  /*
   * openingPageの一番最初へ動画を配置します。
   * shade、メーター、ボタンは動画より手前に残ります。
   */
  openingPage.insertBefore(
    openingMovie,
    openingPage.firstChild
  );

  const shade = openingPage.querySelector(".opening-page__shade");
  const controls = openingPage.querySelector(".opening-controls");

  if (shade) {
    shade.style.position = "absolute";
    shade.style.inset = "0";
    shade.style.zIndex = "1";
  }

  if (controls) {
    controls.style.zIndex = "2";
  }

  const ARC_LENGTH = 314.2;
  let openingRunning = false;
  let openingFinished = false;

  function setMeter(value) {
    const progress = Math.max(0, Math.min(100, value));

    const offset =
      ARC_LENGTH - (ARC_LENGTH * progress / 100);

    const rotation =
      -90 + (180 * progress / 100);

    meterProgress.style.strokeDashoffset = String(offset);
    meterNeedle.style.transform = `rotate(${rotation}deg)`;
    meterValue.textContent = `${Math.round(progress)}%`;

    if (progress < 28) {
      meterLabel.textContent = "HISTORY";
    } else if (progress < 67) {
      meterLabel.textContent = "PRESENT";
    } else if (progress < 100) {
      meterLabel.textContent = "TO THE FUTURE";
    } else {
      meterLabel.textContent = "START";
    }
  }

  function pauseTimelineBehindOpening() {
    const pauseButton =
      document.getElementById("pauseButton");

    if (pauseButton) {
      pauseButton.click();
    }
  }

  function startTimelineAfterOpening() {
    const playButton =
      document.getElementById("playButton");

    if (playButton) {
      playButton.click();
    }
  }

  function finishOpening() {
    if (openingFinished) {
      return;
    }

    openingFinished = true;
    setMeter(100);

    openingPage.classList.add("is-finished");
    document.body.classList.remove("opening-active");

    // オープニング終了時点を本当の起点にし、上下を1966年で完全同期してから再生します。
    lockInitialCardToCenter(true);
    startTimelineAfterOpening();

    window.setTimeout(() => {
      openingPage.remove();
    }, 1300);
  }

  async function runOpening() {
    if (openingRunning) {
      return;
    }

    openingRunning = true;

    openingPage.classList.add("is-loading");
    startButton.disabled = true;

    const buttonText =
      startButton.querySelector("span");

    if (buttonText) {
      buttonText.textContent = "LOADING";
    }

    try {
      openingMovie.pause();
      openingMovie.currentTime = 0;

      await openingMovie.play();
      await startTimelineBgm();

      /*
       * 再生が成功したら、既存のメーターと
       * ボタンを隠して動画全体を見せます。
       */
      
        startButton.style.display = "none";
      
    } catch (error) {
      openingRunning = false;
      startButton.disabled = false;

      if (buttonText) {
        buttonText.textContent = "年表をはじめる";
      }

      console.error(
        "動画の再生に失敗しました。",
        error
      );

      alert(
        "動画を再生できませんでした。movie/top.mp4を確認してください。"
      );
    }
  }

  /*
   * 動画の現在位置を、既存SVGメーターへ反映します。
   */
  openingMovie.addEventListener("timeupdate", () => {
    if (
      !Number.isFinite(openingMovie.duration) ||
      openingMovie.duration <= 0
    ) {
      return;
    }

    const progress =
      (openingMovie.currentTime /
        openingMovie.duration) * 100;

    setMeter(progress);
  });

  /*
   * 動画終了＝メーター100％として、年表を開始します。
   */
  openingMovie.addEventListener(
    "ended",
    finishOpening
  );

  openingMovie.addEventListener("error", () => {
    openingRunning = false;
    startButton.disabled = false;

    const buttonText =
      startButton.querySelector("span");

    if (buttonText) {
      buttonText.textContent = "年表をはじめる";
    }

    console.error(
      "動画ファイルを読み込めません。",
      openingMovie.error
    );

    alert(
      "movie/top.mp4を読み込めませんでした。"
    );
  });

  /*
   * 初期状態：
   * 動画は停止、メーターは0％、年表本体は一時停止。
   */
  window.addEventListener(
    "load",
    () => {
      pauseTimelineBehindOpening();

      openingMovie.pause();
      setMeter(0);
    },
    { once: true }
  );

  startButton.addEventListener(
    "click",
    runOpening
  );
})();
function getEra(year) {
  year = Number(year);
  if (year >= 2019) return year === 2019 ? "令和元年" : `令和${year - 2018}年`;
  if (year >= 1989) return year === 1989 ? "平成元年" : `平成${year - 1988}年`;
  return `昭和${year - 1925}年`;
}

function sheetRows(workbook, name) {
  const sheet = workbook.Sheets[name];
  if (!sheet) throw new Error(`Excelシート「${name}」が見つかりません。`);
  return XLSX.utils.sheet_to_json(sheet, { range: 1, defval: "" });
}


/* 匠会承認：Excelには画像ファイル名だけ入力する */
function resolveTimelineImage(value, folder) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^(?:https?:|data:|blob:|\/|\.\/|\.\.\/)/i.test(raw) || raw.includes("/") || raw.includes("\\")) {
    return raw.replace(/\\/g, "/");
  }
  return `images/${folder}/${raw}`;
}

function makeSectionMap(rows, imageFolder) {
  const map = new Map();

  // 新方式：同じIDで行を増やし、順番＋種類＋内容で自由配置。
  // 旧方式（名称・説明文・画像1～3）も後方互換で読み込めます。
  const isFreeBlockFormat = rows.some((row) =>
    Object.prototype.hasOwnProperty.call(row, "種類") ||
    Object.prototype.hasOwnProperty.call(row, "順番") ||
    Object.prototype.hasOwnProperty.call(row, "内容／画像パス")
  );

  if (isFreeBlockFormat) {
    const grouped = new Map();
    rows.forEach((row, rowIndex) => {
      const id = String(row.ID || "").trim();
      if (!id) return;
      if (!grouped.has(id)) grouped.set(id, []);
      grouped.get(id).push({ row, rowIndex });
    });

    grouped.forEach((entries, id) => {
      entries.sort((a, b) => {
        const ao = Number(a.row["順番"]);
        const bo = Number(b.row["順番"]);
        const av = Number.isFinite(ao) ? ao : a.rowIndex;
        const bv = Number.isFinite(bo) ? bo : b.rowIndex;
        return av - bv || a.rowIndex - b.rowIndex;
      });

      const blocks = [];
      entries.forEach(({ row }) => {
        const type = String(row["種類"] || "TEXT").trim().toUpperCase();
        const value = String(row["内容／画像パス"] || "").trim();
        if (!value) return;

        if (type === "IMAGE") {
          blocks.push({
            type: "image",
            src: value,
            alt: String(row["画像説明"] || "年表画像").trim()
          });
        } else if (type === "TITLE") {
          blocks.push({ type: "title", text: value });
        } else {
          blocks.push({ type: "text", text: value });
        }
      });
      map.set(id, blocks);
    });
    return map;
  }

  rows.forEach((row) => {
    const blocks = [];
    if (row["名称"]) blocks.push({ type: "title", text: String(row["名称"]) });
    if (row["説明文"]) blocks.push({ type: "text", text: String(row["説明文"]) });
    ["画像1", "画像2", "画像3"].forEach((key) => {
      if (row[key]) blocks.push({ type: "image", src: resolveTimelineImage(row[key], imageFolder), alt: String(row["名称"] || "年表画像") });
    });
    map.set(String(row.ID), blocks);
  });
  return map;
}

function canLoadExcelFromCurrentLocation() {
  return location.protocol === "http:" || location.protocol === "https:";
}

function readDisplaySettings(workbook) {
  const sheet = workbook.Sheets["デザイン設定"];
  if (!sheet) return;
  const rows = XLSX.utils.sheet_to_json(sheet, { range: 9, defval: "" });
  const settings = new Map(rows.map((row) => [String(row["設定名"] || "").trim(), Number(row["値"])]));
  const setPx = (name, cssVar, min, max) => {
    const value = settings.get(name);
    if (Number.isFinite(value)) {
      document.documentElement.style.setProperty(cssVar, `${Math.min(max, Math.max(min, value))}px`);
    }
  };
  setPx("本文フォントサイズ", "--excel-content-font-size", 18, 32);
  setPx("選択年タイトルサイズ", "--excel-title-font-size", 28, 52);
  setPx("年表示サイズ", "--excel-year-font-size", 48, 90);
  setPx("写真説明サイズ", "--excel-caption-font-size", 14, 28);
}

function applyExcelWorkbook(workbook) {
  const masterRows = sheetRows(workbook, "年表マスター");
  const carMap = makeSectionMap(sheetRows(workbook, "CAR"), "container1");
  const plantMap = makeSectionMap(sheetRows(workbook, "PLANT"), "container2");
  const societyMap = makeSectionMap(sheetRows(workbook, "SOCIETY"), "container3");

  const loadedTimelineData = masterRows
    .filter((row) => Number(row.DISPLAY) !== 0 && row.YEAR)
    .map((row) => {
      const id = String(row.ID);
      return {
        id,
        year: String(row.YEAR),
        era: getEra(row.YEAR),
        title: String(row.TITLE || ""),
        visual: String(row.VISUAL || ""),
        image: resolveTimelineImage(row.MAIN_IMAGE, "main"),
        spec1: String(row.SPEC1 || ""),
        spec2: String(row.SPEC2 || ""),
        spec3: String(row.SPEC3 || ""),
        movieTitle: String(row.MOVIE_TITLE || ""),
        movieFile: String(row.MOVIE_FILE || ""),
        content: {
          car: carMap.get(id) || [],
          plant: plantMap.get(id) || [],
          society: societyMap.get(id) || []
        }
      };
    });

  if (!loadedTimelineData.length) {
    throw new Error("表示対象の年表データがありません。DISPLAY列を確認してください。");
  }

  const runnerRows = sheetRows(workbook, "RUN-CAR設定");
  RUN_CAR_BY_ID = new Map();
  const maxRow = runnerRows.find((row) => Number(row["最大表示台数"]) > 0);
  if (maxRow) {
    RUN_CAR_MAX_ACTIVE = Math.max(1, Math.min(30, Number(maxRow["最大表示台数"])));
  }

  runnerRows.forEach((row) => {
    const id = String(row.ID || "").trim();
    if (!id) return;
    const config = {
      id,
      enabled: normalizeRunFlag(row.RUN, false),
      fixed: normalizeRunFlag(row["固定"], false),
      alt: String(row["表示名"] || "走行車両").trim(),
      src: String(row["車画像"] || "").trim(),
      speed: Number(row["速度係数"]) || 1,
      width: Number(row["サイズ(px)"]) || 260,
      top: Number(row["走行高さ(px)"]) || 24,
      lightTop: "48%",
      stopOffset: "0px"
    };
    RUN_CAR_BY_ID.set(id, config);
  });

  loadedTimelineData.forEach((item) => {
    item.runnerCar = RUN_CAR_BY_ID.get(String(item.id)) || null;
  });

  // Excel再読込時は、以前のRUN-CARを残さず先頭から再構成します。
  clearAllExcelRunCars(false);

  const backgroundRows = sheetRows(workbook, "RUN-CAR背景設定");
  if (backgroundRows.length) {
    eraBackgrounds = {};
    backgroundRows.forEach((row) => {
      if (row["年代開始"] && row["背景画像"]) {
        eraBackgrounds[Number(row["年代開始"])] = String(row["背景画像"]);
      }
    });
  }

  readDisplaySettings(workbook);
  readSystemSettings(workbook);
  excelTimelineData = loadedTimelineData;
  timelineData = loadedTimelineData;
  activeIndex = 0;
  buildTimeline();
}

function setOfflineExcelStatus(message, isError = false) {
  const status = document.getElementById("offlineExcelStatus");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("is-error", isError);
}

function hideOfflineExcelPanel() {
  const panel = document.querySelector(".offline-excel-panel");
  if (panel) panel.style.display = "none";
}

async function loadWorkbookFromFile(file) {
  try {
    if (typeof XLSX === "undefined") throw new Error("XLSXライブラリを読み込めませんでした。");
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    applyExcelWorkbook(workbook);
    setOfflineExcelStatus(`${file.name} を読み込みました`);
    hideOfflineExcelPanel();
    console.info(`オフラインExcel「${file.name}」を読み込みました。`);
  } catch (error) {
    console.error(error);
    setOfflineExcelStatus(`読込エラー: ${error.message}`, true);
    alert(`Excelを読み込めませんでした。\n${error.message}`);
  }
}

function initializeOfflineExcelPicker() {
  const input = document.getElementById("offlineExcelInput");
  const button = document.getElementById("offlineExcelButton");
  if (!input || !button) return;
  button.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (file) loadWorkbookFromFile(file);
    input.value = "";
  });
}

async function loadExcelTimeline() {
  initializeOfflineExcelPicker();

  if (!canLoadExcelFromCurrentLocation()) {
    excelTimelineData = timelineData;
    activeIndex = 0;
    buildTimeline();
    setOfflineExcelStatus("オフライン起動中：［Excelを読み込む］から timeline.xlsx を選択してください");
    console.info("ローカル直接起動です。Excel選択後に編集内容を反映します。");
    return;
  }

  try {
    if (typeof XLSX === "undefined") throw new Error("XLSXライブラリを読み込めませんでした。");
    const response = await fetch(`timeline.xlsx?reload=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`timeline.xlsx取得失敗（HTTP ${response.status}）`);
    const workbook = XLSX.read(await response.arrayBuffer(), { type: "array" });
    applyExcelWorkbook(workbook);
    setOfflineExcelStatus("timeline.xlsx を自動読み込みしました");
    hideOfflineExcelPanel();
    console.info(`Excel年表を${timelineData.length}件読み込みました。`);
  } catch (error) {
    console.warn("Excel年表を読み込めなかったため、内蔵データへ切り替えました。", error);
    excelTimelineData = timelineData;
    activeIndex = 0;
    buildTimeline();
    setOfflineExcelStatus("自動読込に失敗しました。Excelを手動選択してください", true);
  }
}

initializeThemeSelector();
loadExcelTimeline();

