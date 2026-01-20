document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
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
            let count = 0;
            const inc = target / 50;

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 20);
                } else {
                    if (target === 2000000) counter.innerText = "+2M";
                    if (target === 15000) counter.innerText = "+15k";
                    if (target === 98) counter.innerText = "98%";
                }
            };
            updateCount();
        });
    }

    // --- Form Handling + Envio para Google Sheets ---
    const form = document.getElementById('leadForm');


    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            const data = {
                nome: form.querySelector('[name="nome"]').value,
                email: form.querySelector('[name="email"]').value,
                whatsapp: form.querySelector('[name="whatsapp"]').value,
                faturamento: form.querySelector('[name="faturamento"]').value
            };

            try {
                const response = await fetch(
                    "https://script.google.com/macros/s/AKfycbxin_STTPJ9PUwsc90Ny1u7eRMfuwqEPr8Fzb8pkRx0EXWcZnytwAI3NiRhIfBqA7fw/exec",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    }
                );

                const result = await response.json();

                if (result.status === "sucesso") {
                    btn.innerText = 'Recebido! Entraremos em contato.';
                    btn.style.background = '#10b981';
                    form.reset();
                } else {
                    throw new Error("Erro na API");
                }

            } catch (error) {
                console.error("Erro ao enviar:", error);
                btn.innerText = 'Erro ao enviar. Tente novamente.';
                btn.style.background = '#ef4444';
            }

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 4000);
        });
    }

});
