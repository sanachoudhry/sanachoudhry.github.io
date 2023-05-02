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
    })
  }
  
  function filterList(list, query) {
    return list.filter((item) => {
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    })
  }
  
  function cutRestaurantList() {
    console.log('fired cut list');
    const range = [...Array(15).keys()];
    return newArray = range.map((item, index) => {
      const idx = getRandomIntInclusive(0, list.length - 1);
      return list[index]
    })
  }

  function initMap() {
    const carto = L.map('map').setView([38.98, -76.93], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carto);
    return carto;
  }

  function markerPlace(array, map) {
    console.log('array for markers', array);
    array.forEach((item) => {
       console.log('markerPlace', item); 
    })
  }
  
  async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    const filterDataButton = document.querySelector('#filter');
    const loadDataButton = document.querySelector('#data_load');
    const generateListButton = document.querySelector('#generate');
    const textField = document.querySelector('#resto')

    const loadAnimation = document.querySelector('#data_load_animation');
    loadAnimation.style.display = 'none';

    const carto = initMap();

    let currentList = [];
  
  
    loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
      console.log('form submission'); // this is substituting for a "breakpoint"
      loadAnimation.style.display = 'inline-block';
    
      const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  
      currentList = await results.json();
      console.table(currentList);
      injectHTML(currentList);
    })
  
    filterDataButton.addEventListener('click', (event) => { 
      console.log('clicked filterButton');
  
      const formData = new FormData(mainForm);
      const formProps = Object.fromEntries(formData);
  
      console.log(formProps);
      const newList = filterList(currentList, formProps.resto);
    
      console.log(newList);
      injectHTML(newList);
    })
  
    generateListButton.addEventListener('click',(event) => {
      console.log('generate new list');
      const restaurantsList = cutRestaurantList(currentList);
      console.log(restaurantsList);
      injectHTML(restaurantsList);
      markerPlace(currentList, carto);
    })
    
    textField.addEventListener('input', (event) => {
        console.log('input', event.target.value);
        const newList = filterList(currentList, formProps.resto);
        console.log(newList);
        injectHTML(newList);
        markerPlace(newList, carto);
    })

      const arrayFromJson = await results.json();
      console.table(arrayFromJson.data); // this is called "dot notation"
     
    };
  
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); 
