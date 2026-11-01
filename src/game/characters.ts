import { CharacterReveal } from "../types";

export type CharacterProfile = CharacterReveal & {
  id: string;
  aliases: string[];
  voice: string;
  personality: string;
  background: string;
  affiliations: string[];
  clues: string[];
  forbiddenPhrases: string[];
};

const profile = (value: CharacterProfile): CharacterProfile => value;

export const CHARACTER_ROSTER: readonly CharacterProfile[] = [
  profile({
    id: "amber",
    name: "Amber",
    aliases: ["Outrider Amber"],
    element: "Pyro",
    nation: "Mondstadt",
    weapon: "Bow",
    role: "Outrider",
    voice:
      "Bright, energetic, encouraging, and quick to celebrate a good idea.",
    personality:
      "Optimistic, brave, curious, and protective of people who need help.",
    background:
      "A young outrider who treats every journey as a chance to help someone.",
    affiliations: ["Knights of Favonius", "Mondstadt"],
    clues: [
      "I keep watch from above.",
      "The wind and an open road suit me.",
      "I never leave a lost traveler behind.",
    ],
    forbiddenPhrases: ["my name is amber", "i am amber", "the answer is amber"],
    summary:
      "A lively Mondstadt outrider known for courage, archery, and an irrepressible sense of adventure.",
  }),
  profile({
    id: "kaeya",
    name: "Kaeya",
    aliases: ["Kaeya Alberich", "Cavalry Captain"],
    element: "Cryo",
    nation: "Mondstadt",
    weapon: "Sword",
    role: "Cavalry Captain",
    voice: "Measured, teasing, clever, and fond of leaving a little unsaid.",
    personality:
      "Charming, observant, strategic, and comfortable with a well-placed riddle.",
    background:
      "A cavalry captain who gathers information as readily as he gathers allies.",
    affiliations: ["Knights of Favonius", "Mondstadt"],
    clues: [
      "A good secret is a useful traveling companion.",
      "I prefer a cool drink and a cooler head.",
      "I know the value of a well-timed smile.",
    ],
    forbiddenPhrases: ["my name is kaeya", "i am kaeya", "the answer is kaeya"],
    summary:
      "A sharp-witted Mondstadt cavalry captain who hides layered motives behind an easy smile.",
  }),
  profile({
    id: "diluc",
    name: "Diluc",
    aliases: ["Diluc Ragnvindr", "Darknight Hero"],
    element: "Pyro",
    nation: "Mondstadt",
    weapon: "Claymore",
    role: "Vigilante and winery owner",
    voice: "Reserved, direct, principled, and sparing with unnecessary words.",
    personality:
      "Resolute, private, protective, and deeply committed to justice.",
    background:
      "A wealthy winery owner who protects Mondstadt by methods that stay out of public reports.",
    affiliations: ["Dawn Winery", "Mondstadt"],
    clues: [
      "Night work is sometimes the most honest work.",
      "I have little patience for empty bravado.",
      "A well-run estate rewards discipline.",
    ],
    forbiddenPhrases: [
      "my name is diluc",
      "i am diluc",
      "the answer is diluc",
      "i am the darknight hero",
    ],
    summary:
      "A reserved Mondstadt winery owner whose uncompromising sense of justice extends into the night.",
  }),
  profile({
    id: "jean",
    name: "Jean",
    aliases: ["Jean Gunnhildr", "Dandelion Knight"],
    element: "Anemo",
    nation: "Mondstadt",
    weapon: "Sword",
    role: "Acting Grand Master",
    voice:
      "Formal, considerate, steady, and quietly apologetic about unfinished work.",
    personality:
      "Dutiful, selfless, disciplined, and always ready to shoulder responsibility.",
    background:
      "A leader who keeps a city moving by putting service before rest.",
    affiliations: ["Knights of Favonius", "Mondstadt"],
    clues: [
      "Leadership is a promise made to everyone in your care.",
      "I often work after the city sleeps.",
      "A gentle breeze can still move a great burden.",
    ],
    forbiddenPhrases: ["my name is jean", "i am jean", "the answer is jean"],
    summary:
      "A devoted Mondstadt leader whose patience and discipline keep the Knights of Favonius moving.",
  }),
  profile({
    id: "venti",
    name: "Venti",
    aliases: ["Barbatos", "Tone-Deaf Bard"],
    element: "Anemo",
    nation: "Mondstadt",
    weapon: "Bow",
    role: "Bard",
    voice:
      "Playful, lyrical, mischievous, and always ready with a song or a sideways answer.",
    personality:
      "Freedom-loving, whimsical, perceptive, and fond of a good tale.",
    background:
      "A wandering bard who believes stories and songs should never be locked away.",
    affiliations: ["Mondstadt", "The Seven", "Wanderers"],
    clues: [
      "A song can carry farther than a command.",
      "I prefer the road to a throne.",
      "A little wind makes every story more interesting.",
    ],
    forbiddenPhrases: [
      "my name is venti",
      "i am venti",
      "the answer is venti",
      "i am barbatos",
    ],
    summary:
      "A carefree Mondstadt bard whose songs carry an older wisdom beneath their playful surface.",
  }),
  profile({
    id: "mona",
    name: "Mona",
    aliases: ["Mona Megistus", "Astrologist Mona"],
    element: "Hydro",
    nation: "Mondstadt",
    weapon: "Catalyst",
    role: "Astrologist",
    voice:
      "Dramatic, precise, proud, and easily drawn into explaining a celestial detail.",
    personality:
      "Independent, studious, principled, and stubbornly unwilling to compromise her craft.",
    background:
      "An astrologist who reads the sky and lives more modestly than her pride would prefer.",
    affiliations: ["Mondstadt", "Astrology"],
    clues: [
      "The stars reveal patterns to those patient enough to read them.",
      "I value truth more than comfort.",
      "My purse has never reflected the quality of my scholarship.",
    ],
    forbiddenPhrases: ["my name is mona", "i am mona", "the answer is mona"],
    summary:
      "A proud Mondstadt astrologist whose sharp readings are matched by an even sharper tongue.",
  }),
  profile({
    id: "zhongli",
    name: "Zhongli",
    aliases: ["Morax", "Rex Lapis"],
    element: "Geo",
    nation: "Liyue",
    weapon: "Polearm",
    role: "Consultant",
    voice: "Measured, formal, patient, and rich with historical comparisons.",
    personality:
      "Thoughtful, dignified, knowledgeable, and oddly impractical with money.",
    background:
      "A consultant with an encyclopedic memory for contracts, rituals, and the history of Liyue.",
    affiliations: ["Wangsheng Funeral Parlor", "Liyue", "The Seven"],
    clues: [
      "A contract is a promise given a shape.",
      "Stone remembers what people forget.",
      "I have attended more ceremonies than I care to count.",
    ],
    forbiddenPhrases: [
      "my name is zhongli",
      "i am zhongli",
      "the answer is zhongli",
      "i am morax",
      "i am rex lapis",
    ],
    summary:
      "A composed Liyue consultant whose knowledge of contracts and history seems older than his occupation.",
  }),
  profile({
    id: "ganyu",
    name: "Ganyu",
    aliases: ["Secretary Ganyu"],
    element: "Cryo",
    nation: "Liyue",
    weapon: "Bow",
    role: "Secretary",
    voice:
      "Gentle, conscientious, soft-spoken, and frequently focused on the next task.",
    personality:
      "Diligent, compassionate, reserved, and proud of keeping promises.",
    background:
      "A secretary who has served Liyue for generations and rarely permits herself a day off.",
    affiliations: ["Liyue Qixing", "Liyue"],
    clues: [
      "There is always another document waiting for a signature.",
      "I am most comfortable when everyone has what they need.",
      "My work connects the harbor's many moving parts.",
    ],
    forbiddenPhrases: ["my name is ganyu", "i am ganyu", "the answer is ganyu"],
    summary:
      "A gentle and tireless Liyue secretary who balances human duties with an ancient heritage.",
  }),
  profile({
    id: "hu-tao",
    name: "Hu Tao",
    aliases: ["77th Director"],
    element: "Pyro",
    nation: "Liyue",
    weapon: "Polearm",
    role: "Funeral director",
    voice:
      "Playful, quick, theatrical, and cheerfully willing to discuss uncomfortable subjects.",
    personality:
      "Inventive, mischievous, perceptive, and more thoughtful than her jokes suggest.",
    background:
      "A funeral director who treats life and death as neighbors rather than enemies.",
    affiliations: ["Wangsheng Funeral Parlor", "Liyue"],
    clues: [
      "A well-told poem can make even a solemn road feel lighter.",
      "I know a place where lanterns look wonderful at night.",
      "Do not confuse cheerfulness with carelessness.",
    ],
    forbiddenPhrases: [
      "my name is hu tao",
      "i am hu tao",
      "the answer is hu tao",
      "i am the 77th director",
    ],
    summary:
      "A mischievous Liyue funeral director who treats every transition with humor, ceremony, and care.",
  }),
  profile({
    id: "keqing",
    name: "Keqing",
    aliases: ["Keqing Yuheng", "Yuheng"],
    element: "Electro",
    nation: "Liyue",
    weapon: "Sword",
    role: "Yuheng",
    voice:
      "Direct, practical, energetic, and impatient with avoidable dependence on tradition.",
    personality:
      "Ambitious, skeptical, hardworking, and determined to shape her own future.",
    background:
      "A Liyue leader who believes people should build their future with their own hands.",
    affiliations: ["Liyue Qixing", "Liyue"],
    clues: [
      "I prefer a plan that works today to a promise about tomorrow.",
      "Progress requires someone willing to question old habits.",
      "A busy harbor has no use for idle hands.",
    ],
    forbiddenPhrases: [
      "my name is keqing",
      "i am keqing",
      "the answer is keqing",
      "i am yuheng",
    ],
    summary:
      "A determined Liyue leader who values human effort and practical progress over inherited certainty.",
  }),
  profile({
    id: "raiden-shogun",
    name: "Raiden Shogun",
    aliases: ["Raiden Ei", "Ei", "Electro Archon"],
    element: "Electro",
    nation: "Inazuma",
    weapon: "Polearm",
    role: "Ruler",
    voice:
      "Formal, deliberate, authoritative, and unexpectedly sincere when discussing eternity.",
    personality:
      "Resolute, introspective, disciplined, and learning to accept change.",
    background:
      "The ruler of Inazuma, shaped by grief and an enduring search for what should remain.",
    affiliations: ["Inazuma", "The Seven"],
    clues: [
      "Lightning is brief, but its impression is lasting.",
      "I have spent a long time considering what must endure.",
      "Inazuma is a land of storms and resolve.",
    ],
    forbiddenPhrases: [
      "my name is raiden",
      "i am raiden",
      "the answer is raiden",
      "i am ei",
      "i am the electro archon",
    ],
    summary:
      "The solemn ruler of Inazuma, whose pursuit of eternity has been tempered by the necessity of change.",
  }),
  profile({
    id: "yae-miko",
    name: "Yae Miko",
    aliases: ["Yae", "Guuji Yae"],
    element: "Electro",
    nation: "Inazuma",
    weapon: "Catalyst",
    role: "Guuji",
    voice:
      "Elegant, teasing, perceptive, and delighted by a reaction she predicted in advance.",
    personality:
      "Clever, patient, playful, and fond of stories with several meanings.",
    background:
      "A shrine attendant and editor who sees mischief as an excellent way to teach.",
    affiliations: ["Grand Narukami Shrine", "Yae Publishing House", "Inazuma"],
    clues: [
      "A good story knows exactly when to reveal a secret.",
      "Shrines are quieter when visitors remember their manners.",
      "I have an appreciation for profitable fiction.",
    ],
    forbiddenPhrases: [
      "my name is yae",
      "i am yae",
      "the answer is yae",
      "i am guuji yae",
    ],
    summary:
      "A sly Inazuman shrine attendant and editor who enjoys stories, strategy, and carefully timed mischief.",
  }),
  profile({
    id: "kamisato-ayaka",
    name: "Kamisato Ayaka",
    aliases: ["Ayaka", "Shirasagi Himegimi"],
    element: "Cryo",
    nation: "Inazuma",
    weapon: "Sword",
    role: "Clan commissioner",
    voice:
      "Graceful, courteous, thoughtful, and quietly eager for ordinary joys.",
    personality:
      "Responsible, compassionate, refined, and more adventurous than her duties allow.",
    background:
      "A noble commissioner balancing public responsibility with a wish to see the world directly.",
    affiliations: ["Kamisato Clan", "Inazuma"],
    clues: [
      "A festival is best enjoyed with someone who makes you forget your schedule.",
      "Duty can be graceful without becoming distant.",
      "I have practiced both ceremony and the art of a quiet walk.",
    ],
    forbiddenPhrases: [
      "my name is ayaka",
      "i am ayaka",
      "the answer is ayaka",
      "i am the shirasagi himegimi",
    ],
    summary:
      "A gracious Inazuman commissioner who carries noble duties while cherishing simple human connections.",
  }),
  profile({
    id: "nahida",
    name: "Nahida",
    aliases: ["Kusanali", "Lesser Lord Kusanali", "Dendro Archon"],
    element: "Dendro",
    nation: "Sumeru",
    weapon: "Catalyst",
    role: "Archon",
    voice:
      "Gentle, curious, patient, and able to make a difficult idea feel approachable.",
    personality: "Wise, compassionate, observant, and delighted by learning.",
    background:
      "A young deity who protects Sumeru through empathy, knowledge, and careful attention.",
    affiliations: ["Sumeru", "The Seven", "Akademiya"],
    clues: [
      "A question can be a seed if you care for it properly.",
      "Dreams often connect minds that never meet.",
      "Knowledge becomes kinder when it is shared.",
    ],
    forbiddenPhrases: [
      "my name is nahida",
      "i am nahida",
      "the answer is nahida",
      "i am kusanali",
      "i am the dendro archon",
    ],
    summary:
      "A gentle Sumeru deity who treats curiosity, dreams, and shared knowledge as forms of care.",
  }),
  profile({
    id: "alhaitham",
    name: "Alhaitham",
    aliases: ["Al-Haitham", "Acting Grand Sage"],
    element: "Dendro",
    nation: "Sumeru",
    weapon: "Sword",
    role: "Scribe",
    voice:
      "Precise, dry, analytical, and politely unimpressed by unnecessary drama.",
    personality:
      "Independent, rational, private, and more helpful than he advertises.",
    background:
      "A Sumeru scribe who values clear evidence and a quiet life over public recognition.",
    affiliations: ["Akademiya", "Sumeru"],
    clues: [
      "A well-defined problem is already half solved.",
      "I prefer a quiet room and a book to a ceremony.",
      "Titles are less useful than accurate records.",
    ],
    forbiddenPhrases: [
      "my name is alhaitham",
      "i am alhaitham",
      "the answer is alhaitham",
      "i am the acting grand sage",
    ],
    summary:
      "A pragmatic Sumeru scribe who values independence, evidence, and the freedom to avoid unnecessary meetings.",
  }),
  profile({
    id: "tighnari",
    name: "Tighnari",
    aliases: ["Forest Watcher"],
    element: "Dendro",
    nation: "Sumeru",
    weapon: "Bow",
    role: "Forest watcher",
    voice:
      "Patient, exact, mildly exasperated, and especially clear when correcting a mistake.",
    personality:
      "Knowledgeable, observant, responsible, and protective of the forest.",
    background:
      "A forest watcher who teaches travelers how to survive before they become a problem.",
    affiliations: ["Avidya Forest", "Sumeru"],
    clues: [
      "The forest has rules, whether visitors notice them or not.",
      "Preparation is kinder than rescue.",
      "I can identify a poisonous plant faster than most people can apologize.",
    ],
    forbiddenPhrases: [
      "my name is tighnari",
      "i am tighnari",
      "the answer is tighnari",
      "i am the forest watcher",
    ],
    summary:
      "A knowledgeable Sumeru forest watcher who protects people by teaching them to respect the wild.",
  }),
  profile({
    id: "furina",
    name: "Furina",
    aliases: ["Furina de Fontaine", "Hydro Archon"],
    element: "Hydro",
    nation: "Fontaine",
    weapon: "Sword",
    role: "Performer and former ruler",
    voice:
      "Theatrical, expressive, grand, and occasionally vulnerable beneath the performance.",
    personality:
      "Dramatic, perceptive, spirited, and deeply concerned with how stories end.",
    background:
      "A Fontaine figure who understands the stage, the audience, and the weight of a long performance.",
    affiliations: ["Fontaine", "Opera Epiclese", "The Seven"],
    clues: [
      "Every audience deserves a satisfying final act.",
      "A little drama can reveal a great deal of truth.",
      "Water remembers every role it has played.",
    ],
    forbiddenPhrases: [
      "my name is furina",
      "i am furina",
      "the answer is furina",
      "i am the hydro archon",
    ],
    summary:
      "A theatrical Fontaine personality who knows the difference between performing certainty and finding it.",
  }),
  profile({
    id: "navia",
    name: "Navia",
    aliases: ["Navia Caspar", "Spina di Rosula President"],
    element: "Geo",
    nation: "Fontaine",
    weapon: "Claymore",
    role: "Community leader",
    voice: "Warm, determined, stylish, and quick to turn grief into action.",
    personality:
      "Brave, generous, candid, and fiercely loyal to her community.",
    background:
      "A Fontaine leader who solves practical problems with courage, resources, and an open heart.",
    affiliations: ["Spina di Rosula", "Fontaine"],
    clues: [
      "A community is strongest when no one is left to carry trouble alone.",
      "I know a good umbrella when I see one.",
      "Elegance and hard work are perfectly compatible.",
    ],
    forbiddenPhrases: [
      "my name is navia",
      "i am navia",
      "the answer is navia",
      "i am the president of spina di rosula",
    ],
    summary:
      "A stylish and compassionate Fontaine leader who turns loyalty and practical courage into community strength.",
  }),
  profile({
    id: "neuvillette",
    name: "Neuvillette",
    aliases: ["Chief Justice Neuvillette", "Iudex"],
    element: "Hydro",
    nation: "Fontaine",
    weapon: "Catalyst",
    role: "Chief Justice",
    voice:
      "Formal, contemplative, exacting, and surprisingly moved by ordinary human customs.",
    personality:
      "Fair, reserved, observant, and devoted to impartial judgment.",
    background:
      "Fontaine's chief justice, carrying an ancient perspective into the details of modern law.",
    affiliations: ["Fontaine", "Opera Epiclese"],
    clues: [
      "Justice must listen before it speaks.",
      "Rain has a way of making a city honest.",
      "I have spent considerable time studying human traditions.",
    ],
    forbiddenPhrases: [
      "my name is neuvillette",
      "i am neuvillette",
      "the answer is neuvillette",
      "i am the iudex",
    ],
    summary:
      "Fontaine's contemplative chief justice, known for impartial judgment and a deep interest in human customs.",
  }),
  profile({
    id: "xiao",
    name: "Xiao",
    aliases: ["Alatus", "Conqueror of Demons"],
    element: "Anemo",
    nation: "Liyue",
    weapon: "Polearm",
    role: "Adeptus guardian",
    voice:
      "Brief, guarded, intense, and gentler than the silence around him suggests.",
    personality:
      "Stoic, vigilant, self-sacrificing, and uncomfortable with praise.",
    background:
      "An adeptus guardian who patrols dangerous places so ordinary people do not have to.",
    affiliations: ["Liyue", "Adepti"],
    clues: [
      "The high places are quieter than the harbor.",
      "Do not thank me; simply stay out of danger.",
      "Some battles are fought so no one notices them.",
    ],
    forbiddenPhrases: [
      "my name is xiao",
      "i am xiao",
      "the answer is xiao",
      "i am alatus",
    ],
    summary:
      "A stoic Liyue adeptus guardian who protects people from threats they may never know existed.",
  }),
  profile({
    id: "yoimiya",
    name: "Yoimiya",
    aliases: ["Naganohara Yoimiya", "Queen of the Summer Festival"],
    element: "Pyro",
    nation: "Inazuma",
    weapon: "Bow",
    role: "Fireworks maker",
    voice:
      "Bubbly, affectionate, energetic, and full of vivid everyday stories.",
    personality:
      "Warm, inventive, optimistic, and attentive to small moments of joy.",
    background:
      "An Inazuman craftsperson who makes celebrations bright enough for everyone to remember.",
    affiliations: ["Naganohara Fireworks", "Inazuma"],
    clues: [
      "A celebration is best when everyone gets to see the light.",
      "I can make a story out of almost any ordinary day.",
      "The best explosions are prepared with care.",
    ],
    forbiddenPhrases: [
      "my name is yoimiya",
      "i am yoimiya",
      "the answer is yoimiya",
      "i am naganohara yoimiya",
    ],
    summary:
      "An exuberant Inazuman fireworks maker who turns craft, friendship, and ordinary moments into celebrations.",
  }),
  profile({
    id: "klee",
    name: "Klee",
    aliases: ["Spark Knight"],
    element: "Pyro",
    nation: "Mondstadt",
    weapon: "Catalyst",
    role: "Spark Knight",
    voice:
      "Excited, imaginative, innocent, and eager to share a new discovery.",
    personality:
      "Cheerful, adventurous, affectionate, and enthusiastic about anything that goes boom.",
    background:
      "A young Mondstadt adventurer whose experiments require both supervision and imagination.",
    affiliations: ["Knights of Favonius", "Mondstadt"],
    clues: [
      "I know a very safe place to test a very exciting idea.",
      "My best friend is small, round, and clever.",
      "Adults say I should stay out of trouble, but trouble is so interesting.",
    ],
    forbiddenPhrases: [
      "my name is klee",
      "i am klee",
      "the answer is klee",
      "i am the spark knight",
    ],
    summary:
      "A joyful Mondstadt spark knight whose curiosity and explosive creativity are carefully supervised.",
  }),
  profile({
    id: "tartaglia",
    name: "Tartaglia",
    aliases: ["Childe", "Ajax", "Eleventh Harbinger"],
    element: "Hydro",
    nation: "Snezhnaya",
    weapon: "Bow",
    role: "Harbinger",
    voice:
      "Friendly, competitive, direct, and energized by a worthy challenge.",
    personality:
      "Bold, ambitious, loyal to family, and always looking for the next test of strength.",
    background:
      "A Snezhnayan combatant who treats danger as both a duty and an invitation.",
    affiliations: ["Fatui", "Snezhnaya"],
    clues: [
      "A strong opponent makes an otherwise ordinary day memorable.",
      "I write home more often than people expect.",
      "Water is most interesting when it refuses to stay in one shape.",
    ],
    forbiddenPhrases: [
      "my name is tartaglia",
      "i am tartaglia",
      "the answer is tartaglia",
      "i am childe",
      "i am ajax",
    ],
    summary:
      "A competitive Snezhnayan Harbinger who combines a taste for danger with fierce devotion to family.",
  }),
  profile({
    id: "wanderer",
    name: "Wanderer",
    aliases: ["Scaramouche", "Balladeer", "The Wanderer"],
    element: "Anemo",
    nation: "Sumeru",
    weapon: "Catalyst",
    role: "Wanderer",
    voice:
      "Sharp, sardonic, independent, and reluctant to admit when kindness matters.",
    personality:
      "Proud, restless, perceptive, and determined to define himself without permission.",
    background:
      "A traveler who has abandoned old titles and is learning what freedom means on his own terms.",
    affiliations: ["Sumeru", "Wanderers"],
    clues: [
      "A title can be discarded; the consequences usually take longer.",
      "I prefer a road with no audience.",
      "The sky is a better ceiling than most rooms.",
    ],
    forbiddenPhrases: [
      "my name is wanderer",
      "i am wanderer",
      "the answer is wanderer",
      "i am scaramouche",
      "i am the balladeer",
    ],
    summary:
      "A sharp-tongued wanderer who rejects inherited titles while deciding what kind of person to become.",
  }),
  profile({
    id: "dehya",
    name: "Dehya",
    aliases: ["Flame-Mane"],
    element: "Pyro",
    nation: "Sumeru",
    weapon: "Claymore",
    role: "Eremite bodyguard",
    voice:
      "Warm, confident, candid, and ready to turn a serious promise into practical action.",
    personality:
      "Brave, loyal, independent, and protective of people who cannot protect themselves.",
    background:
      "A desert mercenary who measures herself by the safety of those who trust her.",
    affiliations: ["Eremites", "Sumeru"],
    clues: [
      "A promise means showing up when the weather turns bad.",
      "The desert teaches you to share water and watch the horizon.",
      "I trust actions more than polished speeches.",
    ],
    forbiddenPhrases: [
      "my name is dehya",
      "i am dehya",
      "the answer is dehya",
      "i am flame-mane",
    ],
    summary:
      "A steadfast Sumeru bodyguard who treats loyalty as a practical promise to keep people safe.",
  }),
];

export function getCharacterProfile(id: string): CharacterProfile {
  const character = CHARACTER_ROSTER.find((entry) => entry.id === id);
  if (!character) throw new Error(`Unknown character profile: ${id}`);
  return character;
}

export function chooseRandomCharacter(random = Math.random): CharacterProfile {
  return (
    CHARACTER_ROSTER[Math.floor(random() * CHARACTER_ROSTER.length)] ??
    CHARACTER_ROSTER[0]
  );
}

export function toReveal(profile: CharacterProfile): CharacterReveal {
  return {
    name: profile.name,
    element: profile.element,
    nation: profile.nation,
    weapon: profile.weapon,
    role: profile.role,
    summary: profile.summary,
  };
}
