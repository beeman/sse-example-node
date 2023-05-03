const $ = (id) => document.querySelector(id)
function sendInput(data) {
  return fetch('/input', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
}

let count = 0

const input = $('#input')
const output = $('#output')
const sse = $('#sse')

input.addEventListener('click', () => {
  count++
  sendInput({ time: Date.now(), count }).then((res) => {
    console.log('sendInput res', res)
    $('#output').innerText = JSON.stringify(res, null, 2)
  })
})

const eventSource = new EventSource('/sse')
eventSource.onopen = () => {
  console.log('opened')
}
eventSource.onmessage = (msg) => {
  sse.innerText = JSON.stringify(JSON.parse(msg.data), null, 2)
}
eventSource.onerror = (source, err) => {
  console.log({ source, err })
}
