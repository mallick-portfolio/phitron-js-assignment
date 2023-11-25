let categoryDiv = document.getElementById("categoryContainer");
let tubeItems = document.getElementById("tubeItems");
let allData;
const loadCategory = async () => {
  await fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then((res) => res.json())
    .then((data) => {
      loadTubeData(data?.data[0]?.category_id);
      displayCategory(data?.data);
    })
    .catch((error) => console.log(error));
};

// display category

const displayCategory = (categories) => {
  for (const item of categories) {
    const catButton = document.createElement("p");
    catButton.innerHTML = `<a class="btn btn-primary" onclick="loadTubeData('${item.category_id}')" href="#">${item.category}</a>`;
    categoryDiv.appendChild(catButton);
  }
};

// load all tube data
const loadTubeData = async (id) => {
  await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      allData = data?.data;
      displayAllTubeData(data?.data);
    });
};

// diplay all items
const displayAllTubeData = (items) => {
  tubeItems.innerHTML = "";
  if (items?.length > 0) {
    for (const item of items) {
      let tubeDiv = document.createElement("div");
      tubeDiv.setAttribute("class", "col-md-4 col my-4");
      tubeDiv.innerHTML = ` <div class="card" >
      <div  class="tube-card">
        <img src="${item?.thumbnail}" class="card-img-top tube-img" alt="..." />
        <div id="time" class="tube-hours bg-primary text-white px-2 ">${convertSecondsToHMS(
          item?.others?.posted_date
        )}</div>
      </div>
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div>
          <h5 class="card-title">${item?.title}</h5>
            <div>
              <span>${item?.authors[0]?.profile_name} </span>
              <span>${
                item?.authors[0]?.verified
                  ? `<img class="verified" src="./verified.png" alt="" />`
                  : ""
              } </span>
            </div>
            <p class="card-text">
           ${item?.others?.views}
          </p>
          </div>
        </div>
      </div>
    </div>`;
      tubeItems.append(tubeDiv);
    }
  } else {
    tubeItems.innerHTML = `<div class="mx-auto d-flex justify-content-center">
      <img src="./404.png" />
    </div>`;
  }
};

const convertSecondsToHMS = (totalSeconds) => {
  if (totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}hours ${minutes}mins ago`;
  } else {
    return "";
  }
};

const sortByViews = (data) => {
  // const viewNumber = Number(views.slice(0, -1));
  const sortedData = data.sort(
    (a, b) => b?.others?.views?.slice(0, -1) - a?.others?.views?.slice(0, -1)
  );
  displayAllTubeData(sortedData);
};

document.getElementById("sort_data").addEventListener("click", () => {
  sortByViews(allData);
});

loadCategory();

console.log("tubeItems", tubeItems);
