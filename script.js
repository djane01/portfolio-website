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

    const masonryGrids = document.querySelectorAll('.digital-design-grid, .digital-drawing-grid, .digital-modeling-grid');
    masonryGrids.forEach((masonryGrid) => {
        const resizeMasonryItems = () => {
            const styles = getComputedStyle(masonryGrid);
            const rowHeight = parseFloat(styles.gridAutoRows);
            const rowGap = parseFloat(styles.rowGap);

            masonryGrid.querySelectorAll('.work-card').forEach((card) => {
                const image = card.querySelector('img');
                if (!image || !image.complete || !image.naturalHeight) return;

                const imageHeight = image.getBoundingClientRect().height;
                const rowSpan = Math.ceil((imageHeight + rowGap) / (rowHeight + rowGap));
                card.style.gridRowEnd = `span ${rowSpan}`;
            });
        };

        masonryGrid.querySelectorAll('img').forEach((image) => {
            image.addEventListener('load', resizeMasonryItems);
        });
        window.addEventListener('resize', resizeMasonryItems);
        resizeMasonryItems();
    });

    const navLinks = document.querySelectorAll('.site-nav a');
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');
    const siteHeader = document.querySelector('.site-header');
    const cvButton = document.querySelector('.header-cv-button');
    const sectionTargets = [...document.querySelectorAll('main section[id]')].filter((section) => section.id !== 'home');

    function setMobileNavOpen(isOpen) {
        siteNav.classList.toggle('is-open', isOpen);
        siteHeader.classList.toggle('mobile-menu-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }

    navToggle.addEventListener('click', () => {
        setMobileNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    cvButton.addEventListener('click', () => {
        setMobileNavOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMobileNavOpen(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 480) {
            setMobileNavOpen(false);
        }
    });

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

    function updateActiveNavFromScroll() {
        let currentId = 'about';
        let smallestDistance = Number.POSITIVE_INFINITY;
        const viewportAnchor = window.innerHeight * 0.35;

        sectionTargets.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = (rect.top + rect.bottom) / 2;
            const distance = Math.abs(sectionCenter - viewportAnchor);

            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    currentId = section.id;
                }
            }
        });

        setActiveNav(currentId);
    }

    const sectionObserver = new IntersectionObserver(() => {
        updateActiveNavFromScroll();
    }, {
        threshold: 0,
        rootMargin: '-25% 0px 0px 0px'
    });

    sectionTargets.forEach((section) => sectionObserver.observe(section));
    window.addEventListener('scroll', updateActiveNavFromScroll, { passive: true });
    window.addEventListener('load', updateActiveNavFromScroll);
    updateActiveNavFromScroll();

    navLinks.forEach((link) => {
        link.addEventListener('click', function () {
            const targetId = link.getAttribute('href')?.replace('#', '');
            if (targetId) {
                setActiveNav(targetId);
            }
            setMobileNavOpen(false);
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
