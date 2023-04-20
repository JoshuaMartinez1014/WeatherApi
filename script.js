let cardRow = $(".card-container");
let cardHtml = `<div class="card">
<div class="card-body">
  <h3>Date</h3>
  <br />

  <img src="..." class="card-img-top" alt="..." />
  <br /><br />
 <p class="card-info">Temp: 1213</p>
 <p class="card-info">Wind: 201</p>
 <p class="card-info">Humidity: 121</p>
</div>
</div>`;

for (let i = 0; i < 5; i++) {
  cardRow.append(cardHtml);
}

const apiKey = `5f8c381463b3754d012a2bbf8cd38e60`;
let lat;
let lon;
let city = "chicago";

async function searchByCity() {
  const url1 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}
`;

  try {
    const response = await fetch(url1);
    const data = await response.json();
    lat = data.city.coord.lat;
    lon = data.city.coord.lon;
    console.log(data);
    return {
      lat,
      lon,
    };
  } catch {
    console.log("error");
  }
}

async function searchByLatLon(lat, lon) {
  console.log(lat);
  console.log(lon);
  const url2 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await fetch(url2);
    const data = await response.json();
    console.log(data);
  } catch {
    console.log("error");
  }
}

async function app() {
  const { lat, lon } = await searchByCity();
  searchByLatLon(lat, lon);
}

app();

let dog = {
  name: "Dizzy",
  breed: "Ugly",
};

let { name, breed } = dog;
