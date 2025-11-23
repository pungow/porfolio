import { initNavigation } from './modules/Navigation.js';
import { initTypingEffect } from './modules/TypingEffect.js';
import { initAnimations } from './modules/Animations.js';
import { initContactForm } from './modules/ContactForm.js';
import { ParticleSystem } from './modules/ParticleSystem.js';
import { inject } from 'https://esm.sh/@vercel/analytics';
inject();

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypingEffect();
    initAnimations();
    initContactForm();
    new ParticleSystem();

});
