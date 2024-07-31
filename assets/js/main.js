const URLcards = "https://raw.githubusercontent.com/raulpenaguiao/towns_in_switzerland_locator/main/assets/cards/cards.xml";
const HTMLPreviousScores = document.getElementById("previousScores");
const HTMLmapPicture = document.getElementById("mapPicture");
const HTMLtargetPicture = document.getElementById("targetPicture");
const HTMLredDotPicture = document.getElementById("redDotPicture");
const HTMLdisplayCoordinatesN = document.getElementById("displayCoordinateN");
const HTMLdisplayCoordinatesE = document.getElementById("displayCoordinateE");
const HTMLdisplayCoordinates = document.getElementById("coordinateDisplay");
const HTMLconfirmChoiceButton = document.getElementById("btnConfirmChoice");
const HTMLnextTownButton = document.getElementById("btnNextTown");
const HTMLtownDisplay = document.getElementById("townDisplay");

const halfPicture = 15;
const halfRedDotPicture = 5;

var globalVariables = {};

// #region City display
//display of a city in lower banner
function cityInfoStringify(city) {
    return city.name + " - Population: " + city.population + " - Canton:" + city.canton + " - N: " + city.NCoordinates + "° E: " + city.ECoordinates + "°";
}

//display of a city in the upper banner
function cityPromptStringify(city) {
    return city.name;
}
// #endregion
// #region target display
//Display target picture when user clicks on map
function ListifyHTMLCollection(HTMLCollectionInstance){
    var ans = [];
    for(let i = 0; i < HTMLCollectionInstance.length; i++) ans.push(HTMLCollectionInstance[i]);
    return ans;
}



function displayTargetAndCoordinates(event) {
    //const showOnClickClass = document.getElementsByClassName("showOnClick");
    HTMLtargetPicture.classList.remove("hiddenElement");
    HTMLconfirmChoiceButton.classList.remove("hiddenElement");
    HTMLdisplayCoordinates.classList.remove("hiddenElement");
    HTMLtargetPicture.style.left = (event.x - halfPicture) + "px";
    HTMLtargetPicture.style.top = (event.y - halfPicture) + "px";
    globalVariables.chosenCoordinates = FromCoordsToLatLong(event.x, event.y);
    HTMLdisplayCoordinatesN.innerHTML = globalVariables.chosenCoordinates.NCoordinates.toFixed(2); 
    HTMLdisplayCoordinatesE.innerHTML = globalVariables.chosenCoordinates.ECoordinates.toFixed(2);
}


HTMLmapPicture.addEventListener("click", displayTargetAndCoordinates)
HTMLtargetPicture.addEventListener("click", displayTargetAndCoordinates)

window.addEventListener('scroll', function(event) {
    HTMLtargetPicture.classList.add("hiddenElement");
}, true);
window.addEventListener('resize', function(event) {
    HTMLtargetPicture.classList.add("hiddenElement");
}, true);

// #endregion
// #region coordinates latitude longitude conversion
function FromCoordsToLatLong(x, y) {
    var boundRect = HTMLmapPicture.getBoundingClientRect();
    
    var x0 = parseFloat(boundRect.left);
    var x1 = parseFloat(boundRect.right);
    var y0 = parseFloat(boundRect.bottom);
    var y1 = parseFloat(boundRect.top);
    const X0 = 5.837997;
    const X1 = 10.698235;
    const Y0 = 45.774633;
    const Y1 = 47.894986;

    return ans = {ECoordinates: (x - x0)*(X1 - X0)/(x1 - x0) + X0 , NCoordinates:(y - y0)*(Y1 - Y0)/(y1 - y0) + Y0};
}
function FromLatLongToCoords(x, y) {
    var boundRect = HTMLmapPicture.getBoundingClientRect();
    
    var x0 = parseFloat(boundRect.left);
    var x1 = parseFloat(boundRect.right);
    var y0 = parseFloat(boundRect.bottom);
    var y1 = parseFloat(boundRect.top);
    const X0 = 5.837997;
    const X1 = 10.698235;
    const Y0 = 45.774633;
    const Y1 = 47.894986;

    return ans = {x: (x - X0)*(x1 - x0)/(X1 - X0) + x0 , y:(y - Y0)*(y1 - y0)/(Y1 - Y0) + y0};
}
// #endregion
// #region Distance function
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}
// Example usage:
//const lat1 = 51.5074; // Latitude of London
//const lon1 = -0.1278; // Longitude of London
//const lat2 = 40.7128; // Latitude of New York City
//const lon2 = -74.0060; // Longitude of New York City
//const distance = haversineDistance(lat1, lon1, lat2, lon2).toFixed(2);
// #endregion
// #region Buttons behaviour
function ConfirmChoiceButton(){
    //Reveal the town chosen
    var coordsCity = FromLatLongToCoords(globalVariables.currentCity.NCoordinates, globalVariables.currentCity.ECoordinates);
    console.log(coordsCity);
    HTMLredDotPicture.style.left = coordsCity.x - halfRedDotPicture + "px";
    HTMLredDotPicture.style.top = coordsCity.y - halfRedDotPicture + "px";

    //Compute and display the distance
    var targetBoundingRect = HTMLtargetPicture.getBoundingClientRect();
    var latLonTarget = FromCoordsToLatLong((targetBoundingRect.top + targetBoundingRect.bottom)/2, (targetBoundingRect.left + targetBoundingRect.right)/2);
    var distance = haversineDistance(globalVariables.currentCity.NCoordinates, globalVariables.currentCity.ECoordinates, latLonTarget.NCoordinates, latLonTarget.ECoordinates);
    //Hide confirm choice button
    HTMLconfirmChoiceButton.classList.add("hiddenElement");

    //Dock previous town in the banner
    HTMLPreviousScores.innerHTML += NewTownBanner(globalVariables.city, distance);
}

function NewTownBanner(city, distance){
    return '<div class"banner">' + cityInfoStringify(city) + " at distance " + distance.toFixed(2) + " km " + '</div>'
}


function NextTownButton(){
    HTMLtargetPicture.classList.add("hiddenElement");//Clean target from view
    HTMLconfirmChoiceButton.classList.add("hiddenElement");//Clean confirm button from view
    HTMLdisplayCoordinates.classList.add("hiddenElement");//Clean guessed coordinates from view
    HTMLredDotPicture.classList.add("hiddenElement");//Clean red dot from view

    //Generate and reveal name of new town
    GenerateAndRevealTown();
}
HTMLconfirmChoiceButton.addEventListener("click", ConfirmChoiceButton)
HTMLnextTownButton.addEventListener("click", NextTownButton)
// #endregion
// #region generate town data 
// Function to extract city data from XML
function extractCityData(xml) {
    const cityList = [];
    console.log(xml);
    const citiesDataset = xml.querySelector('dataset[name="Cities"]');
    console.log(citiesDataset);
    
    if (citiesDataset) {
        const cityTable = citiesDataset.querySelector('table[name="City"]');
        
        if (cityTable) {
            const rows = cityTable.querySelectorAll('row');
            
            rows.forEach(row => {
                const name = row.querySelector('Name').textContent;
                const population = row.querySelector('Population').textContent;
                const canton = row.querySelector('Canton').textContent;
                const nCoordinates = row.querySelector('NCoordinates').textContent;
                const eCoordinates = row.querySelector('ECoordinates').textContent;
                
                const city = {
                    Name: name,
                    Population: population,
                    Canton: canton,
                    NCoordinates: nCoordinates,
                    ECoordinates: eCoordinates
                };
                
                cityList.push(city);
            });
        }
    }
    return cityList;
}

function getXmlData(path) {
}

function GenerateCityData(){
    globalVariables.cityData = [{name:"Zurich", population:402762, canton:"Zurich", NCoordinates:47.38, ECoordinates:8.54}]
    //globalVariables.cityData = extractCityData(getXmlData(URLcards))
    
    //sort generated cities
    globalVariables.cityData.sort((city1, city2) => city2.population - city1.population);//sorts in descending order

    //log data
    globalVariables.cityData.forEach(element => {console.log(element);});
}

//#endregion
// #region Generate and reveal town
function GenerateRandomNumber(max){
    return Math.floor(Math.random() * max);
}

function GenerateAndRevealTown(){
    var numberGenerated = GenerateRandomNumber(globalVariables.Limit);
    var city = globalVariables.cityData[numberGenerated];
    HTMLtownDisplay.innerHTML = cityPromptStringify(city);
}
// #endregion
// #region load page
function LoadEvents(){
    GenerateCityData();
    globalVariables.Limit = Math.min(20, globalVariables.cityData.length);
    GenerateAndRevealTown();
}

window.addEventListener("load", LoadEvents);
// #endregion