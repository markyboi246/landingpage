/**
 * UGC Rights - Form Handler
 * Handles FAQ accordion and contact form functionality
 */

(function() {
  'use strict';

  // ========== FAQ ACCORDION ==========

  /**
   * Initializes the FAQ accordion functionality
   */
  function initAccordion() {
    const questionItems = document.querySelectorAll('.question-item');

    if (questionItems.length === 0) {
      console.warn('No question items found');
      return;
    }

    questionItems.forEach(item => {
      const header = item.querySelector('.question-header');
      const toggleIcon = item.querySelector('.toggle-icon');

      if (!header) return;

      // Add click handler to the header
      header.addEventListener('click', () => {
        toggleAccordionItem(item);
      });

      // Ensure toggle icon doesn't double-trigger
      if (toggleIcon) {
        toggleIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleAccordionItem(item);
        });
      }
    });

    console.log(`Initialized ${questionItems.length} FAQ accordion items`);
  }

  /**
   * Toggles an accordion item open/closed
   */
  function toggleAccordionItem(item) {
    const isActive = item.classList.contains('active');

    // Optional: Close other items (remove if you want multiple items open)
    // closeAllAccordionItems();

    if (isActive) {
      // Close this item
      item.classList.remove('active');
    } else {
      // Open this item
      item.classList.add('active');

      // Smooth scroll to make sure the opened item is visible
      setTimeout(() => {
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const itemTop = item.offsetTop - headerHeight - 20;
        const currentScroll = window.scrollY;

        // Only scroll if the item is not fully visible
        if (currentScroll > itemTop) {
          window.scrollTo({
            top: itemTop,
            behavior: 'smooth'
          });
        }
      }, 300); // Wait for accordion animation
    }
  }

  /**
   * Closes all accordion items (optional - for single-open mode)
   */
  function closeAllAccordionItems() {
    const questionItems = document.querySelectorAll('.question-item');

    questionItems.forEach(item => {
      item.classList.remove('active');
    });
  }

  // ========== CONTACT FORM ==========

  /**
   * Initializes the contact form functionality
   */
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
      console.warn('Contact form not found');
      return;
    }

    contactForm.addEventListener('submit', handleFormSubmit);

    // Add real-time validation
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });

    console.log('Contact form initialized');
  }

  /**
   * Handles contact form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;

    // Validate all fields
    let isValid = true;
    const fields = ['name', 'email', 'message'];

    fields.forEach(fieldName => {
      const field = form[fieldName];
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showFormMessage('Please fix the errors above.', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Submit to Netlify Forms
    const formData = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(response => {
      if (response.ok) {
        showFormMessage(
          'Thank you for your message! We\'ll get back to you soon.',
          'success'
        );
        form.reset();

        // Clear success message after 5 seconds
        setTimeout(() => {
          hideFormMessage();
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Form error:', error);
      showFormMessage('Oops! Something went wrong. Please try again.', 'error');
    })
    .finally(() => {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    });
  }

  /**
   * Validates a form field
   */
  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    clearFieldError(field);

    // Required field validation
    if (!value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }

    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    // Name validation (minimum length)
    if (fieldName === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = 'Name must be at least 2 characters.';
    }

    // Message validation (minimum length)
    if (fieldName === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters.';
    }

    // Show error if invalid
    if (!isValid) {
      showFieldError(field, errorMessage);
    } else {
      field.classList.add('success');
      field.classList.remove('error');
    }

    return isValid;
  }

  /**
   * Shows an error for a specific field
   */
  function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');

    // Create or update error message
    let errorElement = field.parentElement.querySelector('.field-error');

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.classList.add('field-error');
      errorElement.style.color = 'var(--accent-red)';
      errorElement.style.fontSize = 'var(--text-sm)';
      errorElement.style.marginTop = 'var(--space-xs)';
      field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  /**
   * Clears error state from a field
   */
  function clearFieldError(field) {
    field.classList.remove('error');

    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Shows a form-level message
   */
  function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');

    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
  }

  /**
   * Hides the form message
   */
  function hideFormMessage() {
    const formMessage = document.getElementById('formMessage');

    if (!formMessage) return;

    formMessage.style.display = 'none';
    formMessage.textContent = '';
    formMessage.className = 'form-message';
  }

  // ========== ADDITIONAL FEATURES ==========

  /**
   * Auto-expands textarea as user types
   */
  function initAutoExpandTextarea() {
    const textareas = document.querySelectorAll('.form-textarea, .demo-textarea');

    textareas.forEach(textarea => {
      // Set initial height
      adjustTextareaHeight(textarea);

      // Adjust on input
      textarea.addEventListener('input', () => {
        adjustTextareaHeight(textarea);
      });
    });
  }

  /**
   * Adjusts textarea height based on content
   */
  function adjustTextareaHeight(textarea) {
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Set new height (with max limit)
    const maxHeight = 400; // Maximum height in pixels
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = newHeight + 'px';
  }

  /**
   * Adds character counter to textarea (optional)
   */
  function initCharacterCounter() {
    const messageField = document.getElementById('message');

    if (!messageField) return;

    const maxChars = 500; // Maximum character limit
    const counter = document.createElement('div');
    counter.classList.add('char-counter');
    counter.style.fontSize = 'var(--text-sm)';
    counter.style.color = 'var(--light-text)';
    counter.style.marginTop = 'var(--space-xs)';
    counter.style.textAlign = 'right';

    messageField.parentElement.appendChild(counter);

    function updateCounter() {
      const remaining = maxChars - messageField.value.length;
      counter.textContent = `${remaining} characters remaining`;

      if (remaining < 0) {
        counter.style.color = 'var(--accent-red)';
        messageField.value = messageField.value.substring(0, maxChars);
      } else if (remaining < 50) {
        counter.style.color = 'var(--accent-red)';
      } else {
        counter.style.color = 'var(--light-text)';
      }
    }

    messageField.addEventListener('input', updateCounter);
    updateCounter();
  }

  // ========== INITIALIZATION ==========

  /**
   * Initialize all form-related features
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('Initializing form handlers...');

    initAccordion();
    initContactForm();
    initAutoExpandTextarea();

    // Optional: Uncomment to enable character counter
    // initCharacterCounter();

    console.log('Form handlers initialization complete!');
  }

  // Start initialization
  init();

})();
