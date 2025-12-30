/**
 * UGC Rights - Auto Demo Animation
 * Handles the typing animation for the "How It Works" section
 */

(function() {
  'use strict';

  const autoDemoText = "Just launched my new product! Check it out and let me know what you think...";
  let autoDemoInterval = null;
  let isAutoDemoVisible = false;

  /**
   * Initialize the auto-demo typing animation
   */
  function initAutoDemo() {
    const typingElement = document.getElementById('demo-typing');
    const feedbackItems = document.querySelectorAll('.feedback-item');
    const autoDemo = document.querySelector('.auto-demo-preview');

    if (!typingElement || !autoDemo) return;

    // Set up intersection observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isAutoDemoVisible) {
          isAutoDemoVisible = true;
          startAutoDemoAnimation(typingElement, feedbackItems);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(autoDemo);
  }

  /**
   * Starts the auto-demo typing animation
   */
  function startAutoDemoAnimation(typingElement, feedbackItems) {
    let charIndex = 0;
    typingElement.textContent = '';

    // Reset suggestion
    const suggestion = document.getElementById('feedback-suggestion');
    if (suggestion) suggestion.classList.remove('show');

    // Reset feedback items
    feedbackItems.forEach(item => {
      item.classList.remove('show');
      const fill = item.querySelector('.mini-score-fill');
      if (fill) fill.style.width = '0';
    });

    // Type out the text
    autoDemoInterval = setInterval(() => {
      if (charIndex < autoDemoText.length) {
        typingElement.textContent += autoDemoText[charIndex];
        charIndex++;
      } else {
        clearInterval(autoDemoInterval);
        // Show suggestion first, then scores
        setTimeout(() => {
          if (suggestion) suggestion.classList.add('show');
          setTimeout(() => showAutoDemoFeedback(feedbackItems), 400);
        }, 500);
      }
    }, 50);
  }

  /**
   * Shows the feedback items with staggered animation
   */
  function showAutoDemoFeedback(feedbackItems) {
    feedbackItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('show');
        const fill = item.querySelector('.mini-score-fill');
        const target = fill?.getAttribute('data-target');
        if (fill && target) {
          setTimeout(() => {
            fill.style.width = target + '%';
          }, 200);
        }
      }, index * 300);
    });

    // Loop the animation after a delay
    setTimeout(() => {
      isAutoDemoVisible = false;
      const autoDemo = document.querySelector('.auto-demo-preview');
      if (autoDemo) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !isAutoDemoVisible) {
              isAutoDemoVisible = true;
              const typingElement = document.getElementById('demo-typing');
              const items = document.querySelectorAll('.feedback-item');
              startAutoDemoAnimation(typingElement, items);
            }
          });
        }, { threshold: 0.5 });
        observer.observe(autoDemo);
      }
    }, 8000);
  }

  /**
   * Initialize when DOM is ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    initAutoDemo();
  }

  init();

})();
