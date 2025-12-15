document.addEventListener('DOMContentLoaded',()=>{

  const hamburger=document.getElementById('hamburger')
  const mobileMenu=document.getElementById('mobileMenu')

  hamburger.onclick=()=>{
    const open=mobileMenu.getAttribute('aria-hidden')==="true"
    mobileMenu.setAttribute('aria-hidden',!open)
    mobileMenu.style.display=open?'flex':'none'
    document.body.style.overflow=open?'hidden':''
  }

  window.closeMobile=()=>{
    mobileMenu.setAttribute('aria-hidden','true')
    mobileMenu.style.display='none'
    document.body.style.overflow=''
  }

  const reveals=document.querySelectorAll('.reveal')
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting)e.target.classList.add('active')
    })
  },{threshold:.15})
  reveals.forEach(r=>obs.observe(r))

  const slides=[...document.querySelectorAll('.ts-slide')]
  let idx=0
  const show=i=>slides.forEach((s,n)=>s.classList.toggle('active',n===i))
  show(0)

  document.getElementById('tsNext')?.onclick=()=>show(idx=(idx+1)%slides.length)
  document.getElementById('tsPrev')?.onclick=()=>show(idx=(idx-1+slides.length)%slides.length)

  const modal=document.getElementById('formModal')
  const courseSpan=document.getElementById('modalCourse')
  const courseInput=document.getElementById('cursoHidden')

  document.querySelectorAll('.js-open-form').forEach(btn=>{
    btn.onclick=()=>{
      modal.setAttribute('aria-hidden','false')
      courseSpan.textContent=btn.dataset.course
      courseInput.value=btn.dataset.course
    }
  })

  document.getElementById('modalClose').onclick=
  document.getElementById('cancelForm').onclick=()=>{
    modal.setAttribute('aria-hidden','true')
  }

  document.getElementById('preForm').onsubmit=e=>{
    e.preventDefault()
    const msg=`Pré-matrícula ENEM\nNome:${nome.value}\nCurso:${cursoHidden.value}`
    window.open(`https://wa.me/5583986627827?text=${encodeURIComponent(msg)}`,'_blank')
    modal.setAttribute('aria-hidden','true')
    e.target.reset()
  }

})
