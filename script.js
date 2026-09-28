document.addEventListener('DOMContentLoaded', function () {
    const revealItems = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target;

            if (entry.isIntersecting) {
                target.classList.remove('visible');
                void target.offsetWidth;
                target.classList.add('visible');
            } else {
                target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));

    const navLinks = document.querySelectorAll('.site-nav a');
    const sectionTargets = document.querySelectorAll('main section[id]');

    function setActiveNav(linkId) {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${linkId}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveNav(entry.target.id);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-25% 0px 0px 0px'
    });

    sectionTargets.forEach((section) => sectionObserver.observe(section));

    navLinks.forEach((link) => {
        link.addEventListener('click', function () {
            const targetId = link.getAttribute('href')?.replace('#', '');
            if (targetId) {
                setActiveNav(targetId);
            }
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    function open(src) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    const portfolioImages = document.querySelectorAll('.portfolio-image');
    portfolioImages.forEach(function (img) {
        img.addEventListener('click', function (e) {
            e.stopPropagation();
            open(img.src);
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', close);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.hasAttribute('data-dismiss')) {
            close();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (lightbox.classList.contains('open') && e.key === 'Escape') close();
    });
});
