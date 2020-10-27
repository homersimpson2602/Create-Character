import { resolve } from "path";
import "./styles.scss"



let cardsCount = 0;
const $createButton = document.querySelector("#create-button")
const $welcomeFrame = document.querySelector("#welcome-frame")
// Берём параметры из формы
function getParameters() {
  let $name = document.querySelector('[data-type="name"]').value.toLowerCase() 
  let selectedIndex = document.querySelector('[data-type="class"]').options["selectedIndex"]
  let $class = document.querySelector('[data-type="class"]').options[selectedIndex].text
  let $gender = document.querySelector('[data-type="male"]').checked 
    ? "мужчина"
    : "женщина"
  let $age = document.querySelector('[data-type="age"]').value

  return {
    name: $name,
    class: $class,
    gender: $gender,
    age: $age
  }
}

// Создаём базовый класс персонажа
class Character {
  constructor(options) {
    this.name = options.name
    this.class = options.class
    this.gender = options.gender
    this.age = options.age
  }

  get imgURL() {
    if (this.gender === "мужчина") {
      return "https://dvqlxo2m2q99q.cloudfront.net/000_clients/75782/page/h800-75782hau958iD.png"
    } else {
      return "https://c0.klipartz.com/pngpicture/384/759/gratis-png-asuna-kirito-anime-femenino-chibi-asuna.png"
    }
  }

  get classColor() {
    switch (this.class) {
      case "Воин":
        return "#c69b6d"
      case "Маг": 
        return "#68ccef"
      case "Друид":
        return "#ff7c0a"  
    }
  }

  get capitalLetterName() {
    if (this.name !=  "") {
      let tempName = this.name.charAt(0).toUpperCase()
      return tempName + this.name.slice(1)
    }
  }
}

// класс-наследник 
class Paladin extends Character {
  constructor(options) {
    super(options)
    this.spec = "Свет"
  }

  get classColor() {
    return "#f48cba"
  }
}

// Проверяем введённые параметры
function checkParameters(params) {
  const nameAlert = document.querySelector("#name-alert")
  const nameLengthALert = document.querySelector("#name-length-alert")
  const ageAlert = document.querySelector("#age-alert")
  if (!params.name) {
    nameAlert.style.display = "block"
    nameLengthALert.style.display = "none"
    return false
  } else if (params.name.length < 3 || params.name.length > 13) {
    nameAlert.style.display = "none"
    nameLengthALert.style.display = "block"
    return false
  }
  if (params.age === "") {
    ageAlert.style.display = "block"
    return false
  } 

  nameAlert.style.display = "none"
  nameLengthALert.style.display = "none"
  ageAlert.style.display = "none"

  return true
}




// Принимаем параметры и на их основе создаём карточку с персонажем
function renderCard(parameters) {
  const wrap = document.querySelector('[data-type="main-content"]')
  wrap.insertAdjacentHTML("beforeend", `
    <div class="character-card" style="background-color: ${parameters.classColor}">
      <img src="${parameters.imgURL}" alt="">
      <h3 class="character-card__name">${parameters.capitalLetterName}</h3>
      <span><strong>Класс:</strong> ${parameters.class}</span>
      <span><strong>Возраст:</strong> ${parameters.age}</span>
      <span><strong>Пол:</strong> ${parameters.gender}</span>
    </div>
  ` 
  )
  $welcomeFrame.remove()

}



// создание карточку на странице 
function createCard() {
  if (cardsCount < 6 ) {
    let charParameters = ""
    if (getParameters().class === "Паладин") {
      charParameters = new Paladin(getParameters())
    } else {
      charParameters = new Character(getParameters())
    }
    if (checkParameters(charParameters)) {
      renderCard(charParameters);
      cardsCount++;
    }
      
  } else {
    const $pirWrap = document.querySelector("#pir-wrap")
    const $partyIsReady = document.createElement("div")
    console.log($partyIsReady.innerHTML)
    while ($pirWrap.firstChild) {
      $pirWrap.removeChild($pirWrap.firstChild)
    }
    $partyIsReady.innerHTML = "<p><strong>Отряд из 6 персонажей полностью укомплектован!</strong></p>"
    $partyIsReady.classList.add("party-is-ready")
    $pirWrap.appendChild($partyIsReady)
  }
  
}

$createButton.addEventListener("click", createCard)

// =============================== 
// additional content
const $egg = document.querySelector("#egg")
const $hen = document.querySelector("#hen")

// отрисовка правильного ответа
function renderAnswer() {
  const $question = document.querySelector("#question")
  while ($question.firstChild) {
    $question.firstChild.remove()
  }
  const $answerWrap = document.createElement("div")
  $answerWrap.classList.add("answer-wrap")
  $answerWrap.insertAdjacentHTML("afterbegin", `
  <div>
    <h2>Это верный ответ!</h2>
    <span>Вы разблокировали новый класс: <strong>Паладин</strong>!</span>
    <p>Теперь можешь создать его в меню выбора параметров персонажа</p>

  </div>
  <div class="secret-card">
        <img src="https://i.pinimg.com/originals/1f/e5/f1/1fe5f1fc56df096788c868c8aa01ccbb.jpg" alt="">
        <h3 class="character-card__name"></h3>
  </div>
  `)
  $question.appendChild($answerWrap)
  addPaladinOption();
  
}

// добавление опции в дроп-даун
function addPaladinOption() {
  let $class = document.querySelector('[data-type="class"]')
  $class.insertAdjacentHTML("afterbegin", `
    <option value="paladin">Паладин</option>
  `)
}

// отрисовка неверного ответа
function renderReject() {
  const $question = document.querySelector("#question")
  while ($question.firstChild) {
    $question.firstChild.remove()
  }

  const $rejectWrap = document.createElement("div")
  $rejectWrap.classList.add("reject-wrap")
  $rejectWrap.insertAdjacentHTML("afterbegin", `
      <img src="https://image.freepik.com/free-vector/man-thinking-with-an-interrogation_59690-122.jpg" alt="">
      <div>
        <h2>Ответ неверный!</h2>
        <p>Наши эксперты думают, что раньше было яйцо!</p>
      </div>  
  `)

  $question.appendChild($rejectWrap)
}

// отрисовка процесса обработки ответа
function renderProcessing(ev) {
  const target = ev.target
  console.log(target)
  const $question = document.querySelector("#question")
  const $processWrap = document.createElement("div")
  let countStage = 1

  while ($question.firstChild) {
    $question.firstChild.remove()
  }

  $processWrap.classList.add("process-wrap")
  $processWrap.insertAdjacentHTML("afterbegin", `
    <p>Отправляем ответ нашим экспертам</p>
  `)
  $question.appendChild($processWrap)

  const renderProcess = new Promise(resolve => {
    setTimeout(() => {
      $processWrap.innerHTML = `<p>Эксперты рассматривают ответ</p>`
      resolve()
    }, 2000);
  })
  renderProcess.then(() => {
    return new Promise(r => {
      setTimeout(() => {
        $processWrap.innerHTML = `<p>Эксперты призадумались...</p>`
        r();
      }, 2000);
    })
  })
    .then(() => {
      return new Promise(r => {
        setTimeout(() => {
          $processWrap.innerHTML = `<p>Эксперты вынесли вердикт</p>`
          r();
        }, 2000)
      })
    })
    .then(() => {
      return new Promise( r => {
        setTimeout(() => {
          if (target.hasAttribute("data-egg")) {
            renderAnswer() 
          } else {
            renderReject()
          }
          
        }, 1500);
      })
    })
  
}

$egg.addEventListener("click", renderProcessing)
$hen.addEventListener("click", renderProcessing)
