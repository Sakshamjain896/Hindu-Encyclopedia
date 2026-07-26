import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import './YugaChronicles.css';

gsap.registerPlugin(useGSAP);

// --- UI Label Dictionary ---
const UI_LABELS = {
  en: {
    endJourney: "← End Journey",
    cosmicEra: "Cosmic Era",
    narrativeFocus: "Narrative Focus",
    language: "Language",
    allEras: "All Eras",
    satyaYuga: "Satya Yuga",
    tretaYuga: "Treta Yuga",
    dvaparaYuga: "Dvapara Yuga",
    kaliYuga: "Kali Yuga",
    allDomains: "All Domains",
    creation: "Creation",
    conflict: "Conflict",
    philosophy: "Philosophy",
    voiceOff: "🔇 Voice Off",
    voiceOn: "🔊 Voice On",
    engageCinematic: "Engage Cinematic Mode",
    cinematicEngaged: "Cinematic Mode Engaged...",
    readFullChronicle: "Read Full Chronicle",
    noEvents: "No ancient texts match these filters..."
  },
  hi: {
    endJourney: "← यात्रा समाप्त",
    cosmicEra: "ब्रह्मांडीय युग",
    narrativeFocus: "कथा केंद्र",
    language: "भाषा",
    allEras: "सभी युग",
    satyaYuga: "सत्य युग",
    tretaYuga: "त्रेता युग",
    dvaparaYuga: "द्वापर युग",
    kaliYuga: "कलि युग",
    allDomains: "सभी क्षेत्र",
    creation: "सृष्टि",
    conflict: "संघर्ष",
    philosophy: "दर्शन",
    voiceOff: "🔇 आवाज बंद",
    voiceOn: "🔊 आवाज चालू",
    engageCinematic: "सिनेमैटिक मोड प्रारंभ करें",
    cinematicEngaged: "सिनेमैटिक मोड जारी है...",
    readFullChronicle: "पूर्ण वृत्तांत पढ़ें",
    noEvents: "इन फ़िल्टरों से मेल खाने वाला कोई प्राचीन ग्रंथ नहीं मिला..."
  }
};

const narrativeData = [
  // --- SATYA YUGA ---
  { 
    id: 'matsya', 
    eraKey: 'Satya Yuga',
    focusKey: 'Creation',
    era: { en: 'Satya Yuga', hi: 'सत्य युग' }, 
    focus: { en: 'Creation', hi: 'सृष्टि' }, 
    title: { en: 'Matsya Avatar', hi: 'मत्स्य अवतार' }, 
    subtitle: { en: 'The Great Deluge & Cosmic Ark', hi: 'महाप्रलय एवं दिव्य नौका' }, 
    desc: {
      en: 'Lord Vishnu manifests as a majestic horned golden fish to guide King Manu and the Saptarishis through the catastrophic cosmic deluge, preserving the sacred seeds of life and the divine Vedas for the rebirth of the universe.',
      hi: 'भगवान विष्णु एक विशाल सींग वाली सुनहरी मछली के रूप में प्रकट होते हैं ताकि राजा मनु और सप्तर्षियों को भयानक प्रलय के दौरान मार्गदर्शन कर सकें, जिससे जीवन के पवित्र बीज और वेदों की रक्षा हो सके।'
    },
    fullStory: {
      en: `During the ancient epoch before the great cosmic dissolution (Pralaya), King Manu was performing his daily ablutions in the holy river when a tiny golden fish swam into his hands asking for protection. Demonstrating compassion, Manu placed the fish in a small jar. However, the divine creature grew exponentially overnight—first filling a well, then a lake, and eventually the vast ocean itself.

Recognizing the fish as Lord Vishnu’s divine Matsya Avatar, Manu bowed before the deity. Matsya prophesied that in seven days, a catastrophic cosmic deluge would submerge all creation. He instructed Manu to build a massive ark and gather the Saptarishis (Seven Sages), seeds of all plant life, and pairs of every living creature.

When the storm arrived and the oceans surged over the continents, Lord Vishnu appeared as a massive golden horned fish. Using the celestial serpent Vasuki as a majestic rope, Manu tied the ark to the golden horn of Matsya. Throughout the dark turbulent night of Pralaya, Matsya guided the vessel across the tempestuous cosmic waters, preserving the eternal Vedas and the seeds of life to initiate the new era of Satya Yuga.`,
      hi: `महाप्रलय से पूर्व के प्राचीन काल में, राजा मनु पवित्र नदी में तर्पण कर रहे थे, तभी एक छोटी सुनहरी मछली उनकी हथेलियों में आ गई और रक्षा की गुहार लगाने लगी। करुणावश मनु ने उसे एक छोटे पात्र में रख दिया। परंतु वह दिव्य जीव रातों-रात विशाल होता गया—पहले कुआं, फिर झील और अंततः पूरे महासागर में समा गया।

मछली को भगवान विष्णु का मत्स्य अवतार पहचानकर राजा मनु ने उन्हें प्रणाम किया। मत्स्य देव ने भविष्यवाणी की कि सात दिनों में एक विनाशकारी प्रलय समस्त सृष्टि को जलमग्न कर देगी। उन्होंने मनु को एक विशाल नौका बनाने और उसमें सप्तर्षियों, सभी वनस्पतियों के बीजों तथा जीवों के जोड़ों को एकत्र करने का निर्देश दिया।

जब भयंकर तूफान आया और समुद्र महाद्वीपों पर उमड़ पड़ा, तब भगवान विष्णु एक विशाल सींग वाली सुनहरी मछली के रूप में प्रकट हुए। नागराज वासुकि को रस्सी बनाकर मनु ने नौका को मत्स्य के सींग से बांध दिया। प्रलय की भयानक रात्रि में मत्स्य देव ने नौका को पार लगाया और वेदों एवं जीवन के बीजों की रक्षा कर सत्य युग की नींव रखी।`
    },
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJb0D95L3Lznl7037AEH9i6EtOknLxAFy6sjpHUH1APJ6F4pBLBmsHYlM&s=10' 
  },
  { 
    id: 'samudra', 
    eraKey: 'Satya Yuga',
    focusKey: 'Creation',
    era: { en: 'Satya Yuga', hi: 'सत्य युग' }, 
    focus: { en: 'Creation', hi: 'सृष्टि' }, 
    title: { en: 'Samudra Manthan', hi: 'समुद्र मंथन' }, 
    subtitle: { en: 'Churning of the Cosmic Ocean', hi: 'क्षीर सागर का मंथन' }, 
    desc: {
      en: 'An unprecedented divine pact between Devas and Asuras to churn the Kshira Sagara for the nectar of immortality. Under immense cosmic friction, magnificent treasures and the world-ending Halahala poison arose before the ultimate prize.',
      hi: 'अमरता के अमृत की प्राप्ति के लिए देवों और असुरों के बीच क्षीर सागर का ऐतिहासिक मंथन हुआ। इस प्रचंड मंथन से हलाहल विष और चौदह अनमोल रत्न प्रकट हुए।'
    },
    fullStory: {
      en: `Stripped of their celestial radiance by a curse, the Devas sought the counsel of Lord Vishnu to regain their strength. Vishnu advised them to form a temporary truce with their rivals, the Asuras, to churn the primeval ocean of milk (Kshira Sagara) and extract Amrita, the elixir of immortality.

Mount Mandara was chosen as the churning rod, and Vasuki, the King of Serpents, served as the churning rope. As the cosmic churning began, Mount Mandara began to sink into the ocean floor. Lord Vishnu manifested as Kurma (the giant tortoise) to anchor the mountain upon His invincible shell.

The churning unleashed unimaginable energies. First arose Halahala, a lethal cosmic poison that threatened to incinerate existence. Lord Shiva heroically drank the venom, holding it in His throat, turning it blue (Neelakantha). As the churning continued, divine treasures emerged: Goddess Lakshmi, the wish-fulfilling cow Kamadhenu, the divine horse Uchchaihshravas, and Dhanvantari holding the pot of Amrita, securing the victory of cosmic order.`,
      hi: `दुर्वासा ऋषि के श्राप से अपनी शक्ति गंवाने के बाद देवों ने भगवान विष्णु से सहायता मांगी। विष्णु जी ने देवों और असुरों को मिलकर क्षीर सागर मथने और अमृत निकालने की सलाह दी।

मंदर पर्वत को मथानी और नागराज वासुकि को नेती (रस्सी) बनाया गया। मंथन प्रारंभ होते ही मंदर पर्वत समुद्र में धंसने लगा, तब भगवान विष्णु ने कछुए (कूर्म अवतार) का रूप धारण कर पर्वत को अपनी पीठ पर संभाला।

मंथन से सबसे पहले भयानक हलाहल विष निकला, जिससे पूरी सृष्टि जलने लगी। भगवान शिव ने ब्रह्मांड की रक्षा के लिए वह विष पी लिया और उसे अपने कंठ में रोक लिया, जिससे वे 'नीलकंठ' कहलाए। इसके पश्चात देवी लक्ष्मी, कामधेनु, उच्चैःश्रवा और अंत में अमृत कलश लेकर धन्वंतरि प्रकट हुए।`
    },
    img: 'https://png.pngtree.com/thumb_back/fw800/background/20251120/pngtree-samudra-manthana-churning-the-ocean-image_20491764.webp' 
  },
  { 
    id: 'varaha', 
    eraKey: 'Satya Yuga',
    focusKey: 'Conflict',
    era: { en: 'Satya Yuga', hi: 'सत्य युग' }, 
    focus: { en: 'Conflict', hi: 'संघर्ष' }, 
    title: { en: 'Varaha Avatar', hi: 'वराह अवतार' }, 
    subtitle: { en: 'Rescue of Mother Earth', hi: 'भूदेवी का दिव्य उद्धार' }, 
    desc: {
      en: 'Assuming the titanic form of a wild boar, Lord Vishnu plunges into the bottomless cosmic abyss to slay the demon Hiranyaksha and lift Bhudevi back into her rightful cosmic orbit upon his glowing tusks.',
      hi: 'विशालकाय वराह रूप धारण कर भगवान विष्णु ने रसातल के अगाध जल में प्रवेश किया, दैत्य हिरण्याक्ष का वध किया और अपनी चमकती दाढ़ों पर भूदेवी को उठाकर पुनः स्थापित किया।'
    },
    fullStory: {
      en: `The tyrannical demon Hiranyaksha performed severe austerities to gain near-invincibility. Drunk with absolute power, he dragged Goddess Earth (Bhudevi) from her celestial position and submerged her into the bottomless cosmic depths of the Rasatala ocean.

To restore cosmic equilibrium, Lord Vishnu manifested as Varaha, a colossal wild boar possessing thunderous strength and glowing divine tusks. Plunging into the primordial ocean abyss, Varaha located Bhudevi resting in darkness.

Hiranyaksha challenged the incarnation to battle. A fierce war ensued across the cosmic realm. Varaha vanquished the demon with His divine mace and delicately balanced Earth upon His glowing tusks. Rising through the cosmic depths, Varaha gently reinstalled Bhudevi in her proper cosmic orbit, safeguarding life and geography.`,
      hi: `अत्याचारी दैत्य हिरण्याक्ष ने कठोर तपस्या कर अपार शक्तियां प्राप्त कीं और अभिमान में आकर पृथ्वी (भूदेवी) को उसके स्थान से हटाकर रसातल के अंधकारपूर्ण महासागर में छिपा दिया।

सृष्टि का संतुलन पुनः स्थापित करने के लिए भगवान विष्णु ने वराह (विशाल वराह) का अवतार लिया। अगाध समुद्र में उतरकर उन्होंने भूदेवी को खोज निकाला।

जब हिरण्याक्ष ने युद्ध के लिए ललकारा, तो वराह भगवान ने गदा युद्ध में उसका वध कर दिया। इसके बाद उन्होंने भूदेवी को अपनी दाढ़ों पर संभालकर ऊपर उठाया और उन्हें पुनः अपनी कक्षा में स्थापित किया।`
    },
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNto9kdh0NlIHTGiSBhLsN3tqQa0oLRO459gLRRhGGNtK5rqmY1z40Os&s=10' 
  },
  { 
    id: 'narasimha', 
    eraKey: 'Satya Yuga',
    focusKey: 'Conflict',
    era: { en: 'Satya Yuga', hi: 'सत्य युग' }, 
    focus: { en: 'Conflict', hi: 'संघर्ष' }, 
    title: { en: 'Narasimha Avatar', hi: 'नृसिंह अवतार' }, 
    subtitle: { en: 'The Half-Lion Incarnation', hi: 'आधा नर, आधा सिंह अवतार' }, 
    desc: {
      en: 'Lord Vishnu incarnates as the fierce half-man, half-lion to bypass a complex boon of invincibility. He ends the cosmic tyranny of the demon king Hiranyakashipu, protecting his absolute devotee Prahlada at the threshold of day and night.',
      hi: 'अहंकारी हिरण्यकशिपु के जटिल वरदान को निष्फल करते हुए भगवान विष्णु ने नृसिंह रूप धारण किया और अपने अनन्य भक्त प्रह्लाद की रक्षा करते हुए संध्या काल में दैत्य का वध किया।'
    },
    fullStory: {
      en: `Seeking vengeance for his brother's death, the demon king Hiranyakashipu secured a legendary boon from Lord Brahma: he could not be killed by man or beast, indoors or outdoors, during day or night, on land or in air, nor by any weapon created by gods or mortals.

Deeming himself supreme, Hiranyakashipu outlawed all worship of Lord Vishnu. However, his own young son, Prahlada, remained an unshakeable devotee of Vishnu. Enraged by Prahlada’s devotion, Hiranyakashipu subjected him to extreme tortures, but divine grace shielded the boy at every turn.

In fury, the king struck a stone pillar in his palace, demanding if Vishnu was present inside. The pillar shattered, and Lord Vishnu manifested as Narasimha—half-man and half-lion. At twilight (neither day nor night), upon the threshold of the palace (neither inside nor outside), placing the demon across His lap (neither earth nor sky), Narasimha destroyed the tyrant with His claws, fulfilling every condition of the boon while preserving ultimate righteousness.`,
      hi: `दैत्यराज हिरण्यकशिपु ने ब्रह्मा जी से वरदान मांगा था कि वह न मनुष्य द्वारा मारा जा सके न पशु द्वारा, न घर के भीतर न बाहर, न दिन में न रात में, न अस्त्र से न शस्त्र से।

स्वयं को ईश्वर मानने वाले हिरण्यकशिपु का पुत्र प्रह्लाद भगवान विष्णु का परम भक्त था। जब क्रोधित होकर हिरण्यकशिपु ने महल के खंभे पर प्रहार कर पूछा कि "क्या तेरा विष्णु इसमें है?", तब खंभा फाड़कर नृसिंह भगवान प्रकट हुए।

नृसिंह जी ने हिरण्यकशिपु को चौखट पर (न भीतर न बाहर), गोधूलि वेला में (न दिन न रात), अपनी जांघों पर रखकर (न भूमि न आकाश) अपने तीक्ष्ण नखों से उसका वध कर दिया।`
    },
    img: 'https://www.pinkvilla.com/images/2025-11/344114581_mahavatar-narsimha-oscars-sq-webp.webp' 
  },

  // --- TRETA YUGA ---
  { 
    id: 'vamana', 
    eraKey: 'Treta Yuga',
    focusKey: 'Philosophy',
    era: { en: 'Treta Yuga', hi: 'त्रेता युग' }, 
    focus: { en: 'Philosophy', hi: 'दर्शन' }, 
    title: { en: 'Vamana & King Bali', hi: 'वामन अवतार' }, 
    subtitle: { en: 'Three Cosmic Steps', hi: 'तीन दिव्य पद' }, 
    desc: {
      en: 'Appearing as a humble dwarf scholar, Vishnu requests three steps of land from the proud King Bali. Expanding beyond the cosmos, two strides encompass the earth and heavens, while the third rests on Bali head in divine blessing.',
      hi: 'एक बटुक ब्राह्मण का रूप धरकर भगवान विष्णु ने दानवीर राजा बलि से तीन पग भूमि मांगी। विशाल रूप धरकर उन्होंने दो पग में तीनों लोक नाप लिए और तीसरा पद बलि के मस्तक पर रखा।'
    },
    fullStory: {
      en: `King Bali, a noble yet ambitious Asura ruler, conquered the three worlds through unmatched valor and grand sacrificial rituals. To restore balance to the heavens without humiliating the virtuous king, Lord Vishnu incarnated as Vamana—a humble dwarf Brahmin carrying a wooden umbrella and water pot.

Vamana entered King Bali’s ritual hall. Impressed by the young scholar’s aura, Bali offered to grant any gift. Vamana requested a modest piece of land measuring just three steps of His foot. Despite his guru Shukracharya warning him of Vishnu's trickery, Bali kept his word.

Instantly, Vamana expanded into the Trivikrama form, transcending the universe. With His first step, He covered the entire Earth; with His second, He claimed the heavens and stars. With no space left for the third step, King Bali humbly bowed and offered his own head. Pleased by Bali's humility and truthfulness, Lord Vishnu placed His foot on Bali's head, granting him immortality and rule over the subterranean realm of Sutala.`,
      hi: `दैत्यराज बलि ने अपने पराक्रम और यज्ञों से तीनों लोकों पर अधिकार कर लिया था। भगवान विष्णु ने वामन रूप में बाल ब्राह्मण बनकर बलि के यज्ञ मंडप में प्रवेश किया।

वामन ने राजा बलि से केवल तीन पग भूमि का दान मांगा। शुक्राचार्य के मना करने पर भी दानवीर बलि ने वचन दे दिया।

तत्पश्चात वामन देव ने 'त्रिविक्रम' रूप धारण कर एक पग से पूरी पृथ्वी और दूसरे से स्वर्गलोक नाप लिया। तीसरे पग के लिए स्थान न बचने पर राजा बलि ने अपना मस्तक आगे कर दिया। उनकी भक्ति और सत्यनिष्ठा से प्रसन्न होकर भगवान ने उन्हें सुतल लोक का स्वामी बना दिया।`
    },
    img: 'https://m.media-amazon.com/images/I/61klZQNCptL._AC_UF894,1000_QL80_.jpg' 
  },
  { 
    id: 'parashurama', 
    eraKey: 'Treta Yuga',
    focusKey: 'Conflict',
    era: { en: 'Treta Yuga', hi: 'त्रेता युग' }, 
    focus: { en: 'Conflict', hi: 'संघर्ष' }, 
    title: { en: 'Parashurama Campaign', hi: 'परशुराम अभियान' }, 
    subtitle: { en: 'Cleansing of Unrighteous Kings', hi: 'अधर्मी राजाओं का दमन' }, 
    desc: {
      en: 'Wielding his unstoppable divine battle-axe bestowed by Lord Shiva, Parashurama wages a ferocious twenty-one-cycle war to eradicate corrupt tyrants and restore cosmic equilibrium across the land.',
      hi: 'भगवान शिव द्वारा प्रदत्त परशु (फरसा) को धारण कर परशुराम जी ने इक्कीस बार पृथ्वी को अधर्मी एवं अत्याचारी राजाओं से मुक्त कराया।'
    },
    fullStory: {
      en: `As the age shifted toward Treta Yuga, the warrior class (Kshatriyas) deviated from their sacred duty of protecting society, becoming corrupt and tyrannical despots. When King Kartavirya Arjuna stole the divine Kamadhenu cow from Parashurama's father, Sage Jamadagni, and slaughtered the sage, Parashurama vowed to restore order.

Armed with Parashu (a divine battle-axe gifted by Lord Shiva), Parashurama embarked on twenty-one campaigns to rid the earth of corrupt tyrants who abused power.

His intense crusade re-established moral balance and reminded rulers that ultimate power serves righteousness, not personal greed. After completing his mission, Parashurama retired to the Mahendra mountains to engage in eternal meditation as a Chiranjivi (immortal).`,
      hi: `त्रेता युग के आगमन पर जब शासक वर्ग अपने धर्म से विमुख होकर अत्याचारी बन गया, तब महर्षि जमदग्नि के पुत्र परशुराम ने समाज में धर्म की पुनः स्थापना का बीड़ा उठाया।

सहस्रबाहु द्वारा कामधेनु का हरण और महर्षि जमदग्नि की हत्या के विरोध में, परशुराम जी ने अपने परशु से इक्कीस बार अत्याचारी क्षत्रियों का दमन किया।

सृष्टि में पुनः धर्म और न्याय की स्थापना करने के उपरांत परशुराम जी महेंद्र पर्वत पर तपस्या हेतु चले गए।`
    },
    img: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5939f539-cb3f-47bd-9755-783503954e7e/dgds5oh-da388e8d-ec65-4dde-8f9b-77fa41d53fb5.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi81OTM5ZjUzOS1jYjNmLTQ3YmQtOTc1NS03ODM1MDM5NTRlN2UvZGdkczVvaC1kYTM4OGU4ZC1lYzY1LTRkZGUtOGY5Yi03N2ZhNDFkNTNmYjUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ajP8hD5OTXIMIOAxs7szjDLAk4-x73mcTpGulxEn_E0' 
  },
  { 
    id: 'lanka_dahan', 
    eraKey: 'Treta Yuga',
    focusKey: 'Conflict',
    era: { en: 'Treta Yuga', hi: 'त्रेता युग' }, 
    focus: { en: 'Conflict', hi: 'संघर्ष' }, 
    title: { en: 'Lanka Dahan', hi: 'लंका दहन' }, 
    subtitle: { en: 'Hanuman Cosmic Inferno', hi: 'हनुमान जी का रुद्र रूप' }, 
    desc: {
      en: 'Captured in Ravana realm, Lord Hanuman transforms his ignited tail into a devastating instrument of divine retribution, reducing the golden fortress of Lanka to ashes as a stark warning to evil.',
      hi: 'रावण की सभा में बंदी बनाए जाने पर श्री हनुमान जी ने अपनी प्रज्वलित पूंछ से पूरी स्वर्ण लंका को भस्म कर दिया और रावण के अभिमान को मिट्टी में मिला दिया।'
    },
    fullStory: {
      en: `In search of Goddess Sita, Lord Hanuman leaped across the vast ocean to reach Lanka. After discovering Sita in the Ashoka Vatika and delivering Lord Rama's signet ring, Hanuman allowed himself to be brought before King Ravana to assess the kingdom's defenses.

Ravana, filled with arrogance, ordered Hanuman's tail to be wrapped in cloth soaked in oil and set ablaze to humiliate him.

Instead of burning, Lord Hanuman expanded his size and broke free from his bonds. Leaping across Lanka’s golden towers, palaces, and fortifications, he transformed his burning tail into a divine storm of retribution, burning Lanka's grand fortress to ashes while leaving the Ashoka Vatika untouched—delivering a severe warning to Ravana.`,
      hi: `माता सीता की खोज में महाबली हनुमान जी ने विशाल समुद्र लांघकर लंका में प्रवेश किया। अशोक वाटिका में माता सीता को प्रभु श्री राम की मुद्रिका देने के उपरांत वे रावण की सभा में उपस्थित हुए।

अहंकारी रावण ने हनुमान जी का अपमान करने के लिए उनकी पूंछ में तेल में डूबा कपड़ा लपेटकर आग लगाने का आदेश दिया।

हनुमान जी ने अपना आकार बढ़ाकर बंधनों को तोड़ दिया और एक अट्टालिका से दूसरी अट्टालिका पर कूदकर संपूर्ण स्वर्ण लंका को जलाकर राख कर दिया, परंतु अशोक वाटिका को कोई आंच नहीं आने दी।`
    },
    img: 'https://mir-s3-cdn-cf.behance.net/projects/404/45222d223488565.Y3JvcCwzMDAwLDIzNDYsMCwyNjc.jpg' 
  },
  { 
    id: 'ramayana', 
    eraKey: 'Treta Yuga',
    focusKey: 'Philosophy',
    era: { en: 'Treta Yuga', hi: 'त्रेता युग' }, 
    focus: { en: 'Philosophy', hi: 'दर्शन' }, 
    title: { en: 'The Ramayana Epic', hi: 'श्रीमद्रामायण' }, 
    subtitle: { en: 'The Path of Righteousness', hi: 'मर्यादा पुरुषोत्तम का मार्ग' }, 
    desc: {
      en: 'The divine earthly journey of Lord Rama, illustrating supreme dharma, devotion, and the steadfast victory of divine light over the darkness embodied by the multi-headed rakshasa king Ravana in the citadel of Lanka.',
      hi: 'भगवान श्री राम का चरित्र, जो मर्यादा, धर्म और सत्य का प्रतीक है। वानर सेना की सहायता से लंकापति रावण का वध कर उन्होंने रामराज्य की स्थापना की।'
    },
    fullStory: {
      en: `Born as the prince of Ayodhya, Lord Rama embodied ideal virtue (Maryada Purushottama). Accompanied by his wife Sita and brother Lakshmana, Rama accepted fourteen years of exile to honor his father's sacred promise.

While dwelling in the Panchavati forest, Goddess Sita was abducted by the ten-headed demon king Ravana. Rama formed an alliance with Sugriva and the Vanara army, led by the steadfast Lord Hanuman. Together, they built the bridge across the sea to Lanka.

A monumental battle ensued where Rama destroyed Ravana and his army, establishing the eternal reign of Ramrajya—a timeless model of justice, duty, and truth.`,
      hi: `अयोध्या के राजकुमार के रूप में जन्मे भगवान श्री राम ने सत्य और मर्यादा का आदर्श स्थापित किया। अपने पिता के वचन को निभाने के लिए वे माता सीता और भ्राता लक्ष्मण के साथ चौदह वर्ष के वनवास पर गए।

पंचवटी से रावण द्वारा माता सीता के हरण के पश्चात, श्री राम ने सुग्रीव और हनुमान जी की वानर सेना के साथ संधि की और समुद्र पर सेतु बनाकर लंका पर चढ़ाई की।

भीषण युद्ध के अंत में श्री राम ने रावण का वध कर धर्म की विजय पताका फहराई और अयोध्या लौटकर 'रामराज्य' की स्थापना की।`
    },
    img: 'https://media.assettype.com/thequint/2024-01/f9ea022f-3e68-4995-9ff0-50c1d7beea8c/GEdgTgeWIAIs8j9.jpeg?auto=format,compress&fmt=webp&format=webp&w=1200&h=900&dpr=1.0' 
  },

  // --- DVAPARA YUGA ---
  { 
    id: 'govardhan', 
    eraKey: 'Dvapara Yuga',
    focusKey: 'Creation',
    era: { en: 'Dvapara Yuga', hi: 'द्वापर युग' }, 
    focus: { en: 'Creation', hi: 'सृष्टि' }, 
    title: { en: 'Govardhan Leela', hi: 'गोवर्धन लीला' }, 
    subtitle: { en: 'Shield of the Little Finger', hi: 'कनिष्ठा उंगली पर धारण पर्वत' }, 
    desc: {
      en: 'To shatter the ego of the storm god Indra, young Krishna effortlessly lifts the massive Govardhan Mountain on his little finger for seven days, sheltering the villagers and cattle from a fierce deluge.',
      hi: 'देवराज इंद्र के अहंकार को भंग करने के लिए बालक श्री कृष्ण ने गोवर्धन पर्वत को अपनी कनिष्ठिका उंगली पर उठाकर ब्रजवासियों और पशुओं की भयंकर वर्षा से रक्षा की।'
    },
    fullStory: {
      en: `In the village of Vrindavan, the cowherds prepared annual offerings for Indra, the god of rain and thunder. Young Krishna reasoned that instead of worshiping an arrogant deity, they should give thanks to Govardhan Hill and the surrounding pastures that nourished their livestock.

Enraged by the missed offerings, Indra unleashed torrential rains and devastating thunderstorms over Vrindavan for days.

To protect the villagers and animals, Krishna raised the entire Govardhan Hill using the pinky finger of His left hand. He held it elevated for seven days and nights, creating an impenetrable sanctuary underneath. Realizing Krishna’s supreme nature, Indra ended the storm and bowed in deep reverence.`,
      hi: `वृंदावन में इंद्र पूजा की तैयारी देख बालक कृष्ण ने तर्क दिया कि वर्षा के लिए अहंकार से भरे देवराज इंद्र के बजाय गोवर्धन पर्वत का पूजन करना चाहिए, जो हमारी गायों को चारा देता है।

इससे क्रुद्ध होकर इंद्र ने ब्रज में मूसलाधार बारिश और भयंकर तूफान भेज दिया।

ब्रजवासियों की रक्षा के लिए बाल कृष्ण ने विशाल गोवर्धन पर्वत को सात दिनों तक अपनी बाएँ हाथ की छोटी उंगली पर उठाए रखा। अंततः इंद्र का अभिमान टूटा और उन्होंने श्री कृष्ण से क्षमा मांगी।`
    },
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnaYgSWs_o3LgdwE3govbdSMrUE_m5OJWNGG3SMf0TSd-UwPZegMoKMEI&s=10' 
  },
  { 
    id: 'kaliya_mardan', 
    eraKey: 'Dvapara Yuga',
    focusKey: 'Conflict',
    era: { en: 'Dvapara Yuga', hi: 'द्वापर युग' }, 
    focus: { en: 'Conflict', hi: 'संघर्ष' }, 
    title: { en: 'Kaliya Manthan', hi: 'कालिया मर्दन' }, 
    subtitle: { en: 'Subduing the Poisonous Serpent', hi: 'विषैले सर्प का दमन' }, 
    desc: {
      en: 'The divine child Krishna leaps into the poisoned waters of the Yamuna and dances upon the myriad hoods of the mighty Naga, Kaliya, purifying the river and restoring harmony to the ecology of Vrindavan.',
      hi: 'यमुना के जहरीले जल में कूदकर बाल कृष्ण ने अत्यंत भयंकर नाग कालिया के फनों पर तांडव नृत्य किया और उसके विष को शांत कर यमुना को पुनः पवित्र किया।'
    },
    fullStory: {
      en: `The venomous multi-headed serpent Kaliya fled to the Yamuna River near Vrindavan to escape Garuda. Kaliya’s burning venom turned the river's waters pitch black, boiling the stream and killing birds that flew overhead.

Determined to purify the river, child Krishna climbed a Kadamba tree and dove straight into the dark waters. Kaliya wrapped his massive coils around Krishna, attempting to crush Him.

Effortlessly breaking free, Krishna assumed immense cosmic lightness and leaped onto Kaliya's many hoods. Krishna danced the Tandava rhythm upon the serpent's heads. As Kaliya’s pride was crushed, his wives prayed for mercy. Krishna spared Kaliya, commanding him to return to the ocean, purifying the Yamuna River for Vrindavan.`,
      hi: `विषैला नाग कालिया गरुड़ के भय से यमुना नदी के रमणक द्वीप में आ छिपा था। उसके विष से यमुना का जल काला और विषैला हो चुका था।

यमुना को शुद्ध करने हेतु बाल कृष्ण कदंब के पेड़ से कूदकर जहरीले जल में उतर गए। कालिया ने उन्हें अपने पाश में जकड़ने का प्रयास किया।

श्री कृष्ण ने सहज ही मुक्त होकर कालिया के फनों पर नृत्य शुरू कर दिया। नृत्य के प्रहारों से कालिया का घमंड चूर-चूर हो गया। नागपत्नियों की प्रार्थना पर कृष्ण ने कालिया को समुद्र में लौटने का आदेश देकर यमुना को पवित्र किया।`
    },
    img: 'https://t4.ftcdn.net/jpg/18/22/78/93/360_F_1822789369_dullRYcbzEav1JkTjpKRx4yh82L5W7fT.jpg' 
  },
  { 
    id: 'kansa_wadh', 
    eraKey: 'Dvapara Yuga',
    focusKey: 'Conflict',
    era: { en: 'Dvapara Yuga', hi: 'द्वापर युग' }, 
    focus: { en: 'Conflict', hi: 'संघर्ष' }, 
    title: { en: 'Kansa Wadh', hi: 'कंस वध' }, 
    subtitle: { en: 'The Fall of the Tyrant King', hi: 'अत्याचारी कंस का अंत' }, 
    desc: {
      en: 'Fulfilling the great prophecy, Krishna storms the gladiatorial arena in Mathura, overpowers the colossal elephant Kuvalayapida, defeats the royal wrestlers, and ultimately slays his tyrannical uncle, King Kamsa, liberating the kingdom.',
      hi: 'आकाशवाणी की भविष्यवाणी को सच करते हुए श्री कृष्ण ने मथुरा में कुवलयापीड़ हाथी और मल्लों का अंत किया और अत्याचारी मामा कंस का वध कर मथुरा को अत्याचार से मुक्त कराया।'
    },
    fullStory: {
      en: `A divine voice warned King Kamsa of Mathura that his sister Devaki’s eighth child would destroy him. Desperate to escape his fate, Kamsa imprisoned Devaki and Vasudeva, killing their first six children before Krishna was secretly carried to Gokul.

Years later, after failing to kill Krishna with assassins, Kamsa organized a grand wrestling tournament in Mathura as a trap.

Upon arrival, Krishna and Balarama defeated the rogue war-elephant Kuvalayapida and vanquished Kamsa's champion wrestlers Chanura and Mushtika. Krishna then confronted Kamsa, knocking off his crown and ending his tyranny, fulfilling the prophecy and restoring righteousness in Mathura.`,
      hi: `मथुरा के राजा कंस को आकाशवाणी से ज्ञात हुआ था कि देवकी का आठवां पुत्र उसका वध करेगा। भयभीत कंस ने देवकी-वसुदेव को बंदी बना लिया।

वर्षों बाद, कंस ने कृष्ण-बलराम का वध करने के लिए मथुरा में धनुष यज्ञ और मल्ल युद्ध का आयोजन किया।

मथुरा पहुंचकर श्री कृष्ण और बलराम ने कुवलयापीड़ हाथी तथा चाणूर-मुष्टिक जैसे मल्लों का वध किया। इसके बाद श्री कृष्ण ने कंस को सिंहासन से खींचकर उसका अंत किया और अपने माता-पिता को मुक्त कराया।`
    },
    img: 'https://www.jkyog.org/blog/content/images/2025/04/DALL-E-2024-10-30-14.56.18---A-detailed-and-vibrant-scene-depicting-Lord-Krishna-slaying-King-Kansa-in-a-royal-palace-setting--with-no-other-people-and-no-debris-or-trash-on-the-g.webp' 
  },
  { 
    id: 'gita_upadesh', 
    eraKey: 'Dvapara Yuga',
    focusKey: 'Philosophy',
    era: { en: 'Dvapara Yuga', hi: 'द्वापर युग' }, 
    focus: { en: 'Philosophy', hi: 'दर्शन' }, 
    title: { en: 'Bhagavad Gita', hi: 'श्रीमद्भगवद्गीता' }, 
    subtitle: { en: 'The Song of God', hi: 'ईश्वर का दिव्य संदेश' }, 
    desc: {
      en: 'At the precipice of war, Lord Krishna freezes time to reveal the Vishwaroopa form and impart immortal wisdom on Karma, Dharma, and Moksha to Arjuna, creating humanity spiritual bedrock.',
      hi: 'कुरुक्षेत्र की रणभूमि में श्री कृष्ण ने अर्जुन के मोह का निवारण करने के लिए कर्म, धर्म और भक्ति का कालजयी उपदेश दिया तथा अपना विराट स्वरूप प्रकट किया।'
    },
    fullStory: {
      en: `On the sacred field of Kurukshetra, as two massive armies stood ready for battle, the Pandava prince Arjuna was overcome with sorrow at the thought of fighting his own relatives, teachers, and friends. Lowering his bow, Arjuna turned to his charioteer, Lord Krishna, for guidance.

In that quiet moment between armies, Lord Krishna revealed the eternal wisdom of the Bhagavad Gita. He explained Karma Yoga (selfless action), Jnana Yoga (divine knowledge), and Bhakti Yoga (loving devotion).

Krishna then revealed His awe-inspiring Vishwaroopa (cosmic form), encompassing all planets, stars, gods, and time itself within His being. Reassured of the divine order, Arjuna resumed his bow with clarity and purpose.`,
      hi: `कुरुक्षेत्र के मैदान में जब दोनों सेनाएं आमने-सामने थीं, तब सगे-संबंधियों पर शस्त्र उठाने के विचार से अर्जुन मोहग्रस्त होकर युद्ध से विमुख हो गए।

तब सारथी बने भगवान श्री कृष्ण ने अर्जुन को गीता का अमर संदेश दिया। उन्होंने कर्मयोग, ज्ञानयोग और भक्तियोग का गूढ़ दर्शन समझाया।

तत्पश्चात श्री कृष्ण ने अपना दिव्य 'विराट रूप' प्रकट किया, जिसमें संपूर्ण ब्रह्मांड समाहित था। इस परम ज्ञान को पाकर अर्जुन का संशय समाप्त हुआ और उन्होंने अपना धनुष गांडीव संभाल लिया।`
    },
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyULfpGUXZcLD29A5qQ14mJjpy4zj8pAqoiwReuzV2NwOyt06CAqZa4pY&s=10' 
  },
  { 
    id: 'mahabharata', 
    eraKey: 'Dvapara Yuga',
    focusKey: 'Conflict',
    era: { en: 'Dvapara Yuga', hi: 'द्वापर युग' }, 
    focus: { en: 'Conflict', hi: 'संघर्ष' }, 
    title: { en: 'The Mahabharata War', hi: 'महाभारत धर्मयुद्ध' }, 
    subtitle: { en: 'The Great Kurukshetra Conflict', hi: 'कुरुक्षेत्र का महान संग्राम' }, 
    desc: {
      en: 'A monumental, tragic clash of duty, kinship, and morality marking the twilight of the age. It is amidst this frozen battlefield that Lord Krishna imparts eternal cosmic wisdom to a despondent Arjuna through the profound Bhagavad Gita.',
      hi: 'धर्म, सत्य और न्याय की रक्षा के लिए पांडवों और कौरवों के मध्य लड़ा गया अठारह दिवसीय महासंग्राम, जिसने द्वापर युग के अंत का मार्ग प्रशस्त किया।'
    },
    fullStory: {
      en: `The Kurukshetra War was the culmination of long-standing rivalries over duty and righteous governance between the five Pandava brothers and their hundred Kaurava cousins.

For eighteen days, grand warriors clashed on the plains of Kurukshetra using celestial astras and strategic formations (Vyuhas).

The war reshaped the ancient world, bringing an end to the golden era of kings and chivalry. Ultimately, righteousness prevailed, paving the way for Yudhishthira's coronation and signaling the transition from Dvapara Yuga into Kali Yuga.`,
      hi: `कुरुक्षेत्र का युद्ध धर्म और अधर्म के बीच एक ऐतिहासिक संघर्ष था, जो पांडवों और कौरवों के मध्य लड़ा गया।

अठारह दिनों तक चले इस भयंकर युद्ध में विश्व के सर्वश्रेष्ठ योद्धाओं ने भाग लिया और दिव्यास्त्रों का प्रयोग किया गया।

अंततः सत्य और धर्म की विजय हुई। युद्ध समाप्त होने पर युधिष्ठिर का राज्याभिषेक हुआ, जिसने द्वापर युग का समापन कर कलि युग के आगमन का द्वार खोला।`
    },
    img: 'https://pbs.twimg.com/media/GDLN8BtXkAEPioR.jpg' 
  },

  // --- KALI YUGA ---
  { 
    id: 'kali_dawn', 
    eraKey: 'Kali Yuga',
    focusKey: 'Philosophy',
    era: { en: 'Kali Yuga', hi: 'कलि युग' }, 
    focus: { en: 'Philosophy', hi: 'दर्शन' }, 
    title: { en: 'Dawn of Darkness', hi: 'कलि युग का प्रारंभ' }, 
    subtitle: { en: 'The Departure of Krishna', hi: 'श्री कृष्ण का स्वधाम गमन' }, 
    desc: {
      en: 'With Lord Krishna departure to Vaikuntha, the divine cosmic balance shifts. The dark age of Kali commences, characterized by spiritual decay, forgotten truth, and the essential internal struggle for individual righteousness.',
      hi: 'श्री कृष्ण के वैकुंठ लौटने के पश्चात पृथ्वी पर कलि युग का प्रभाव प्रारंभ हुआ, जहां धर्म और सत्य की रक्षा के लिए आंतरिक साधना और भक्ति का मार्ग ही मुख्य आधार बना।'
    },
    fullStory: {
      en: `Following the Kurukshetra war and thirty-six years of peaceful rule, Lord Krishna finished His earthly incarnation and returned to His supreme abode, Vaikuntha.

With His departure, the divine cosmic balance shifted, allowing Kali Yuga—the age of strife and spiritual darkness—to take hold.

In this age, truth and righteousness face constant challenges. However, sacred texts reveal that spiritual progress made through devotion and truthfulness in Kali Yuga yields profound spiritual results.`,
      hi: `महाभारत युद्ध के छत्तीस वर्ष पश्चात भगवान श्री कृष्ण ने अपनी लीला समाप्त कर वैकुंठ धाम के लिए प्रस्थान किया।

उनके जाने के साथ ही पृथ्वी पर कलि युग का प्रवेश हुआ, जिसमें धर्म के तीन चरण नष्ट हो गए और केवल एक चरण शेष रहा।

शास्त्रों के अनुसार, इस युग में कठिन साधना के स्थान पर केवल नाम-स्मरण और निष्काम भक्ति से ही जीव का कल्याण संभव है।`
    },
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlfyX_5l7CdBZ8F4o6zBopWv2DoJIIrHRIi2kScZyHangjNwIUCHow-6k&s=10' 
  },
  { 
    id: 'kalki', 
    eraKey: 'Kali Yuga',
    focusKey: 'Creation',
    era: { en: 'Kali Yuga', hi: 'कलि युग' }, 
    focus: { en: 'Creation', hi: 'सृष्टि' }, 
    title: { en: 'The Kalki Prophecy', hi: 'कल्कि अवतार की भविष्यवाणी' }, 
    subtitle: { en: 'The Final Purificator', hi: 'अधर्म का विनाशक अवतार' }, 
    desc: {
      en: 'Prophesied to appear at the absolute twilight of the darkest age. Riding a white steed and wielding a blazing, comet-like sword, Kalki will descend to cleanse the earth of ultimate adharma and inaugurate a pristine new Satya Yuga.',
      hi: 'कलि युग के अंतिम चरण में शंभल ग्राम में भगवान विष्णु के दसवें अवतार "कल्कि" का प्राकट्य होगा, जो देवदत्त घोड़े पर सवार होकर अधर्म का नाश करेंगे।'
    },
    fullStory: {
      en: `As predicted in ancient puranic texts, when Kali Yuga reaches its final phase and darkness prevails over truth, Lord Vishnu will manifest as His tenth avatar—Kalki.

Kalki is prophesied to be born in the village of Shambhala. Armed with a blazing divine sword and riding a swift white charger named Devadatta, He will restore order across the world.

Kalki will destroy corrupt forces, cleanse the world of accumulated darkness, and re-establish truth, ushering in a brand-new Satya Yuga and restarting the eternal cycle of the Yugas.`,
      hi: `पौराणिक ग्रंथों के अनुसार, जब कलि युग में अधर्म अपनी चरम सीमा पर पहुंच जाएगा, तब भगवान विष्णु 'कल्कि' रूप में दसवां अवतार धारण करेंगे।

शंभल ग्राम में विष्णुयशा नामक ब्राह्मण के घर उनका जन्म होगा। वे 'देवदत्त' नामक श्वेत घोड़े पर सवार होकर और चमचमाती खड्ग लेकर अधर्मियों का संहार करेंगे।

कल्कि अवतार पृथ्वी को समस्त पापों से मुक्त कर पुनः 'सत्य युग' की स्थापना करेंगे, जिससे युग चक्र पुनः प्रारंभ होगा।`
    },
    img: 'https://miro.medium.com/1*R2HOHT0Uj7ccvvSx-DoEmA.png' 
  }
];

// --- Divine Cosmic Arrowhead SVGs ---
const DivineCosmicLeftArrow = () => (
  <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="cosmic-astra-svg">
    <defs>
      <linearGradient id="cosmicGoldLeft" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF9DA" />
        <stop offset="45%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#C59300" />
      </linearGradient>
      <filter id="cosmicGlowLeft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="M42 12 C30 20 22 25 14 30 C22 35 30 40 42 48" stroke="url(#cosmicGoldLeft)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#cosmicGlowLeft)" />
    <path d="M36 18 L20 30 L36 42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    <polygon points="12,30 24,24 21,30 24,36" fill="url(#cosmicGoldLeft)" filter="url(#cosmicGlowLeft)" />
    <line x1="46" y1="30" x2="21" y2="30" stroke="url(#cosmicGoldLeft)" strokeWidth="1.8" strokeDasharray="3 3" />
    <circle cx="46" cy="30" r="3" fill="#FFD700" filter="url(#cosmicGlowLeft)" />
  </svg>
);

const DivineCosmicRightArrow = () => (
  <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="cosmic-astra-svg">
    <defs>
      <linearGradient id="cosmicGoldRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF9DA" />
        <stop offset="45%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#C59300" />
      </linearGradient>
      <filter id="cosmicGlowRight" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="M18 12 C30 20 38 25 46 30 C38 35 30 40 18 48" stroke="url(#cosmicGoldRight)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#cosmicGlowRight)" />
    <path d="M24 18 L40 30 L24 42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    <polygon points="48,30 36,24 39,30 36,36" fill="url(#cosmicGoldRight)" filter="url(#cosmicGlowRight)" />
    <line x1="14" y1="30" x2="39" y2="30" stroke="url(#cosmicGoldRight)" strokeWidth="1.8" strokeDasharray="3 3" />
    <circle cx="14" cy="30" r="3" fill="#FFD700" filter="url(#cosmicGlowRight)" />
  </svg>
);

// --- Inline Highlighted Description with Real-Time Parallel Audio Sync ---
const HighlightedDescription = ({ text, currentCharIndex, isMuted }) => {
  const wordsWithOffsets = useMemo(() => {
    if (!text) return [];
    const regex = /\S+/g;
    const result = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      result.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }
    return result;
  }, [text]);

  if (!text) return null;

  if (isMuted) {
    return <>{text}</>;
  }

  const transitionSpeed = '0.15s';

  return (
    <>
      {wordsWithOffsets.map(({ word, start, end }, index) => {
        const isPast = currentCharIndex >= end;
        const isCurrent = currentCharIndex >= start && currentCharIndex <= end + 3;

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              marginRight: '0.35rem',
              transition: `color ${transitionSpeed} ease, text-shadow ${transitionSpeed} ease, transform ${transitionSpeed} ease`,
              color: isCurrent
                ? '#FFD700'
                : isPast
                ? '#E5C158'
                : 'rgba(255, 255, 255, 0.45)',
              fontWeight: isCurrent || isPast ? '600' : '400',
              textShadow: isCurrent
                ? '0 0 14px rgba(255, 215, 0, 0.95), 0 0 24px rgba(255, 215, 0, 0.6)'
                : isPast
                ? '0 0 6px rgba(229, 193, 88, 0.4)'
                : 'none',
              transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {word}
          </span>
        );
      })}
    </>
  );
};

export default function YugaChronicles({ onClose }) {
  const containerRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const cinematicTl = useRef(null);
  const synthRef = useRef(null);
  const timerRef = useRef(null);
  
  // Language State ('en' | 'hi')
  const [language, setLanguage] = useState('en');
  const labels = UI_LABELS[language];

  const [selectedEra, setSelectedEra] = useState('All');
  const [selectedFocus, setSelectedFocus] = useState('All');
  const [filteredData, setFilteredData] = useState(narrativeData);
  const [activeEvent, setActiveEvent] = useState(narrativeData[0]);
  const [isCinematicMode, setIsCinematicMode] = useState(false);

  // State for Full Story Modal Popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Speech Synthesis States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  // Synchronized Voiceover Trigger Handler
  const speakNarration = useCallback((text) => {
    if (!synthRef.current || isMuted) return;

    synthRef.current.cancel();
    if (timerRef.current) cancelAnimationFrame(timerRef.current);

    setCurrentCharIndex(-1);

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = language === 'hi' ? 0.88 : 0.82;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

    const voices = synthRef.current.getVoices();

    const selectedVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      if (language === 'hi') {
        return v.lang.startsWith('hi') || name.includes('hindi') || name.includes('kalpana');
      }
      const isEnglish = v.lang.startsWith('en');
      return isEnglish && (
        name.includes('aria') ||
        name.includes('jenny') ||
        name.includes('serena') ||
        name.includes('samantha') ||
        name.includes('victoria') ||
        name.includes('google uk english female') || 
        name.includes('google us english') ||
        (name.includes('natural') && name.includes('female'))
      );
    }) || voices.find(v => v.lang.startsWith(language === 'hi' ? 'hi' : 'en')) || voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    let startTime = null;
    let nativeBoundaryFired = false;
    const estimatedDuration = (text.length / (13.5 * utterance.rate)) * 1000;

    const animateHighlight = () => {
      if (!startTime) startTime = performance.now();
      const elapsed = performance.now() - startTime;

      if (!nativeBoundaryFired) {
        const calculatedIndex = Math.min(
          Math.floor((elapsed / estimatedDuration) * text.length),
          text.length
        );
        setCurrentCharIndex(calculatedIndex);
      }

      if (elapsed < estimatedDuration) {
        timerRef.current = requestAnimationFrame(animateHighlight);
      }
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      startTime = performance.now();
      timerRef.current = requestAnimationFrame(animateHighlight);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        nativeBoundaryFired = true;
        setCurrentCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      setIsSpeaking(false);
      setCurrentCharIndex(text.length);
    };

    utterance.onerror = () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      setIsSpeaking(false);
      setCurrentCharIndex(-1);
    };

    synthRef.current.speak(utterance);
  }, [isMuted, language]);

  const stopSpeech = useCallback(() => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentCharIndex(-1);
    }
  }, []);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const fd = narrativeData.filter(d => {
      const eraMatch = selectedEra === 'All' || d.eraKey === selectedEra;
      const focusMatch = selectedFocus === 'All' || d.focusKey === selectedFocus;
      return eraMatch && focusMatch;
    });
    setFilteredData(fd);
    if(fd.length > 0 && !isCinematicMode) {
      setActiveEvent(fd[0]);
    }
  }, [selectedEra, selectedFocus]);

  useEffect(() => {
    if (activeEvent && !isCinematicMode && !isMuted) {
      speakNarration(activeEvent.desc[language]);
    }
  }, [activeEvent, isCinematicMode, isMuted, language, speakNarration]);

  const scrollTopicsTrack = (direction) => {
    if (timelineTrackRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      timelineTrackRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleEngageCinematic = () => {
    if(filteredData.length === 0) return;
    
    setIsCinematicMode(true);
    
    if (cinematicTl.current) cinematicTl.current.kill();
    cinematicTl.current = gsap.timeline({ 
      onComplete: () => {
        setIsCinematicMode(false);
        stopSpeech();
      }
    });
    
    filteredData.forEach((ev, i) => {
      if(i !== 0) {
        cinematicTl.current.to('.cinematic-stage', { opacity: 0, duration: 0.8, ease: "power2.inOut" });
      } else {
        cinematicTl.current.set('.cinematic-stage', { opacity: 0 });
      }
      
      cinematicTl.current.call(() => {
        setActiveEvent(ev);
        speakNarration(ev.desc[language]);
      });
      
      cinematicTl.current.fromTo('.cinematic-stage', 
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out", clearProps: "scale" }
      );
      
      const spokenWordsCount = ev.desc[language].split(' ').length;
      const calculatedDuration = Math.max(5.5, (spokenWordsCount / 2.1));
      
      cinematicTl.current.to({}, { duration: calculatedDuration });
    });
  };

  const handleNodeClick = (ev) => {
    if(isCinematicMode) return;
    gsap.fromTo('.cinematic-stage', 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
    setActiveEvent(ev);
  };

  const handleClose = () => {
     stopSpeech();
     if(cinematicTl.current) cinematicTl.current.kill();
     gsap.to(containerRef.current, {
         opacity: 0,
         scale: 0.95,
         duration: 0.6,
         ease: 'power2.in',
         onComplete: onClose
     });
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (activeEvent) speakNarration(activeEvent.desc[language]);
    } else {
      setIsMuted(true);
      stopSpeech();
    }
  };

  const particleOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      color: { value: "#ffffff" }, 
      links: { enable: false },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "out" },
        random: true,
        speed: 0.2,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: { enable: true, speed: 0.5, minimumValue: 0.1 }
      },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  };

  return (
    <div className="yuga-chronicles-page cinematic-mode-wrapper" ref={containerRef}>
      {/* Background Layer */}
      {activeEvent && (
        <div className="cinematic-backdrop">
          <img src={activeEvent.img} alt={activeEvent.title[language]} />
          <div className="backdrop-overlay"></div>
        </div>
      )}
      
      <Particles id="tsparticles-yuga" init={particlesInit} options={particleOptions} />
      
      {/* Top Controls UI */}
      <div className={`cinematic-controls ${isCinematicMode ? 'disabled' : ''}`}>
        <button 
          className="cinematic-select minimal-btn" 
          onClick={handleClose} 
          disabled={isCinematicMode}
        >
          {labels.endJourney}
        </button>
        
        <div className="controls-group">
          {/* 1. Cosmic Era Dropdown */}
          <div className="filter-block">
            <span className="filter-label">{labels.cosmicEra}</span>
            <select 
              value={selectedEra} 
              onChange={e => setSelectedEra(e.target.value)} 
              disabled={isCinematicMode} 
              className="cinematic-select"
            >
              <option value="All">{labels.allEras}</option>
              <option value="Satya Yuga">{labels.satyaYuga}</option>
              <option value="Treta Yuga">{labels.tretaYuga}</option>
              <option value="Dvapara Yuga">{labels.dvaparaYuga}</option>
              <option value="Kali Yuga">{labels.kaliYuga}</option>
            </select>
          </div>
          
          {/* 2. Narrative Focus Dropdown */}
          <div className="filter-block">
            <span className="filter-label">{labels.narrativeFocus}</span>
            <select 
              value={selectedFocus} 
              onChange={e => setSelectedFocus(e.target.value)} 
              disabled={isCinematicMode} 
              className="cinematic-select"
            >
              <option value="All">{labels.allDomains}</option>
              <option value="Creation">{labels.creation}</option>
              <option value="Conflict">{labels.conflict}</option>
              <option value="Philosophy">{labels.philosophy}</option>
            </select>
          </div>

          {/* 3. Language Dropdown (Styled identically to the two above) */}
          <div className="filter-block">
            <span className="filter-label">{labels.language}</span>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)} 
              disabled={isCinematicMode} 
              className="cinematic-select"
            >
              <option value="en">ENGLISH</option>
              <option value="hi">हिंदी (HINDI)</option>
            </select>
          </div>

          {/* Minimal Audio Toggle */}
          <button 
            className="cinematic-select minimal-btn" 
            onClick={toggleMute}
            title={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
          >
            {isMuted ? labels.voiceOff : labels.voiceOn}
          </button>
          
          {/* Minimal Cinematic Mode Toggle */}
          <button 
            className={`cinematic-select minimal-btn ${isCinematicMode ? 'active' : ''}`} 
            onClick={handleEngageCinematic} 
            disabled={isCinematicMode || filteredData.length === 0}
          >
            {isCinematicMode ? labels.cinematicEngaged : labels.engageCinematic}
          </button>
        </div>
      </div>

      {/* Main Cinematic Stage */}
      <div className="cinematic-stage">
        {activeEvent ? (
          <div className="epic-node-display">
            <div className="epic-text-panel frosted-glass">
              
              <div className="epic-meta">
                <span className="meta-tag">{activeEvent.era[language]}</span>
                <span className="meta-dot">•</span>
                <span className="meta-tag">{activeEvent.focus[language]}</span>
              </div>
              <h1 className="epic-title">{activeEvent.title[language]}</h1>
              <h2 className="epic-subtitle">{activeEvent.subtitle[language]}</h2>
              <div className="epic-divider"></div>

              <p className="epic-desc">
                <HighlightedDescription 
                  text={activeEvent.desc[language]}
                  currentCharIndex={currentCharIndex}
                  isMuted={isMuted}
                />
              </p>
              
              {/* Black Frosted Circular Read Button at Bottom Right */}
              <button 
                className="read-story-btn-circle" 
                onClick={() => setIsModalOpen(true)}
                disabled={isCinematicMode}
                title={labels.readFullChronicle}
                aria-label={labels.readFullChronicle}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </button>
            </div>
            
            <div className="epic-visual-panel frosted-glass">
              <div className="image-wrapper">
                <img src={activeEvent.img} alt={activeEvent.title[language]} />
              </div>
            </div>
          </div>
        ) : (
          <div className="no-events-msg">{labels.noEvents}</div>
        )}
      </div>

      {/* Timeline Slider Area */}
      <div className={`epic-timeline ${isCinematicMode ? 'disabled' : ''}`}>
        <button 
          className="epic-timeline-arrow left-astra"
          onClick={() => scrollTopicsTrack('left')}
          disabled={isCinematicMode}
          aria-label="Scroll Topics Left"
        >
          <DivineCosmicLeftArrow />
        </button>

        <div className="timeline-track-wrapper" ref={timelineTrackRef}>
          <div className="timeline-track"></div>
          {filteredData.map((ev) => (
            <div 
              key={ev.id} 
              className={`timeline-node ${activeEvent?.id === ev.id ? 'active' : ''} ${isCinematicMode ? 'locked' : ''}`}
              onClick={() => handleNodeClick(ev)}
            >
              <div className="node-point"></div>
              <div className="node-label">{ev.title[language]}</div>
            </div>
          ))}
        </div>

        <button 
          className="epic-timeline-arrow right-astra"
          onClick={() => scrollTopicsTrack('right')}
          disabled={isCinematicMode}
          aria-label="Scroll Topics Right"
        >
          <DivineCosmicRightArrow />
        </button>
      </div>

      {/* Yuga Chronicles Full Story Modal Popup */}
      {isModalOpen && activeEvent && (
        <div className="story-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setIsModalOpen(false)}
              aria-label="Close story popup"
            >
              ✕
            </button>

            <div className="modal-header">
              <div className="epic-meta">
                <span className="meta-tag">{activeEvent.era[language]}</span>
                <span className="meta-dot">•</span>
                <span className="meta-tag">{activeEvent.focus[language]}</span>
              </div>
              <h2 className="modal-title">{activeEvent.title[language]}</h2>
              <p className="modal-subtitle">{activeEvent.subtitle[language]}</p>
              <div className="epic-divider"></div>
            </div>

            <div className="modal-body custom-scrollbar">
              <p className="modal-paragraph">
                {activeEvent.fullStory[language] || activeEvent.desc[language]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}