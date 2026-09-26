// Game data: cities, bikes, caps, rewards, translations.
// Pixel-space constants: the canvas is 380x176 'game pixels', scaled up to fit the phone.
export const VW=380,VH=176,SY=16,LANE_Y=[SY+128,SY+157],BOY_X=70;
export const HOUSES={"delhi":[43,289,415,535,691,815,941],"mumbai":[36,164,286,559,688,808,894],"pune":[43,161,281,611,735,851],"bengaluru":[55,201,525,669,803,941],"gurugram":[48,168,306,428,506,630,748,826,944],"noida":[43,161,283,543,623,741,879,941]};
export const CITIES=[
{id:'delhi',name:'Delhi',hi:'दिल्ली',route:'Gali No. 4 · Karol Bagh',marks:'Hanuman statue · Blue Line metro · India Gate',need:0,ev:'rush',evText:'Wedding season traffic – autos everywhere',fin:'Diwali morning – beat the metro to Jhandewalan'},
{id:'mumbai',name:'Mumbai',hi:'मुंबई',route:'Gali No. 10 · Colaba',marks:'Gateway of India · Bandra–Worli Sea Link · Chawls',need:8,ev:'monsoon',evText:'Monsoon! Jump the waterlogged road',fin:'Ganpati procession fills Gali No. 10'},
{id:'pune',name:'Pune',hi:'पुणे',route:'Gali No. 7 · Shaniwar Peth',marks:'Shaniwar Wada · Parvati hill',need:24,ev:'dogs',evText:'Street dogs guard every gate',fin:'Finish the peth before the wada gates open'},
{id:'bengaluru',name:'Bengaluru',hi:'बेंगलुरु',route:'Cross No. 3 · Malleshwaram',marks:'Vidhana Soudha · Namma Metro · Tech parks',need:40,ev:'rush',evText:'Silk Board jam – squeeze past stuck traffic',fin:'Rain and traffic at Vidhana Soudha'},
{id:'gurugram',name:'Gurugram',hi:'गुरुग्राम',route:'Gali No. 5 · Cyber City',marks:'Cyber City towers · Rapid Metro · Cranes',need:60,ev:'rush',evText:'Office cab rush at 9 AM',fin:'Deliver all of Cyber City before 7 AM'},
{id:'noida',name:'Noida',hi:'नोएडा',route:'Gali No. 8 · Sector 18',marks:'DND Flyway · Aqua Line metro · Sector 18 mall',need:80,ev:'fog',evText:'Winter fog – obstacles appear late',fin:'Race the Aqua Line across the flyway'}];
export const BIKES=[
{id:'red',name:'Old Faithful',tag:'Dad’s old roadster. Never lets you down.',col:[216,50,42],st:[3,3,2,3],price:0},
{id:'blue',name:'Gali Racer',tag:'Light frame, low bars. Pure speed.',col:[45,111,209],st:[5,3,3,2],price:1500},
{id:'green',name:'Monsoon Rider',tag:'Fat tyres grip wet roads and puddles.',col:[46,139,62],st:[3,5,3,3],price:2500},
{id:'purple',name:'Tiffin Tanker',tag:'Huge basket. More papers per trip.',col:[122,58,138],st:[2,3,2,5],price:3000},
{id:'yellow',name:'Rocket Roadster',tag:'Top of the line. Unlocks after 12 levels.',col:[242,194,48],st:[5,4,5,4],price:4000,need:12}];
export const CAPS=[['Blue','#2d6fd1',0],['Red','#d8322a',300],['Green','#2e8b3e',300],['Purple','#7a3a8a',500],['Orange','#f39c2b',500],['Black','#3a3a44',800],['Pink','#e05a8a',500],['Teal','#2ab5b5',800]];
export const DAILY=[50,75,100,150,200,300,500];
export const NAMES=['GaliRider','ChaiSprinter','PaperTiger','BellBajao','CycleSultan','MorningMonk','RaddiRacer','PaperWala'];
export const T={en:{},hi:{tapToStart:'शुरू करने के लिए टैप करें',startDelivery:'डिलीवरी शुरू करें',garage:'गैराज',missions:'मिशन',ranks:'रैंक',bonus:'बोनस',howToPlay:'कैसे खेलें',howToPlayU:'कैसे खेलें',printing:'आज का अख़बार छप रहा है…',tip:'लेन बदलने के लिए ऊपर-नीचे स्वाइप करें, कूदने के लिए टैप करें।',bestRun:'सबसे अच्छा स्कोर',whoRides:'आज डिलीवरी कौन करेगा?',pickCap:'अपनी टोपी चुनें',playerName:'खिलाड़ी का नाम',nameHelp:'3–12 अक्षर या अंक। असली पूरा नाम नहीं, उपनाम रखें।',homeCity:'आपका शहर',forRanks:'– शहर की रैंकिंग के लिए',changeLater:'बाद में मेन्यू से बदल सकते हैं।',letsRide:'चलो चलें!',howRide:'कैसे चलाएँ',gotIt:'समझ गया!',dailyBonus:'रोज़ का बोनस',missionsH:'मिशन',ride:'चलो!',garageH:'गैराज',cycles:'साइकिल',caps:'टोपी',ranksH:'रैंक',papersWeek:'इस हफ़्ते बाँटे गए अख़बार',settingsH:'सेटिंग्स',music:'संगीत',sfx:'आवाज़',vibration:'कंपन',language:'भाषा',controls:'कंट्रोल',swipe:'स्वाइप',buttons:'बटन',changeName:'नाम बदलें',done:'हो गया',scoreU:'स्कोर',lowPapers:'अख़बार कम हैं!',papersLeft:'बचे अख़बार',getReady:'तैयार हो जाओ!',paused:'रुका हुआ',resume:'जारी रखें',restart:'फिर से',settingsU:'सेटिंग्स',quit:'छोड़ें',menuU:'मेन्यू'}};
