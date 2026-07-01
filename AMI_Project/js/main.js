/**
 * ============================================================
 * main.js — Agence Maïto Immobilière (A.M.I - NIGER)
 * Script principal : navigation, menu mobile, page active, contact
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// 1. DÉTECTION DE LA PAGE ACTIVE
// ─────────────────────────────────────────────────────────────
function setActivePage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('[data-nav-link]');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('nav-active');

    if ((page === '' || page === 'index.html') && (href === 'index.html' || href === './')) {
      link.classList.add('nav-active');
    }
    else if (href === page) {
      link.classList.add('nav-active');
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 2. MENU BURGER MOBILE
// ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const burgerBtn  = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const burgerIcon = document.getElementById('burger-icon');
  const closeIcon  = document.getElementById('close-icon');

  if (!burgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('hidden', 'opacity-0', '-translate-y-4');
    mobileMenu.classList.add('opacity-100', 'translate-y-0');
    burgerIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('opacity-0', '-translate-y-4');
    mobileMenu.classList.remove('opacity-100', 'translate-y-0');
    burgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    setTimeout(() => {
      if (mobileMenu.classList.contains('opacity-0')) {
        mobileMenu.classList.add('hidden');
      }
    }, 300);
  }

  burgerBtn.addEventListener('click', () => {
    const isOpen = burgerBtn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
}

// ─────────────────────────────────────────────────────────────
// 3. HEADER STICKY — OMBRAGE AU DÉFILEMENT
// ─────────────────────────────────────────────────────────────
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─────────────────────────────────────────────────────────────
// 4. ANIMATIONS D'APPARITION AU SCROLL
// ─────────────────────────────────────────────────────────────
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────
// 5. COMPTEUR ANIMÉ (stats section)
// ─────────────────────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const step   = Math.ceil(target / (duration / 16));
      let current  = 0;

      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString('fr-FR') + suffix;
        if (current < target) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────
// 6. ENVOI DU FORMULAIRE DE CONTACT VERS WHATSAPP
// ─────────────────────────────────────────────────────────────
/**
 * Capture les données du formulaire de contact et redirige 
 * vers l'API WhatsApp avec un message bien structuré.
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Bloque l'actualisation de la page
    
    // Récupération des champs du DOM
    const nom = document.getElementById('nom').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const email = document.getElementById('email').value.trim() || "Non renseigné";
    const selectObjet = document.getElementById('objet');
    const objetText = selectObjet.options[selectObjet.selectedIndex].text;
    const message = document.getElementById('message').value.trim();
    
    // Détection de la branche sélectionnée
    const serviceRadio = document.querySelector('input[name="service"]:checked');
    const serviceText = serviceRadio && serviceRadio.value === 'auto-ecole' ? '🚗 Auto-École' : '🏠 Immobilier';

    // Validation rapide de sécurité
    if (!nom || !telephone || selectObjet.value === "" || !message) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Formatage propre du texte pour l'application WhatsApp
    const texteWhatsApp = `✨ *NOUVELLE DEMANDE SITE WEB* ✨\n\n` +
                          `👤 *Nom complet :* ${nom}\n` +
                          `📞 *Téléphone :* ${telephone}\n` +
                          `📧 *Email :* ${email}\n` +
                          `💼 *Intérêt :* ${serviceText}\n` +
                          `📌 *Objet :* ${objetText}\n\n` +
                          `💬 *Message :*\n"${message}"`;

    // NUMÉRO DE RÉCUPÉRATION (Changer ici si besoin)
    const numeroWhatsApp = "22798127235"; 

    // Création de l'URL d'envoi
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texteWhatsApp)}`;
    
    // Déclenchement de l'affichage du conteneur de succès vert présent dans le HTML
    const successBlock = document.getElementById('form-success');
    if (successBlock) {
      successBlock.style.display = 'flex';
      successBlock.classList.remove('hidden');
    }

    // Temporisation de 1,2 seconde pour l'effet de succès avant la bascule
    setTimeout(() => {
      window.open(url, '_blank');
      contactForm.reset(); // On vide les champs du formulaire
      if (successBlock) {
        successBlock.style.display = 'none';
        successBlock.classList.add('hidden');
      }
    }, 1200);
  });
}

// ─────────────────────────────────────────────────────────────
// 7. INITIALISATION GLOBALE
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActivePage();
  initMobileMenu();
  initStickyHeader();
  initScrollReveal();
  initCounters();
  initContactForm(); // <-- Appel de la nouvelle fonction de contact

  console.info('%c✅ A.M.I Niger — Scripts initialisés', 'color:#1E3A8A;font-weight:bold;');
});