document.addEventListener('DOMContentLoaded', () => {

    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });
    // Fallback
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 4000);
    const line1 = document.getElementById("line1");
    const line2 = document.getElementById("line2");
    const line3 = document.getElementById("line3");
    const bubbleBtn = document.getElementById("bubble-button");
    const introScreen = document.getElementById("intro-screen");
    
    setTimeout(() => {
      line1.classList.add("show");
    }, 500);
    
    setTimeout(() => {
      line2.classList.remove("hidden");
      line2.classList.add("show");
    }, 3000);
    
    setTimeout(() => {
      line3.classList.remove("hidden");
      line3.classList.add("show");
    }, 6000);
    
    setTimeout(() => {
      bubbleBtn.classList.remove("hidden");
      bubbleBtn.classList.add("show");
    }, 9000);
    
    bubbleBtn.addEventListener("click", () => {
      introScreen.style.opacity = "0";
      introScreen.style.transition = "opacity 2s ease";
    
      setTimeout(() => {
        introScreen.style.display = "none";
      }, 2000);
    });

    // ---- Floating Bubbles Background ----
    const bubblesContainer = document.getElementById('bubbles-container');
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 40 + 10;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = Math.random() * 15 + 10 + 's';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        bubblesContainer.appendChild(bubble);
        // Remove after animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 30000);
    }
    setInterval(createBubble, 3000);

    // ---- Enter Button ----
    const enterBtn = document.getElementById('enterBtn');
    enterBtn.addEventListener('click', () => {
        document.getElementById('countdown-section').scrollIntoView({ behavior: 'smooth' });
        
    });

    // ---- Scroll Animations (Intersection Observer) ----
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe decade cards
    document.querySelectorAll('.decade-card').forEach((card, i) => {
        card.style.transitionDelay = (i * 0.2) + 's';
        observer.observe(card);
    });

    // Observe reason cards
    document.querySelectorAll('.reason-card').forEach((card, i) => {
        card.style.transitionDelay = (i * 0.08) + 's';
        observer.observe(card);
    });

    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        item.style.transitionDelay = (i * 0.1) + 's';
        observer.observe(item);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        item.style.transitionDelay = (i * 0.15) + 's';
        observer.observe(item);
    });

    // Observe notebook
    const notebook = document.querySelector('.notebook');
    if (notebook) {
        observer.observe(notebook);
    }

    // ---- Side Navigation Active State ----
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.dataset.section === id) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => navObserver.observe(section));

    // Smooth scroll for nav dots
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Blow Candles ----
    const blowBtn = document.getElementById('blowBtn');
    const wishText = document.getElementById('wishText');
    const candles = document.querySelectorAll('.candle');

    blowBtn.addEventListener('click', () => {
        candles.forEach((c, i) => {
            setTimeout(() => {
                c.classList.add('blown-out');
            }, i * 200);
        });
        blowBtn.classList.add('blown');
        setTimeout(() => {
            wishText.classList.add('show');
            launchMiniConfetti();
        }, candles.length * 200 + 300);
    });

    // ---- Gallery Photo Click (Play Music & Lightbox) ----
    const photoMusic = document.getElementById('photo-music');
    const nowPlaying = document.getElementById('nowPlaying');
    const npCaption = document.getElementById('npCaption');
    const npClose = document.getElementById('npClose');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    let currentlyPlaying = null;

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const song = item.dataset.song;
            const caption = item.dataset.caption;
            const img = item.querySelector('img');

            // Play music
            if (song && song !== '') {
                if (currentlyPlaying === song && !photoMusic.paused) {
                    // If same song, show lightbox
                } else {
                    photoMusic.src = song;
                    photoMusic.play().catch(e => console.log('Audio play prevented:', e));
                    currentlyPlaying = song;
                    npCaption.textContent = caption;
                    nowPlaying.classList.add('show');
                }
            }

            // Show lightbox
            if (img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption;
                lightbox.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    // Close now playing
    npClose.addEventListener('click', () => {
        photoMusic.pause();
        photoMusic.currentTime = 0;
        nowPlaying.classList.remove('show');
        currentlyPlaying = null;
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // ---- Stars Section ----
    const starsSky = document.getElementById('starsSky');
    // Generate stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
        star.style.animationDelay = Math.random() * 5 + 's';
        starsSky.appendChild(star);
    }
    // // Generate shooting stars
    // for (let i = 0; i < 3; i++) {
    //     const shoot = document.createElement('div');
    //     shoot.classList.add('shooting-star');
    //     shoot.style.left = Math.random() * 60 + '%';
    //     shoot.style.top = Math.random() * 40 + '%';
    //     shoot.style.animationDelay = (Math.random() * 8 + i * 5) + 's';
    //     shoot.style.animationDuration = (Math.random() * 3 + 3) + 's';
    //     starsSky.appendChild(shoot);
    // }

    // ---- Wishes Carousel ----
    const wishSlides = document.querySelectorAll('.wish-slide');
    const wishDotsContainer = document.getElementById('wishDots');
    const wishPrev = document.getElementById('wishPrev');
    const wishNext = document.getElementById('wishNext');
    let currentWish = 0;

    // Create dots
    wishSlides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('wish-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToWish(i));
        wishDotsContainer.appendChild(dot);
    });

    function goToWish(index) {
        wishSlides[currentWish].classList.remove('active');
        wishSlides[currentWish].classList.add('prev');
        setTimeout(() => {
            wishSlides[currentWish].classList.remove('prev');
        }, 600);

        currentWish = (index + wishSlides.length) % wishSlides.length;
        wishSlides[currentWish].classList.add('active');

        document.querySelectorAll('.wish-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentWish);
        });
    }

    wishNext.addEventListener('click', () => goToWish(currentWish + 1));
    wishPrev.addEventListener('click', () => goToWish(currentWish - 1));

    // // Auto advance wishes
    // setInterval(() => {
    //     goToWish(currentWish + 1);
    // }, 5000);

    // ---- Gift Box ----
    const giftBox = document.getElementById('giftBox');
    const giftInstruction = document.getElementById('giftInstruction');

    giftBox.addEventListener('click', () => {
        if (!giftBox.classList.contains('opened')) {
            giftBox.classList.add('opened');
            giftInstruction.style.display = 'none';
            launchMiniConfetti();
            // Create mini confetti in gift
            const confettiContainer = document.getElementById('giftConfetti');
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.style.cssText = `
                        position: absolute;
                        width: ${Math.random() * 8 + 4}px;
                        height: ${Math.random() * 8 + 4}px;
                        background: ${['#ff6b6b', '#ffd700', '#ff69b4', '#87ceeb', '#98fb98', '#dda0dd'][Math.floor(Math.random() * 6)]};
                        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                        top: ${Math.random() * 100}%;
                        left: ${Math.random() * 100}%;
                        animation: giftConfettiPiece ${Math.random() * 2 + 1}s ease-out forwards;
                    `;
                    confettiContainer.appendChild(confetti);
                }, i * 50);
            }
        }
    });

    // Add gift confetti animation
    const giftConfettiStyle = document.createElement('style');
    giftConfettiStyle.textContent = `
        @keyframes giftConfettiPiece {
            0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 60}px, -${Math.random() * 100 + 50}px) rotate(${Math.random() * 720}deg) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(giftConfettiStyle);

    // ---- Confetti System ----
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');
    let confettiPieces = [];
    let confettiActive = false;

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 4 - 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.color = [
                '#ff6b6b', '#ffd700', '#ff69b4', '#87ceeb',
                '#98fb98', '#dda0dd', '#f8bbd0', '#ce93d8',
                '#ffa07a', '#ff1493', '#00ced1', '#ff4500'
            ][Math.floor(Math.random() * 12)];
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
            this.opacity = 1;
            this.gravity = 0.05;
            this.wind = Math.random() * 0.5 - 0.25;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + this.wind;
            this.speedY += this.gravity;
            this.rotation += this.rotationSpeed;
            this.opacity -= 0.002;
            if (this.y > confettiCanvas.height + 20 || this.opacity <= 0) return false;
            return true;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function animateConfetti() {
        if (!confettiActive && confettiPieces.length === 0) return;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces = confettiPieces.filter(p => {
            p.draw();
            return p.update();
        });
        requestAnimationFrame(animateConfetti);
    }

    function launchConfetti(count = 150) {
        confettiActive = true;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                confettiPieces.push(new ConfettiPiece());
            }, i * 20);
        }
        animateConfetti();
        setTimeout(() => {
            confettiActive = false;
        }, count * 20 + 1000);
    }

    function launchMiniConfetti() {
        launchConfetti(80);
    }

    // Confetti button
    const confettiBtn = document.getElementById('confettiBtn');
    confettiBtn.addEventListener('click', () => {
        launchConfetti(200);
        // Floating hearts
        const finaleHearts = document.getElementById('finaleHearts');
        const heartEmojis = ['💖', '💕', '💗', '💝', '🫧', '✨', '🌸', '🦋', '💜', '🩷'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.classList.add('floating-finale-heart');
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
                heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
                heart.style.animationDelay = (Math.random() * 0.5) + 's';
                finaleHearts.appendChild(heart);
                setTimeout(() => {
                    if (heart.parentNode) heart.remove();
                }, 7000);
            }, i * 100);
        }
    });

    // ---- Music Toggle (Background Music) ----
    // const musicToggle = document.getElementById('musicToggle');
    // const bgMusic = document.getElementById('bg-music');
    // musicToggle.addEventListener('click', () => {
    //     if (bgMusic.paused) {
    //         bgMusic.play().catch(() => {});
    //         musicToggle.classList.add('playing');
    //     } else {
    //         bgMusic.pause();
    //         musicToggle.classList.remove('playing');
    //     }
    // });

    // ---- Age Counter Animation ----
    const ageCounter = document.getElementById('age-counter');
    let counted = false;
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            counted = true;
            let count = 0;
            const target = 20;
            const interval = setInterval(() => {
                count++;
                ageCounter.textContent = count;
                if (count >= target) {
                    clearInterval(interval);
                    // Pulse effect
                    ageCounter.style.animation = 'gradientShift 4s ease-in-out infinite, agePulse 0.5s ease';
                }
            }, 80);
        }
    }, { threshold: 0.5 });
    heroObserver.observe(document.getElementById('hero'));

    // Add age pulse animation
    const agePulseStyle = document.createElement('style');
    agePulseStyle.textContent = `
        @keyframes agePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(agePulseStyle);

    // ---- Touch/Tap Support for Mobile Gallery ----
    if ('ontouchstart' in window) {
        document.querySelectorAll('.photo-frame').forEach(frame => {
            frame.style.cssText += 'transform: rotate(0deg) !important;';
        });
    }

    // ---- Keyboard Navigation ----
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            const current = document.querySelector('.nav-dot.active');
            if (current && current.nextElementSibling) {
                current.nextElementSibling.click();
            }
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            const current = document.querySelector('.nav-dot.active');
            if (current && current.previousElementSibling) {
                current.previousElementSibling.click();
            }
        }
    });

    console.log('🫧 Happy 20th Birthday, Bubble! 💖');
    console.log('Made with all the love in the world ✨');

});
let dreamImages = [
    "./img1.png",
    "./img2.png",
    "./img3.png",
    "./img4.png",
    "./img5.png"
];

let dreamIndex = 0;

function startDream() {
    document.getElementById("dreamOverlay").style.display = "flex";
    dreamIndex = 0;
    showDreamImage();
}

function showDreamImage() {
    let img = document.getElementById("dreamImage");

    img.style.opacity = 0;

    setTimeout(() => {
        img.src = dreamImages[dreamIndex];
        img.style.opacity = 1;
        dreamIndex++;

        if (dreamIndex < dreamImages.length) {
            setTimeout(showDreamImage, 2500);
        } else {
            setTimeout(() => {
                document.getElementById("dreamOverlay").style.display = "none";
            }, 2500);
        }
    }, 800);
}