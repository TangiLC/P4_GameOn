function editNav() {
  var x = document.getElementById("myTopnav")
  if (x.className === "topnav") {
    x.className += " responsive"
  } else {
    x.className = "topnav"
  }
}

// DOM Elements
const submitBtn = document.querySelector(".btn-submit")
const modalBg = document.querySelector(".bground")
const modalContent = document.querySelector(".content")
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

// launch modal form : passe l'attribut display en "block" pour la classe <bground>
function launchModal() {
  modalBg.style.display = "block"
  modalBg.style.opacity = "1"

}

// close modal form : modifie l'attribut display en "none" de la classe <bground>
function closeModal() {
  setTimeout(modalBg.style.display = "none",200);
  setTimeout(modalBg.style.opacity = "0",200);
}

function resetModal(){
  form.classList.remove("formSuccess");
  document.getElementsByClassName("text-control").value="";
  setTimeout(closeModal(),15);
}

function closevalidModal(){
  modalContent.style.setProperty('-webkit-animation-name','modalclose');
  modalContent.style.setProperty('animation-name','modalclose');
  setTimeout(resetModal(),2000);
  
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
  validateWholeForm() && setTimeout(closevalidModal,600)
})
