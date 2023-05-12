function getRandomInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#hosp_list");
  target.innerHTML = "";
  list.forEach((item) => {
    const str = `<li>${item.facility_name}</li>`;
    target.innerHTML += str;
  });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.facility_name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomInclusive(0, list.length - 1);
    return list[index];
  }));
}

function initMap() {
  const carto = L.map("map").setView([38.98, -76.93], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(carto);
  return carto;
}

function markerPlace(array, map) {
  console.log("array for markers", array);

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log("markerPlace", item);
    L.marker(item.latitude, item.longitude).addTo(map);
  });
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const mainForm = document.querySelector(".main_form");
  const generateListButton = document.querySelector("#get-resto");
  const textField = document.querySelector("#resto");

  const loadAnimation = document.querySelector("#data_load_animation");
  //loadAnimation.style.display = "none";
  //generateListButton.classList.add("hidden");

  const carto = initMap();

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);
  
  if (parsedData?.length > 0) {
    generateListButton.classList.remove("hidden");
  }

  let currentList = []; 
  const results = await fetch(
    "https://data.princegeorgescountymd.gov/resource/4juk-b4qs.json"
  );

  const storedList = await results.json();
  localStorage.setItem("storedData", JSON.stringify(storedList));
  parsedData = storedList;

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutRestaurantList(parsedData);
    console.log(currentList);
    injectHTML(currentList);
    markerPlace(currentList, carto);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
    markerPlace(newList, carto);
  });
}

/*
        This adds an event listener that fires our main event only once our page elements have loaded
        The use of the async keyword means we can "await" events before continuing in our scripts
        In this case, we load some data when the form has submitted
      */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests

/* function getRandomInclusive(min, max) {
    newMin = Math.ceil(min);
    newMax = Math.floor(max);
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
  

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.facility_name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}


function selectRandomHospitals(list) {
  console.log('fired selectRandomHospitals');
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const idx = getRandomInclusive(0, list.length - 1);
    return list[idx];
  }));
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

  carto.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log("markerPlace", item);
   L.marker(item.latitude, item.longitude).addTo(carto);
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
  


  /*filterButton.addEventListener('click', (event) => {
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

  
 document.addEventListener("DOMContentLoaded", async () => mainEvent()); */
