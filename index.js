let url = 'wss://lavender-luck-smelt.glitch.me/ws'
let socket = new WebSocket(url);

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') {
    document.querySelector("#imageInput").onchange = readImage
    document.querySelector("#titleInput").onchange = readTitle
    document.querySelector("#priceInput").onchange = readPrice
    document.querySelector("#descriptionInput").onchange = readDescription
    document.querySelector("#whatsappInput").onchange = readWhatsapp
    document.querySelector("#updateInput").onclick = updateData
    document.querySelector("#whatsappOutput").onclick = openChat
  }
});



socket.onopen = function(e) {};

socket.onmessage = function(e) {
  let res = JSON.parse(e.data)
  let data = res.data
  updateLocal(data)
};

socket.onclose = function(e) {
  notifCode()
  .then(reloadPage)
  
  function notifCode() {
    return new Promise((res) => {
      let resCode = e.code
      console.log(`Closed: ${resCode}`);
      res(true)
    })
  }
  
  function reloadPage(val) {
    if (val === true) {
      return new Promise((res) => {
        setTimeout(() => {
          location.reload()
        }, 500)
      })
    }
  }
};

function readImage(e) {
  let elm = document.querySelector('#imageInput')
  document.querySelector('#imageOutput').src = elm.value
}

function readTitle() {
  let elm = document.querySelector('#titleInput')
  document.querySelector('#titleOutput').textContent = elm.value.toUpperCase()
}

function readPrice() {
  let elm = document.querySelector('#priceInput')
  let price = parseInt(elm.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.').slice(0, -3)
  document.querySelector('#priceOutput').textContent = "Rp" + price
}

function readDescription() {
  let elm = document.querySelector('#descriptionInput')
  let desc = elm.value.replace(new RegExp('\n','g'), '<br />')
  document.querySelector('#descriptionOutput').innerHTML = desc
}

function readWhatsapp() {
  let elm = document.querySelector('#whatsappInput')
  let num = elm.value.toString()
  let charOne = num.charAt(0)
  let charTwo = num.charAt(1)
  let firstTwo = charOne + charTwo
  if (firstTwo === "62") {
    document.querySelector('#whatsappOutput').value = num
  } else if (firstTwo === "08") {
    let remZero = num.slice(1)
    document.querySelector('#whatsappOutput').value = "62" + remZero
  }
}

function updateData() {
  let data = {
    image: document.querySelector('#imageInput').value,
    title: document.querySelector('#titleInput').value,
    price: document.querySelector('#priceInput').value,
    description: document.querySelector('#descriptionInput').value,
    whatsapp: document.querySelector('#whatsappInput').value
  }
  
  changeButtonColor()
  .then(sendDatabase)
  
  function changeButtonColor() {
    return new Promise((res) => {
      document.querySelector("#updateInput").className = "btn btn-light btn-lg btn-block mb-3";
      res(true)
    })
  }
  
  function sendDatabase(val) {
    if (val === true) {
      return new Promise((res) => {
        setTimeout(() => {
          document.querySelector("#updateInput").className = "btn btn-warning btn-lg btn-block mb-3";
          localStorage.setItem('data', JSON.stringify(data))
          socket.send(JSON.stringify({ data: data }))
          res(true)
        }, 200)
      })
    }
  }
}

function openChat() {
  changeButtonColor()
  .then(sendWhatsapp)
  
  function changeButtonColor() {
    return new Promise((res) => {
      document.querySelector("#whatsappOutput").className = "btn btn-light btn-lg btn-block mb-3";
      res(true)
    })
  }
  
  function sendWhatsapp(val) {
    if (val === true) {
      return new Promise((res) => {
        setTimeout(() => {
          document.querySelector("#whatsappOutput").className = "btn btn-success btn-lg btn-block mb-3";
          let waNum = document.querySelector('#whatsappOutput').value
          let urlChat = `https://api.whatsapp.com/send/?phone=${waNum}&text=saya+tertarik+dengan+penawaran+anda`
          window.open(urlChat, "_blank")
          res(true)
        }, 200)
      })
    }
  }
}

function updateLocal(data) {
  document.querySelector('#imageOutput').src = data.image
  document.querySelector('#titleOutput').textContent = data.title.toUpperCase()
  let price = parseInt(data.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.').slice(0, -3)
  document.querySelector('#priceOutput').textContent = "Rp" + price
  let desc = data.description.replace(new RegExp('\n','g'), '<br />')
  document.querySelector('#descriptionOutput').innerHTML = desc
  let num = data.whatsapp.toString()
  let charOne = num.charAt(0)
  let charTwo = num.charAt(1)
  let firstTwo = charOne + charTwo
  if (firstTwo === "62") {
    document.querySelector('#whatsappOutput').value = num
  } else if (firstTwo === "08") {
    let remZero = num.slice(1)
    document.querySelector('#whatsappOutput').value = "62" + remZero
  }
}
