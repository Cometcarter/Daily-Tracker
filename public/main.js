// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down");
// var deletetask = document.querySelector('.delete');
// deletetask.addEventListener('click', function () {
// })

function deleteItem(remove) {
  const task = remove.parentNode.childNodes[1].innerText.trim()
  const priority = remove.parentNode.childNodes[3].innerText.trim()
  //^^target the span//always print the child and parent nodes so you know where to target
  console.log(task, priority, 'task')
  console.log(remove.parentNode)
  fetch('tracklist', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'task': task,
      'priority': priority,
    })
  }).then(function (response) {
    window.location.reload()
  })
}

function deleteItemFromLog(remove) {
  const task = remove.parentNode.parentNode.childNodes[1].innerText.trim()
  const priority = remove.parentNode.parentNode.childNodes[3].innerText.trim()
  //^^target the span//always print the child and parent nodes so you know where to target
  console.log(task, priority, 'task')
  console.log(remove.parentNode)
  fetch('tracklist', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'task': task,
      'priority': priority,
    })
  }).then(function (response) {
    window.location.reload()
  })
}

// Array.from(thumbUp).forEach(function (element) {
//   element.addEventListener('click', function () {
//     const name = this.parentNode.parentNode.childNodes[1].innerText.trim()
//     const msg = this.parentNode.parentNode.childNodes[3].innerText.trim()
//     const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//     console.log(thumbUp)
//     fetch('thumbup', {
//       method: 'put',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'thumbUp': thumbUp
//       })
//     })
//       .then(response => {
//         if (response.ok) return response.json()
//       })
//       .then(data => {
//         console.log(data)
//         window.location.reload(true)
//       })
//   });
// });



