let url = 'wss://lavender-luck-smelt.glitch.me/ws'
let socket = new WebSocket(url);

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
