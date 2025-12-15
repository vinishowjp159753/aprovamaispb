document.addEventListener('DOMContentLoaded', () => {

  /* ===== MENU MOBILE ===== */
  const hamburger = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobileMenu')

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isHidden = mobileMenu.getAttribute('aria-hidden') === 'true'

      mobileMenu.setAttribute('aria-hidden', isHidden ? 'false' : 'true')
      mobileMenu.style.display = isHidden ? 'flex' : 'none'
      document.body.style.overflow = isHidden ? 'hidden' : ''
    })
  }

  window.closeMobile = () => {
    if (!mobileMenu) return
    mobileMenu.setAttribute('aria-hidden', 'true')
    mobileMenu.style.display = 'none'
    document.body.style.overflow = ''
  }

  /* ===== REVEAL ON SCROLL ===== */
  const reveals = document.querySelectorAll('.reveal')

  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, { threshold: 0.15 })

    reveals.forEach(el => observer.observe(el))
  }

  /* ===== SLIDER DE DEPOIMENTOS ===== */
  const slides = Array.from(document.querySelectorAll('.ts-slide'))
  const nextBtn = document.getElementById('tsNext')
  const prevBtn = document.getElementById('tsPrev')
  let index = 0

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === i)
    })
  }

  if (slides.length) {
    showSlide(0)

    nextBtn && nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length
      showSlide(index)
    })

    prevBtn && prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length
      showSlide(index)
    })
  }

  /* ===== MODAL PRÉ-MATRÍCULA ===== */
  const modal = document.getElementById('formModal')
  const modalClose = document.getElementById('modalClose')
  const cancelForm = document.getElementById('cancelForm')
  const modalCourse = document.getElementById('modalCourse')
  const cursoHidden = document.getElementById('cursoHidden')
  const preForm = document.getElementById('preForm')

  document.querySelectorAll('.js-open-form').forEach(btn => {
    btn.addEventListener('click', () => {
      const course = btn.dataset.course || 'Curso'
      modal.setAttribute('aria-hidden', 'false')
      modal.style.display = 'flex'
      modalCourse.textContent = course
      cursoHidden.value = course
    })
  })

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true')
    modal.style.display = 'none'
  }

  modalClose && modalClose.addEventListener('click', closeModal)
  cancelForm && cancelForm.addEventListener('click', closeModal)

  /* ===== ENVIO PARA WHATSAPP ===== */
  preForm && preForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value
    const whatsapp = document.getElementById('whatsapp').value
    const email = document.getElementById('email').value
    const ano = document.getElementById('ano').value
    const curso = cursoHidden.value
    const obs = document.getElementById('observacoes').value || 'Nenhuma observação'

    const mensagem =
`📚 PRÉ-MATRÍCULA ENEM

👤 Nome: ${nome}
📱 WhatsApp: ${whatsapp}
📧 Email: ${email}
📅 Ano ENEM: ${ano}
🎓 Curso: ${curso}

📝 Observações:
${obs}`

    window.open(
      `https://wa.me/5583986627827?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    )

    closeModal()
    preForm.reset()
  })

})
