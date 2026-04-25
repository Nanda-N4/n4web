// This script can be used to add interactive elements if needed
document.addEventListener('DOMContentLoaded', function() {
  // Add animation to pricing cards on scroll
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  const animateCards = () => {
    pricingCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 150);
    });
  };
  
  // Initialize cards with opacity 0 for animation
  pricingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Animate when cards come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCards();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelector('.pricing-section').style.opacity = '0';
  observer.observe(document.querySelector('.pricing-section'));
  document.querySelector('.pricing-section').style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.querySelector('.pricing-section').style.opacity = '1';
  }, 100);
  
  // Add hover effect to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.feature-icon');
      icon.style.transform = 'rotate(10deg) scale(1.1)';
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.feature-icon');
      icon.style.transform = 'rotate(0) scale(1)';
    });
  });
  
  // Add click effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
      button.style.transform = 'translateY(1px)';
    });
    
    button.addEventListener('mouseup', () => {
      button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });
  });
});