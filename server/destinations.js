const destinations = [
    // MOUNTAINS (4)
    {
        id: 1,
        name: 'Gulmarg',
        state: 'Jammu & Kashmir',
        category: 'Mountains',
        description: 'Uff! Snow, skiing, aur endless meadows — Jannat ka ek corner! ❄️',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
        cost: 35000,
        adventureLevel: 5,
        bestSeason: 'December - March',
        topThings: ['Skiing and snowsports', 'Gondola rides with Valley views'],
        idealDays: 3,
        isTopPick: true
    },
    {
        id: 2,
        name: 'Manali',
        state: 'Himachal Pradesh',
        category: 'Mountains',
        description: 'Mountain hugging mein expert ho jaoge yahan! 🏔️',
        imageUrl: 'https://images.unsplash.com/photo-1532274040911-5a369e4c4bb5?w=500&h=300&fit=crop',
        cost: 25000,
        adventureLevel: 4,
        bestSeason: 'March - June',
        topThings: ['Paragliding over valleys', 'Trekking to Rohtang Pass'],
        idealDays: 4
    },
    {
        id: 3,
        name: 'Auli',
        state: 'Uttarakhand',
        category: 'Mountains',
        description: 'India ka ski resort! Snow mein roll karo, sirf roll mat karo! ⛷️',
        imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6c7f?w=500&h=300&fit=crop',
        cost: 28000,
        adventureLevel: 4,
        bestSeason: 'January - March',
        topThings: ['Skiing lessons and racing', 'Chopta meadows trekking'],
        idealDays: 3
    },
    {
        id: 4,
        name: 'Spiti Valley',
        state: 'Himachal Pradesh',
        category: 'Mountains',
        description: 'High altitude mein space mein travel karte feel karega! 🪐',
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=300&fit=crop',
        cost: 30000,
        adventureLevel: 5,
        bestSeason: 'July - September',
        topThings: ['Kaza village exploration', 'Key Monastery pilgrimage'],
        idealDays: 5
    },

    // BEACHES (4)
    {
        id: 5,
        name: 'Goa',
        state: 'Goa',
        category: 'Beaches',
        description: 'Beach ka matlab Goa, Goa ka matlab beach! 🏖️',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
        cost: 20000,
        adventureLevel: 2,
        bestSeason: 'November - February',
        topThings: ['Beach hopping and water sports', 'Sunset parties and nightlife'],
        idealDays: 4,
        isTopPick: true
    },
    {
        id: 6,
        name: 'Lakshadweep',
        state: 'Lakshadweep',
        category: 'Beaches',
        description: 'Islands jahan hawa dhishe, pani mein peace! 🏝️',
        imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&h=300&fit=crop',
        cost: 45000,
        adventureLevel: 3,
        bestSeason: 'October - May',
        topThings: ['Scuba diving and snorkeling', 'Lagoon island hops'],
        idealDays: 4
    },
    {
        id: 7,
        name: 'Kanyakumari',
        state: 'Tamil Nadu',
        category: 'Beaches',
        description: 'Teeno samudra milate hain yahan — spiritual aur scenic! 🌊',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
        cost: 15000,
        adventureLevel: 1,
        bestSeason: 'October - February',
        topThings: ['Sunrise viewing at three seas junction', 'Vivekananda Rock visit'],
        idealDays: 2
    },
    {
        id: 8,
        name: 'Andaman',
        state: 'Andaman & Nicobar',
        category: 'Beaches',
        description: 'Turquoise waters aur white sand — heaven bhai, heaven! 💙',
        imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=300&fit=crop',
        cost: 40000,
        adventureLevel: 3,
        bestSeason: 'November - April',
        topThings: ['Island hopping and beach walks', 'Snorkeling at coral reefs'],
        idealDays: 4
    },

    // HERITAGE CITIES (4)
    {
        id: 9,
        name: 'Jaipur',
        state: 'Rajasthan',
        category: 'Heritage',
        description: 'Pink City mein history har corner mein! 🏰',
        imageUrl: 'https://images.unsplash.com/photo-1585399781694-54201cc0b470?w=500&h=300&fit=crop',
        cost: 18000,
        adventureLevel: 2,
        bestSeason: 'October - March',
        topThings: ['City Palace and Jantar Mantar', 'Hawa Mahal photography'],
        idealDays: 2,
        isTopPick: true
    },
    {
        id: 10,
        name: 'Varanasi',
        state: 'Uttar Pradesh',
        category: 'Heritage',
        description: 'Ghat, ghaat, ghataaon ka raag! Spiritual drama in its glory! 🕯️',
        imageUrl: 'https://images.unsplash.com/photo-1591906614436-2e58fc639e1e?w=500&h=300&fit=crop',
        cost: 12000,
        adventureLevel: 2,
        bestSeason: 'October - March',
        topThings: ['Ghat walks and Aarti ceremony', 'Boat rides on Ganges'],
        idealDays: 3
    },
    {
        id: 11,
        name: 'Agra',
        state: 'Uttar Pradesh',
        category: 'Heritage',
        description: 'Taj Mahal — pyaar ka monument, emotion ka checkpoint! 🕌',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop',
        cost: 10000,
        adventureLevel: 1,
        bestSeason: 'October - March',
        topThings: ['Taj Mahal sunset visit', 'Agra Fort exploration'],
        idealDays: 2
    },
    {
        id: 12,
        name: 'Jodhpur',
        state: 'Rajasthan',
        category: 'Heritage',
        description: 'Blue City — neelay rang ki kahani suno! 💙',
        imageUrl: 'https://images.unsplash.com/photo-1596040226248-d8c51f87e2a5?w=500&h=300&fit=crop',
        cost: 16000,
        adventureLevel: 2,
        bestSeason: 'September - March',
        topThings: ['Mehrangarh Fort views', 'Clock Tower Market wandering'],
        idealDays: 2
    },

    // HIDDEN GEMS (4)
    {
        id: 13,
        name: 'Hampi',
        state: 'Karnataka',
        category: 'Hidden',
        description: 'Temples aur boulders — nature aur history ka fusion! 🪨',
        imageUrl: 'https://images.unsplash.com/photo-1586377832701-0f0578b542d1?w=500&h=300&fit=crop',
        cost: 14000,
        adventureLevel: 3,
        bestSeason: 'October - February',
        topThings: ['Virupaksha Temple exploration', 'Stone carving walks'],
        idealDays: 3,
        isTopPick: true
    },
    {
        id: 14,
        name: 'Pushkar',
        state: 'Rajasthan',
        category: 'Hidden',
        description: 'Holy lake, camel rides, aur desert peace! Sikhogo na tum! 🐪',
        imageUrl: 'https://images.unsplash.com/photo-1542736667-069246bdbc44?w=500&h=300&fit=crop',
        cost: 12000,
        adventureLevel: 2,
        bestSeason: 'October - March',
        topThings: ['Camel safari rides', 'Temple hopping around lake'],
        idealDays: 2
    },
    {
        id: 15,
        name: 'Mawlynnong',
        state: 'Meghalaya',
        category: 'Hidden',
        description: 'Earth ka asli green — rain, waterfalls, aur bamboo forests! 🌿',
        imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=300&fit=crop',
        cost: 22000,
        adventureLevel: 3,
        bestSeason: 'October - April',
        topThings: ['Living root bridge hikes', 'Waterfall and cave exploration'],
        idealDays: 3
    },
    {
        id: 16,
        name: 'Chettinad',
        state: 'Tamil Nadu',
        category: 'Hidden',
        description: 'Palaces, tanks, aur colonial charm — time machine mein ghusega! ✨',
        imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=300&fit=crop',
        cost: 13000,
        adventureLevel: 2,
        bestSeason: 'October - March',
        topThings: ['Heritage palace tours', 'Traditional village walks'],
        idealDays: 2
    }
];

module.exports = destinations;
