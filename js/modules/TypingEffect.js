export function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const texts = [
            'Desarrollador Full Stack',
            'Especialista en Python',
            'Data Science Enthusiast',
            'Machine Learning Developer'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentText.substring(0, charIndex);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex > currentText.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before typing new text
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start typing animation after a short delay
        setTimeout(type, 1000);
    }
}
