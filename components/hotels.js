// WanderWise Hotels Component
// Display and filter hotel listings

class HotelsComponent {
    constructor(options = {}) {
        this.hotels = options.hotels || [];
        this.destinationId = options.destinationId || null;
        this.onSelect = options.onSelect || (() => {});
        this.filters = {
            minPrice: options.minPrice || 0,
            maxPrice: options.maxPrice || 10000,
            category: options.category || 'all',
            minRating: options.minRating || 0
        };
    }

    // Filter hotels based on criteria
    getFilteredHotels() {
        return this.hotels.filter(hotel => {
            const matchesDestination = !this.destinationId || hotel.destinationId === this.destinationId;
            const matchesPrice = hotel.pricePerNight >= this.filters.minPrice && 
                                hotel.pricePerNight <= this.filters.maxPrice;
            const matchesCategory = this.filters.category === 'all' || 
                                   hotel.category === this.filters.category;
            const matchesRating = hotel.rating >= this.filters.minRating;

            return matchesDestination && matchesPrice && matchesCategory && matchesRating;
        });
    }

    // Create hotel card HTML
    createHotelCard(hotel) {
        return `
            <div class="hotel-card" data-hotel-id="${hotel.id}">
                <div class="hotel-image">
                    <img src="${hotel.imageUrl}" alt="${hotel.name}" />
                    <span class="hotel-category">${hotel.category}</span>
                </div>
                <div class="hotel-info">
                    <div class="hotel-header">
                        <h3>${hotel.name}</h3>
                        <div class="hotel-rating">
                            <span class="stars">${'★'.repeat(Math.floor(hotel.rating))}${'☆'.repeat(5 - Math.floor(hotel.rating))}</span>
                            <span class="rating-number">${hotel.rating}</span>
                        </div>
                    </div>
                    <p class="hotel-description">${hotel.description}</p>
                    <div class="hotel-amenities">
                        <strong>Amenities:</strong>
                        <ul>
                            ${hotel.amenities.slice(0, 3).map(a => `<li>✓ ${a}</li>`).join('')}
                            ${hotel.amenities.length > 3 ? `<li>+ ${hotel.amenities.length - 3} more</li>` : ''}
                        </ul>
                    </div>
                    <div class="hotel-footer">
                        <div class="hotel-price">
                            <span class="price-label">per night</span>
                            <span class="price-amount">₹${hotel.pricePerNight}</span>
                        </div>
                        <button class="btn-select" data-hotel-id="${hotel.id}">Select Hotel</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create filter controls HTML
    createFilters() {
        return `
            <div class="hotel-filters">
                <div class="filter-group">
                    <label for="price-range">Price Range (per night)</label>
                    <input 
                        type="range" 
                        id="price-range" 
                        min="0" 
                        max="10000" 
                        value="${this.filters.maxPrice}"
                        step="500"
                        class="price-slider"
                    />
                    <div class="price-display">
                        ₹0 - ₹<span id="price-value">${this.filters.maxPrice}</span>
                    </div>
                </div>

                <div class="filter-group">
                    <label for="category-filter">Hotel Category</label>
                    <select id="category-filter" class="category-select">
                        <option value="all">All Categories</option>
                        <option value="Budget">Budget</option>
                        <option value="Mid-Range">Mid-Range</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="rating-filter">Minimum Rating</label>
                    <select id="rating-filter" class="rating-select">
                        <option value="0">All Ratings</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                    </select>
                </div>

                <button id="reset-filters" class="btn-secondary">Reset Filters</button>
            </div>
        `;
    }

    // Render hotels grid
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;

        const filteredHotels = this.getFilteredHotels();
        
        if (filteredHotels.length === 0) {
            container.innerHTML = '<p class="no-results">No hotels found matching your criteria.</p>';
            return true;
        }

        const hotelsHTML = filteredHotels
            .map(hotel => this.createHotelCard(hotel))
            .join('');

        container.innerHTML = hotelsHTML;

        // Attach event listeners to select buttons
        container.querySelectorAll('.btn-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hotelId = parseInt(e.target.dataset.hotelId);
                const selected = this.hotels.find(h => h.id === hotelId);
                if (selected) {
                    this.onSelect(selected);
                }
            });
        });

        return true;
    }

    // Initialize filters
    initFilters(filterId) {
        const filterContainer = document.getElementById(filterId);
        if (!filterContainer) return false;

        filterContainer.innerHTML = this.createFilters();

        // Price range slider
        const priceSlider = filterContainer.querySelector('.price-slider');
        const priceValue = filterContainer.querySelector('#price-value');
        if (priceSlider) {
            priceSlider.addEventListener('change', (e) => {
                this.filters.maxPrice = parseInt(e.target.value);
                priceValue.textContent = this.filters.maxPrice;
            });
        }

        // Category filter
        const categorySelect = filterContainer.querySelector('#category-filter');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
            });
        }

        // Rating filter
        const ratingSelect = filterContainer.querySelector('#rating-filter');
        if (ratingSelect) {
            ratingSelect.addEventListener('change', (e) => {
                this.filters.minRating = parseFloat(e.target.value);
            });
        }

        // Reset filters
        const resetBtn = filterContainer.querySelector('#reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.filters = {
                    minPrice: 0,
                    maxPrice: 10000,
                    category: 'all',
                    minRating: 0
                };
                priceSlider.value = 10000;
                priceValue.textContent = 10000;
                categorySelect.value = 'all';
                ratingSelect.value = '0';
            });
        }

        return true;
    }

    // Set hotels data
    setHotels(hotels) {
        this.hotels = hotels;
    }

    // Update filter
    updateFilter(key, value) {
        if (this.filters.hasOwnProperty(key)) {
            this.filters[key] = value;
        }
    }
}

// Export for browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HotelsComponent;
}
