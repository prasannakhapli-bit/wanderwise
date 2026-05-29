// WanderWise Modal Component
// Reusable modal UI component for popups, details, and forms

class Modal {
    constructor(options = {}) {
        this.id = options.id || 'modal-' + Math.random().toString(36).substr(2, 9);
        this.title = options.title || 'Modal';
        this.content = options.content || '';
        this.onClose = options.onClose || (() => {});
        this.modalElement = null;
    }

    // Create modal DOM structure
    create() {
        const modal = document.createElement('div');
        modal.id = this.id;
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.title}</h2>
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.content}
                </div>
            </div>
        `;

        // Attach event listeners
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalElement) {
                this.close();
            }
        });

        this.modalElement = modal;
        return modal;
    }

    // Show modal
    show() {
        if (!this.modalElement) {
            this.create();
        }
        document.body.appendChild(this.modalElement);
        this.modalElement.classList.add('active');
    }

    // Hide modal
    close() {
        if (this.modalElement) {
            this.modalElement.classList.remove('active');
            setTimeout(() => {
                if (this.modalElement && this.modalElement.parentNode) {
                    this.modalElement.parentNode.removeChild(this.modalElement);
                }
            }, 300);
            this.onClose();
        }
    }

    // Update content dynamically
    setContent(content) {
        this.content = content;
        if (this.modalElement) {
            const body = this.modalElement.querySelector('.modal-body');
            if (body) {
                body.innerHTML = content;
            }
        }
    }

    // Update title
    setTitle(title) {
        this.title = title;
        if (this.modalElement) {
            const header = this.modalElement.querySelector('.modal-header h2');
            if (header) {
                header.textContent = title;
            }
        }
    }
}

// Export for browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}
