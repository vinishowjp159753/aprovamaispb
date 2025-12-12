// main.js - mobile menu, modal, slider, form -> whatsapp

document.addEventListener('DOMContentLoaded', function() {

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger && hamburger.addEventListener('click', function(){
    const visible = mobileMenu.getAttribute('aria-hidden') === 'false';
    mobileMenu.setAttribute('aria-hidden', visible ? 'true' : 'false');
    mobileMenu.style.display = visible ? 'none' : 'flex';
  });

  window.closeMobile = function(){
    mobileMenu.setAttribute('aria-hidden','true');
    mobileMenu.style.display = 'none';
  }

  /* ---------- Slider (Depoimentos) ---------- */
  const slides = Array.from(document.querySelectorAll('.slide'));
  let slideIndex = 0;
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  function showSlide(i){
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  }

  if(slides.length){
    showSlide(0);
    // controls
    nextBtn && nextBtn.addEventListener('click', function(){ slideIndex = (slideIndex+1)%slides.length; showSlide(slideIndex); });
    prevBtn && prevBtn.addEventListener('click', function(){ slideIndex = (slideIndex-1+slides.length)%slides.length; showSlide(slideIndex); });
    // auto
    setInterval(function(){ slideIndex = (slideIndex+1)%slides.length; showSlide(slideIndex); }, 6000);
  }

  /* ---------- Modal form for pre-enrollment ---------- */
  const modal = document.getElementById('formModal');
  const modalClose = document.getElementById('modalClose');
  const openButtons = Array.from(document.querySelectorAll('.js-open-form'));
  const courseLabel = document.getElementById('modalCourse');
  const cursoHidden = document.getElementById('cursoHidden');
  const preForm = document.getElementById('preForm');
  const cancelForm = document.getElementById('cancelForm');

  function openModal(courseName){
    modal.setAttribute('aria-hidden','false');
    courseLabel.textContent = courseName;
    cursoHidden.value = courseName;
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
  }

  openButtons.forEach(btn=>{
    btn.addEventListener('click', function(){
      const course = btn.dataset.course || 'Curso';
      openModal(course);
    });
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  cancelForm && cancelForm.addEventListener('click', closeModal);

  // When user submits the form, construct the WhatsApp message and open wa.me
  preForm && preForm.addEventListener('submit', function(e){
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim() || 'Não informado';
    const whatsapp = document.getElementById('whatsapp').value.trim() || 'Não informado';
    const email = document.getElementById('email').value.trim() || 'Não informado';
    const ano = document.getElementById('ano').value.trim() || 'Não informado';
    const observacoes = document.getElementById('observacoes').value.trim() || 'Nenhuma observação';
    const curso = cursoHidden.value || 'Curso não selecionado';

    // Build message exactly as requested
    let msg = "🎓 NOVA PRÉ-MATRÍCULA - ENEM PREP\n\n";
    msg += "👤 Nome: " + nome + "\n";
    msg += "📱 WhatsApp: " + whatsapp + "\n";
    msg += "📧 E-mail: " + email + "\n";
    msg += "📚 Curso de Interesse: " + curso + "\n";
    msg += "📅 Ano do ENEM: " + ano + "\n\n";
    msg += "💭 Observações:\n" + observacoes + "\n\n";
    msg += "---\nMensagem enviada através do site";

    const phone = "5583986627827"; // ENEM PREP number (country code 55)
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg);

    // Open new window/tab
    window.open(url, '_blank');

    // Optional: close modal after sending
    closeModal();

    // You can also clear the form fields if desired:
    preForm.reset();
  });

});
