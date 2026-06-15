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

// 年代別に年表の上を走る車画像
// 1960年代: corolla-60th / 1970年代: corolla-green / 1980年代: levin
// 1990年代: prius / 2000年代: iQ / 2010年代: hayy / 2020年代: rav4-silver
const ERA_RUNNER_CARS = [
  {
    from: 1960,
    to: 1969,
    src: "images/run-cars/corolla-60th.png",
    alt: "Corolla 60th",
    width: "clamp(210px, 20vw, 340px)"
  },
  {
    from: 1970,
    to: 1979,
    src: "images/run-cars/corolla-green.png",
    alt: "Classic Corolla",
    width: "clamp(210px, 20vw, 340px)"
  },
  {
    from: 1980,
    to: 1989,
    src: "images/run-cars/levin.png",
    alt: "Levin",
    width: "clamp(210px, 20vw, 340px)"
  },
  {
    from: 1990,
    to: 1999,
    src: "images/run-cars/prius.png",
    alt: "Prius",
    width: "clamp(210px, 20vw, 340px)"
  },
  {
    from: 2000,
    to: 2009,
    src: "images/run-cars/iQ.png",
    alt: "iQ",
    width: "clamp(150px, 15vw, 260px)"
  },
  {
    from: 2010,
    to: 2019,
    src: "images/run-cars/hayy.png",
    alt: "Harrier 60th",
    width: "clamp(200px, 19vw, 330px)"
  },
  {
    from: 2020,
    to: 2026,
    src: "images/run-cars/rav4-silver.png",
    alt: "RAV4 Silver",
    width: "clamp(200px, 19vw, 330px)"
  }
];

const TOYOTA_MARK_IMAGE = "images/toyotamark.jpg";

const timelineData = [
  {
    "year": "1966",
    "era": "昭和41年",
    "title": "高岡工場スタート",
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
          "art" :"スペック",
        }
      ],
      "car2": [
        {
          "src": "images/1960/1966publicaPickup.JPG",
          "text": "工場の歩みの起点。生産車種と工場の歴史をここから紹介します。パブリカは1961年に発売され、エンジンは697cc強制空冷水平対向２気筒OHV最高出力28ps最高速度110km/h トヨタ車史上唯一の空冷エンジン搭載　発売当時価格38.9万円。"
        },
        {
          "type": "image",
          "src": "images/1960/1966publica.JPG",
          "alt": "パブリカ",
        }
      ],
      "Plant": [
        {
          "type": "text",
          "text": "高度経済成長の中で、家庭に車が広がっていく時代でした。初代トヨタ・カローラ発売、日本の総人口1億人突破、いざなぎ景気の始まりなどが重なります。1000ドルカーという初代後期型のキャッチコピーで親しまれ、セダン、コンバーチブル、トラック、バンとバリエーションは多彩であった"
        },
        {
          "type": "image",
          "src": "images/1960/1966publicaVan.JPG",
          "alt": "パブリカバン"
        }
      ]
    }
  },
  {
    "year": "1967",
    "era": "昭和42年",
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
           "text": "1967年 元町工場よりパブリカの生産移管、ミニエースは｢パブリカ｣のコンポーネンツを用いた小型商用車。当初「トラック（低床／高床）」と「パネルバン」のラインナップ 1968年8月に「バン」と乗用車登録の「コーチ（7名乗り）」を追加。エンジンを運転席の下に搭載する、キャブ・オーバー・ザ・エンジン型(いわゆるキャブオーバー)のデザインにして、限られた全長の中で荷台寸法を最長にとり、軽トラックより150kg多い500kgの最大積載量を確保した。" ,   }
      ],
      "plant": [
        {
          "type":"image",
          "src":"images/1960/カラーミニエース.jpg",
          "alt":"ミニエース"

        },
        {
          "type": "image",
           "src": "images/1960/カタログミニ.jpg",
           "alt" : "miniace",
        },
        {
          "type" : "text",
          "text" : "スペック  エンジンは空冷水平対向2気筒OHV800cc・36PS (2U-B)。トランスミッションは4速MTコラムシフト。サスペンションは、フロントがダブルウィッシュボーン/トーションバーの独立式、リヤがリジッドアクスル/リーフスプリング"
        },

        
        
        
      ],
      "society": [
        {
          "type": "image",
           "src": "images/1960/1968miniace.JPG"
        },
        {
          "type": "image",
          "src" : "images/1960/カタログミニエース.jpg",
          "alt" : "ミニエース",
        },
        {
          "type": "image",
          "src" : "images/1960/ミニエースカタログ.jpg",
          "alt" : "ミニエース",
        },
      ]
    }
  },
  {
    "year": "1969",
    "era": "昭和44年",
    "title": "高岡工場オンライン生産指示",
    "visual": "2代目パブリカ",
    "image": "images/1960/1969P.png",
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
          "src": "images/1960/スペック.png",
          "alt": "スペック"
        }
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
          "alt" :""
        },


        {
          "type": "image",
          "src": "images/1960/inpane.jpg",
          "alt": "インパネ"
        }
      ],
      "society": [
        {
          "type": "image",
          "src": "images/1960/パブリカピックアップ.jpg",
          "alt":"トラック"
        },
        {
          "type": "image",
          "src": "images/1960/1969publicaVan.JPG",
          "alt": "Van"
        }
      ]
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
          "src": "images/1970/1970クーペ.JPG",
          "alt" :""
        },
        {
          "type": "image",
          "src" :"images/1970/1970バン.JPG",
          "alt" : ""
        },
        {
          "type": "image",
          "src" :"images/1970/1971スプリンター.JPG",
          "alt": "スプリンター",
        },



      ],
      "society": [
        {
          "type": "image",
          "src": "images/1970/1972カリーナハードトップ.JPG",
          "alt":"カリーナ",
        },
        {
          "type":"image",
          "src":"images/1970/カリーナカタログ.jpg",
          "alt":"カリーナ",
        },
        {
          "type":"image",
          "src" :"images/1970/カリーナ内装.jpg",
          "alt":"内装",
        },
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
const pauseButton = document.getElementById("pauseButton");
const playButton = document.getElementById("playButton");
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
let manualPaused = false;
let hoverPaused = false;
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

function updatePlayButtons() {
  if (!pauseButton || !playButton) return;

  pauseButton.classList.toggle("active", manualPaused);
  playButton.classList.toggle("active", !manualPaused);
}

function isPaused() {
  return manualPaused || hoverPaused;
}

function animate() {
  if (!isPaused()) {
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

function getRunnerCarConfigByYear(year) {
  const targetYear = Number(year);

  if (Number.isNaN(targetYear)) {
    return ERA_RUNNER_CARS[0];
  }

  return ERA_RUNNER_CARS.find(function(car) {
    return targetYear >= car.from && targetYear <= car.to;
  }) || ERA_RUNNER_CARS[ERA_RUNNER_CARS.length - 1];
}

function getCurrentRunnerCarConfig() {
  const item = getCurrentItem();
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

  runner.appendChild(light);
  runner.appendChild(car);
  timelineFrame.appendChild(runner);

  runner.addEventListener("animationend", function() {
    runner.classList.remove("is-running");
  });
}

function runRav4Once() {
  const runner = timelineFrame ? timelineFrame.querySelector(".rav4-runner") : null;
  if (!runner || runner.classList.contains("is-running") || isPaused()) return;

  const selectedCar = getCurrentRunnerCarConfig();
  const car = runner.querySelector("img");

  if (selectedCar && car) {
    car.src = selectedCar.src;
    car.alt = selectedCar.alt || "";

    if (selectedCar.width) {
      runner.style.setProperty("--runner-width", selectedCar.width);
    }
  }

  // 少しだけ高さを変えて、毎回同じ位置に見えないようにします。
  const laneTop = 34 + Math.floor(Math.random() * 18);
  runner.style.setProperty("--rav4-top", laneTop + "px");

  // 同じアニメーションを確実に再スタートさせます。
  runner.classList.remove("is-running");
  void runner.offsetWidth;
  runner.classList.add("is-running");
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

restoreToyotaMark();
buildTimeline();
centerNode(0);
createRav4Runner();
updatePlayButtons();
animate();
scheduleRav4Run();
