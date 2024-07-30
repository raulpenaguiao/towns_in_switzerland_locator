const URLcards = "https://raw.githubusercontent.com/raulpenaguiao/towns_in_switzerland_locator/main/assets/cards/cards.xml";
const HTMLPreviousScores = document.getElementById("previousScores");

function cityInfoStringify(city) {
    return city.name + " - " + city.population;
}

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


//var cityData = extractCityData(getXmlData(URLcards));
var cityData = [{name:"Zurich", population:402762, canton:"Zurich", nCoordinates:47.38, eCoordinates:8.54}]

cityData.forEach(element => {
    HTMLPreviousScores.innerHTML += '<div class="banner">' + cityInfoStringify(element) + '</div>';
});



//Display target picture when user clicks on map

const HTMLmapPicture = document.getElementById("mapPicture");
const HTMLtargetPicture = document.getElementById("targetPicture");
const HTMLdisplayCoordinatesN = document.getElementById("displayCoordinateN");
const HTMLdisplayCoordinatesE = document.getElementById("displayCoordinateE");
const HTMLdisplayCoordinates = document.getElementById("coordinateDisplay");

const halfPicture = 15;

function displayTargetAndCoordinates(event) {
    const showOnClickClass = document.getElementsByClassName("showOnClick");
    var arrayShowOnClickClass = [];
    for(let i = 0; i < showOnClickClass.length; i++) arrayShowOnClickClass.push(showOnClickClass[i]);
    arrayShowOnClickClass.forEach(element => {
        element.classList.toggle("showOnClick");
    })
    HTMLtargetPicture.style.left = event.x - halfPicture + "px";
    HTMLtargetPicture.style.top = event.y - halfPicture + "px";
    HTMLdisplayCoordinatesN.innerHTML = event.x;
    HTMLdisplayCoordinatesE.innerHTML = event.y;
}

HTMLmapPicture.addEventListener("click", displayTargetAndCoordinates)
HTMLtargetPicture.addEventListener("click", displayTargetAndCoordinates)