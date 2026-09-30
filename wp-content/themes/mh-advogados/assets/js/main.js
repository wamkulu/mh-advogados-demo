/* MH theme — front-end behaviour. Vanilla JS, no dependencies. */
(function () {
	'use strict';

	var doc = document;

	var navbar = doc.getElementById('mh-navbar');
	var toTop = doc.querySelector('.mh-to-top');

	/* ---- Mobile navigation ------------------------------------------ */
	var toggle = doc.querySelector('.mh-nav-toggle');
	var nav = doc.getElementById('mh-primary-nav');

	// The panel fills the space between the navbar and the bottom of the screen.
	function sizeNav() {
		if (navbar && nav) {
			nav.style.setProperty('--mh-nav-h', Math.max(0, window.innerHeight - navbar.getBoundingClientRect().bottom) + 'px');
		}
	}

	function setNav(open) {
		if (open) { sizeNav(); }
		nav.classList.toggle('is-open', open);
		toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		doc.body.style.overflow = open ? 'hidden' : '';
	}

	if (toggle && nav) {
		toggle.addEventListener('click', function () {
			setNav(!nav.classList.contains('is-open'));
		});
		nav.addEventListener('click', function (e) {
			if (e.target.closest('a') && nav.classList.contains('is-open')) { setNav(false); }
		});
		window.addEventListener('resize', function () {
			if (window.innerWidth > 1100 && nav.classList.contains('is-open')) { setNav(false); }
			if (nav.classList.contains('is-open')) { sizeNav(); }
		});
	}

	/* ---- Search drop-down (desktop) ------------------------------- */
	var searchToggle = doc.querySelector('.mh-search-toggle');
	var searchInput = doc.getElementById('mh-nav-s');

	function setSearch(open) {
		navbar.classList.toggle('is-search-open', open);
		searchToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		if (open && searchInput) { setTimeout(function () { searchInput.focus(); }, 60); }
	}

	if (searchToggle && navbar) {
		searchToggle.addEventListener('click', function () {
			setSearch(!navbar.classList.contains('is-search-open'));
		});
		doc.addEventListener('click', function (e) {
			if (navbar.classList.contains('is-search-open') && !e.target.closest('.mh-nav__aside')) { setSearch(false); }
		});
	}

	doc.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') { return; }
		if (nav && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
		if (navbar && navbar.classList.contains('is-search-open')) { setSearch(false); searchToggle.focus(); }
	});

	/* ---- Navbar shadow + back-to-top ------------------------------ */
	function onScroll() {
		var y = window.pageYOffset || doc.documentElement.scrollTop;
		if (navbar) { navbar.classList.toggle('is-scrolled', y > 44); }
		if (toTop) { toTop.classList.toggle('is-visible', y > 700); }
	}
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });

	if (toTop) {
		toTop.addEventListener('click', function (e) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	/* ---- Scroll reveal ------------------------------------------- */
	var targets = doc.querySelectorAll(
		'.mh-section__head, .mh-area-card, .mh-member-card, .mh-post-card, .mh-training-card, .mh-timeline__item, .mh-about__body, .mh-about__media, .mh-stat, .mh-testi__card, .mh-training__intro, .mh-awards__intro'
	);

	function revealAll() {
		targets.forEach(function (el) { el.classList.add('is-in'); });
	}

	if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-in');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

		targets.forEach(function (el, i) {
			el.classList.add('mh-reveal');
			el.style.transitionDelay = (i % 3 * 80) + 'ms';
			io.observe(el);
		});

		// Failsafe: never leave content hidden (print, headless capture, background tabs).
		window.addEventListener('beforeprint', revealAll);
		window.addEventListener('load', function () { setTimeout(revealAll, 2500); });
	} else {
		revealAll();
	}

	/* ---- Testimonials carousel --------------------------------- */
	doc.querySelectorAll('.mh-testi').forEach(function (section) {
		var track = section.querySelector('[data-mh-carousel]');
		var prev = section.querySelector('[data-mh-prev]');
		var next = section.querySelector('[data-mh-next]');
		if (!track) { return; }

		function step() {
			var card = track.querySelector('.mh-testi__card');
			return card ? card.getBoundingClientRect().width + 24 : 320;
		}
		if (prev) { prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); }); }
		if (next) { next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); }); }
	});
})();
