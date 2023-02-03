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
const closeBtn = document.querySelector(".btn-close")
const limitBirthday =document.getElementById("birthdate")
const toHide =document.querySelectorAll(".toHide")   
const success =document.querySelectorAll(".formSuccessMessage")
const modalBg = document.querySelector(".bground")
const modalContent = document.querySelector(".content")
const modalBtn = document.querySelectorAll(".modal-btn")
const closeModalBtn = document.getElementById("close-button")
const form = document.querySelector("form")
const formData = document.querySelectorAll(".formData")
const formDataToValidate = document.querySelectorAll(
  ".formData[data-validation-type]:not([data-validation-type=none])"
)
// set birthdate min (100y) and max (6y) from current date
const today = new Date();
function twoDigits(nb){
  return ((nb<10) ? ('0'+nb.toString()) : (nb.toString()));
}
const todayMonth = twoDigits(today.getMonth()+1);
const todayDay = twoDigits(today.getDate());
const today_6y = ((today.getYear()+(1900-06))+'-'+todayMonth+'-'+todayDay);
const today_100y =((today.getYear()+(1900-100))+'-'+todayMonth+'-'+todayDay);
const jour_6y =(todayDay+'/'+todayMonth+'/'+(today.getYear()+(1900-06)));
const jour_100y =(todayDay+'/'+todayMonth+'/'+(today.getYear()+(1900-100)));
limitBirthday.setAttribute('min', today_100y);
limitBirthday.setAttribute('max', today_6y);

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// close modal event
closeModalBtn.addEventListener("click", closeModal);
closeBtn.addEventListener("click", resetCloseModal);

// launch modal form : passe l'attribut display en "block" pour la classe <bground>
function launchModal() {
  modalBg.style.display = "block";
  modalBg.style.opacity = "1";
  console.log('opening modal');
}

// close modal form : modifie l'attribut display en "none" de la classe <bground>
function closeModal() {
  setTimeout(modalBg.style.display = 'none',800);
  setTimeout(modalBg.style.opacity = '0',800);
}

// Reset form and close modal : vide les champs input du formulaire avant fermeture
function resetCloseModal(){
  setTimeout(form.reset(),2000);
  location.reload();
  closeModal();
}

// Close Valid Modal : masquage des champs "toHide" et apparition du bouton close
function closeValidModal(){
  toHide.forEach((arg) => {
    arg.style.display='none';
    arg.style.visibility='hidden';
  });
  closeBtn.style.display='block';
  success.forEach((arg) =>{arg.setAttribute('visibility','hidden');});
  setTimeout(console.log('Valid Form completed: closing'),800);
  closeModal();
  launchModal();
  
}

// Regex pour les tests input
let validName = /^[A-Za-zÀ-ÖØ-öø-ÿ '-]{2,}$/;
let validEmail = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
let validNb = /^[0-9]{1,}$/;


// Validation unitaire booléen de l'array element(input)/attribut (value) comparaison avec le regex
const validate = {
  name: ({ value }) => validName.test(value),
  email: ({ value }) => validEmail.test(value.toLowerCase()),
  birthdate: ({ value }) => ((new Date(value)<new Date(jour_6y)) && (new Date(value)>new Date(jour_100y))),
  number: ({ value }) => validNb.test(value),
  radioRequired: ({ elem }) =>
    elem.querySelectorAll('input[type="radio"]:checked').length > 0,
  checkboxRequired: ({ elem }) =>
    elem.querySelector('input[type="checkbox"]').checked,
}

//fonction de validation en arrière plan avec affichage du message d'erreur si invalide
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

//Validation finale de l'ensemble du formulaire au clique submit
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

//fonction d'attente
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// lancer l'animation css formfail contenue dans la class puis restauration à l'état antérieur
async function formFail(){
  form.classList.toggle("formFail");
  await delay(2000);
  form.classList.toggle("formFail");
}
// fonction au submit : conserver les input et lancer la validation,
// afficher le message formsuccess et boutton fermer si validation true
// lancer formfail si validation false
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if(validateWholeForm()){
    form.classList.add("formSuccess");
    setTimeout(closeValidModal,200);
  } else {
    formFail();
  }
})
