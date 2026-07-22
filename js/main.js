/* ============================================
   THREE.JS HERO BACKGROUND
   ============================================ */
const initThreeJS = () => {
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 15;
        posArray[i + 1] = (Math.random() - 0.5) * 15;
        posArray[i + 2] = (Math.random() - 0.5) * 15;
        
        // Gradient colors (purple to pink)
        colorArray[i] = 0.4 + Math.random() * 0.3;
        colorArray[i + 1] = 0.3 + Math.random() * 0.3;
        colorArray[i + 2] = 0.8 + Math.random() * 0.2;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create connecting lines
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x667eea,
        transparent: true,
        opacity: 0.1
    });
    
    // Create floating geometric shapes
    const shapes = [];
    const shapeGeometries = [
        new THREE.IcosahedronGeometry(0.3, 0),
        new THREE.OctahedronGeometry(0.25, 0),
        new THREE.TetrahedronGeometry(0.2, 0)
    ];
    
    for (let i = 0; i < 8; i++) {
        const geometry = shapeGeometries[i % 3];
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x667eea : 0x764ba2,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5
        );
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2
        };
        scene.add(mesh);
        shapes.push(mesh);
    }
    
    camera.position.z = 5;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        // Smooth camera follow
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Rotate particles
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;
        
        // Animate shapes
        shapes.forEach((shape, i) => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.position.y += Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.002;
        });
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const initCursor = () => {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
    });
    
    const animateCursor = () => {
        outlineX += (dotX - outlineX) * 0.15;
        outlineY += (dotY - outlineY) * 0.15;
        
        dot.style.left = `${dotX - 4}px`;
        dot.style.top = `${dotY - 4}px`;
        outline.style.left = `${outlineX - 20}px`;
        outline.style.top = `${outlineY - 20}px`;
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-planet, .soft-skill-card, .contact-card, .cert-card, .timeline-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.transform = 'scale(1.5)';
            outline.style.borderColor = '#f093fb';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.transform = 'scale(1)';
            outline.style.borderColor = '#667eea';
        });
    });
};

/* ============================================
   GSAP ANIMATIONS
   ============================================ */
const initGSAP = () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero entrance animations
    const heroTl = gsap.timeline({ delay: 0.5 });
    
    heroTl.to('.hero-greeting', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to('.name-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.4')
    .to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6')
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4')
    .to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4')
    .to('.scroll-indicator', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.2');
    
    // Section reveals
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelectorAll('.timeline-item, .exp-card, .project-card, .skills-category, .contact-card, .contact-cta, .about-container');
        
        if (header) {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });
        }
        
        content.forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });
    });
    
    // Timeline animation
    gsap.from('.timeline-line', {
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 70%',
            end: 'bottom 20%',
            scrub: 1
        },
        scaleY: 0,
        transformOrigin: 'top'
    });
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        const isDecimal = target % 1 !== 0;
        
        gsap.to(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            innerHTML: target,
            duration: 2,
            ease: 'power2.out',
            snap: isDecimal ? { innerHTML: 0.01 } : { innerHTML: 1 },
            onUpdate: function() {
                if (isDecimal) {
                    stat.innerHTML = parseFloat(stat.innerHTML).toFixed(2);
                } else {
                    stat.innerHTML = Math.round(parseFloat(stat.innerHTML));
                }
            }
        });
    });
    
    // Language progress bars
    const langProgress = document.querySelectorAll('.lang-progress');
    
    langProgress.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            width: width,
            duration: 1.5,
            ease: 'power3.out'
        });
    });
    
    // Navbar scroll effect
    ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
            const navbar = document.querySelector('.navbar');
            if (self.direction === 1 && self.progress > 0) {
                navbar.classList.add('scrolled');
            } else if (self.progress === 0) {
                navbar.classList.remove('scrolled');
            }
        }
    });
};

/* ============================================
   NAVIGATION ACTIVE STATE
   ============================================ */
const initNavigation = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
};

/* ============================================
   3D CARD TILT EFFECT
   ============================================ */
const initTiltEffect = () => {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
};

/* ============================================
   SKILLS ORBIT ANIMATION
   ============================================ */
const initSkillsOrbit = () => {
    const orbit = document.getElementById('tech-skills-orbit');
    const planets = orbit.querySelectorAll('.skill-planet');
    
    planets.forEach((planet, i) => {
        const angle = (i / planets.length) * Math.PI * 2;
        const radius = 150;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.3;
        
        gsap.set(planet, { x, y });
        
        // Floating animation
        gsap.to(planet, {
            y: y - 15,
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
};

/* ============================================
   MOBILE MENU
   ============================================ */
const initMobileMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
};

/* ============================================
   INITIALIZE EVERYTHING
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initCursor();
    initGSAP();
    initNavigation();
    initTiltEffect();
    initSkillsOrbit();
    initMobileMenu();
});
