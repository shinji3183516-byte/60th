"use strict";
const timelineData = [
  {
    "year": "1966",
    "era": "昭和41年",
    "title": "高岡工場スタート",
    "visual": "PLANT",
    "car": "初代カローラ数年後をこのように予測したトヨタ自動車は、高岡（愛知県豊田市）に1km四方にも及ぶカローラの専用工場を建設。翌年、元町工場から「パプリカ」の生産を移管。1968年には「スプリンター」の生産開始",
    "carImage": "images/car/パブリカ.jpg",
    "factory": "工場の歩みの起点。生産車種と工場の歴史をここから紹介します。数年後をこのように予測したトヨタ自動車は、高岡（愛知県豊田市）に1km四方にも及ぶカローラの専用工場を建設。トヨタ自動車の年間生産台数が約5万台だった当時、カローラは月間3万台を生産すると記者会見で発表。",
    "factoryImage": "images/factory/takaoka_1gousha.jpg",
    "society": "高度経済成長の中で、家庭に車が広がっていく時代でした。初代トヨタ・カローラが発売されたのは、昭和41年11月。日本の総人口数が1億人を突破し、いざなぎ景気の始まりでもあります。",
    "societyImage": "images/society/ビートルズ.jpg",
    "spec1": "創業期",
    "spec2": "生産開始",
    "spec3": "60年の起点",
    "image": "images/1966.jpg"
  },
  {
    "year": "1978",
    "era": "昭和53年",
    "title": "カローラ生産拡大",
    "visual": "COROLLA",
    "car": "カローラを中心に、小型で扱いやすい車づくりが広がりました。また、トヨタ初の前輪駆動（FF)車である「ターセル」「コルサ」の生産を開始。1982年カローラⅡ生産開始",
    "carImage": "images/car/コルサ.jpg",
    "factory": "量産体制を強め、高岡工場の存在感が高まっていきました。1980年トヨタ国内車両生産累計3,000万台を記念して時計塔設置",
    "factoryImage":"images/factory/img01.jpg",
    "society": "生活の中に自動車が定着し、大衆車の需要が拡大しました。成田空港が開港。当時は「新東京国際空港」として開港。沖縄で交通方法変更。右側通行から本土と同じ左側通行へ変更。キャンディーズ解散など、昭和の芸能・流行も話題に。",
    "societyImage":"images/society/okinawa.png",
    "spec1": "カローラ",
    "spec2": "量産",
    "spec3": "大衆車",
    "image": "images/3.jpg"
  },
  {
    "year": "1984",
    "era": "昭和59年",
    "title": "品質向上とグローバル対応",
    "visual": "QUALITY",
    "car": "カローラFXなど、使いやすさと品質を重視した車種が登場しました。",
    "carImage": "images/car/FX.jpg",
    "factory": "品質・生産性向上に取り組み、グローバルな車づくりへつながりました。米国GMとの合弁会社「NUMMI（ヌイミ）」の立ち上げにおける親工場として、現地従業員の研修など生産ノウハウを指導・支援。",
    "factoryImage": "images/car/1000man.jpg",
    "society": "省エネ志向や小型車需要が高まりました。ファミコン人気拡大。ロサンゼルスオリンピック開催。",
    "societyImage":"images/society/Olympic.jpg",
    "spec1": "品質",
    "spec2": "効率化",
    "spec3": "海外支援",
    "image": "images/5.jpg"
  },
  {
    "year": "1997",
    "era": "平成9年",
    "title": "プリウス生産開始",
    "visual": "PRIUS",
    "car": "世界初の量産ハイブリッド車プリウスの生産により、環境技術の時代へ進みました。SUV初代ハリアー登場",
    "carImage": "images/car/shodaiharr.jpg",
    "factory": "世界初の量産ハイブリッド車である初代プリウスの生産を開始しました。高岡工場にとって、環境技術と新しい車づくりへの大きな転機となりました。",
    "society": "環境性能と技術革新への関心が高まりました。日本では金融危機が深刻化する一方、京都議定書の採択や東京湾アクアライン開通など、社会の大きな転換点となる出来事が続いた。消費税５％に",
    "societyImage":"images/Aqua.jpg",
    "spec1": "HV",
    "spec2": "環境技術",
    "spec3": "新時代",
    "image": "images/prius.jpg"
  },
  {
    "year": "1999",
    "era": "平成11年",
    "title": "ヴィッツ・ファンカーゴ・プラッツ",
    "visual": "VITZ",
    "car": "コンパクトカーのラインアップが広がりました。e-かんばん導入。ターセル、コルサ、サイノス生産終了。",
    "carImage": "images/car/fan.jpg",
    "factory": "多車種生産への対応力を高めました。ヴィッツ生産開始、ボデー工程にトヨタ初の GBL 導入",
    "society": "暮らしにフィットする車が注目されました。NTTドコモI-mode開始。東海村JCO臨界事故",
    "societyImage":"images/society/mail.jpg",
    "spec1": "コンパクト",
    "spec2": "多車種",
    "spec3": "実用性",
    "image": "images/vit.jpg"
  },
  {
    "year": "2001",
    "era": "平成13年",
    "title": "工場生産累計2,000万台",
    "visual": "20M",
    "car": "カローラ ランクス・アレックスなど、日常の使いやすさを重視したモデルが生産されました。",
    "carImage": "images/car/01.jpg",
    "factory": "累計生産台数の節目を迎え、生産体制の強化が進みました。支援先の TMMF（フランス） 生産開始。工場生産累計2,000万台達成。単一工場として国内初。",
    "factoryImage": "images/car/inher.jpg",
    "society": "品質と実用性の両立が求められました。小泉内閣発足、構造改革進む。アメリカ同時多発テロ。世界の安全保障が大きく変化。翌年、日韓FIFAワールドカップ開催。ユーロの流通",
    "spec1": "2,000万台",
    "spec2": "高効率",
    "spec3": "品質強化",
    "image": "images/corolla_runx.jpg",
  },
  {
    "year": "2007",
    "era": "平成19年",
    "title": "新第1ライン・オーリス時代",
    "visual": "AURIS",
    "car": "2月カローラ ランクス,アレックス生産終了。8月：新第1ライン生産開始。10月第3ライン生産終了。",
    "carImage": "images/car/viz.png",
    "factory": "新ラインにより、生産能力と品質をさらに高めました。",
    "factoryImage": "images/car/オーリス.png",
    "society": "世界市場での競争が強まりました。apple 初代IPhone発売。翌年、リーマンショックで日本経済にも大打撃・世界金融危機　",
    "societyImage":"images/society/iphone.jpg",
    "spec1": "新ライン",
    "spec2": "能力向上",
    "spec3": "品質向上",
    "image": "images/Au.jpg"
  },
  {
    "year": "2013",
    "era": "平成25年",
    "title": "第2ライン再開・SUV対応",
    "visual": "SUV",
    "car": "ハリアー、RAV4など、SUVラインへの対応が進みました。",
    "carImage":"images/car/rav4_.jpg",
    "factory": "多様なニーズに対応する生産体制を強化しました。",
    "society": "SUVへの関心が高まりました。翌年、市販型燃料電池車、初代MIRAI発売しました",
    "societyImage":"images/car/22956_2.jpg",
    "spec1": "SUV",
    "spec2": "第2ライン",
    "spec3": "多様化",
    "image": "images/harrier.jpg"
  },
  {
    "year": "2026",
    "era": "令和8年",
    "title": "高岡工場60周年",
    "visual": "60TH",
    "car": "60年の歩みを振り返り、次の時代の車づくりへつなげます。",
    "carImage":"images/RAV42.jpg",
    "factory": "これまでの改善・品質・生産技術の積み重ねを未来へつなげます。高岡工場60周年 1ラインbZ4X,CH-R+の生産開始,新型RAV4オールHV化",
    "society": "デジタル化や環境対応など、新しい価値づくりが求められています。TOYOTA RACINGは、来週開催される第94回ル・マン24時間レースの舞台、サルト・サーキットにおいて、液体水素を燃料とする「TR LH2 Racing Prototype」の初の一般公開デモンストレーション走行を実施",
    "societyImage":"images/society/85562.jpg",
    "spec1": "60周年",
    "spec2": "未来",
    "spec3": "DX",
    "image": "images/bzr4.jpg"
  }
];
const timelineFrame=document.getElementById("timelineFrame");
const timelineTrack=document.getElementById("timelineTrack");
const selectedYear=document.getElementById("selectedYear");
const selectedEra=document.getElementById("selectedEra");
const selectedTitle=document.getElementById("selectedTitle");
const mainPhoto=document.getElementById("mainPhoto");
const photoLink=document.getElementById("photoLink");
const visualTitle=document.getElementById("visualTitle");
const carIntro=document.getElementById("carIntro");
const factoryEvent=document.getElementById("factoryEvent");
const socialEvent=document.getElementById("socialEvent");
const spec1=document.getElementById("spec1");
const spec2=document.getElementById("spec2");
const spec3=document.getElementById("spec3");
const speedButtons=document.querySelectorAll(".speed-button");

function createInfoPhoto(textElement,idName){
  const photo=document.createElement("img");
  photo.id=idName;
  photo.className="info-photo";
  photo.hidden=true;
  if(textElement){
    textElement.insertAdjacentElement("afterend",photo);
  }
  return photo;
}

const carPhoto=createInfoPhoto(carIntro,"carPhoto");
const factoryPhoto=createInfoPhoto(factoryEvent,"factoryPhoto");
const societyPhoto=createInfoPhoto(socialEvent,"societyPhoto");

function updateInfoPhoto(photo,imagePath,altText){
  if(imagePath){
    photo.src=imagePath;
    photo.alt=altText;
    photo.hidden=false;
  }else{
    photo.removeAttribute("src");
    photo.alt="";
    photo.hidden=true;
  }
}
let offset=0;
let paused=false;
let activeIndex=0;
const speedMap={
  verySlow:0.1,
  slow:0.18,
  normal:0.38
};
let speed=speedMap.normal;

function createNode(item,index){
  const button=document.createElement("button");
  button.className="year-node";
  button.type="button";
  button.dataset.index=index;
  button.innerHTML=`<span class="era">${item.era}</span><span class="wheel"><strong>${item.year}</strong></span><span class="node-photo"><img src="${item.image}" alt="${item.year}"></span>`;
  button.addEventListener("click",function(){
    activeIndex=index;
    showData(index);
    centerNode(index);
  });
  return button;
}

function buildTimeline(){
  timelineTrack.innerHTML="";
  for(let loop=0;loop<3;loop++){
    timelineData.forEach(function(item,index){
      timelineTrack.appendChild(createNode(item,index));
    });
  }
  showData(0);
}

function showData(index){
  const item=timelineData[index];
  selectedYear.textContent=item.year;
  selectedEra.textContent=item.era;
  selectedTitle.textContent=item.title;
  mainPhoto.src=item.image;
  mainPhoto.alt=item.year+" "+item.title;
  visualTitle.textContent=item.visual;
  carIntro.textContent=item.car;
  factoryEvent.textContent=item.factory;
  socialEvent.textContent=item.society;
  updateInfoPhoto(carPhoto,item.carImage,item.year+" 車紹介");
  updateInfoPhoto(factoryPhoto,item.factoryImage,item.year+" 工場の出来事");
  updateInfoPhoto(societyPhoto,item.societyImage,item.year+" 社会の出来事");
  spec1.textContent=item.spec1;
  spec2.textContent=item.spec2;
  spec3.textContent=item.spec3;
  if(photoLink){
    photoLink.href=item.image;
  }
  document.querySelectorAll(".year-node").forEach(function(node){
    node.classList.toggle("active",Number(node.dataset.index)===index);
  });
}

function centerNode(index){
  const nodes=Array.from(document.querySelectorAll(".year-node"));
  const target=nodes.find(function(node){return Number(node.dataset.index)===index;});
  if(!target)return;
  const frameCenter=timelineFrame.clientWidth/2;
  const nodeCenter=target.offsetLeft+target.offsetWidth/2;
  offset=frameCenter-nodeCenter;
  timelineTrack.style.transform="translateX("+offset+"px)";
}

function updateSelectedByCenter(){
  const frameRect=timelineFrame.getBoundingClientRect();
  const centerX=frameRect.left+frameRect.width/2;
  const nodes=Array.from(document.querySelectorAll(".year-node"));
  let nearestNode=null;
  let nearestDistance=Infinity;
  nodes.forEach(function(node){
    const rect=node.getBoundingClientRect();
    const nodeCenter=rect.left+rect.width/2;
    const distance=Math.abs(centerX-nodeCenter);
    if(distance<nearestDistance){
      nearestDistance=distance;
      nearestNode=node;
    }
  });
  if(!nearestNode)return;
  const newIndex=Number(nearestNode.dataset.index);
  if(newIndex!==activeIndex){
    activeIndex=newIndex;
    showData(activeIndex);
  }
}

function keepEndlessLoop(){
  const oneSetWidth=timelineTrack.scrollWidth/3;
  if(Math.abs(offset)>=oneSetWidth*2){offset+=oneSetWidth;}
  if(offset>0){offset-=oneSetWidth;}
}

function animate(){
  if(!paused){
    offset-=speed;
    keepEndlessLoop();
    timelineTrack.style.transform="translateX("+offset+"px)";
    updateSelectedByCenter();
  }
  requestAnimationFrame(animate);
}

timelineFrame.addEventListener("mouseenter",function(){paused=true;});
timelineFrame.addEventListener("mouseleave",function(){paused=false;});

speedButtons.forEach(function(button){
  button.addEventListener("click",function(){
    const nextSpeed=button.dataset.speed;
    speed=speedMap[nextSpeed]||speedMap.normal;
    speedButtons.forEach(function(item){
      item.classList.toggle("active",item===button);
    });
  });
});

photoLink.addEventListener("click",function(){
  const item=timelineData[activeIndex];
  alert(item.year+"年："+item.title);
});

buildTimeline();
centerNode(0);
animate();
