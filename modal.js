function editNav() {
  var x = document.getElementById("myTopnav")
  if (x.className === "topnav") {
    x.className += " responsive"
  } else {
    x.className = "topnav"
  }
}

// DOM Elements
const modalBg = document.querySelector(".bground")
const modalBtn = document.querySelectorAll(".modal-btn")
const closeModalBtn = document.getElementById("close-button")
const form = document.querySelector("form")
const formData = document.querySelectorAll(".formData")
const formDataToValidate = document.querySelectorAll(
  ".formData[data-validation-type]:not([data-validation-type=none])"
)

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal))

// close modal event
closeModalBtn.addEventListener("click", closeModal)

// launch modal form
function launchModal() {
  modalBg.style.display = "block"
}

// close modal form
function closeModal() {
  modalBg.style.opacity = "0"
  modalBg.style.transform = "translateY(-150px)"
  setTimeout(() => {
    modalBg.style.display = "none"
    modalBg.style.removeProperty("opacity")
    modalBg.style.removeProperty("transform")
  }, 800)
}

// Regex
let validName = /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,}$/;
let validEmail = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
let validNb = /^[0-9]{1,}$/;



const validate = {
  name: ({ value }) => validName.test(value),
  email: ({ value }) => validEmail.test(value.toLowerCase()),
  birthdate: ({ value }) => new Date(value) < new Date(),
  number: ({ value }) => validNb.test(value),
  radioRequired: ({ elem }) =>
    elem.querySelectorAll('input[type="radio"]:checked').length > 0,
  checkboxRequired: ({ elem }) =>
    elem.querySelector('input[type="checkbox"]').checked,
}

formDataToValidate.forEach((elem) => {
  elem.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const isValid = validate[elem.getAttribute("data-validation-type")]({
        value: e.target.value,
        elem,
      })
      elem.setAttribute("data-error-visible", !isValid)
    })
  })
})

function validateWholeForm() {
  formDataToValidate.forEach((elem) => {
    elem.querySelectorAll("input").forEach((input) => {
      const isValid = validate[elem.getAttribute("data-validation-type")]({
        value: input.value,
        elem,
      })
      elem.setAttribute("data-error-visible", !isValid)
    })
  })

  const isFormValid = [...formDataToValidate].every(
    (elem) =>
      elem.getAttribute("data-error-visible") === "false" ||
      !elem.hasAttribute("data-error-visible")
  )

  return isFormValid
}

form.addEventListener("submit", (e) => {
  e.preventDefault()
  validateWholeForm() && form.classList.add("formSuccess") 
  validateWholeForm() && setTimeout(closeModal,2000)
})
