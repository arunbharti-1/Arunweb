document.addEventListener('DOMContentLoaded', () => {
    let db;
    // 1. Open (or create) the database. Increment version to 2 to trigger onupgradeneeded.
    const request = indexedDB.open('portfolioDB', 2);


        // 2. Handle errors
        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
        };

        // 3. Create the object store if needed (runs on first-time setup or version change)
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create 'messages' object store for contact form if it doesn't exist
            if (!db.objectStoreNames.contains('messages')) {
                const messageStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
                messageStore.createIndex('name', 'name', { unique: false });
                messageStore.createIndex('email', 'email', { unique: false });
                messageStore.createIndex('subject', 'subject', { unique: false });
                messageStore.createIndex('timestamp', 'timestamp', { unique: false });
            }

            console.log('Database setup complete.');
        };

        // 4. On successful database connection
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database opened successfully.');
            
            // Initialize dark mode functionality on all pages
            handleDarkMode();

            // Since this is a single-page application, initialize all features on page load.
            handleHomePage();
            handleContactForm();
        };

        function handleDarkMode() {
            const toggleButton = document.getElementById('dark-mode-toggle');
            const currentTheme = localStorage.getItem('theme');

            if (currentTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
            }

            toggleButton.addEventListener('click', () => {
                let theme = 'light';
                if (document.body.getAttribute('data-theme') !== 'dark') {
                    document.body.setAttribute('data-theme', 'dark');
                    toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
                    theme = 'dark';
                } else {
                    document.body.removeAttribute('data-theme');
                    toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
                }
                localStorage.setItem('theme', theme);
            });
        }


        function handleHomePage() {
            // Add smooth scrolling for anchor links on the homepage
            const navToggle = document.getElementById('nav-toggle');

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }

                    // Close the mobile nav after clicking a link
                    if (navToggle.checked) {
                        navToggle.checked = false;
                    }
                });
            });

            // Highlight nav link on scroll
            const sections = document.querySelectorAll('.content-section');
            const navLinks = document.querySelectorAll('.main-nav a');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href').substring(1) === entry.target.id) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, {
                rootMargin: '-50% 0px -50% 0px'
            });

            sections.forEach(section => {
                observer.observe(section);
            });
        }


        // 5. Function to handle the form submission
        function handleContactForm() {
            const contactForm = document.querySelector('form[action="#"]');
            if (!contactForm) return;

            contactForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent the form from submitting the traditional way

                // === PASTE YOUR GOOGLE APPS SCRIPT URL HERE ===
                // Replace the placeholder below with the URL you copied from Google Apps Script.
                // The correct URL should start with "https://script.google.com/macros/s/..."
                const scriptURL = 'https://script.google.com/macros/s/AKfycbyeQnMiU4NgCmbXZRHNJVWSrqe7VKzbsqPAeMH3y5eSbLMhHuN-GeUItf5OFf_7M8B9YA/exec';
                const form = event.target;
                const submitButton = form.querySelector('button');
                const successMessage = document.querySelector('.form-success-message');

                submitButton.disabled = true;
                submitButton.textContent = 'SENDING...';

                fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                    .then(response => {
                        console.log('Success!', response);
                        if (successMessage) {
                            successMessage.style.display = 'block';
                            setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
                        }
                        form.reset();
                    })
                    .catch(error => {
                        console.error('Error!', error.message);
                        alert('An error occurred. Please try again.');
                    })
                    .finally(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                    });
            });
        }

});