/**
 * Adventist Fam - JavaScript Principal
 * Funcionalidades interativas do site
 */

// ========================================
// NAVEGAÇÃO
// ========================================

// Toggle do menu mobile
function initMobileMenu() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navbarLinks = navbarMenu.querySelectorAll('.navbar-link');
        navbarLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });
    }
}

// Efeito de scroll na navbar
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ========================================
// BOTÃO FLUTUANTE DE ORAÇÃO
// ========================================

function initPrayerButton() {
    const prayerBtn = document.getElementById('prayer-btn');
    const prayerModal = document.getElementById('prayer-modal');
    const prayerClose = document.getElementById('prayer-close');
    const prayerAmen = document.getElementById('prayer-amen');
    const prayerCounter = document.getElementById('prayer-counter');

    if (!prayerBtn || !prayerModal) return;

    // Carregar contador do localStorage
    let prayerCount = parseInt(localStorage.getItem('adventist-fam-prayers')) || 0;
    updatePrayerCounter();

    // Abrir modal
    prayerBtn.addEventListener('click', () => {
        prayerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Fechar modal
    function closeModal() {
        prayerModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (prayerClose) prayerClose.addEventListener('click', closeModal);
    
    // Botão Amém - incrementar contador
    if (prayerAmen) {
        prayerAmen.addEventListener('click', () => {
            prayerCount++;
            localStorage.setItem('adventist-fam-prayers', prayerCount);
            updatePrayerCounter();
            closeModal();
            
            // Mostrar notificação
            showNotification(translationManager ? translationManager.get('oracao_modal_text') : 'Obrigado pela sua oração!');
        });
    }

    // Fechar ao clicar fora
    prayerModal.addEventListener('click', (e) => {
        if (e.target === prayerModal) {
            closeModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && prayerModal.classList.contains('active')) {
            closeModal();
        }
    });

    function updatePrayerCounter() {
        if (prayerCounter) {
            const label = translationManager ? translationManager.get('oracao_contador') : 'orações realizadas';
            prayerCounter.textContent = `${prayerCount} ${label}`;
        }
    }
}

// ========================================
// NOTIFICAÇÕES
// ========================================

function showNotification(message, type = 'success') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : '!'}</span>
        <span class="notification-message">${message}</span>
    `;

    // Estilos inline para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #2E7D32, #1565C0);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// ANIMAÇÕES AO SCROLL
// ========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.getAttribute('data-animate');
                entry.target.classList.add(`animate-${animation}`);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// CONTADORES ANIMADOS
// ========================================

function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ========================================
// COPIAR PARA ÁREA DE TRANSFERÊNCIA
// ========================================

function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(message || 'Copiado com sucesso!');
    }).catch(() => {
        // Fallback para navegadores mais antigos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification(message || 'Copiado com sucesso!');
    });
}

// ========================================
// COMPARTILHAMENTO
// ========================================

function sharePage(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title || document.title,
            text: text || '',
            url: url || window.location.href
        }).catch(() => {
            // Usuário cancelou
        });
    } else {
        // Fallback: copiar link
        copyToClipboard(url || window.location.href, 'Link copiado para compartilhar!');
    }
}

// ========================================
// MODAL DE DOAÇÃO INTERNACIONAL
// ========================================

function initInternationalDonationModal() {
    const btn = document.getElementById('btn-international');
    const modal = document.getElementById('modal-international');
    const close = document.getElementById('close-international');

    if (!btn || !modal) return;

    btn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (close) close.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// ========================================
// GALERIA LIGHTBOX
// ========================================

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay">
            <button class="lightbox-close">&times;</button>
            <img src="${src}" alt="${alt}" class="lightbox-image">
        </div>
    `;

    lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const overlay = lightbox.querySelector('.lightbox-overlay');
    overlay.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
    `;

    const image = lightbox.querySelector('.lightbox-image');
    image.style.cssText = `
        max-width: 100%;
        max-height: 85vh;
        border-radius: 10px;
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    closeBtn.addEventListener('click', () => {
        lightbox.remove();
        document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.remove();
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// FORMULÁRIO DE CONTATO
// ========================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Aqui você pode adicionar a lógica para enviar o formulário
        // Por enquanto, apenas mostra uma notificação
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
    });
}

// ========================================
// SMOOTH SCROLL PARA ÂNCORAS
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80; // Altura da navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// LAZY LOADING DE IMAGENS
// ========================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initNavbarScroll();
    initPrayerButton();
    initScrollAnimations();
    initCounters();
    initInternationalDonationModal();
    initGallery();
    initContactForm();
    initSmoothScroll();
    initLazyLoading();
});

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
