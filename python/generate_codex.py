import json
from pathlib import Path

CODex = {
    "gods": [
        {
            "name": "Lord Brahma",
            "title": "The Creator",
            "desc": "Brahma is the creator god, part of the Trimurti, and is depicted with four faces.",
            "details": "He is associated with wisdom and the Vedas, and his consort is Saraswati, goddess of knowledge.",
            "img": "https://media.istockphoto.com/id/535496908/vector/brahma.jpg?s=2048x2048&w=is&k=20&c=ZQG_ZV4ZMMm61EGZQ0U5FCbBnWeW3YPTG4_rMb7WvxM=",
            "temples": [
                {"name": "Brahma Temple", "city": "Pushkar"}
            ],
            "mantra": {"sanskrit": "ॐ वेदात्मने विद्महे हिरण्यगर्भाय धीमहि", "english": "Om Vedatmane Vidmahe Hiranyagarbhaya Dhimahi"}
        },
        {
            "name": "Lord Vishnu",
            "title": "The Preserver",
            "desc": "Vishnu is the preserver and protector of the universe, often shown with blue skin and four arms.",
            "details": "He is known for his ten avatars, including Rama and Krishna, and is always depicted with a conch, discus, mace, and lotus.",
            "img": "https://cdn.pixabay.com/photo/2024/05/24/02/12/vishnu-8784113_1280.jpg",
            "temples": [
                {"name": "Tirupati Balaji", "city": "Tirupati"},
                {"name": "Jagannath Temple", "city": "Puri"}
            ],
            "mantra": {"sanskrit": "ॐ नमो भगवते वासुदेवाय", "english": "Om Namo Bhagavate Vasudevaya"}
        },
        {
            "name": "Lord Shiva",
            "title": "The Destroyer",
            "desc": "Shiva, the destroyer and transformer, is depicted with a trident, crescent moon, and the river Ganga flowing from his hair.",
            "details": "He is the master of meditation and yoga, and his consort is Parvati. His vahana (vehicle) is the bull Nandi.",
            "img": "https://cdn.pixabay.com/photo/2023/10/31/05/24/shiva-8354334_1280.png",
            "avatars": [
                { "name": "Kala Bhairava", "type": "fierce", "desc": "The terrifying manifestation of annihilation.", "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-B7qJdZw_brX-DjVtSZ1HYO0BoelaeKVrVg&s" },
                { "name": "Nataraja", "type": "peaceful", "desc": "The Lord of Dance, representing cosmic cycles.", "img": "https://www.tallengestore.com/cdn/shop/products/NatrajLordShiva-IndianReligiousPainting_0608cac9-bab4-4527-ae6e-39c663f610fc.jpg?v=1671612022" },
                { "name": "Virabhadra", "type": "fierce", "desc": "A great warrior created from Shiva's wrath.", "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_CrQikcqHpCe2Ax17vDcbIR1jlDLwNAZNCg&s" }
            ],
            "temples": [
                {"name": "Kashi Vishwanath", "city": "Varanasi"},
                {"name": "Kedarnath", "city": "Uttarakhand"}
            ],
            "mantra": {"sanskrit": "ॐ नमः शिवाय", "english": "Om Namah Shivaya"}
        },
        {
            "name": "Lakshmi",
            "title": "Goddess of Wealth",
            "desc": "Lakshmi is the goddess of wealth, fortune, and prosperity, often shown with gold coins and lotuses.",
            "details": "She is the consort of Vishnu and is worshipped especially during Diwali for prosperity and good luck.",
            "img": "https://i.etsystatic.com/20908186/r/il/bb2faa/2277693998/il_570xN.2277693998_2jc1.jpg",
            "temples": [
                {"name": "Mahalakshmi Temple", "city": "Mumbai"}
            ],
            "mantra": {"sanskrit": "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद", "english": "Om Shreem Hreem Shreem Kamale Kamalalaye Praseed"}
        },
        {
            "name": "Saraswati",
            "title": "Goddess of Knowledge",
            "desc": "Saraswati is the goddess of wisdom, music, and learning, depicted with a veena and a swan.",
            "details": "She is the consort of Brahma and is worshipped by students and artists for wisdom and creativity.",
            "img": "https://cdn.pixabay.com/photo/2024/05/03/04/04/ai-generated-8736092_1280.jpg",
            "temples": [
                {"name": "Sharada Peeth", "city": "Sringeri"}
            ],
            "mantra": {"sanskrit": "ॐ ऐं सरस्वत्यै नमः", "english": "Om Aim Saraswatyai Namah"}
        },
        {
            "name": "Parvati",
            "title": "Mother Goddess",
            "desc": "Parvati is the goddess of power, harmony, and devotion, wife of Shiva and mother of Ganesha and Kartikeya.",
            "details": "She is also worshipped as Durga and Kali in her fierce forms.",
            "img": "https://cdn.pixabay.com/photo/2023/10/17/07/51/ai-generated-8320587_1280.jpg",
            "temples": [
                {"name": "Meenakshi Temple", "city": "Madurai"}
            ],
            "mantra": {"sanskrit": "ॐ पार्वत्यै नमः", "english": "Om Parvatyai Namah"}
        },
        {
            "name": "Durga",
            "title": "Goddess of Power",
            "desc": "Durga is the fierce form of Parvati, symbolizing strength and protection, often shown riding a lion or tiger.",
            "details": "She is celebrated during Navratri and is known for slaying the buffalo demon Mahishasura.",
            "img": "https://thegoddessgarden.com/wp-content/uploads/2018/11/durga03-750x712.jpg",
            "temples": [
                {"name": "Vaishno Devi", "city": "Katra"}
            ],
            "mantra": {"sanskrit": "ॐ दुं दुर्गायै नमः", "english": "Om Dum Durgayai Namah"}
        },
        {
            "name": "Kali",
            "title": "Goddess of Time & Change",
            "desc": "Kali is the goddess of destruction and transformation, depicted with dark skin and a garland of skulls.",
            "details": "She is a fierce form of Parvati, representing the power of time and change, and is worshipped for protection from evil.",
            "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0kPSnzmjIjjq0O5ajG1WQpbpYMeqxOfU-vg&s",
            "temples": [
                {"name": "Kalighat", "city": "Kolkata"}
            ],
            "mantra": {"sanskrit": "ॐ क्रीं कालिकायै नमः", "english": "Om Kreem Kalikayai Namah"}
        },
        {
            "name": "Ganesha",
            "title": "Remover of Obstacles",
            "desc": "Ganesha, the elephant-headed god, is the remover of obstacles and patron of arts and sciences.",
            "details": "He is the son of Shiva and Parvati, and is worshipped at the start of new ventures for good fortune.",
            "img": "https://cdn.pixabay.com/photo/2024/03/27/07/14/ai-generated-8658378_1280.jpg",
            "temples": [
                {"name": "Siddhivinayak", "city": "Mumbai"}
            ],
            "mantra": {"sanskrit": "ॐ गं गणपतये नमः", "english": "Om Gam Ganapataye Namah"}
        },
        {
            "name": "Hanuman",
            "title": "Monkey God",
            "desc": "Hanuman is the devoted servant of Rama, symbolizing strength, devotion, and courage.",
            "details": "He is a central figure in the Ramayana, known for his loyalty, bravery, and ability to change form at will.",
            "img": "https://cdn.pixabay.com/photo/2024/02/26/15/10/hanuman-8598225_1280.png",
            "temples": [
                {"name": "Sankat Mochan", "city": "Varanasi"}
            ],
            "mantra": {"sanskrit": "ॐ हं हनुमते नमः", "english": "Om Hum Hanumate Namah"}
        },
        {
            "name": "Rama",
            "title": "Seventh Avatar of Vishnu",
            "desc": "Rama, the hero of the Ramayana, is the embodiment of virtue, courage, and devotion.",
            "details": "He is the ideal king and husband, and his story is celebrated during the festival of Diwali.",
            "img": "https://cdn.pixabay.com/photo/2024/02/20/10/04/ai-generated-8585102_1280.jpg",
            "temples": [
                {"name": "Ram Janmabhoomi", "city": "Ayodhya"}
            ],
            "mantra": {"sanskrit": "ॐ रां रामाय नमः", "english": "Om Ram Ramaya Namah"}
        },
        {
            "name": "Krishna",
            "title": "Eighth Avatar of Vishnu",
            "desc": "Krishna is worshipped as the god of compassion, tenderness, and love, and is a central figure in the Mahabharata.",
            "details": "He is known for his childhood pranks, the Bhagavad Gita, and the festival of Janmashtami.",
            "img": "https://cdn.pixabay.com/photo/2024/06/15/03/30/krishna-8830928_1280.jpg",
            "temples": [
                {"name": "Banke Bihari", "city": "Vrindavan"}
            ],
            "mantra": {"sanskrit": "ॐ क्लीं कृष्णाय नमः", "english": "Om Kleem Krishnaya Namah"}
        },
        {
            "name": "Skanda",
            "title": "God of War",
            "desc": "Skanda, also known as Kartikeya or Murugan, is the god of war and the son of Shiva and Parvati.",
            "details": "He is especially popular in South India and is depicted riding a peacock and holding a spear.",
            "img": "https://www.poojn.in/wp-content/uploads/2024/06/Kartikeya-poojn.jpg",
            "temples": [
                {"name": "Palani Murugan", "city": "Tamil Nadu"}
            ],
            "mantra": {"sanskrit": "ॐ शरवणभवाय नमः", "english": "Om Sharavanabhavaya Namah"}
        },
        {
            "name": "Sita",
            "title": "Wife of Rama",
            "desc": "Sita is the incarnation of Lakshmi and the devoted wife of Rama, known for her purity and courage.",
            "details": "She is a central character in the Ramayana and is revered as the ideal woman and wife.",
            "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlVWEga8CvO_tVUv_K_lsduaCSTbu_B5huZA&s",
            "temples": [
                {"name": "Janaki Mandir", "city": "Janakpur"}
            ],
            "mantra": {"sanskrit": "ॐ सीतायै नमः", "english": "Om Sitayai Namah"}
        }
    ],
    "asuras": [
        {
            "name": "Hiranyaksha",
            "title": "The Golden-Eyed Demon",
            "desc": "A mighty Daitya who dragged the Earth into the cosmic ocean.",
            "details": "He was slain by Lord Vishnu in his Varaha (boar) avatar after a thousand-year battle to restore the Earth to its rightful place.",
            "img": "https://cdn.pixabay.com/photo/2024/03/11/17/08/ai-generated-8627092_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "अहं ब्रह्मास्मि", "english": "Aham Brahmasmi (Egoistic War Cry)"}
        },
        {
            "name": "Hiranyakashipu",
            "title": "Enemy of Devotion",
            "desc": "A tyrannical Asura king who demanded to be worshipped as God.",
            "details": "Granted a boon of near-immortality by Brahma, he tormented his son Prahlada. He was brutally slain by Lord Vishnu's Narasimha avatar at twilight.",
            "img": "https://cdn.pixabay.com/photo/2024/08/21/09/25/mythology-8985794_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "हिरण्यकशिपुर्जयति", "english": "Victory to Hiranyakashipu (War Cry)"}
        },
        {
            "name": "Bhasmasura",
            "title": "The Ash Demon",
            "desc": "An Asura granted the power to turn anyone to ashes by touching their head.",
            "details": "He attempted to use this boon on Lord Shiva himself. He was ultimately tricked by Vishnu in the form of Mohini into touching his own head, reducing himself to ash.",
            "img": "https://cdn.pixabay.com/photo/2023/12/13/06/49/ai-generated-8446342_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "भस्मसात् करोमि", "english": "I shall turn all to ash!"}
        },
        {
            "name": "Alakshmi",
            "title": "Goddess of Misfortune",
            "desc": "The shadow sister of Lakshmi, representing grief, jealousy, and poverty.",
            "details": "She arose during the churning of the cosmic ocean (Samudra Manthan) just before Lakshmi, embodying the struggles and misfortunes of the material world.",
            "img": "https://cdn.pixabay.com/photo/2024/03/22/10/21/ai-generated-8649514_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "अलक्ष्मीर्नाशय", "english": "Alakshmir Nashaya (Prayer to ward her off)"}
        },
        {
            "name": "Kumbhakarna",
            "title": "The Slumbering Giant",
            "desc": "The colossal brother of Ravana known for his endless sleep and immense appetite.",
            "details": "Despite knowing Ravana was wrong, he fought loyally for his brother against Rama. He was cursed by Saraswati to sleep for six months at a time.",
            "img": "https://cdn.pixabay.com/photo/2024/01/22/16/08/ai-generated-8525712_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "निद्रा मे शरणम्", "english": "Sleep is my refuge"}
        },
        {
            "name": "Andhakasura",
            "title": "The Blind Demon",
            "desc": "A formidable Asura born from the sweat of Lord Shiva.",
            "details": "Blind due to Parvati covering Shiva's eyes playfully, he grew powerful and arrogant. He was ultimately defeated by Shiva and Kali when he tried to abduct Parvati.",
            "img": "https://cdn.pixabay.com/photo/2023/11/09/16/09/ai-generated-8377665_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "अन्धकारो विजयते", "english": "Darkness Prevails"}
        },
        {
            "name": "Mahishasura",
            "title": "The Buffalo Demon",
            "desc": "A shape-shifting Asura who could take the form of a massive water buffalo.",
            "details": "Protected by a boon that no man or god could kill him, he conquered the heavens. He was ultimately slain by Goddess Durga after a fierce nine-day battle.",
            "img": "https://cdn.pixabay.com/photo/2023/10/18/15/43/hindu-8324467_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "महिषोऽहम्", "english": "I am the Mighty Buffalo"}
        },
        {
            "name": "Raktabija",
            "title": "The Blood-Seed Demon",
            "desc": "A terrifying Asura whose spilled blood would spawn duplicates of himself.",
            "details": "During battle, every drop of his blood that hit the ground created a new clone. He was finally defeated by Goddess Kali, who drank his blood before it could touch the earth.",
            "img": "https://cdn.pixabay.com/photo/2024/05/15/07/49/ai-generated-8763024_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "रक्तबीजोऽहम्", "english": "From blood, I multiply"}
        },
        {
            "name": "Gajamukhasura",
            "title": "The Elephant Demon",
            "desc": "An Asura with the head of an elephant who terrorized the gods.",
            "details": "He was granted a boon that he could not be killed by any weapon. Lord Ganesha defeated him using his own broken tusk, eventually turning the demon into a mouse (his vahana).",
            "img": "https://cdn.pixabay.com/photo/2024/02/20/15/48/ai-generated-8585698_1280.png",
            "temples": [],
            "mantra": {"sanskrit": "गजामुखोऽहम्", "english": "I am the Elephant-Faced"}
        },
        {
            "name": "Ahiravan",
            "title": "Demon of the Underworld",
            "desc": "A powerful sorcerer and brother of Ravana who ruled Patala (the underworld).",
            "details": "He kidnapped Rama and Lakshmana to sacrifice them to Goddess Kali. Hanuman rescued them by changing his size and slaying Ahiravan in his own realm.",
            "img": "https://cdn.pixabay.com/photo/2024/08/24/08/12/mythology-8993856_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "पातालो मे राज्यम्", "english": "The Underworld is my Kingdom"}
        },
        {
            "name": "Ravana",
            "title": "Demon King of Lanka",
            "desc": "The ten-headed Rakshasa king of Lanka and primary antagonist of the Ramayana.",
            "details": "A great scholar, devoted follower of Shiva, and master of the Veena, whose arrogance and kidnapping of Sita led to his downfall at the hands of Rama.",
            "img": "https://cdn.pixabay.com/photo/2023/10/22/08/17/ravana-8333501_1280.png",
            "temples": [
                {"name": "Koneswaram Temple (Associated)", "city": "Sri Lanka"}
            ],
            "mantra": {"sanskrit": "ॐ शिवताण्डवस्तोत्रम्", "english": "Shiva Tandava Stotram (Composed by him)"}
        },
        {
            "name": "Kansa",
            "title": "The Tyrant of Mathura",
            "desc": "The cruel uncle of Lord Krishna who overthrew his own father to claim the throne.",
            "details": "Fearing a prophecy that his sister's eighth child would kill him, he murdered his nephews. He was eventually slain by Krishna, fulfilling the prophecy.",
            "img": "https://cdn.pixabay.com/photo/2024/08/21/09/25/mythology-8985794_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "मथुराधिपतिर्जयति", "english": "Glory to the Lord of Mathura"}
        },
        {
            "name": "Tarakasura",
            "title": "The Invincible Warrior",
            "desc": "A mighty Asura who conquered the universe and drove out the Devas.",
            "details": "He had a boon that he could only be killed by the son of Shiva. This led to the birth of Skanda (Kartikeya), who ultimately led the divine army to defeat him.",
            "img": "https://cdn.pixabay.com/photo/2024/02/20/15/48/ai-generated-8585698_1280.png",
            "temples": [],
            "mantra": {"sanskrit": "तारकोऽहम्", "english": "I am Taraka, the Invincible"}
        },
        {
            "name": "Surpanakha",
            "title": "The Demoness of Vengeance",
            "desc": "The sister of Ravana whose actions sparked the great war of Ramayana.",
            "details": "She attempted to seduce Rama and attack Sita, resulting in Lakshmana cutting off her nose. Her desire for revenge caused Ravana to kidnap Sita.",
            "img": "https://cdn.pixabay.com/photo/2024/03/22/10/21/ai-generated-8649514_1280.jpg",
            "temples": [],
            "mantra": {"sanskrit": "प्रतिशोधो मे धर्मः", "english": "Vengeance is my duty"}
        }
    ],
    "festivals": [
        {
            "name": "Diwali",
            "date": "2025-10-20",
            "description": "Festival of Lights, celebrating the victory of light over darkness.",
            "gods": ["Lakshmi", "Rama", "Ganesha"]
        },
        {
            "name": "Janmashtami",
            "date": "2025-08-16",
            "description": "Celebrates the birth of Lord Krishna.",
            "gods": ["Krishna"]
        },
        {
            "name": "Maha Shivaratri",
            "date": "2025-02-26",
            "description": "Night of Shiva, dedicated to Lord Shiva with fasting and night-long vigils.",
            "gods": ["Shiva"]
        },
        {
            "name": "Navratri",
            "date": "2025-09-22",
            "description": "Nine nights dedicated to the goddess Durga and her forms.",
            "gods": ["Durga", "Parvati", "Kali"]
        },
        {
            "name": "Ganesh Chaturthi",
            "date": "2025-08-27",
            "description": "Celebrates the birth of Ganesha, the remover of obstacles.",
            "gods": ["Ganesha"]
        }
    ]
}


def write_codex(destination: Path | str):
    destination = Path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("w", encoding="utf-8") as fp:
        json.dump(CODex, fp, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    write_codex(root / "data" / "codex.json")
