/* main.js
 - mobile menu
 - reveal on scroll
 - tilt micro-interaction
 - testimonials slider
 - modal form + assemble WhatsApp message and open wa.me
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger && hamburger.addEventListener('click', () => {
    const hidden = mobileMenu.getAttribute('aria-hidden') === 'true';
    mobileMenu.setAttribute('aria-hidden', hidden ? 'false' : 'true');
    mobileMenu.style.display = hidden ? 'flex' : 'none';
  });

  window.closeMobile = function(){
    mobileMenu.setAttribute('aria-hidden','true');
    mobileMenu.style.display = 'none';
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(r => obs.observe(r));

  /* ---------- Tilt micro effect for cards ---------- */
  const tilts = document.querySelectorAll('[data-tilt]');
  tilts.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 8; // rotateX
      const ry = (x - 0.5) * -8; // rotateY
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  /* ---------- Testimonials slider ---------- */
  const slides = Array.from(document.querySelectorAll('.ts-slide'));
  let sIndex = 0;
  const nextBtn = document.getElementById('tsNext');
  const prevBtn = document.getElementById('tsPrev');

  function showTestimonial(i){
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  }
  if(slides.length){
    showTestimonial(0);
    nextBtn && nextBtn.addEventListener('click', () => { sIndex = (sIndex+1)%slides.length; showTestimonial(sIndex); });
    prevBtn && prevBtn.addEventListener('click', () => { sIndex = (sIndex-1+slides.length)%slides.length; showTestimonial(sIndex); });
    setInterval(()=>{ sIndex = (sIndex+1)%slides.length; showTestimonial(sIndex); }, 6000);
  }

  /* ---------- Modal & PRE-FILL form logic ---------- */
  const modal = document.getElementById('formModal');
  const modalClose = document.getElementById('modalClose');
  const openButtons = Array.from(document.querySelectorAll('.js-open-form'));
  const modalCourse = document.getElementById('modalCourse');
  const cursoHidden = document.getElementById('cursoHidden');
  const preForm = document.getElementById('preForm');
  const cancelForm = document.getElementById('cancelForm');

  function openModal(courseName){
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
    modalCourse.textContent = courseName;
    cursoHidden.value = courseName;
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const course = btn.dataset.course || 'Curso';
      openModal(course);
    });
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  cancelForm && cancelForm.addEventListener('click', closeModal);

  // Build WhatsApp message and open wa.me with encoded text
  preForm && preForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim() || 'Não informado';
    const whatsapp = document.getElementById('whatsapp').value.trim() || 'Não informado';
    const email = document.getElementById('email').value.trim() || 'Não informado';
    const ano = document.getElementById('ano').value.trim() || 'Não informado';
    const observacoes = document.getElementById('observacoes').value.trim() || 'Nenhuma observação';
    const curso = document.getElementById('cursoHidden').value || 'Curso não informado';

    const msg =
`🎓 NOVA PRÉ-MATRÍCULA - ENEM PREP

👤 Nome: ${nome}
📱 WhatsApp: ${whatsapp}
📧 E-mail: ${email}
📚 Curso de Interesse: ${curso}
📅 Ano do ENEM: ${ano}

💭 Observações:
${observacoes}

---
Mensagem enviada através do site`;

    const phone = '5583986627827'; // BR number with country code
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url,'_blank');

    // Close and reset
    closeModal();
    preForm.reset();
  });

});
