// WanderWise Hotels Data
// Mock hotel data for different destinations

const hotels = [
    // GULMARG HOTELS
    {
        id: 101,
        destinationId: 1,
        name: 'Gulmarg Meadows Resort',
        destination: 'Gulmarg',
        category: 'Luxury',
        rating: 4.8,
        pricePerNight: 8500,
        description: 'Luxury ski resort with stunning valley views',
        amenities: ['WiFi', 'Spa', 'Restaurant', 'Ski Equipment Rental', 'Heated Rooms'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
    },
    {
        id: 102,
        destinationId: 1,
        name: 'Alpine Guest House',
        destination: 'Gulmarg',
        category: 'Budget',
        rating: 4.2,
        pricePerNight: 2500,
        description: 'Cozy guesthouse with warm hospitality',
        amenities: ['WiFi', 'Hot Water', 'Home Cooked Meals', 'Garden View'],
        imageUrl: 'https://images.unsplash.com/photo-1537314-b8f03e8d5b27?w=500&h=300&fit=crop'
    },

    // MANALI HOTELS
    {
        id: 103,
        destinationId: 2,
        name: 'Mountain Paradise Hotel',
        destination: 'Manali',
        category: 'Mid-Range',
        rating: 4.5,
        pricePerNight: 4500,
        description: 'Modern hotel with adventure activity packages',
        amenities: ['WiFi', 'Restaurant', 'Adventure Desk', 'Room Service', 'Parking'],
        imageUrl: 'https://images.unsplash.com/photo-1551190822-5ff12d278dcc?w=500&h=300&fit=crop'
    },
    {
        id: 104,
        destinationId: 2,
        name: 'Budget Backpackers Manali',
        destination: 'Manali',
        category: 'Budget',
        rating: 4.1,
        pricePerNight: 1800,
        description: 'Traveler-friendly hostel with communal spaces',
        amenities: ['WiFi', 'Shared Kitchen', 'Lounge', 'Laundry Service'],
        imageUrl: 'https://images.unsplash.com/photo-1565531585007-f4a0f8d8bd8a?w=500&h=300&fit=crop'
    },

    // GOA HOTELS
    {
        id: 105,
        destinationId: 5,
        name: 'Beachfront Paradise Resort',
        destination: 'Goa',
        category: 'Luxury',
        rating: 4.9,
        pricePerNight: 7200,
        description: 'Right on the beach with water sports included',
        amenities: ['Private Beach', 'Water Sports', 'Spa', 'Bar', 'Restaurant'],
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop'
    },
    {
        id: 106,
        destinationId: 5,
        name: 'Goa Budget Inn',
        destination: 'Goa',
        category: 'Budget',
        rating: 3.9,
        pricePerNight: 2000,
        description: 'Economy accommodation close to beaches',
        amenities: ['WiFi', 'AC Rooms', 'Quick Checkout', 'Beach Access'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
    },

    // AGRA HOTELS
    {
        id: 107,
        destinationId: 11,
        name: 'Taj View Hotel',
        destination: 'Agra',
        category: 'Mid-Range',
        rating: 4.6,
        pricePerNight: 3500,
        description: 'Hotel with Taj Mahal views from rooftop',
        amenities: ['Rooftop Restaurant', 'WiFi', 'Guided Tours', 'Room Service'],
        imageUrl: 'https://images.unsplash.com/photo-1596178065887-8f180103047c?w=500&h=300&fit=crop'
    },
    {
        id: 108,
        destinationId: 11,
        name: 'Shatabdi Inn',
        destination: 'Agra',
        category: 'Budget',
        rating: 4.0,
        pricePerNight: 1500,
        description: 'No-frills but clean and convenient',
        amenities: ['WiFi', 'AC', 'Restaurant', 'Near Station'],
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop'
    }
];

// Export for Node.js (server-side)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = hotels;
}
