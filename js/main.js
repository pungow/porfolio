import { initNavigation } from './modules/Navigation.js';
import { initTypingEffect } from './modules/TypingEffect.js';
import { initAnimations } from './modules/Animations.js';
import { initContactForm } from './modules/ContactForm.js';
import { ParticleSystem } from './modules/ParticleSystem.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypingEffect();
    initAnimations();
    initContactForm();
    new ParticleSystem();
    
    console.log('Portfolio loaded successfully! 🚀 (Modular Version)');
});
