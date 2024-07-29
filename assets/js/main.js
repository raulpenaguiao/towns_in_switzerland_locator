const URLcards = "https://raw.githubusercontent.com/raulpenaguiao/towns_in_switzerland_locator/main/assets/cards/cards.xml";


// Function to load XML file
function loadXMLDoc(filename, callbackXMLFunction) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callbackXMLFunction(this.responseXML);
        }
    };
    xhttp.open("GET", filename, true);
    xhttp.send();
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


loadXMLDoc(URLcards, function(xml) {
    const cityData = extractCityData(xml);
    console.log(cityData);
});
