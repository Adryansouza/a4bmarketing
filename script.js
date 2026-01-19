document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Fade Up Animation Observer ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // --- Number Counter Animation ---
    const statsSection = document.querySelector('.stats-grid');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateNumbers();
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateNumbers() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.innerText.replace(/[0-9]/g, ''); // Get non-numeric chars like +, %, M

            let count = 0;
            const inc = target / 50; // Speed

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    counter.innerText = Math.ceil(count) + suffix; // Append suffix manually for simple animation
                    // Note: This is a basic implementation. Ideally we separate number and suffix in HTML.
                    // For this specific design, we'll keep it simple or stick to the static text if complex suffixes interfere.
                    // Re-setting to text content for smoother visual in this demo:
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                    // Restore original text formatting if needed, or simple add suffix back
                    if (suffix) counter.innerText += suffix;
                    // Special case for the "2000000" -> "+2M"
                    if (target === 2000000) counter.innerText = "+2M";
                    if (target === 15000) counter.innerText = "+15k";
                    if (target === 98) counter.innerText = "98%";
                }
            };
            updateCount();
        });
    }

    // --- Form Handling ---
    const form = document.getElementById('leadForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerHTML = 'Enviando...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerHTML = 'Recebido! Entraremos em contato 🚀';
                btn.style.background = '#10b981'; // Success Green
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 4000);
            }, 1500);
        });
    }
});
