export function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = `mailto:pungowilmer@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`;
            
            // Open default email client
            window.location.href = mailtoLink;
            
            // Show success message
            alert('¡Gracias por tu mensaje! Se abrirá tu cliente de correo para enviar el mensaje.');
            
            // Reset form
            contactForm.reset();
        });
    }
}
