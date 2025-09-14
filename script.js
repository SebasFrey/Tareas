document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const navButtons = document.querySelectorAll(".nav-btn")
  const sections = document.querySelectorAll(".section")

  // Función para mostrar una sección específica
  function showSection(targetId) {
    // Ocultar todas las secciones
    sections.forEach((section) => {
      section.classList.remove("active")
    })

    // Remover clase active de todos los botones
    navButtons.forEach((btn) => {
      btn.classList.remove("active")
    })

    // Mostrar la sección objetivo
    const targetSection = document.getElementById(targetId)
    if (targetSection) {
      targetSection.classList.add("active")
    }

    // Activar el botón correspondiente
    const activeButton = document.querySelector(`[data-section="${targetId}"]`)
    if (activeButton) {
      activeButton.classList.add("active")
    }

    // Scroll suave hacia arriba
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Event listeners para los botones de navegación
  navButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetSection = this.getAttribute("data-section")
      showSection(targetSection)

      // Guardar la sección actual en localStorage
      localStorage.setItem("currentSection", targetSection)
    })
  })

  // Funcionalidad del acordeón de países
  const accordionItems = document.querySelectorAll(".accordion-item")

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header")
    const content = item.querySelector(".accordion-content")
    const toggle = item.querySelector(".accordion-toggle")

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active")

      // Cerrar todos los acordeones
      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove("active")
        const otherToggle = otherItem.querySelector(".accordion-toggle")
        otherToggle.textContent = "▶"
      })

      // Si no estaba activo, abrirlo
      if (!isActive) {
        item.classList.add("active")
        toggle.textContent = "▼"

        // Scroll suave hacia el acordeón activo
        setTimeout(() => {
          item.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          })
        }, 300)
      }
    })
  })

  // Navegación con teclado en acordeón
  document.addEventListener("keydown", (e) => {
    const activeSection = document.querySelector(".section.active")
    if (activeSection && activeSection.id === "paises") {
      const activeAccordion = document.querySelector(".accordion-item.active")
      const allAccordions = Array.from(accordionItems)

      if (e.key === "ArrowDown" && e.altKey) {
        e.preventDefault()
        const currentIndex = allAccordions.indexOf(activeAccordion)
        const nextIndex = (currentIndex + 1) % allAccordions.length
        allAccordions[nextIndex].querySelector(".accordion-header").click()
      } else if (e.key === "ArrowUp" && e.altKey) {
        e.preventDefault()
        const currentIndex = allAccordions.indexOf(activeAccordion)
        const prevIndex = (currentIndex - 1 + allAccordions.length) % allAccordions.length
        allAccordions[prevIndex].querySelector(".accordion-header").click()
      }
    }
  })

  // Restaurar la última sección visitada o mostrar la primera
  const savedSection = localStorage.getItem("currentSection")
  if (savedSection && document.getElementById(savedSection)) {
    showSection(savedSection)
  } else {
    showSection("definicion")
  }

  // Navegación con teclado
  document.addEventListener("keydown", (e) => {
    const currentActive = document.querySelector(".section.active")
    if (!currentActive) return

    const currentId = currentActive.id
    const sectionIds = ["definicion", "origen", "produccion", "sistema", "paises", "comparacion"]
    const currentIndex = sectionIds.indexOf(currentId)

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      // Solo navegar si no estamos usando Alt (para acordeón)
      if (!e.altKey) {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % sectionIds.length
        showSection(sectionIds[nextIndex])
      }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      // Solo navegar si no estamos usando Alt (para acordeón)
      if (!e.altKey) {
        e.preventDefault()
        const prevIndex = (currentIndex - 1 + sectionIds.length) % sectionIds.length
        showSection(sectionIds[prevIndex])
      }
    }
  })

  // Efectos de hover para las tarjetas
  const cards = document.querySelectorAll(
    ".content-card, .country-card, .characteristic-card, .analogy-card, .accordion-item",
  )
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains("accordion-item")) {
        this.style.transform = "translateY(-5px) scale(1.02)"
      }
    })

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("accordion-item")) {
        this.style.transform = "translateY(0) scale(1)"
      }
    })
  })

  // Animación de aparición para elementos cuando se hace scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Aplicar animación a elementos específicos
  const animatedElements = document.querySelectorAll(
    ".content-card, .timeline-item, .characteristic-card, .country-card, .vs-column, .accordion-item",
  )
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Función para imprimir o exportar la sección actual
  function printCurrentSection() {
    const activeSection = document.querySelector(".section.active")
    if (activeSection) {
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
                <html>
                    <head>
                        <title>Socialismo - ${activeSection.querySelector(".section-title").textContent}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h2 { color: #c41e3a; border-bottom: 2px solid #c41e3a; padding-bottom: 10px; }
                            h3 { color: #8b0000; }
                            .content-grid, .characteristics-grid, .countries-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
                            .content-card, .characteristic-card, .country-card { border: 1px solid #ccc; padding: 15px; border-radius: 5px; }
                            .accordion-content { display: block !important; max-height: none !important; }
                            .country-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                            .country-image img { max-width: 100%; height: auto; }
                        </style>
                    </head>
                    <body>
                        ${activeSection.innerHTML}
                    </body>
                </html>
            `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Atajo de teclado para imprimir (Ctrl+P)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "p") {
      e.preventDefault()
      printCurrentSection()
    }
  })

  // Función para modo presentación (pantalla completa)
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Error al entrar en pantalla completa:", err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Atajo de teclado para pantalla completa (F11 o F)
  document.addEventListener("keydown", (e) => {
    if (e.key === "F11" || (e.key === "f" && e.ctrlKey)) {
      e.preventDefault()
      toggleFullscreen()
    }
  })

  // Mostrar indicador de progreso
  function updateProgress() {
    const sectionIds = ["definicion", "origen", "produccion", "sistema", "paises", "comparacion"]
    const currentSection = document.querySelector(".section.active").id
    const currentIndex = sectionIds.indexOf(currentSection)
    const progress = ((currentIndex + 1) / sectionIds.length) * 100

    // Crear barra de progreso si no existe
    let progressBar = document.querySelector(".progress-bar")
    if (!progressBar) {
      progressBar = document.createElement("div")
      progressBar.className = "progress-bar"
      progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 4px;
                background: #c41e3a;
                transition: width 0.3s ease;
                z-index: 1000;
            `
      document.body.appendChild(progressBar)
    }

    progressBar.style.width = progress + "%"
  }

  // Actualizar progreso cuando cambie la sección
  const originalShowSection = showSection
  showSection = (targetId) => {
    originalShowSection(targetId)
    updateProgress()
  }

  // Inicializar progreso
  updateProgress()

  console.log("🔴 Página web sobre Socialismo cargada correctamente")
  console.log("📚 Usa las flechas del teclado para navegar entre secciones")
  console.log("🏛️ En la sección de países, usa Alt + ↑/↓ para navegar el acordeón")
  console.log("🖨️ Presiona Ctrl+P para imprimir la sección actual")
  console.log("📺 Presiona F11 para modo pantalla completa")
})
