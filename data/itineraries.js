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
,

    // KERALA 5-DAY ITINERARY
    {
        id: 205,
        destinationId: 4,
        name: 'Kerala Backwater Paradise',
        destination: 'Kerala',
        duration: 5,
        budget: 30000,
        difficulty: 'Easy',
        description: 'Explore backwaters, beaches, and tea plantations',
        days: [
            {
                dayNumber: 1,
                title: 'Arrival in Kochi',
                activities: [
                    'Arrive in Kochi',
                    'Explore Fort Kochi heritage zone',
                    'Witness Chinese fishing nets at sunset',
                    'Dinner at beachside restaurant'
                ]
            },
            {
                dayNumber: 2,
                title: 'Backwater Cruise',
                activities: [
                    'Houseboat cruise on backwaters',
                    'Visit spice markets',
                    'Lunch on the boat',
                    'Experience village life',
                    'Traditional dinner'
                ]
            },
            {
                dayNumber: 3,
                title: 'Munnar Tea Gardens',
                activities: [
                    'Journey to Munnar hill station',
                    'Tea plantation trek',
                    'Visit tea factory',
                    'Sunset view point',
                    'Adventure activities'
                ]
            },
            {
                dayNumber: 4,
                title: 'Beach Exploration',
                activities: [
                    'Head to Alleppey beaches',
                    'Beach volleyball and swimming',
                    'Ayurvedic spa treatment',
                    'Fresh seafood dinner',
                    'Bonfire on beach'
                ]
            },
            {
                dayNumber: 5,
                title: 'Relaxation & Departure',
                activities: [
                    'Morning yoga session',
                    'Last-minute shopping',
                    'Beach time',
                    'Departure'
                ]
            }
        ]
    },

    // RAJASTHAN 4-DAY ITINERARY
    {
        id: 206,
        destinationId: 8,
        name: 'Rajasthan Royal Heritage',
        destination: 'Rajasthan',
        duration: 4,
        budget: 28000,
        difficulty: 'Medium',
        description: 'Explore palaces, forts, and desert landscapes',
        days: [
            {
                dayNumber: 1,
                title: 'Jaipur Pink City',
                activities: [
                    'Explore City Palace',
                    'Visit Jantar Mantar',
                    'Walk through bazaars',
                    'Hawa Mahal photography',
                    'Evening light and sound show'
                ]
            },
            {
                dayNumber: 2,
                title: 'Amber Fort & Elephant Ride',
                activities: [
                    'Elephant ride to Amber Fort',
                    'Fort exploration with guide',
                    'Mirror Palace visit',
                    'Lunch in heritage hotel',
                    'Traditional puppet show'
                ]
            },
            {
                dayNumber: 3,
                title: 'Jodhpur Blue City',
                activities: [
                    'Travel to Jodhpur',
                    'Mehrangarh Fort exploration',
                    'Climb fort stairs for city views',
                    'Explore blue-painted old town',
                    'Visit local markets'
                ]
            },
            {
                dayNumber: 4,
                title: 'Desert Safari & Departure',
                activities: [
                    'Desert camel safari',
                    'Lunch in desert village',
                    'Traditional folk performance',
                    'Sunset photography',
                    'Departure'
                ]
            }
        ]
    },

    // DARJEELING 3-DAY ITINERARY
    {
        id: 207,
        destinationId: 3,
        name: 'Darjeeling Tea Trail',
        destination: 'Darjeeling',
        duration: 3,
        budget: 18000,
        difficulty: 'Medium',
        description: 'Tea gardens, toy train, and Himalayan views',
        days: [
            {
                dayNumber: 1,
                title: 'Arrival & Sightseeing',
                activities: [
                    'Arrive in Darjeeling',
                    'Tiger Hill sunrise visit',
                    'Kanyakumari viewpoint',
                    'Explore local markets',
                    'Evening stroll on Mall Road'
                ]
            },
            {
                dayNumber: 2,
                title: 'Toy Train & Tea Gardens',
                activities: [
                    'Ride the famous toy train',
                    'Visit Batasia Loop',
                    'Tea garden trek',
                    'Tour tea processing factory',
                    'Tea tasting experience'
                ]
            },
            {
                dayNumber: 3,
                title: 'Adventure & Departure',
                activities: [
                    'Rock climbing or paragliding',
                    'Visit monasteries',
                    'Last shopping session',
                    'Departure'
                ]
            }
        ]
    },

    // PUSHKAR 3-DAY ITINERARY
    {
        id: 208,
        destinationId: 9,
        name: 'Pushkar Spiritual Journey',
        destination: 'Pushkar',
        duration: 3,
        budget: 12000,
        difficulty: 'Easy',
        description: 'Explore the sacred Pushkar Lake and experience spiritual India',
        days: [
            {
                dayNumber: 1,
                title: 'Arrival & Pushkar Ghats',
                activities: [
                    'Arrive in Pushkar',
                    'Visit Pushkar Lake Ghats',
                    'Pushkar Temple exploration',
                    'Evening Aarti ceremony at the lake',
                    'Dinner at rooftop restaurant'
                ]
            },
            {
                dayNumber: 2,
                title: 'Spiritual Exploration',
                activities: [
                    'Early morning Brahma Temple visit',
                    'Camel ride in the Thar Desert',
                    'Village market exploration',
                    'Sunset at Pushkar Hills',
                    'Traditional Indian meal'
                ]
            },
            {
                dayNumber: 3,
                title: 'Local Culture & Departure',
                activities: [
                    'Shopping at local bazaars',
                    'Craft workshop visit',
                    'Final lake walk',
                    'Departure'
                ]
            }
        ]
    },

    // VARANASI 3-DAY ITINERARY
    {
        id: 209,
        destinationId: 10,
        name: 'Varanasi - The Sacred City',
        destination: 'Varanasi',
        duration: 3,
        budget: 10000,
        difficulty: 'Easy',
        description: 'Experience the spiritual heart of India at Varanasi',
        days: [
            {
                dayNumber: 1,
                title: 'Ghat Experience',
                activities: [
                    'Arrive in Varanasi',
                    'Early morning Ganga Aarti',
                    'Boat ride on Ganga River',
                    'Dashashwamedh Ghat exploration',
                    'Evening prayer ceremony'
                ]
            },
            {
                dayNumber: 2,
                title: 'Temples & Culture',
                activities: [
                    'Kashi Vishwanath Temple visit',
                    'Local street food tour',
                    'Annapurna Temple visit',
                    'Silk weaving workshop',
                    'Night Ganga show'
                ]
            },
            {
                dayNumber: 3,
                title: 'Spiritual Reflection & Departure',
                activities: [
                    'Sunrise meditation at Ghat',
                    'Shopping for silks and handicrafts',
                    'Sarnath day trip (optional)',
                    'Departure'
                ]
            }
        ]
    },

    // LAKSHADWEEP 4-DAY ITINERARY
    {
        id: 210,
        destinationId: 6,
        name: 'Lakshadweep Island Paradise',
        destination: 'Lakshadweep',
        duration: 4,
        budget: 40000,
        difficulty: 'Easy',
        description: 'Pristine islands with turquoise waters and coral reefs',
        days: [
            {
                dayNumber: 1,
                title: 'Island Arrival',
                activities: [
                    'Arrive at Lakshadweep',
                    'Island tour orientation',
                    'Beach relaxation',
                    'Sunset at the beach',
                    'Welcome dinner with seafood'
                ]
            },
            {
                dayNumber: 2,
                title: 'Water Sports & Snorkeling',
                activities: [
                    'Scuba diving or snorkeling',
                    'Coral reef exploration',
                    'Water sports activities',
                    'Beach volleyball',
                    'Bonfire and beach dinner'
                ]
            },
            {
                dayNumber: 3,
                title: 'Island Hopping',
                activities: [
                    'Island hopping adventure',
                    'Visit local villages',
                    'Traditional fishing experience',
                    'Island culture workshop',
                    'Night sea walk'
                ]
            },
            {
                dayNumber: 4,
                title: 'Relaxation & Departure',
                activities: [
                    'Last beach time',
                    'Spa treatment',
                    'Souvenir shopping',
                    'Departure'
                ]
            }
        ]
    }];

// Export for Node.js (server-side)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = itineraries;
}
