// WanderWise Booking Component
// Handles booking form creation and submission

class BookingComponent {
    constructor(options = {}) {
        this.destination = options.destination || {};
        this.hotel = options.hotel || {};
        this.onSubmit = options.onSubmit || (() => {});
    }

    // Create booking form HTML
    createForm() {
        return `
            <form id="booking-form" class="booking-form">
                <div class="form-group">
                    <label for="guest-name">Full Name *</label>
                    <input 
                        type="text" 
                        id="guest-name" 
                        name="guestName" 
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="guest-email">Email *</label>
                    <input 
                        type="email" 
                        id="guest-email" 
                        name="email" 
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="guest-phone">Phone Number *</label>
                    <input 
                        type="tel" 
                        id="guest-phone" 
                        name="phone" 
                        placeholder="+91-XXXXX-XXXXX"
                        required
                    />
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="check-in">Check-In Date *</label>
                        <input 
                            type="date" 
                            id="check-in" 
                            name="checkInDate"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="check-out">Check-Out Date *</label>
                        <input 
                            type="date" 
                            id="check-out" 
                            name="checkOutDate"
                            required
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label for="guests">Number of Guests *</label>
                    <select id="guests" name="guestCount" required>
                        <option value="">Select</option>
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5+">5+ Guests</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="room-type">Room Type *</label>
                    <select id="room-type" name="roomType" required>
                        <option value="">Select</option>
                        <option value="single">Single Room</option>
                        <option value="double">Double Room</option>
                        <option value="suite">Suite</option>
                        <option value="deluxe">Deluxe</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="special-requests">Special Requests</label>
                    <textarea 
                        id="special-requests" 
                        name="specialRequests" 
                        placeholder="Any special requests? (Optional)"
                        rows="3"
                    ></textarea>
                </div>

                <div class="booking-summary">
                    <p><strong>Destination:</strong> ${this.destination.name || 'N/A'}</p>
                    <p><strong>Hotel:</strong> ${this.hotel.name || 'N/A'}</p>
                    <p><strong>Price per Night:</strong> ₹${this.hotel.pricePerNight || 0}</p>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-primary">Complete Booking</button>
                    <button type="reset" class="btn-secondary">Clear Form</button>
                </div>
            </form>
        `;
    }

    // Validate form inputs
    validateForm(formData) {
        const errors = [];
        
        if (!formData.guestName || formData.guestName.trim().length < 3) {
            errors.push('Please enter a valid name (minimum 3 characters)');
        }
        
        if (!formData.email || !formData.email.includes('@')) {
            errors.push('Please enter a valid email address');
        }
        
        if (!formData.phone || formData.phone.length < 10) {
            errors.push('Please enter a valid phone number');
        }
        
        if (!formData.checkInDate || !formData.checkOutDate) {
            errors.push('Check-in and check-out dates are required');
        }
        
        if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
            errors.push('Check-out date must be after check-in date');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Handle form submission
    handleSubmit(formElement) {
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(formElement);
            const data = {
                guestName: formData.get('guestName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                checkInDate: formData.get('checkInDate'),
                checkOutDate: formData.get('checkOutDate'),
                guestCount: formData.get('guestCount'),
                roomType: formData.get('roomType'),
                specialRequests: formData.get('specialRequests'),
                destination: this.destination.name,
                hotel: this.hotel.name,
                pricePerNight: this.hotel.pricePerNight
            };

            const validation = this.validateForm(data);
            
            if (!validation.isValid) {
                alert('Booking Error:\n' + validation.errors.join('\n'));
                return;
            }

            this.onSubmit(data);
        });
    }

    // Initialize booking component
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;

        container.innerHTML = this.createForm();
        const form = container.querySelector('#booking-form');
        this.handleSubmit(form);
        
        return true;
    }
}

// Export for browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingComponent;
}
