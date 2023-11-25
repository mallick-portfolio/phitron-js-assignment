const error = document.getElementById("error");
const drinkItems = document.getElementById("drinksItems");
error.innerHTML = "";

const searchItems = () => {
  const searchInput = document.querySelector(".search-input");
  if (searchInput.value === "") {
    drinkItems.innerHTML = "";
    loader("block");
    setTimeout(() => {
      error.innerHTML = "Please provide your search Item name";
      loader("none");
    }, 5000);
  } else {
    loadData(searchInput.value);
    searchInput.value = "";
  }
};

const loader = (showOrHide) => {
  document.getElementById("loader").style.display = showOrHide;
};

const loadData = (itemName) => {
  error.innerHTML = "";
  loader("block");
  url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${itemName}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      drinkItems.textContent = "";
      if (!data.drinks) {
        loader("block");
        setTimeout(() => {
          error.innerHTML = "Not Found";
          loader("none");
        }, 5000);
      } else {
        loader("block");
        error.innerHTML = "";
        displayDrink(data.drinks);
      }
    });
};

const displayDrink = (items) => {
  drinkItems.textContent = "";
  for (const item of items) {
    const drinkDiv = document.createElement("div");
    drinkDiv.className = "col";
    drinkDiv.innerHTML = `
    <div class="card h-100">
      <img src="${item.strDrinkThumb}" class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">${item.strDrink}</h5>
        <p class="card-text">
          ${item.strInstructions.slice(0, 100)}...
        </p>
      </div>
      <button data-bs-toggle="modal"
        data-bs-target="#drink"  class="btn btn-primary" onclick="details('${
          item.idDrink
        }')">Show Details</button>
    </div>
    `;
    drinkItems.appendChild(drinkDiv);
    loader("none");
  }
};

// Show Single item Details
const details = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => showDetails(data.drinks[0]));
};

const showDetails = (drink) => {
  const drinkDiv = document.getElementById("drink");
  drinkDiv.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-body">
        <div class="card">
        <img src="${drink.strDrinkThumb}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${drink.strAlcoholic}</h5>
          <h3 class="card-title">Category ${drink.strCategory}</h3>
          
          <p class="card-text">${drink.strInstructionsDE}</p>
          
          <p class="card-text">${drink.strInstructionsIT}</p>
          
        </div>
      </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  `;
};

// Enter button event
document.querySelector(".search-input").addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("searchBtn").click();
  }
});
