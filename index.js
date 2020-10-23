let url = 'wss://lavender-luck-smelt.glitch.me/ws'
let socket = new WebSocket(url);

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') {
    updateData()
    buttonReady()
    syncData()
    devButton()
  }
});

socket.onmessage = function(e) {
  let res = JSON.parse(e.data)
  let data = res.data
  renderData(data)
  saveData(data)
}

socket.onclose = function(e) {
  notifCode(e)
  .then(reloadPage)
  
  function notifCode(event) {
    return new Promise((ful) => {
      let resCode = event.code
      ful(true)
    })
  }
  
  function reloadPage(val) {
    if (val === true) {
      return new Promise((ful) => {
        setTimeout(() => {
          location.reload()
          ful(true)
        }, 500)
      })
    }
  }
};



function saveData(obj) {
  let data = JSON.stringify(obj)
  localStorage.setItem('data', data)
}


function updateData() {
  readLocal()
  readCloud()
  
  function readLocal() {
    return new Promise((ful) => {
      let res = localStorage.getItem('data');
      let data = JSON.parse(res)
      renderData(data)
      ful(true)
    })
  }

  function readCloud() {
    return new Promise((ful) => {
      fetch('https://lavender-luck-smelt.glitch.me/data')
        .then(response => response.json())
        .then(data => renderData(data))
      ful(true)
    })
  }
}


function renderData(obj) {
  document.querySelector('#imageOutput').src = obj.image
  document.querySelector('#titleOutput').textContent = obj.title.toUpperCase()
  let price = parseInt(obj.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.').slice(0, -3)
  document.querySelector('#priceOutput').textContent = "Rp" + price
  let desc = obj.description.replace(new RegExp('\n','g'), '<br />')
  document.querySelector('#descriptionOutput').innerHTML = desc
  let num = obj.whatsapp.toString()
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

function syncData() {
  document.querySelector("#imageInput").onchange = () => {
    let elm = document.querySelector('#imageInput')
    document.querySelector('#imageOutput').src = elm.value
  }
  
  document.querySelector("#titleInput").onchange = () => {
    let elm = document.querySelector('#titleInput')
    document.querySelector('#titleOutput').textContent = elm.value.toUpperCase()
  }
  
  document.querySelector("#priceInput").onchange = () => {
    let elm = document.querySelector('#priceInput')
    let price = parseInt(elm.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.').slice(0, -3)
    document.querySelector('#priceOutput').textContent = "Rp" + price
  }
  
  document.querySelector("#descriptionInput").onchange = () => {
    let elm = document.querySelector('#descriptionInput')
    let desc = elm.value.replace(new RegExp('\n','g'), '<br />')
    document.querySelector('#descriptionOutput').innerHTML = desc
  }
  
  document.querySelector("#whatsappInput").onchange = () => {
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
}

function buttonReady() {
  document.querySelector("#whatsappOutput").onclick = () => {
    changeButtonColor()
    .then(sendWhatsapp)

    function changeButtonColor() {
      return new Promise((ful) => {
        document.querySelector("#whatsappOutput").className = "btn btn-light btn-lg btn-block mb-3";
        ful(true)
      })
    }

    function sendWhatsapp(val) {
      if (val === true) {
        return new Promise((ful) => {
          setTimeout(() => {
            document.querySelector("#whatsappOutput").className = "btn btn-success btn-lg btn-block mb-3";
            let waNum = document.querySelector('#whatsappOutput').value
            let urlChat = `https://api.whatsapp.com/send/?phone=${waNum}&text=saya+tertarik+dengan+penawaran+anda`
            window.open(urlChat, "_blank")
            ful(true)
          }, 200)
        })
      }
    }
  }
  
  document.querySelector("#updateInput").onclick = () => {
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
      return new Promise((ful) => {
        document.querySelector("#updateInput").className = "btn btn-light btn-lg btn-block mb-3";
        ful(true)
      })
    }

    function sendDatabase(val) {
      if (val === true) {
        return new Promise((ful) => {
          setTimeout(() => {
            document.querySelector("#updateInput").className = "btn btn-warning btn-lg btn-block mb-3";
            localStorage.setItem('data', JSON.stringify(data))
            socket.send(JSON.stringify({ data: data }))
            ful(true)
          }, 200)
        })
      }
    }
  }
}

function devButton() {
  let elm = document.querySelector('#devOutput')
  elm.addEventListener('click', () => {
    if (document.querySelector('#dinaweb').className === "col-sm-6 d-none") {
      document.querySelector('#dinaweb').className = "col-sm-6 d-block"
    } else {
      document.querySelector('#dinaweb').className = "col-sm-6 d-none"
    }
  })
}
