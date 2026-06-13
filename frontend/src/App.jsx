import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import CosmicBackground from './components/CosmicBackground';
import AsuraLightning from './components/AsuraLightning';
import AsuraBoonPanel from './components/AsuraBoonPanel';
import YugaChronicles from './components/YugaChronicles';
import AsuraFireRain from './components/AsuraFireRain';
import KaliYugaBackground from './components/KaliYugaBackground';
import BhasmaBackground from './components/BhasmaBackground';
import DharmaCompass from './components/DharmaCompass';
import DimensionalCard from './components/DimensionalCard';
import KalkiCard from './components/KalkiCard';
import DivineCard from './components/DivineCard';
import AsuraCard from './components/AsuraCard';
import useAppSound from './hooks/useAppSound';
import KalkiPanelBackground from './components/KalkiPanelBackground';
import { callAi } from './utils/api';
import Tilt from 'react-parallax-tilt';

import rawCodex from '../../data/codex.json';

const codexData = rawCodex;

/* --- MOCK DATA FOR KALI YUGA --- */
const mockKalkiArmy = [
  {
    name: "Kalki Avatar",
    title: "The Final Avatar",
    desc: "The destroyer of filth, riding the white horse Devadatta.",
    img: "https://pbs.twimg.com/media/GG8FELCbsAAEUb2.jpg", 
    details: "Kalki will end the Kali Yuga by cleansing the world of adharma. He wields the sword Ratnamaru.",
    mantra: { sanskrit: "ॐ कल्किने नमः", english: "Om Kalkine Namah" },
    temples: []
  },
  {
    name: "Lord Hanuman",
    title: "The Chiranjeevi (Immortal)",
    desc: "The mighty Vanara god who waits to serve Kalki with unmatched strength.",
    img: "https://paintwaint.in/cdn/shop/files/LordHanumanFull.png?crop=center&height=1186&v=1712553654&width=1186",
    details: "Hanuman joins the battle to crush adharma with his mace and devotion.",
    mantra: { sanskrit: "ॐ हनुमते नमः", english: "Om Hanumate Namah" }
  },
  {
    name: "Lord Parashurama",
    title: "The Warrior Sage",
    desc: "The 6th Avatar of Vishnu and the heavy-weapon guru of Kalki.",
    img: "https://i.pinimg.com/736x/3a/08/b1/3a08b15704ec93cf6fe51b79fc61b802.jpg",
    details: "He trains Kalki in martial arts and gifts him celestial weapons.",
    mantra: { sanskrit: "ॐ परशुरामाय नमः", english: "Om Parashuramaya Namah" }
  },
  {
    name: "Ashwatthama",
    title: "The Cursed Warrior",
    desc: "The son of Drona, seeking redemption through the final war.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8wfu3wHqpCMtwT1-iI5lVDOPKtYGU_W5reA&s",
    details: "Possessing the gem of immortality, he fights as a furious commander.",
    mantra: { sanskrit: "ॐ अश्वत्थाम्ने नमः", english: "Om Ashwatthamne Namah" }
  },
  {
    name: "Mahabali",
    title: "The Asura King",
    desc: "The benevolent ruler of the netherworld, returning to uphold Dharma.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGoy1MH9Oy_puXGPLvhRFs756xIa0ldw-Llg&s",
    details: "Though an Asura by birth, his devotion to Vishnu makes him a pillar of the army.",
    mantra: { sanskrit: "ॐ महाबलये नमः", english: "Om Mahabalaye Namah" }
  },
  {
    name: "Veda Vyasa",
    title: "The Eternal Sage",
    desc: "The compiler of the Vedas and author of the Mahabharata.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGB9kfFQi5YqwA88GM9e5KcCVYua2p9H8Y6Q&s",
    details: "He provides the spiritual vision and knowledge necessary for the new age.",
    mantra: { sanskrit: "ॐ व्यासाय नमः", english: "Om Vyasaya Namah" }
  },
  {
    name: "Kripacharya",
    title: "The Royal Preceptor",
    desc: "The masterful teacher of warfare from the Mahabharata era.",
    img: "https://i.pinimg.com/736x/78/b6/3b/78b63b32c0e7525c4dc32a58f1fee1f9.jpg",
    details: "He brings ancient strategic genius to the cosmic battlefield.",
    mantra: { sanskrit: "ॐ कृपाय नमः", english: "Om Kripaya Namah" }
  },
  {
    name: "Vibhishana",
    title: "The Righteous King of Lanka",
    desc: "The brother of Ravana who stands eternally for the truth.",
    img: "https://www.shutterstock.com/image-photo/raavan-brother-vibhishan-260nw-2464262867.jpg",
    details: "He aids Kalki with his knowledge of Asura limitations and righteousness.",
    mantra: { sanskrit: "ॐ विभीषणाय नमः", english: "Om Vibhishanaya Namah" }
  }
];

const mockKaliArmy = [
  {
    name: "Kali Purusha",
    title: "The Demon of Kali Yuga",
    desc: "The personification of corruption, greed, and time.",
    img: "https://i.pinimg.com/736x/47/db/1a/47db1a40220b556030fd1803f08ab0ea.jpg", 
    details: "Kali Purusha is the source of all vice in the current age. He is the nemesis of Kalki.",
    mantra: { sanskrit: "ॐ कलये नमः", english: "Om Kalaye Namah" },
    temples: []
  },
  {
    name: "Koka & Vikoka",
    title: "Twin Generals of Adharma",
    desc: "Detailed in the Kalki Purana as the terrifying twin demon generals.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nn75P_M4O1kZjYUDtGHYFCZ-xB8ojGb_Fw&s",
    details: "They lead the vast armies of barbarians against the forces of Dharma.",
    mantra: { sanskrit: "ॐ कोकाय नमः", english: "Om Kokaya Namah" }
  },
  {
    name: "Rahu",
    title: "The Eclipser of Light",
    desc: "The severed head demon who swallows the sun, casting shadows over truth.",
    img: "https://www.shutterstock.com/image-photo/mystical-depiction-rahu-shadow-deity-260nw-2548521747.jpg", 
    details: "Rahu creates cosmic confusion and illusion, empowering the deceptive tactics used by Kali's army.",
    mantra: { sanskrit: "ॐ राहवे नमः", english: "Om Rahave Namah" }
  },
  {
    name: "Alakshmi",
    title: "The Bringer of Misfortune",
    desc: "The dark sister of Lakshmi, embodying poverty, strife, and grief.",
    img: "https://images.indianexpress.com/2024/10/alakshmi.jpg",
    details: "She drains the spiritual wealth of humanity, leaving them vulnerable to Kali's corruption.",
    mantra: { sanskrit: "ॐ अलक्ष्म्यै नमः", english: "Om Alakshmyai Namah" }
  },
  {
    name: "Dambha",
    title: "The Lord of Hypocrisy",
    desc: "The general of deceit who weaponizes false righteousness.",
    img: "https://aiartshop.com/cdn/shop/files/hindu-mythology-demon-ai-artwork-832_600x600.webp?v=1714335853",
    details: "Dambha ensures that even the 'holy' men of the Kali Yuga work to mislead the masses.",
    mantra: { sanskrit: "ॐ दम्भाय नमः", english: "Om Dambhaya Namah" }
  },
  {
    name: "Lobha",
    title: "The Demon of Greed",
    desc: "An insatiable entity that drives mankind to destroy nature for gold.",
    img: "https://cdna.artstation.com/p/assets/images/images/018/313/176/large/edwin-sablaya-greed.jpg?1558920949",
    details: "He fuels the wars and exploitation that ravage the earth in the final age.",
    mantra: { sanskrit: "ॐ लोभाय नमः", english: "Om Lobhaya Namah" }
  },
  {
    name: "Krodha",
    title: "The Spirit of Wrath",
    desc: "The embodiment of blind rage and senseless violence.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ23VlOGlXl-CQ8M7fWRL45L_peIIYOFCBmmQ&s", 
    details: "Krodha incite riots and hatred, ensuring peace remains impossible.",
    mantra: { sanskrit: "ॐ क्रोधाय नमः", english: "Om Krodhaya Namah" }
  },
  {
    name: "Ketu",
    title: "The Comet of Doom",
    desc: "The tail of the demon, representing detachment and catastrophic endings.",
    img: "https://www.shutterstock.com/image-photo/a-cosmic-mystical-depiction-rahu-260nw-2548556603.jpg",
    details: "Ketu signals the final disasters and the unraveling of the material world.",
    mantra: { sanskrit: "ॐ केतवे नमः", english: "Om Ketave Namah" }
  }
];


const fallbackQuizPool = [
{ question: 'Who is known as the Preserver in the Trimurti?', options: ['Brahma', 'Shiva', 'Vishnu', 'Ganesha'], answer: 'Vishnu' },
{ question: 'During which festival is Lakshmi primarily worshipped?', options: ['Holi', 'Diwali', 'Navratri', 'Maha Shivaratri'], answer: 'Diwali' },
{ question: 'Who is the consort of Lord Shiva?', options: ['Saraswati', 'Lakshmi', 'Parvati', 'Sita'], answer: 'Parvati' },
{ question: 'Which avatar of Vishnu delivered the Bhagavad Gita?', options: ['Rama', 'Krishna', 'Matsya', 'Kurma'], answer: 'Krishna' },
{ question: 'Who is the ten-headed Rakshasa king of Lanka?', options: ['Kumbhakarna', 'Ravana', 'Hiranyakashipu', 'Kansa'], answer: 'Ravana' },
{ question: 'Which Asura could only be killed by the son of Shiva?', options: ['Mahishasura', 'Bhasmasura', 'Tarakasura', 'Raktabija'], answer: 'Tarakasura' },
{ question: "Which demon's blood drops created duplicates of himself in battle?", options: ['Ravana', 'Hiranyaksha', 'Bhasmasura', 'Raktabija'], answer: 'Raktabija' },
{ question: 'Who dragged the Earth into the cosmic ocean?', options: ['Hiranyakashipu', 'Hiranyaksha', 'Ahiravan', 'Kansa'], answer: 'Hiranyaksha' },
{ question: 'Which Asura was defeated by Goddess Durga after a nine-day battle?', options: ['Mahishasura', 'Ravana', 'Andhakasura', 'Bhasmasura'], answer: 'Mahishasura' }];


const offlineCodex = {
  narsingh: {
    desc: 'Narasimha is the fierce half-human, half-lion avatar of Lord Vishnu.',
    details: 'He incarnated to destroy the demon king Hiranyakashipu, restore dharma, and protect his great devotee Prahlada from harm.',
    sanskrit: 'ॐ नृसिंहाय नमः',
    english: 'Om Nrisimhaya Namah',
    temples: [
    { name: 'Ahobilam Temple', city: 'Tamil Nadu' },
    { name: 'Yadagirigutta', city: 'Telangana' }]

  },
  surya: {
    desc: 'Surya is the chief solar deity and the supreme source of life and light.',
    details: 'He rides a glorious chariot drawn by seven horses representing the colors of the rainbow. He is worshipped daily for health, vitality, and the dispelling of cosmic darkness.',
    sanskrit: 'ॐ सूर्याय नमः',
    english: 'Om Suryaya Namah',
    temples: [
    { name: 'Konark Sun Temple', city: 'Odisha' },
    { name: 'Modhera Sun Temple', city: 'Gujarat' }]

  },
  indra: {
    desc: 'Indra is the king of the Devas and the lord of heavens, storms, and lightning.',
    details: 'Wielding the mighty Vajra (thunderbolt) and riding the multi-headed elephant Airavata, he leads the divine forces in the eternal cosmic battle against demons.',
    sanskrit: 'ॐ इन्द्राय नमः',
    english: 'Om Indraya Namah',
    temples: []
  },
  agni: {
    desc: 'Agni is the Hindu god of fire and the ultimate cosmic messenger.',
    details: 'He accepts offerings poured into the sacred fire and delivers them to the heavenly deities. He symbolizes purity and spiritual awakening.',
    sanskrit: 'ॐ अग्नये नमः',
    english: 'Om Agnaye Namah',
    temples: [
    { name: 'Agni Temple', city: 'Kolkata' }]

  },
  kalki: {
    desc: 'Kalki is the prophesied tenth and final mighty avatar of Lord Vishnu.',
    details: 'He is destined to appear at the end of the Kali Yuga astride a white horse, wielding a blazing sword to annihilate corruption and usher in the Satya Yuga.',
    sanskrit: 'ॐ कल्किने नमः',
    english: 'Om Kalkine Namah',
    temples: []
  },
  varaha: {
    desc: 'Varaha is the third avatar of Vishnu, taking the form of a magnificent boar.',
    details: 'He famously rescued the Earth from the cosmic ocean after it was dragged down by the demon Hiranyaksha.',
    sanskrit: 'ॐ वराहाय नमः',
    english: 'Om Varahaya Namah',
    temples: [
    { name: 'Sri Varahaswami Temple', city: 'Tirumala' }]

  },
  kurma: {
    desc: 'Kurma is the giant tortoise avatar of Vishnu.',
    details: 'He served as the divine foundation block for Mount Mandara during the Samudra Manthan.',
    sanskrit: 'ॐ कूर्माय नमः',
    english: 'Om Kurmaya Namah',
    temples: [
    { name: 'Kurma Temple', city: 'Srikurmam' }]

  },
  matsya: {
    desc: 'Matsya is the first avatar of Vishnu in the form of a giant fish.',
    details: 'He saved the first man, Manu, along with the seeds of all living creatures and the sacred Vedas, from a devastating cosmic flood.',
    sanskrit: 'ॐ मत्स्याय नमः',
    english: 'Om Matsyaya Namah',
    temples: []
  },
  yama: {
    desc: 'Yama is the god of death, dharma, and justice.',
    details: 'He acts as the ultimate judge of souls, weighing a person\'s karma and actions.',
    sanskrit: 'ॐ यमाय नमः',
    english: 'Om Yamaya Namah',
    temples: [
    { name: 'Dharmeshwar Mahadev', city: 'Varanasi' }]

  },
  varuna: {
    desc: 'Varuna is the sovereign god of the oceans, water, and the celestial ocean.',
    details: 'In Vedic times, he was one of the most supreme deities, upholding the cosmic order.',
    sanskrit: 'ॐ वरुणाय नमः',
    english: 'Om Varunaya Namah',
    temples: []
  },
  kuber: {
    desc: 'Kubera is the Lord of Wealth and the god-king of the Yakshas.',
    details: 'He is the treasurer of the gods and the guardian of the North. Devotees pray to him for financial stability.',
    sanskrit: 'ॐ कुबेराय नमः',
    english: 'Om Kuberaya Namah',
    temples: [
    { name: 'Kuber Bhandari Temple', city: 'Mathura' }]

  }
};

const shuffle = (items) => [...items].sort(() => 0.5 - Math.random());

export default function App() {
  const { playClick, playHover, playSuccess, playError, playGodMode, playAsuraMode } = useAppSound();
  const [user, setUser] = useState(null);
  const [isGodMode, setIsGodMode] = useState(true);
  const [isKaliYugaMode, setIsKaliYugaMode] = useState(false);
  const [showYugaChronicles, setShowYugaChronicles] = useState(false); // NEW STATE FOR NAVIGATION
  const [gods, setGods] = useState(codexData.gods);
  const [asuras, setAsuras] = useState(codexData.asuras);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [panelEntity, setPanelEntity] = useState(null);
  const [aiFactContent, setAiFactContent] = useState('');
  const [aiFactVisible, setAiFactVisible] = useState(false);
  const [aiFactLoading, setAiFactLoading] = useState(false);
  const [compareHtml, setCompareHtml] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareVisible, setCompareVisible] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [availableVoices, setAvailableVoices] = useState([]);

  const festivals = useMemo(() => [...codexData.festivals].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), []);
  const displayedEntities = isKaliYugaMode 
    ? (isGodMode ? mockKalkiArmy : mockKaliArmy) 
    : (isGodMode ? gods : asuras);

  useEffect(() => {
    // Determine the base theme
    document.body.classList.toggle('light-theme', isGodMode);
    
    // Determine Kali Yuga Mode variants
    if (isKaliYugaMode) {
      document.body.classList.add('kali-theme-active');
      if (isGodMode) {
        document.body.classList.add('kalki-mode');
        document.body.classList.remove('kali-mode');
      } else {
        document.body.classList.add('kali-mode');
        document.body.classList.remove('kalki-mode');
      }
    } else {
      document.body.classList.remove('kali-mode', 'kalki-mode', 'kali-theme-active');
    }
  }, [isGodMode, isKaliYugaMode]);


  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    setUserAnswers(Array(quizQuestions.length).fill(''));
    setQuizScore(null);
    setQuizSubmitted(false);
    setQuizFeedback([]);
  }, [quizQuestions]);

  const playMantra = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = isKaliYugaMode ? 0.55 : 0.7; // Slower, dragging in Kali Yuga
    utterance.pitch = isKaliYugaMode ? 0.1 : (isGodMode ? 0.8 : 0.4); // Extremely low/broken frequency
    if (availableVoices.length === 0) {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    }
    const hindiVoices = availableVoices.filter((voice) => voice.lang.includes('hi') || voice.lang.includes('IN'));
    if (hindiVoices.length > 0) {
      const googleVoice = hindiVoices.find((voice) => voice.name.includes('Google'));
      utterance.voice = googleVoice ?? hindiVoices[0];
    }
    window.speechSynthesis.speak(utterance);
  };

  const toggleEntitySelection = (entity) => {
    setSelectedEntities((prev) => {
      const exists = prev.some((item) => item.name === entity.name);
      if (exists) {
        return prev.filter((item) => item.name !== entity.name);
      }
      if (prev.length >= 2) {
        window.alert('Select only two for comparison.');
        return prev;
      }
      return [...prev, entity];
    });
  };

  const handleCompare = async () => {
    if (selectedEntities.length !== 2) return;
    setCompareLoading(true);
    setCompareVisible(false);

    const entityType = isGodMode ? 'Hindu deity' : 'Hindu Asura (Demon)';
    const prompt = `You are a master of Hindu mythology. Compare ${selectedEntities[0].name} and ${selectedEntities[1].name} (${entityType}s) side-by-side. \
Format your response as an **HTML Table** (using <table>, <tr>, <th>, <td> tags). \
The table must have 3 columns: <th>Feature</th>, <th>${selectedEntities[0].name}</th>, <th>${selectedEntities[1].name}</th>. \
The rows must cover: \
1. Core Role & Domain \
2. Iconography & Weapons \
3. Key Lore / Story \
4. Philosophical Meaning \
\
After the table, provide an <h2>The Key Difference</h2> tag and a <p> paragraph explaining the fundamental contrast. \
Do not include any \`\`\`html code blocks or markdown syntax. Just return the raw HTML string.`;

    const templeList = (entity) =>
    entity.temples && entity.temples.length ? entity.temples.map((t) => t.name).join(', ') : 'associated realms';
    
    // Fallback HTML string
    const fallback = `
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>${selectedEntities[0].name}</th>
            <th>${selectedEntities[1].name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Core Role & Domain</strong></td>
            <td>${selectedEntities[0].title}. ${selectedEntities[0].desc}</td>
            <td>${selectedEntities[1].title}. ${selectedEntities[1].desc}</td>
          </tr>
          <tr>
            <td><strong>Iconography & Weapons</strong></td>
            <td>${selectedEntities[0].details.substring(0, 100)}...</td>
            <td>${selectedEntities[1].details.substring(0, 100)}...</td>
          </tr>
          <tr>
            <td><strong>Key Lore / Story</strong></td>
            <td>Linked to: ${templeList(selectedEntities[0])}</td>
            <td>Linked to: ${templeList(selectedEntities[1])}</td>
          </tr>
          <tr>
            <td><strong>Philosophical Meaning</strong></td>
            <td>Represents order, preservation, or specific cosmic energy.</td>
            <td>Represents power, challenge, or transformation.</td>
          </tr>
        </tbody>
      </table>
      <h2>The Key Difference</h2>
      <p>The absolute core contrast lies in their cosmic function—one maintaining the cosmic order while the other challenges or enforces it through different means.</p>
    `;

    try {
      const aiResponse = await callAi({ prompt, fallback, responseType: 'text' });
      const content = typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse);
      setCompareHtml(content);
    } catch (error) {
      setCompareHtml(fallback);
    } finally {
      setCompareVisible(true);
      setCompareLoading(false);
    }
  };

  const handleExpandEntry = async () => {
    if (!panelEntity) return;
    setAiFactLoading(true);
    setAiFactVisible(false);
    const entityType = isGodMode ? 'Hindu deity' : 'Hindu Asura (Demon)';
    const prompt = `You are an expert in Hindu mythology. Write a beautiful, descriptive encyclopedia entry for the ${entityType} ${panelEntity.name}. Format your response EXACTLY using these Markdown headings:\
## Origins & Lore\
## Symbolic Meaning\
## Major Conflict or Worship\
## Hidden Fact\
\
CRITICAL INSTRUCTION: You MUST place a double line break (\
\
) immediately after every single Markdown heading. Write the content exclusively in rich, descriptive PARAGRAPHS. DO NOT use any bullet points or numbered lists.`;
    const fallback = `*⚠️ AI Quota Reached. Displaying Local Archive Data:*\
\
## Origins & Lore\
${panelEntity.name} is deeply rooted in Hindu traditions as ${panelEntity.title}. ${panelEntity.desc} Their stories are woven into the very fabric of the ancient epics.\
\
## Symbolic Meaning\
In sacred art and scripture, this figure is depicted with profound symbolism. ${panelEntity.details}\
\
## Major Conflict or Worship\
Devotees remember ${panelEntity.name} through rituals, festivals, and epic battles that underline their significance.\
\
## Hidden Fact\
According to esoteric folklore, their mythological presence represents deeper psychological and cosmic truths about the human condition.`;

    try {
      const aiResponse = await callAi({ prompt, fallback, responseType: 'text' });
      const content = typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse);
      setAiFactContent(content);
    } catch (error) {
      setAiFactContent(fallback);
    } finally {
      setAiFactVisible(true);
      setAiFactLoading(false);
    }
  };

  const handleQuizGenerate = async () => {
    setQuizLoading(true);
    const activeType = isGodMode ? 'Hindu Gods/Deities' : 'Hindu Asuras/Demons';
    const prompt = `Generate a 5-question multiple choice quiz completely focused on ${activeType} in Hindu mythology. \
You are NOT restricted to any specific list. Create questions about ANY well-known ${activeType}. \
Ensure the questions are challenging, completely random, and different every time I ask. \
Strict JSON format: {"questions":[{"question":"...","options":["...","...","...","..."],"answer":"..."}]}`;

    const dynamicPool = [...fallbackQuizPool];
    const activeList = isGodMode ? gods : asuras;
    if (activeList.length > 14) {
      for (let i = 14; i < activeList.length; i++) {
        const entity = activeList[i];
        dynamicPool.push({
          question: `What is the primary domain or title of ${entity.name}?`,
          options: shuffle([entity.title, 'The Destroyer', 'King of Lanka', 'Remover of Obstacles']),
          answer: entity.title
        });
      }
    }

    const shuffledFallback = shuffle(dynamicPool).slice(0, 5);
    const fallbackJson = { questions: shuffledFallback };

    try {
      const aiResponse = await callAi({ prompt, fallback: fallbackJson, responseType: 'json' });
      const parsed = typeof aiResponse === 'string' ? fallbackJson : aiResponse;
      const normalized = parsed.questions?.map((question) => ({
        question: question.question,
        options: question.options,
        answer: question.answer
      })) ?? fallbackJson.questions;
      setQuizQuestions(normalized);
    } catch (error) {
      setQuizQuestions(fallbackJson.questions);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerChange = (index, option) => {
    setUserAnswers((prev) => {
      const next = [...prev];
      next[index] = option;
      return next;
    });
  };

  const handleQuizSubmit = () => {
    if (userAnswers.some((answer) => !answer)) return;
    const feedback = quizQuestions.map((question, index) => {
      if (question.answer === userAnswers[index]) {
        return 'Correct!';
      }
      return `Incorrect. The correct answer was: ${question.answer}`;
    });
    const score = quizQuestions.reduce((acc, question, index) => question.answer === userAnswers[index] ? acc + 1 : acc, 0);
    setQuizFeedback(feedback);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score > 0) playSuccess();
    else playError();

    if (score === quizQuestions.length) {
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b', '#10b981', '#ffffff'] });
    } else if (score >= 3) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b'] });
    } else if (score > 0) {
      confetti({ particleCount: 40, spread: 40, origin: { y: 0.6 }, colors: ['#94a3b8', '#fbbf24'] });
    }
  };

  const handleAddEntity = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('godName')?.trim() ?? '';
    const title = data.get('godTitle')?.trim() ?? '';
    let img = data.get('godImg')?.trim(); 

    if (!name || !title) return;

    if (!img) {
      // If no image provided, generate one via NVIDIA NIM (if available)
      try {
        setFormMessage(`Summoning visual manifestation of ${name}...`);
        const imagePrompt = `Hindu mythology, ${isGodMode ? 'god' : 'demon'} ${name}, ${title}, sacred art, detailed, 8k, cinematic lighting, photorealistic, divine aura`;
        
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: imagePrompt })
        });
        
        if (response.ok) {
          const json = await response.json();
          if (json.imageUrl) {
             img = json.imageUrl;
          }
        }
      } catch (err) {
        console.error("Image generation failed", err);
      }
    }

    // Default fallback if generation fails or is skipped
    img = img || 'https://cdn.pixabay.com/photo/2017/01/31/13/14/avatar-2026510_1280.png';

    setFormMessage(`Manifesting ${isGodMode ? 'deity' : 'asura/demon'} & fetching authentic info...`);
    const prompt = `Generate accurate information for the Hindu ${isGodMode ? 'deity' : 'asura/demon'} "${name}", known as "${title}". Respond ONLY with a valid JSON object using this exact structure:
{
  "desc": "A brief 2-sentence summary of the ${isGodMode ? 'deity' : 'asura/demon'}.",
  "details": "A rich, detailed 1-paragraph explanation of their lore, symbolism, and significance.",
  "sanskrit": "Their most famous Sanskrit mantra, chant, or war cry (MUST be in pure Devanagari script).",
  "english": "The English transliteration of the chant.",
  "temples": [
     {"name": "Name of a famous associated temple or realm", "city": "Location"}
  ]
}`;

    const searchName = name.toLowerCase();
    const fallbackData =
    Object.entries(offlineCodex).find(([key]) => searchName.includes(key))?.[1] ?? {
      desc: `A powerful manifestation representing ${title}. Known and revered across ancient traditions.`,
      details: `${name}, the ${title}, is a profound symbol of cosmic energy. Devotees honor this form to bring balance, courage, and divine blessings into their lives.`,
      sanskrit: 'ॐ दिव्य तत्त्वाय नमः',
      english: 'Om Divya Tattvaya Namah',
      temples: []
    };

    try {
      const aiResponse = await callAi({ prompt, fallback: fallbackData, responseType: 'json' });
      const payload = typeof aiResponse === 'string' ? fallbackData : aiResponse;
      const newEntity = {
        name,
        title,
        desc: payload.desc,
        details: payload.details,
        img,
        mantra: { sanskrit: payload.sanskrit, english: payload.english },
        temples: payload.temples ?? []
      };
      if (isGodMode) {
        setGods((prev) => [...prev, newEntity]);
      } else {
        setAsuras((prev) => [...prev, newEntity]);
      }
      setFormMessage(`${name} has been added to the codex.`);
      form.reset();
    } catch (error) {
      setFormMessage('Unable to fetch AI data right now. Try again later.');
    }
  };

  const openEntityPanel = (entity) => {
    setPanelEntity(entity);
    setAiFactVisible(false);
    setAiFactContent('');
    setAiFactLoading(false);
  };

  const closePanel = () => {
    setPanelEntity(null);
    window.speechSynthesis?.cancel();
  };

  const handleThemeToggle = () => {
    if (isGodMode) {
      playAsuraMode();
    } else {
      playGodMode();
    }
    setIsGodMode((prev) => !prev);
    setSelectedEntities([]);
    setCompareHtml('');
    setCompareVisible(false);
    setPanelEntity(null);
    setAiFactVisible(false);
    setAiFactContent('');
  };

  const mainTitle = isKaliYugaMode 
  ? (isGodMode ? 'Warriors of Kalki Avatar' : 'Demons of Kali Yuga')
  : (isGodMode ? 'Encyclopedia of Hindu Gods' : 'Encyclopedia of Hindu Asuras'); 
  
  // Quiz Button Text
  const quizButtonText = isKaliYugaMode 
     ? (isGodMode ? 'Test Your Purity' : 'Trial of Corrosion') 
     : 'Generate Mythology Quiz';

  const addFormTitle = isKaliYugaMode
    ? (isGodMode ? 'Summon the New Dawn' : 'Salvage Myth')
    : (isGodMode ? 'Discover a New Deity' : 'Discover a New Asura');

  const addButtonText = isKaliYugaMode
    ? (isGodMode ? 'Ascend' : 'Extract Ancient Record')
    : (isGodMode ? 'Manifest Deity' : 'Summon Asura');
    
  const addPlaceholder = isKaliYugaMode
    ? (isGodMode ? 'Key to Satya Yuga' : 'Fragment of Lost Lore')
    : (isGodMode ? 'Domain / Title' : 'Demonic Title / Power');

  const themeButtonLabel = isKaliYugaMode
    ? (isGodMode ? '⚔️ Reveal Kalki\'s Army' : '💀 Start the Purification')
    : (isGodMode ? '🔥 Dark Asura Theme' : '☀️ Divine Gods Theme');

  const MainWrapper = isKaliYugaMode && !isGodMode 
    ? BhasmaBackground 
    : ({ children }) => <>{children}</>;

  const themeClass = isKaliYugaMode 
    ? (isGodMode ? 'theme-kalki' : 'theme-kali') 
    : (isGodMode ? 'theme-gods' : 'theme-asuras');

  return (
    <MainWrapper>
      <div 
        className={`app-shell ${isKaliYugaMode ? 'kali-theme-active' : ''} ${themeClass}`}
        style={isKaliYugaMode && !isGodMode ? {
          position: 'relative',
          zIndex: 10,
          background: 'transparent',
          minHeight: '100vh'
        } : {}}
      >
        {/* Background System Layer */}
        {!(isKaliYugaMode && !isGodMode) && (
          <div className="background-layer" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            {isKaliYugaMode && isGodMode && <KaliYugaBackground isGodMode={isGodMode} />}

            {!isKaliYugaMode && isGodMode && (
              <CosmicBackground /> // Vaikunth Theme
            )}

            {!isKaliYugaMode && !isGodMode && (
              <>
                <div className="asura-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                <AsuraFireRain />
                <div className="lightning-strike" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                <AsuraLightning />
              </>
            )}
          </div>
        )}

        {/* Main Content Layer */}
        <div className={`content-layer ${panelEntity ? 'sidebar-open' : ''}`} style={{ position: 'relative', zIndex: 10 }}>
        <div className="top-controls">
        {user ? (
          <UserProfile 
            user={user} 
            onLogout={() => { playClick(); setUser(null); setIsKaliYugaMode(false); }} 
            onToggleKaliYuga={() => { playClick(); setIsKaliYugaMode(!isKaliYugaMode); }}
            isKaliYuga={isKaliYugaMode}
            onUpdateUser={setUser}
          />
        ) : (
          <button className="top-btn" id="openAuthBtn" onMouseEnter={playHover} onClick={() => { playClick(); setModalOpen(true); }}>
            🚪 Enter Shrine
          </button>
        )}
        <button className="top-btn" onMouseEnter={playHover} onClick={() => { playClick(); setShowYugaChronicles(!showYugaChronicles); }}>
          {showYugaChronicles ? 'Return to Codex' : 'Yuga Chronicles'}
        </button>
        <button className="top-btn theme-toggle" id="themeToggleBtn" onMouseEnter={playHover} onClick={handleThemeToggle}>
          {themeButtonLabel}
        </button>
      </div>

      {!showYugaChronicles ? (
        <>
          <h1 id="mainTitle">{mainTitle}</h1>

      <div className="compare-bar" id="compare-bar" style={{ display: selectedEntities.length > 0 ? 'flex' : 'none' }}>
        <button id="compare-btn" disabled={selectedEntities.length !== 2 || compareLoading} onMouseEnter={playHover} onClick={() => { playClick(); handleCompare(); }}>
          {compareLoading ? 'Consulting ancient texts...' : 'Compare Selected Entities'}
        </button>
      </div>

      <div
        id="compare-result"
        className={compareVisible ? 'show fade-in' : ''}
        dangerouslySetInnerHTML={{ __html: compareHtml }} />
      

      <motion.div className={isKaliYugaMode && isGodMode ? 'marble-card' : 'container-box'} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {isKaliYugaMode && isGodMode && <div className="card-glare"></div>}
        <div className={isKaliYugaMode && isGodMode ? 'gold-border-box' : ''} style={{ width: '100%', boxSizing: 'border-box' }}>
        <h3 id="quizTitle" className={isKaliYugaMode && isGodMode ? 'card-title' : ''}>Test Your Knowledge</h3>
        <div style={{ textAlign: 'center' }}>
          <button id="quizBtn" className={isKaliYugaMode && isGodMode ? 'gold-premium-btn' : ''} onMouseEnter={playHover} onClick={() => { playClick(); handleQuizGenerate(); }} disabled={quizLoading}>
            {quizLoading ? 'Communing with the Ether...' : quizButtonText}
          </button>
        </div>
        <div id="quizArea" style={{ marginTop: '24px' }}>
          {quizQuestions.map((question, index) =>
          <div className="quiz-question" id={`qBlock${index}`} key={question.question}>
              <b>
                Question {index + 1}: {question.question}
              </b>
              {question.options.map((option) =>
            <label
              key={`${question.question}-${option}`}
              className={`quiz-option ${quizSubmitted ? 'disabled' : ''}`}
              id={`label-q${index}-opt${option}`}>
              
                  <input
                type="radio"
                name={`q${index}`}
                value={option}
                disabled={quizSubmitted}
                checked={userAnswers[index] === option}
                onChange={() => { playClick(); handleAnswerChange(index, option); }} />
              
                  <span className="opt-text">{option}</span>
                </label>
            )}
              <div id={`fb${index}`} style={{ marginTop: '10px', fontWeight: 600 }}>
                {quizSubmitted ? quizFeedback[index] : ''}
              </div>
            </div>
          )}
          {quizQuestions.length > 0 &&
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
              {!quizSubmitted &&
            <button id="submitQuizBtn" onMouseEnter={playHover} disabled={userAnswers.some((answer) => !answer)} onClick={() => { playClick(); handleQuizSubmit(); }}>
                  Submit Answers
                </button>
            }
              {quizSubmitted && quizScore !== null &&
            <div id="finalScoreArea" style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.5em', color: 'var(--gold)', fontWeight: 'bold' }}>
                  Final Score: {quizScore} / {quizQuestions.length}
                </div>
            }
              {quizSubmitted &&
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button onMouseEnter={playHover} onClick={() => { playClick(); handleQuizGenerate(); }}>Play Again</button>
                </div>
            }
            </div>
          }
        </div>
        </div>
      </motion.div>

      <div className="features-grid">
        <DharmaCompass isGodMode={isGodMode} isKaliYugaMode={isKaliYugaMode} />
      </div>

      <div className="gallery" id="gallery">
        {displayedEntities.map((entity) => {
          const isSelected = selectedEntities.some((item) => item.name === entity.name);
          
          if (isKaliYugaMode && isGodMode) {
               return (
                 <Tilt key={entity.name} tiltReverse={true} scale={1.05} transitionSpeed={2500}>
                   <KalkiCard
                     deityData={entity}
                     isSelected={isSelected}
                     onToggleSelect={() => { playClick(); toggleEntitySelection(entity); }}
                     onOpenPanel={(eData) => { playClick(); openEntityPanel(eData); }}
                   />
                 </Tilt>
               );
            }

            if (!isGodMode && isKaliYugaMode) {
             // For ASURAS in Kali Yuga context:
             return (
               <Tilt key={entity.name} tiltReverse={true} scale={1.05} transitionSpeed={2500}>
                 <DimensionalCard isKaliMode={isKaliYugaMode}
                   deityData={entity}
                   isSelected={isSelected}
                   onToggleSelect={() => { playClick(); toggleEntitySelection(entity); }}
                   onOpenPanel={(eData) => { playClick(); openEntityPanel(eData); }}
                 />
               </Tilt>
             );
          }

          if (!isGodMode && !isKaliYugaMode) {
             // Premium Asura Theme
             return (
               <Tilt key={entity.name} tiltReverse={true} scale={1.05} transitionSpeed={2500}>
                 <AsuraCard
                   deityData={entity}
                   isSelected={isSelected}
                   onToggleSelect={() => { playClick(); toggleEntitySelection(entity); }}
                   onOpenPanel={(eData) => { playClick(); openEntityPanel(eData); }}
                 />
               </Tilt>
             );
          }

          // Premium Divine Gods Theme
          return (
            <Tilt key={entity.name} tiltReverse={true} scale={1.05} transitionSpeed={2500}>
              <DivineCard
                deityData={entity}
                isSelected={isSelected}
                onToggleSelect={() => { playClick(); toggleEntitySelection(entity); }}
                onOpenPanel={(eData) => { playClick(); openEntityPanel(eData); }}
              />
            </Tilt>
          );

        })}
      </div>

      <motion.div className={`side-panel ${panelEntity ? 'open' : ''}`} id="sidePanel">
        <div className="side-panel-header">
          <img 
            className="side-panel-img" 
            id="panelImg" 
            src={panelEntity?.img || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Om_symbol.svg/1024px-Om_symbol.svg.png"} 
            onError={(e) => { e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Om_symbol.svg/1024px-Om_symbol.svg.png" }}
            alt={panelEntity?.name ?? ''} 
          />
          <button className="side-panel-close" onMouseEnter={playHover} onClick={() => { playClick(); closePanel(); }}>
            &times;
          </button>
          <div className="side-panel-title-container">
            <div className="side-panel-title" id="panelName">
              {panelEntity?.name}
            </div>
            <div className="side-panel-subtitle" id="panelTitle">
              {panelEntity?.title}
            </div>
          </div>
        </div>
        <div className="side-panel-details" id="panelDetails">
          {panelEntity &&
          <>
              {panelEntity.avatars && panelEntity.avatars.length > 0 && (
                <>
                  <div className="avatar-section-title">Divine Manifestations</div>
                  <div className="avatar-grid">
                    {panelEntity.avatars.map((avatar, idx) => (
                      <div key={idx} className={`avatar-mini-card ${avatar.type}`}>
                        <img 
                          src={avatar.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(avatar.name)}&background=random`}
                          onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(avatar.name)}&background=random`; }} 
                          alt={avatar.name} 
                        />
                        <h4>{avatar.name}</h4>
                        <p>{avatar.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!isGodMode ? (
                <AsuraBoonPanel 
                  asuraName={panelEntity.name} 
                  boonText={panelEntity.boon || panelEntity.desc} 
                  flawText={panelEntity.flaw || panelEntity.details} 
                />
              ) : (
                panelEntity.mantra && (
                  <div className="mantra-box">
                    <div className="mantra-sanskrit">{panelEntity.mantra.sanskrit}</div>
                    <div className="mantra-english">"{panelEntity.mantra.english}"</div>
                    <button className="play-mantra-btn" onMouseEnter={playHover} onClick={() => { playClick(); playMantra(panelEntity.mantra.sanskrit); }}>
                      <span className="play-icon">▶</span> {isGodMode ? 'Play Chant' : 'Play War Cry'}
                    </button>
                  </div>
                )
              )}
              <p style={{ fontSize: '1.1em', marginTop: '24px' }}>{panelEntity.details}</p>

              {panelEntity.temples && panelEntity.temples.length > 0 &&
            <>
                  <br />
                  <b style={{ color: 'var(--gold)' }}>Associated Sites:</b>
                  <ul style={{ marginTop: '8px' }}>
                    {panelEntity.temples.map((temple) =>
                <li key={`${temple.name}-${temple.city}`}>
                        {temple.name} ({temple.city})
                      </li>
                )}
                  </ul>
                </>
            }
              <button id="expandAI" style={{ marginTop: '30px', width: '100%' }} onMouseEnter={playHover} onClick={() => { playClick(); handleExpandEntry(); }} disabled={aiFactLoading || !panelEntity}>
                {aiFactLoading ? 'Channeling mythological knowledge...' : 'Expand Encyclopedia Entry (AI)'}
              </button>
              <div
              id="aiFact"
              className="ai-fact"
              style={{ display: aiFactVisible ? 'block' : 'none', marginTop: '20px' }}
              dangerouslySetInnerHTML={{ __html: aiFactContent }} />
            
            </>
          }
        </div>
      </motion.div>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onLogin={setUser} />
      </>
      ) : (
        <YugaChronicles onClose={() => setShowYugaChronicles(false)} />
      )}
      </div>
      </div>
    </MainWrapper>
  );

}




