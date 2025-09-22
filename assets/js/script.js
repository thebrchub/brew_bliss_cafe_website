'use strict';

// Utility function to add event listeners to elements
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 10000;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#F59E0B'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
    font-weight: 500;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.contains(notification)) {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');
  
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Navigation Toggle with error checking
  const toggleNavbar = function () {
    console.log('Hamburger clicked!');
    
    if (hamburger && navMenu) {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      console.log('Menu toggled:', navMenu.classList.contains('active'));
    } else {
      console.error('Hamburger or navMenu not found');
    }
  }

  // Add event listener with error checking
  if (hamburger) {
    hamburger.addEventListener('click', toggleNavbar);
    console.log('Hamburger menu initialized successfully');
  } else {
    console.error('Hamburger element not found');
  }

  // Close navigation when clicking on nav links
  const navLinks = document.querySelectorAll('.nav-link');
  const closeNavbar = function () {
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }

  if (navLinks.length > 0) {
    addEventOnElem(navLinks, 'click', closeNavbar);
  }

  // Header scroll effect
  const headerActive = function () {
    if (navbar && window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else if (navbar) {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', headerActive);

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 100; // Account for fixed header
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          // Close mobile menu if open
          closeNavbar();
        }
      }
    });
  });

  // Menu Category Filtering
  const categoryBtns = document.querySelectorAll('.category-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  const filterMenu = function(category) {
    // Remove active class from all buttons
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Show/hide menu items based on category
    menuItems.forEach(item => {
      if (category === 'all' || item.classList.contains(category)) {
        item.classList.add('active');
        item.style.display = 'block';
      } else {
        item.classList.remove('active');
        item.style.display = 'none';
      }
    });
  }

  // Add event listeners to category buttons
  if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.getAttribute('data-category');
        filterMenu(category);
      });
    });
  }

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Add fade-in class to specific elements that should animate
  const animatedElements = document.querySelectorAll('.hero-content, .section-header, .about-content, .reservation-content, .contact-content');
  animatedElements.forEach(el => {
    if (el) {
      el.classList.add('fade-in');
      observer.observe(el);
    }
  });

  // Form Handling
  const reservationForm = document.getElementById('reservationForm');
  const contactForm = document.getElementById('contactForm');

  // Reservation Form Submission
  if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      // Simulate form submission
      const submitBtn = this.querySelector('.reservation-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span>Booking...</span>';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ Reservation Confirmed!</span>';
        showNotification('Table reserved successfully! We\'ll contact you soon.', 'success');
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          this.reset();
        }, 3000);
      }, 1500);
    });
  }

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      if (!data.name || !data.email || !data.subject || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Simulate form submission
      const submitBtn = this.querySelector('.contact-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          this.reset();
        }, 3000);
      }, 1500);
    });
  }

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const submitBtn = this.querySelector('button');
      const originalText = submitBtn.textContent;
      
      if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'Subscribed!';
        showNotification('Welcome to our coffee family! Check your email for a special offer.', 'success');
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          this.reset();
        }, 3000);
      }, 1000);
    });
  }

  // Quick Order functionality for menu items
  const quickOrderBtns = document.querySelectorAll('.quick-order');
  quickOrderBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const menuItem = this.closest('.menu-item');
      const itemName = menuItem.querySelector('.menu-name').textContent;
      
      showNotification(`${itemName} added to your order! Call us at (555) 123-BREW to complete your order.`, 'success');
      
      // Add animation effect
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Gallery Image Click Handler
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      // Add click animation
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
      
      // Could add lightbox functionality here
      console.log('Gallery item clicked - lightbox could be implemented here');
    });
  });

  // Form Input Enhancements
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
    
    // Check if input has value on page load
    if (input.value) {
      input.parentElement.classList.add('focused');
    }
  });

  // Prevent form submission on Enter for better UX
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
      const form = e.target.closest('form');
      if (form) {
        e.preventDefault();
        // Focus next input or submit if it's the last input
        const inputs = form.querySelectorAll('input, select, textarea');
        const currentIndex = Array.from(inputs).indexOf(e.target);
        if (currentIndex < inputs.length - 1) {
          inputs[currentIndex + 1].focus();
        } else {
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.click();
        }
      }
    }
  });

  // Set min date for date inputs (today)
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    input.min = today;
  });

  // Add loading state to all buttons with hover effects
  const interactiveButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .category-btn');
  interactiveButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      if (!this.disabled) {
        this.style.transform = 'translateY(-2px)';
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      if (!this.disabled) {
        this.style.transform = '';
      }
    });
    
    btn.addEventListener('mousedown', function() {
      if (!this.disabled) {
        this.style.transform = 'translateY(0)';
      }
    });
    
    btn.addEventListener('mouseup', function() {
      if (!this.disabled) {
        this.style.transform = 'translateY(-2px)';
      }
    });
  });

  // Console welcome message
  console.log(`
☕ Welcome to Brew & Bliss Development Console! ☕

Thanks for checking out our code. 
If you're interested in working with us or have any questions,
feel free to reach out at hello@brewandbliss.com

Happy coding! ☕✨
`);

  console.log('Brew & Bliss website initialized successfully!');
});