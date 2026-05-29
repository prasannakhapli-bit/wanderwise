// WanderWise Itineraries Data
// Pre-built itinerary templates for different destinations

const itineraries = [
    // GULMARG 3-DAY ITINERARY
    {
        id: 201,
        destinationId: 1,
        name: 'Gulmarg Winter Wonderland',
        destination: 'Gulmarg',
        duration: 3,
        budget: 35000,
        difficulty: 'Hard',
        description: 'Experience skiing and alpine beauty in Kashmir',
        days: [
            {
                dayNumber: 1,
                title: 'Arrival & Acclimation',
                activities: [
                    'Arrive in Gulmarg',
                    'Check-in at resort',
                    'Light walk around meadows',
                    'Evening sunset viewing'
                ]
            },
            {
                dayNumber: 2,
                title: 'Skiing Adventure',
                activities: [
                    'Breakfast at resort',
                    'Skiing lessons (3 hours)',
                    'Lunch at slope-side cafe',
                    'Gondola ride with valley views',
                    'Spa treatment in evening'
                ]
            },
            {
                dayNumber: 3,
                title: 'Departure',
                activities: [
                    'Final sunrise walk',
                    'Breakfast and packing',
                    'Departure'
                ]
            }
        ]
    },

    // MANALI 4-DAY ITINERARY
    {
        id: 202,
        destinationId: 2,
        name: 'Manali Adventure Trail',
        destination: 'Manali',
        duration: 4,
        budget: 25000,
        difficulty: 'Medium',
        description: 'Mountain adventure with paragliding and trekking',
        days: [
            {
                dayNumber: 1,
                title: 'Arrival Day',
                activities: [
                    'Arrive in Manali',
                    'Local market exploration',
                    'Evening stroll on Mall Road',
                    'Dinner at local restaurant'
                ]
            },
            {
                dayNumber: 2,
                title: 'Paragliding',
                activities: [
                    'Early breakfast',
                    'Paragliding experience (tandem)',
                    'Lunch at base',
                    'Visit nearby Hadimba Temple',
                    'Evening shopping'
                ]
            },
            {
                dayNumber: 3,
                title: 'Trekking Day',
                activities: [
                    'Trek to Rohtang Pass (guide included)',
                    'Picnic lunch at viewpoint',
                    'Photography session',
                    'Return and rest'
                ]
            },
            {
                dayNumber: 4,
                title: 'Leisure & Departure',
                activities: [
                    'Spa and relaxation',
                    'Last-minute shopping',
                    'Departure'
                ]
            }
        ]
    },

    // GOA 4-DAY ITINERARY
    {
        id: 203,
        destinationId: 5,
        name: 'Goa Beach Bliss',
        destination: 'Goa',
        duration: 4,
        budget: 20000,
        difficulty: 'Easy',
        description: 'Relax on beaches and explore local culture',
        days: [
            {
                dayNumber: 1,
                title: 'Beach Exploration',
                activities: [
                    'Arrive at Goa',
                    'Beach walk at Calangute',
                    'Sunset at Baga Beach',
                    'Seafood dinner'
                ]
            },
            {
                dayNumber: 2,
                title: 'Water Sports',
                activities: [
                    'Jet ski riding',
                    'Parasailing',
                    'Lunch by the beach',
                    'Beach volleyball',
                    'Evening bar visit'
                ]
            },
            {
                dayNumber: 3,
                title: 'Culture & Temples',
                activities: [
                    'Visit Basilica of Bom Jesus',
                    'Explore Old Goa architecture',
                    'Spice plantation tour',
                    'Traditional Goan lunch'
                ]
            },
            {
                dayNumber: 4,
                title: 'Relaxation & Departure',
                activities: [
                    'Beach time',
                    'Spa treatment',
                    'Departure'
                ]
            }
        ]
    },

    // AGRA 2-DAY ITINERARY
    {
        id: 204,
        destinationId: 11,
        name: 'Taj Mahal Classic Tour',
        destination: 'Agra',
        duration: 2,
        budget: 10000,
        difficulty: 'Easy',
        description: 'Must-see Taj Mahal and Agra Fort experience',
        days: [
            {
                dayNumber: 1,
                title: 'Taj Mahal Experience',
                activities: [
                    'Sunrise visit to Taj Mahal (guided tour)',
                    'Photography at different angles',
                    'Breakfast at hotel',
                    'Agra Fort exploration',
                    'Sunset at Taj Mahal viewpoint'
                ]
            },
            {
                dayNumber: 2,
                title: 'Local Culture',
                activities: [
                    'Marble inlay workshop visit',
                    'Local market exploration',
                    'Lunch with a view',
                    'Departure'
                ]
            }
        ]
    }
];

// Export for Node.js (server-side)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = itineraries;
}
