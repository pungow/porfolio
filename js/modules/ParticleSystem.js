export class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 200 };
        this.waves = []; // Store active waves
        this.init();
    }

    init() {
        // Create canvas
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Remove old background if exists
        const oldBg = heroSection.querySelector('.hero-background');
        if (oldBg) oldBg.remove();

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;';
        heroSection.insertBefore(this.canvas, heroSection.firstChild);

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.createParticles();
        this.animate();

        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 6000);
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2.5 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.3;
            const speedY = (Math.random() - 0.5) * 0.3;
            
            this.particles.push({
                x,
                y,
                size,
                speedX,
                speedY,
                baseX: x,
                baseY: y,
                vx: 0,
                vy: 0,
                brightness: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        
        // Create wave ripple when mouse moves
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = newX - this.mouse.x;
            const dy = newY - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) { // Only create wave if mouse moved significantly
                this.waves.push({
                    x: newX,
                    y: newY,
                    radius: 0,
                    maxRadius: 250,
                    speed: 3,
                    strength: 1
                });
            }
        }
        
        this.mouse.x = newX;
        this.mouse.y = newY;
    }

    updateWaves() {
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];
            wave.radius += wave.speed;
            wave.strength = 1 - (wave.radius / wave.maxRadius);
            
            if (wave.radius >= wave.maxRadius) {
                this.waves.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Apply wave effects
            let totalForceX = 0;
            let totalForceY = 0;
            
            this.waves.forEach(wave => {
                const dx = particle.x - wave.x;
                const dy = particle.y - wave.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const waveFront = wave.radius;
                const waveThickness = 30;
                
                // Check if particle is near the wave front
                if (Math.abs(distance - waveFront) < waveThickness) {
                    const angle = Math.atan2(dy, dx);
                    const force = wave.strength * 8 * (1 - Math.abs(distance - waveFront) / waveThickness);
                    totalForceX += Math.cos(angle) * force;
                    totalForceY += Math.sin(angle) * force;
                }
            });
            
            // Apply forces
            particle.vx += totalForceX;
            particle.vy += totalForceY;
            
            // Apply damping
            particle.vx *= 0.85;
            particle.vy *= 0.85;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Return to base position
            const returnForce = 0.03;
            particle.vx += (particle.baseX - particle.x) * returnForce;
            particle.vy += (particle.baseY - particle.y) * returnForce;
            
            // Gentle drift
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Update twinkling
            particle.twinklePhase += particle.twinkleSpeed;
            particle.brightness = 0.3 + Math.sin(particle.twinklePhase) * 0.4 + 0.3;
            
            // Draw particle with twinkling effect
            const alpha = particle.brightness;
            this.ctx.fillStyle = `rgba(78, 205, 196, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const opacity = 1 - (distance / 100);
                    this.ctx.strokeStyle = `rgba(78, 205, 196, ${opacity * 0.15})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateWaves();
        this.connectParticles();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }
}
