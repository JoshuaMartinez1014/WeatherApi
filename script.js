const apiKey = `5e920e99b4b73b6a9c717fee4cbe47f8
`;
let lat;
let lon;

let now = dayjs();
let today = dayjs().format("MM/DD/YYYY");
let tomorrow = now.add(1, "day");

let storageParse;
let btnCol;
let btn;

function pullStorage() {
  storageParse = JSON.parse(localStorage.getItem("previousSearch"));
}

function checkStorage(cityName) {
  if (storageParse == null) {
    storageParse = [];
  }
  if (!storageParse.includes(cityName)) {
    console.log(storageParse);
    console.log("push into storage");
    storageParse.unshift(cityName);
    if (storageParse.length > 5) {
      storageParse.pop();
    }
    localStorage.setItem("previousSearch", JSON.stringify(storageParse));
  }
}
function storage(cityName) {
  pullStorage();
  checkStorage(cityName);
  createBtns();
}

function createBtns(e) {
  btnCol = $(".sidebar-bottom");
  $(btnCol).empty();
  console.log(storageParse);
  for (let i = 0; i < storageParse.length; i++) {
    //prettier-ignore
    btn = $(`<button class="previousBtns" id="previousBtns${i}">${storageParse[i].toLowerCase()}</button>`);

    if (i % 2 === 0) {
      btn.css("background-color", "lightgrey");
    }

    btn.on("click", function (event) {
      const cityName = $(this).text();
      searchByCity(cityName);
    });

    btnCol.append(btn);
  }
}
pullStorage();

if (!(storageParse == null)) {
  createBtns();
}
async function searchByCity(cityName) {
  const url1 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
  try {
    const response = await fetch(url1);
    const data = await response.json();

    lat = data.city.coord.lat;
    lon = data.city.coord.lon;
    console.log(data);

    searchByLatLon(lat, lon, cityName);
    storage(cityName);
  } catch (error) {
    console.log("error");
    console.log(error);
  }
}

async function searchByLatLon(lat, lon, cityName) {
  console.log(lat);
  console.log(lon);
  const url2 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await fetch(url2);
    const data = await response.json();
    console.log(data);
    createCards(data);
    mainForecast(data, cityName);
  } catch (error) {
    console.log(error);
  }
}

function mainForecast(data, cityName) {
  $(".section-top").empty();
  let temp = (((data.daily[0].temp.day - 273.15) * 9) / 5 + 32).toFixed(2);

  let forecastCard = $(".section-top");
  let forecastHtml = `
  <div class="card-body" id="main-forecast">
  <h2 class="forcast-header">${cityName} (${today})</h2>
  <h3>${now.format("dddd")}</h3>
  <img src="https://openweathermap.org/img/wn/${
    data.daily[0].weather[0].icon
  }@2x.png" alt="..." style="width: 65px"/>
  <br /><br />
  <p class="card-info"><b>Temp:</b>&nbsp&nbsp${temp} F</p>
  <p class="card-info"><b>Wind:</b>&nbsp&nbsp${data.daily[0].wind_speed} MPH</p>
  <p class="card-info"><b>Humidity:</b>&nbsp&nbsp${data.daily[0].humidity} %</p>
  </div>
  `;

  forecastCard.append(forecastHtml);
}

function createCards(data) {
  $(".card-container").empty();
  for (let i = 1; i < 6; i++) {
    let temp = (((data.daily[i].temp.day - 273.15) * 9) / 5 + 32).toFixed(2);
    let cardDate = now.add(i, "day");

    /* console.log(data); */
    let cardRow = $(".card-container");
    let cardHtml = `<div class="card">

    <div class="card-body">
    <h3>${cardDate.format("dddd")}</h3>
    <h3>${cardDate.format("MM/DD/YYYY")}</h3>
  <br />
  <img src="https://openweathermap.org/img/wn/${
    data.daily[i].weather[0].icon
  }@2x.png" class="card-img-top" alt="..." style="width: 65px"/>
  <br />
  <p class="card-info"><b>Temp:</b>&nbsp&nbsp${temp} F</p>
  <p class="card-info"><b>Wind:</b>&nbsp&nbsp${data.daily[i].wind_speed} MPH</p>
  <p class="card-info"><b>Humidity:</b>&nbsp&nbsp${data.daily[i].humidity} %</p>
  </div>
  </div>`;

    cardRow.append(cardHtml);
  }
}

async function weatherForecast() {
  const cityName = $("#searchbar").val();
  searchByCity(cityName);
}

$("#submitBtn").click(weatherForecast);
