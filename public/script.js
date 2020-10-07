//APIs
    /*NASA API*/
const baseImageUrl = 'https://images-api.nasa.gov';
const marsRoverUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/'
// const marsRoverUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol='
const nasaKey = 'm4yeuGBjITcuHoSRECivvXxzhSVNEb0JaeI6nabk';
    /*Le Systeme Soliare API*/
const lssUrl = 'https://api.le-systeme-solaire.net/rest/bodies/';


//CONST VARIABLES
    /*TOP NAV*/
const sun = document.getElementById('sun');
const mercury = document.getElementById('mercury');
const venus = document.getElementById('venus');
const earth = document.getElementById('earth');
const mars = document.getElementById('mars');
const jupiter = document.getElementById('jupiter');
const saturn = document.getElementById('saturn');
const uranus = document.getElementById('uranus');
const neptune = document.getElementById('neptune');

    /*RESULTS CARD*/
const results = document.getElementById('results-table');
const bodyName = document.getElementById('name');
const totalMass = document.getElementById('mass');
const perihelion = document.getElementById('perihelion');
const aphelion = document.getElementById('aphelion');
const listOfMoons = document.getElementById('moons');
const description = document.getElementById('description');
const imageBody = document.getElementById('carousel-inner');
const orbitBorder = document.getElementsByTagName('li');
const newMarsSol = document.getElementById('newMarsSol');

//EVENTLISTENERS
sun.addEventListener('click', fetchResults);
mercury.addEventListener('click', fetchResults);
venus.addEventListener('click', fetchResults);
earth.addEventListener('click', fetchResults);
mars.addEventListener('click', fetchResults);
jupiter.addEventListener('click', fetchResults);
saturn.addEventListener('click', fetchResults);
uranus.addEventListener('click', fetchResults);
neptune.addEventListener('click', fetchResults);
newMarsSol.addEventListener('click', fetchMars);

//CONDITIONAL STYLING
results.style.display = 'none';
newMarsSol.style.display = 'none';


//CLASSES
class Planet{
    constructor(name, mass, perihelion, aphelion, numberOfMoons){
        this.name = name;
        this.perihelion = perihelion;
        this.mass = mass;
        this.aphelion = aphelion;
        this.numberOfMoons = numberOfMoons;
    }
}

class Moon extends Planet{}

//FUNCTIONS
function fetchResults(e){
    e.preventDefault();
    let searchTerm = e.target.innerText;
    url = lssUrl + searchTerm;

    fetch(url)
        .then(result => {return result.json()})
        .then(json => {console.log(json); createPlanet(json)});
}

function getRandomMarsSol(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomRover(){
    let roverArray = ['curiosity', 'spirit', 'opportunity'];
    let randomRover = roverArray[Math.floor(Math.random()*roverArray.length)];
    return randomRover;
}

function fetchMars(){
    let solNumber = getRandomMarsSol(100, 1500);
    let roverName = getRandomRover();
    url = marsRoverUrl + roverName + '/photos?sol=' + solNumber + '&api_key=' + nasaKey;

    fetch(url)
        .then(result => {return result.json()})
        .then(json => {displayRover(json)});
}

function displayRover(json){
    newMarsSol.style.display = '';
    console.log(json);
    while(imageBody.firstChild){
        imageBody.removeChild(imageBody.firstChild)
    }

    //Iterate through the first 30 images returned and create a carousel card for each
    let current = json.photos
    let activeDiv = document.createElement('div');
    let activeImg = document.createElement('img');
    activeDiv.setAttribute('class', 'carousel-item active');
    activeImg.setAttribute('class', 'd-block w-100');
    activeImg.src = current[0].img_src;
    activeDiv.appendChild(activeImg);
    imageBody.appendChild(activeDiv);

    for(let i = 1; i < 30; i++){
        let carouselDiv = document.createElement('div');
        carouselDiv.setAttribute('class', 'carousel-item');
        let carouselImg = document.createElement('img');
        carouselImg.setAttribute('class', 'd-block w-100');
        let carouselCaption = document.createElement('div');
        carouselCaption.setAttribute('class', 'carousel-caption d-none d-md-block');
        let captionText = document.createElement('p');

        let solDate = current[i].sol;

        let cameraName = current[i].camera.full_name;
        let roverName = current[i].rover.name;
        let imageDate = current[i].earth_date;
        captionText.innerText = `Taken on Sol ${solDate} (${imageDate}) from the ${cameraName} onboard the ${roverName} Rover`;
        carouselImg.src = current[i].img_src;
        carouselCaption.appendChild(captionText);
        carouselDiv.appendChild(carouselImg);
        carouselDiv.appendChild(carouselCaption);    
        imageBody.appendChild(carouselDiv);
        }
}

function createPlanet(json){
    if(json.moons === null){
        numberOfMoons = 0;
    }else{
        numberOfMoons = json.moons.length;
    }
    let newPlanet = new Planet(json.englishName, json.mass.massExponent, json.perihelion, json.aphelion, numberOfMoons)
    let planetName = newPlanet.name;
    displayPlanet(newPlanet);
    if(planetName == 'Mars'){
        fetchMars();
    }else{
        getImage(planetName);
    } 
}
  
function displayPlanet(newPlanet){
    //Assign JSON values to HTML elements
    bodyName.innerText = newPlanet.name;
    totalMass.innerText = `10^${newPlanet.mass} kg`;
    aphelion.innerText = newPlanet.aphelion.toLocaleString() + ' km (farthest distance from the Sun)';
    perihelion.innerText = newPlanet.perihelion.toLocaleString() + ' km (closest distance to the Sun)';
    listOfMoons.innerText = newPlanet.numberOfMoons;
    //Change Orbit Color
    orbitBorder[10].style.border = '2px solid #393b3b';
    orbitBorder[11].style.border = '2px solid #393b3b';
    orbitBorder[12].style.border = '2px solid #393b3b';
    orbitBorder[13].style.border = '2px solid #393b3b';
    orbitBorder[14].style.border = '2px solid #393b3b';
    orbitBorder[15].style.border = '2px solid #393b3b';
    orbitBorder[16].style.border = '2px solid #393b3b';
    orbitBorder[17].style.border = '2px solid #393b3b';
    let orbitName = newPlanet.name.toLowerCase();
    let orbit = document.getElementsByClassName(`${orbitName}`);
        if(orbitName != 'sun'){ 
            orbit[0].style.border = '2px solid #cdd4d4';
        } else{
            orbit[0].style.border = 'none';
        }
    results.style.display = '';
    newMarsSol.style.display = 'none';
    
}

function getImage(planetName){
    let searchTerm = planetName;
    url = baseImageUrl + "/search?q=" + searchTerm;

    fetch(url)
        .then(result => {return result.json()})
        .then(json => {console.log(json); displayImage(json)});
}

function displayImage(json){
    //Remove previous results, if they exist
    while(imageBody.firstChild){
        imageBody.removeChild(imageBody.firstChild)
    }

    //Iterate through the first 20 images returned and create a carousel card for each
    let current = json.collection.items;
    let activeDiv = document.createElement('div');
    let activeImg = document.createElement('img');
    activeDiv.setAttribute('class', 'carousel-item active');
    activeImg.setAttribute('class', 'd-block w-100');
    activeImg.src = current[0].links[0].href;
    activeDiv.appendChild(activeImg);
    imageBody.appendChild(activeDiv);

    for(let i = 1; i < 20; i++){
        let carouselDiv = document.createElement('div');
        let carouselImg = document.createElement('img');
        carouselImg.setAttribute('class', 'd-block w-100');
        carouselDiv.setAttribute('class', 'carousel-item');
        carouselImg.src = current[i].links[0].href;    
        carouselDiv.appendChild(carouselImg);
        imageBody.appendChild(carouselDiv);
        }

        
    // let displayImg = document.createElement('img');
    // let current = json.collection.items;
    // displayImg.src = current[4].links[0].href;
    // imageBody.appendChild(displayImg);
}

