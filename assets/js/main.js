const URLcards = "assets/cards/cards.xml";
const HTMLPreviousScores = document.getElementById("previousScores");
const HTMLmapPicture = document.getElementById("mapPicture");
const HTMLtargetPicture = document.getElementById("targetPicture");
const HTMLredDotPicture = document.getElementById("redDotPicture");
const HTMLdisplayCoordinatesN = document.getElementById("displayCoordinateN");
const HTMLdisplayCoordinatesE = document.getElementById("displayCoordinateE");
const HTMLdisplayCoordinates = document.getElementById("coordinateDisplay");
const HTMLconfirmChoiceButton = document.getElementById("btnConfirmChoice");
const HTMLtownDisplay = document.getElementById("townDisplay");

const halfPicture = 15;
const halfRedDotPicture = 5;

var globalVariables = {};

// #region City display
//display of a city in lower banner
function cityInfoStringify(city) {
    return city.name + " - Population: " + city.population + " - Canton: " + city.canton + " - N: " + city.NCoordinates + "° E: " + city.ECoordinates + "°";
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
    if (globalVariables.advancing) return;
    HTMLtargetPicture.classList.remove("hiddenElement");
    HTMLconfirmChoiceButton.classList.remove("hiddenElement");
    HTMLdisplayCoordinates.classList.remove("hiddenElement");
    var mapRect = HTMLmapPicture.getBoundingClientRect();
    HTMLtargetPicture.style.left = (event.x - halfPicture - mapRect.left) + "px";
    HTMLtargetPicture.style.top = (event.y - halfPicture - mapRect.top) + "px";
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
    //console.log("Coords are = ", x, y);
    var x0 = parseFloat(boundRect.left);
    var x1 = parseFloat(boundRect.right);
    var y0 = parseFloat(boundRect.bottom);
    var y1 = parseFloat(boundRect.top);
    //console.log("Coords map picture rectangle edges x0 = ", x0, " x1 = ", x1, " y0 = ", y0, " y1 = ", y1);
    const X0 = 5.837997;
    const X1 = 10.698235;
    const Y0 = 45.774633;
    const Y1 = 47.894986;
    

    var ans = {ECoordinates: (x - x0)*(X1 - X0)/(x1 - x0) + X0 , NCoordinates:(y - y0)*(Y1 - Y0)/(y1 - y0) + Y0};
    //console.log("Lat Long is = ", ans);
    return ans;
}
function FromLatLongToCoords(eCoord, nCoord) {
    var boundRect = HTMLmapPicture.getBoundingClientRect();
    //console.log("Lat Long = ", eCoord, nCoord);
    var x0 = parseFloat(boundRect.left);
    var x1 = parseFloat(boundRect.right);
    var y0 = parseFloat(boundRect.bottom);
    var y1 = parseFloat(boundRect.top);
    //console.log("Coords map picture rectangle edges = ", x0, x1, y0, y1);
    const X0 = 5.837997;
    const X1 = 10.698235;
    const Y0 = 45.774633;
    const Y1 = 47.894986;

    var ans = {x: (eCoord - X0)*(x1 - x0)/(X1 - X0) + x0 , y:(nCoord - Y0)*(y1 - y0)/(Y1 - Y0) + y0};
    //console.log("Coords are = ", ans);
    return ans;
}
// #endregion
// #region Distance function
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function haversineDistance(point1, point2) {
    const lat1 = point1.NCoordinates;
    const lon1 = point1.ECoordinates;
    const lat2 = point2.NCoordinates;
    const lon2 = point2.ECoordinates;

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
    var coordsCity = FromLatLongToCoords(globalVariables.currentCity.ECoordinates, globalVariables.currentCity.NCoordinates);
    //console.log(coordsCity);
    var mapRect = HTMLmapPicture.getBoundingClientRect();
    HTMLredDotPicture.style.left = (coordsCity.x - halfRedDotPicture - mapRect.left) + "px";
    HTMLredDotPicture.style.top = (coordsCity.y - halfRedDotPicture - mapRect.top) + "px";

    //Compute and display the distance
    var targetBoundingRect = HTMLtargetPicture.getBoundingClientRect();
    var targetCoordinates = FromCoordsToLatLong((targetBoundingRect.left + targetBoundingRect.right)/2, (targetBoundingRect.top + targetBoundingRect.bottom)/2);
    var distance = haversineDistance(globalVariables.currentCity, targetCoordinates);
    
    //Hide confirm choice button
    HTMLconfirmChoiceButton.classList.add("hiddenElement");
    HTMLredDotPicture.classList.remove("hiddenElement");

    //Dock previous town in the banner
    var win = distance < 10;
    HTMLPreviousScores.innerHTML = NewTownBanner(globalVariables.currentCity, distance, win) + HTMLPreviousScores.innerHTML;

    if (win) {
        globalVariables.consecutiveWins++;
        if (globalVariables.consecutiveWins >= 10 && !globalVariables.starSixUnlocked) {
            globalVariables.starSixUnlocked = true;
            var s6 = document.getElementById('starSix');
            s6.classList.remove('star-locked');
            s6.style.animation = 'star-unlock 0.6s ease';
            setTimeout(function() { s6.style.animation = ''; }, 600);
        }
    } else {
        globalVariables.consecutiveWins = 0;
    }

    //Advance to next town after a short delay so the red dot is visible
    globalVariables.advancing = true;
    setTimeout(function() {
        globalVariables.advancing = false;
        NextTownButton();
    }, 2000);
}

function NewTownBanner(city, distance, win){
    var distText = distance.toFixed(1) + ' km' + (win ? ' ✓' : '');
    return '<tr class="' + (win ? 'win-row' : '') + '">' +
        '<td>' + city.name + '</td>' +
        '<td class="col-population">' + city.population.toLocaleString() + '</td>' +
        '<td>' + city.canton + '</td>' +
        '<td class="col-coordinates">N ' + city.NCoordinates + '° E ' + city.ECoordinates + '°</td>' +
        '<td class="' + (win ? 'win-cell' : '') + '">' + distText + '</td>' +
        '</tr>';
}

function NextTownButton(){
    HTMLtargetPicture.classList.add("hiddenElement");//Clean target from view
    HTMLconfirmChoiceButton.classList.add("hiddenElement");//Clean confirm button from view
    HTMLdisplayCoordinates.classList.add("hiddenElement");//Clean guessed coordinates from view
    HTMLredDotPicture.classList.add("hiddenElement");//Clean red dot from view

    //Generate and reveal name of new town
    GenerateAndRevealTownName();
}
const DIFFICULTY_LIMITS = [20, 50, 125, 330, 800];

function setDifficulty(level) {
    if (level === 6 && !globalVariables.starSixUnlocked) return;
    globalVariables.difficultyLevel = level;
    globalVariables.Limit = level <= 5
        ? Math.min(DIFFICULTY_LIMITS[level - 1], globalVariables.cityData.length)
        : globalVariables.cityData.length;
    globalVariables.cityPool = [];
    HTMLPreviousScores.innerHTML = '';
    document.querySelectorAll('.star').forEach(function(s) {
        s.classList.toggle('star-active', parseInt(s.dataset.level) <= level);
    });
}

HTMLconfirmChoiceButton.addEventListener("click", ConfirmChoiceButton)
document.querySelectorAll('.star').forEach(function(s) {
    s.addEventListener('click', function() { setDifficulty(parseInt(s.dataset.level)); });
});
// #endregion
// #region generate town data 
// Function to extract city data from XML
function extractCityData(xml) {
    const cityList = [];
    xml.querySelectorAll('Tables > Cities > City').forEach(cityNode => {
        cityList.push({
            name: cityNode.querySelector('Name').textContent,
            population: parseInt(cityNode.querySelector('Population').textContent),
            canton: cityNode.querySelector('Canton').textContent,
            NCoordinates: parseFloat(cityNode.querySelector('NCoordinates').textContent),
            ECoordinates: parseFloat(cityNode.querySelector('ECoordinates').textContent),
        });
    });
    return cityList;
}

async function getXmlData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return new DOMParser().parseFromString(text, 'text/xml');
}

async function GenerateCityData(){
    const xml = await getXmlData(URLcards);
    globalVariables.cityData = extractCityData(xml);

    //sort generated cities
    globalVariables.cityData.sort((city1, city2) => city2.population - city1.population);//sorts in descending order

}

//#endregion
// #region Generate and reveal town name
function buildCityPool(){
    // Fisher-Yates shuffle of indices [0 .. Limit-1]
    var pool = [];
    for (var i = 0; i < globalVariables.Limit; i++) pool.push(i);
    for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    globalVariables.cityPool = pool;
}

function GenerateAndRevealTownName(){
    if (!globalVariables.cityPool || globalVariables.cityPool.length === 0) buildCityPool();
    var index = globalVariables.cityPool.pop();
    var city = globalVariables.cityData[index];
    globalVariables.currentCity = city;
    HTMLtownDisplay.innerHTML = cityPromptStringify(city);
}
// #endregion
// #region load page
async function LoadEvents(){
    await GenerateCityData();
    globalVariables.consecutiveWins = 0;
    globalVariables.starSixUnlocked = false;
    setDifficulty(1);
    GenerateAndRevealTownName();
}

window.addEventListener("load", LoadEvents);
// #endregion