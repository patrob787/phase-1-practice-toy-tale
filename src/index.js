let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetch("http://localhost:3000/toys")
.then(resp => resp.json())
.then((data) => {
  renderToyCards(data);
});

function renderToyCards (toys){
  toys.forEach((toy) => {
    let numOfLikes = toy.likes;

    const card = document.createElement('div');
    card.classList.add('card')

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const image = document.createElement('img');
    image.src = toy.image;
    image.classList.add('toy-avatar');

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement('button');
    likeBtn.classList.add('like-btn');
    likeBtn.textContent = "Like ❤️"
    likeBtn.id = `${toy.id}`

    likeBtn.addEventListener('click', () => {
      numOfLikes++;
      p.textContent = `${numOfLikes} Likes`

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "Likes": numOfLikes
        })
      })
      .then(resp => resp.json())
      .then(data => console.log(data));
    })

    card.append(h2, image, p, likeBtn);
    let toyCollection = document.querySelector('#toy-collection');
    toyCollection.append(card);
  })  
};


function postToy(toy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(toy)
  })
  .then(resp => resp.json())
  .then(data => renderToyCards([data]));
};

let form = document.querySelector('.add-toy-form');
let inputBoxes = form.querySelectorAll('.input-text');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  let newToy = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  console.log(newToy);

postToy(newToy);

});