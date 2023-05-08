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
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  });
}
  
function thruHospitals(list) {
  console.log('fired hospitals list');
  const range = [...Array(15).keys()];
  const newArray = range.map((item, index) => {
    const idx = getRandomInclusive(0, list.length - 1);
    return list[idx]
  });
  return newArray;
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
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
   const {coordinates} = item.geocoded_column_1;

   L.marker([coordinates[1], coordinates[0]]).addTo(carto)
  });
}

async function getData() {
  const url = 'https://data.princegeorgescountymd.gov/api/views/4juk-b4qs/rows.json';
  const data = await fetch(url);
  const json = await data.json();
  const reply = json.filter((item) => Boolean(item.clearance_code_inc_type)).filter((item) => Boolean(item.clearance_code_inc_type));
  return reply;
}
  
async function mainEvent() { // the async keyword means we can make API requests
  const carto = initMap();
  const form = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const submit = document.querySelector('#get-resto');
  submit.style.display = 'inline-block';

    


  let currentList = [];

  submit.addEventListener('click', async () => {
    form.dispatchEvent(new Event('submit'));
  });
  
  
  form.addEventListener('input', (event) => { // async has to be declared on every function that needs to "await" something
    const filteredList = filterList(currentList, event.target.value);
    injectHTML(filteredList);
    markerPlace(filteredList, carto);
  });

  form.addEventListener('submit', async (submitEvent) => { 
    submitEvent.preventDefault();
    const data = await getData();
    const hospitalNames = data.map((item) => ({ name: item.facility_name}));
    currentList = thruHospitals(hospitalNames).slice(0,10);
    injectHTML(currentList);
    markerPlace(currentList, carto);

    const results = await fetch(
      "https://data.princegeorgescountymd.gov/api/views/4juk-b4qs/rows.json"
    );
  });
}
  
document.addEventListener('DOMContentLoaded', async function() {
  await mainEvent();
}); 
