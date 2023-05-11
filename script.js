function getRandomInclusive(min, max) {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    return Math.floor(Math.random() * (newMax - newMin + 1) + min);
}
  
function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#hosp_list');
  target.innerHTML = '';
  list.forEach((item) =>  {
    const str = `<li>${item.facility_name}</li>`;
    target.innerHTML += str;
  });
}
  
function selectRandomHospitals(list) {
  console.log('fired selectRandomHospitals');
  const range = [...Array(15).keys()];
  const newArray = range.map((item) => {
    const idx = getRandomInclusive(0, list.length - 1);
    return list[idx]
  });
  return newArray;
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.facility_name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function initMap() {
  console.log('initMap');
  const carto = L.map('map').setView([38.98, -76.93], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(carto);
  return carto;
}

function markerPlace(array, carto) {
  const markers =[];
  carto.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      markers.push(layer);
    }
  });
  markers.forEach((marker) => {
   carto.removeLayer(marker);
  });
  array.forEach((item) => {
   const marker = L.marker([item.latitude, item.longitude]).addTo(marker);
   marker.bindPopup(`<b>${item.name}</b><br>${item.address}`);
   const { coordinates } = item.geocoded_column_1;

   L.marker([coordinates[1], coordinates[0]]).addTo(carto)
  });
}

async function getData() {
  const url = 'https://data.princegeorgescountymd.gov/resource/4juk-b4qs.json';
  const data = await fetch(url);
  const json = await data.json();
   const reply = json
       .filter((item) => Boolean(item.facility_name));
   return reply;
}
  
async function mainEvent() { // the async keyword means we can make API requests
  const carto = initMap();
  const submit = document.querySelector('#get-resto');
  const loader = document.querySelector('.lds-ellipsis');
  const filterButton = document.querySelector('#filterButton');

  let currentList = [];
  
  submit.addEventListener('click', async (event) => {
    event.preventDefault();
    loader.classList.remove('lds-ellipsis_hidden');
    const data = await getData();
    const hospitalNames = data.map((item) => ({name: item.facility_name }));
    currentList = selectRandomHospitals(hospitalNames).slice(0,10);
    injectHTML(currentList);
    markerPlace(currentList, carto);
    loader.classList.add('lds-ellipsis_hidden');
  });

  const restoInput = document.querySelector('#resto');
  restoInput.addEventListener('input', (event) => {
    const filteredList = filterList(currentList, event.target.value);
    injectHTML(filteredList);
    markerPlace(filteredList, carto);
  })

  const form = document.querySelector('.main_form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  })
  


  filterButton.addEventListener('click', (event) => {
    event.preventDefault();
    form.dispatchEvent(new Event('submit'));
  });

  submit.style.display = 'inline-block';
  
  
  form.addEventListener('input', (event) => { // async has to be declared on every function that needs to "await" something
    const filteredList = filterList(currentList, event.target.value);
    injectHTML(filteredList);
    markerPlace(filteredList, carto);
  });

  form.addEventListener('submit', async (submitEvent) => { 
    submitEvent.preventDefault();

    const searchInput = document.querySelector('#resto');
    const query = searchInput.value;

    const filteredList = filterList(currentList, query);
    injectHTML(filteredList);
    markerPlace(filteredList, carto);
  });
}
  
document.addEventListener("DOMContentLoaded", async () => mainEvent());
