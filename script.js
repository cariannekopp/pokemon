import { getAllPokemonData, getPokemonDataByName, getPokemonDataById, getPokemonSpecies, getEvolutionChain } from './getMethods.js'

const pokemonSearchBox = document.querySelector('.pokemon-search')
const triggerButton = document.querySelector('.trigger-button')
const randomPokemonSearchButton = document.getElementById('yellowBox1')
const backOnePokemonButton = document.getElementById('barbutton2')
const forwardOnePokemonButton = document.getElementById('barbutton1')
const evolutionsButton = document.getElementById('evolutions-button')
const abilitiesButton = document.getElementById('abilities-button')
const changeSpriteImgButton = document.getElementById('buttonbottomPicture')
const scrollUpButton = document.getElementById('topcross')
const scrollDownButton = document.getElementById('botcross')
const changePokemonPictureBackgroundColorButton = document.getElementById('bigbluebutton')


triggerButton.addEventListener('click', () => getPokemonNameToSearch(pokemonSearchBox.value))
triggerButton.addEventListener('click', () => displayPokemonBaseStats(pokemon), false)
randomPokemonSearchButton.addEventListener('click', () => displayRandomPokemon())
backOnePokemonButton.addEventListener('click', () => displayOnePokemonBack())
forwardOnePokemonButton.addEventListener('click', () => displayOnePokemonForward())
evolutionsButton.addEventListener('click', () => displayPokemonEvolutionStats())
abilitiesButton.addEventListener('click', () => displayPokemonAbilitiesStats())
changeSpriteImgButton.addEventListener('click', () => changeSpriteImage())
changePokemonPictureBackgroundColorButton.addEventListener('click', () => changePokemonPictureBackgroundColor())


const baseUrl = 'https://pokeapi.co/api/v2/pokemon/'
let pokemon = 'pikachu'

async function getPokemonNameToSearch(pokemonSearchBoxValue) {
  if (pokemonSearchBoxValue.length === 0) {
    pokemon = 'pikachu'
  } else {
    pokemon = pokemonSearchBox.value;
    console.log('pokemon to search: ' + pokemon)
  }
}

async function setStatsScreenSectionToDisplay(screen) {
  const statsScreens = {
    stats: document.getElementById('stats-data'),
    evolutions: document.getElementById('evolutions-data'),
    abilities: document.getElementById('abilities-data')
  }
  for (let key in statsScreens) {
    let view = statsScreens[key]
    if(screen === key.toString()) {
      view.removeAttribute('hidden', "")
    }
    else {
      view.setAttribute('hidden', "")
    }
  }
}

async function displayPokemonBaseStats(pokemon) {
  const pokemonData = await getAllPokemonData(pokemon);
  console.log(pokemonData)
  // TODO: change to enum
  await setStatsScreenSectionToDisplay('stats')
  setPokemonIdNumber(pokemonData.id)
  setSprites(pokemonData.pokemonName, pokemonData.sprites)
  setPokemonName(pokemonData.pokemonName);
  setType(pokemonData.types)
  setHeight(pokemonData.height);
  setWeight(pokemonData.weight);
  setColor(pokemonData.color)
  setGenus(pokemonData.genera);
  setFlavorText(pokemonData.speciesFlavorText)
}

async function displayPokemonEvolutionStats() {
  setStatsScreenSectionToDisplay('evolutions')
  const pokemonIdNumber = document.getElementById('pokemon-id-number').textContent;
  const pokemonData = await getAllPokemonData(Number(pokemonIdNumber));
  document.getElementById('pokemon-name-display').textContent = (pokemonData.pokemonName).toUpperCase() + " EVOLUTION"
  console.log(pokemonData)
  displayEvolvesFrom(pokemonData);
  displayEvolvesInto(pokemonData);
  displayEvolutionTrigger(pokemonData);
  displayGrowthRate(pokemonData);
}

async function displayPokemonAbilitiesStats() {
  setStatsScreenSectionToDisplay('abilities')
  const pokemonIdNumber = document.getElementById('pokemon-id-number').textContent;
  const pokemonData = await getAllPokemonData(Number(pokemonIdNumber));
  document.getElementById('pokemon-name-display').textContent = (pokemonData.pokemonName).toUpperCase() + " ABILITIES"
  setAbilitiesData(pokemonData.abilities)
}

async function setPokemonIdNumber(id) {
  if(id > 999) {
    document.getElementById('pokemon-id-number').style.fontSize='x-large';
    document.getElementById('pokemon-id-number').style.marginTop='-3px';
  } else {
    document.getElementById('pokemon-id-number').style.fontSize='xx-large';
    document.getElementById('pokemon-id-number').style.marginTop='-10px';
  }
  document.getElementById('pokemon-id-number').textContent = id;
}

async function setSprites(pokemonName, sprites) {
  document.getElementById('display-picture').src = sprites.front_default
  document.getElementById('display-picture').alt = pokemonName;

  // TODO: Make image into a gif using more sprites
  // Call pokemon species endpoint to get 'varities' of pokemon that has more sprites
}

async function changeSpriteImage() {
  const pokemonId = Number(document.getElementById('pokemon-id-number').textContent)
  const pokemonData = await getPokemonDataById(pokemonId)
  const sprites = pokemonData.sprites;
  const spriteImages = [sprites.front_default, sprites.back_default]
  if (document.getElementById('display-picture').src === spriteImages[0]) {
    document.getElementById('display-picture').src = spriteImages[1]
  } else {
    document.getElementById('display-picture').src = spriteImages[0]
  }
}

async function setPokemonName(pokemonName) {
  const name = await capitalizeFirstLetter(pokemonName);
  document.getElementById('pokemon-name-display').textContent = name
}

function capitalizeFirstLetter(str) {
  const strCapitalizedFirstLetter = str.charAt(0).toUpperCase() + str.slice(1);
  return strCapitalizedFirstLetter
}

async function setType(types) {
  const pokemonType = capitalizeFirstLetter(types[0].type.name); 
  document.getElementById('stat-type').textContent = "  " + pokemonType
}

async function setHeight(height) {
  document.getElementById('stat-height').textContent = "  " + height
}

async function setWeight(weight) {
  document.getElementById('stat-weight').textContent = "  " + weight
}

async function setColor(color) {
  if(color === undefined) {
    document.getElementById('stat-color').textContent = "  " + 'unspecified'
  } else {
    const colorName = capitalizeFirstLetter(color.name);
    document.getElementById('stat-color').textContent = "  " + colorName
  }
}

async function setGenus(genera) {
  for(let i = 0; i <= genera.length - 1; i++) {
    if(genera[i].language.name === "en") {
      const pokemonGenus = genera[i].genus;
      document.getElementById('description-container').childNodes[1].textContent = "The " + pokemonGenus
    } 
  }
}

async function setFlavorText(flavorText) {
  let flavorTextStrings = []
  for(let i = 0; i <= flavorText.length - 1; i++) {
    if(flavorText[i].language.name === "en") {
      flavorTextStrings.push(flavorText[i].flavor_text)
    }
  }
  const randomFlavorText = flavorTextStrings[Math.floor(Math.random()*flavorTextStrings.length)];
  if(randomFlavorText.length > 135) {console.log('flavor text will overflow')}
  document.getElementById('description-container').childNodes[3].textContent = randomFlavorText
}

// TODO move to getMethods.js
async function getAllPokemonNames() {
  const pokemonNamesAndUrls = axios.get('https://pokeapi.co/api/v2/pokemon/?limit=1302')
  .then(function (response) {
    return response.data.results;
  }).catch(function (error) {
    console.log(error)
  })
  return pokemonNamesAndUrls
}

async function displayRandomPokemon() {
  const allPokemon = await getAllPokemonNames();
  const randomPokemon = await allPokemon[Math.floor(Math.random()*allPokemon.length)];
  await displayPokemonBaseStats(randomPokemon.name)
}

async function changePokemonPictureBackgroundColor() {
  const backgroundColors = ['white', 'rgb(255, 240, 245)', 'rgb(255, 245, 238)', 'rgb(176, 196, 222)', 'rgb(224, 255, 255)']
  const pokemonPictureBackground = document.getElementById('picture')
  const currentBackgroundColor = pokemonPictureBackground.style.backgroundColor;
  let currentBackgroundColorIndex = backgroundColors.indexOf(currentBackgroundColor);
console.log('current color ' + currentBackgroundColor)
console.log('current color index ' + currentBackgroundColorIndex)
  if (currentBackgroundColorIndex === -1) {currentBackgroundColorIndex = 0}
console.log('current color index after null check ' + currentBackgroundColorIndex)
  let newBackgroundColorIndex;
  if (currentBackgroundColorIndex >= backgroundColors.length) {
    newBackgroundColorIndex = 0
  } else {
    newBackgroundColorIndex = currentBackgroundColorIndex + 1
  }
console.log('new color index ' + newBackgroundColorIndex)
  pokemonPictureBackground.style = ""
  pokemonPictureBackground.style.backgroundColor = backgroundColors[newBackgroundColorIndex]
  
}

async function displayOnePokemonBack() {
  const currentPokemonId = document.getElementById('pokemon-id-number').textContent
  let onePokemonBackId = Number(currentPokemonId) - 1
  if(onePokemonBackId === 0) {onePokemonBackId = 1}
  const pokemonData = await getPokemonDataById(onePokemonBackId)
  await displayPokemonBaseStats(pokemonData.name);
}

async function displayOnePokemonForward() {
  const currentPokemonId = document.getElementById('pokemon-id-number').textContent
  let onePokemonForwardId = Number(currentPokemonId) + 1
  if (onePokemonForwardId === 1303) {onePokemonForwardId = 1302}
  const pokemonData = await getPokemonDataById(onePokemonForwardId)
  await displayPokemonBaseStats(pokemonData.name);
}

async function displayEvolvesFrom(pokemonData) {
  if (pokemonData.evolvesFrom === null) {
    document.getElementById('evolve-from').textContent = "  No prior evolution"
  } else {
    let evolvesFrom = pokemonData.evolvesFrom.name;
    evolvesFrom = capitalizeFirstLetter(evolvesFrom);
    document.getElementById('evolve-from').textContent = "  No prior evolution"
  }
}

async function displayEvolvesInto(pokemonData) {
  const evolvesIntoData = pokemonData.evolvesInto;
  let upcomingEvolution;

  if (evolvesIntoData.length === 0) {
    upcomingEvolution = "No further evolutions"
  } else if (pokemonData.pokemonName === evolvesIntoData[0].species.name && evolvesIntoData[0].evolves_to.length === 0) {
    upcomingEvolution = "No further evolutions"
  } else if (pokemonData.pokemonName === evolvesIntoData[0].species.name) {
    upcomingEvolution = evolvesIntoData[0].evolves_to[0].species.name;
    upcomingEvolution = capitalizeFirstLetter(upcomingEvolution)
  } else {
    upcomingEvolution = evolvesIntoData[0].species.name;
    upcomingEvolution = capitalizeFirstLetter(upcomingEvolution)
  }
    document.getElementById('evolve-into').textContent = "  " + upcomingEvolution;
}

async function displayEvolutionTrigger(pokemonData) {
  if (pokemonData.evolvesInto.length === 0) {
    document.getElementById('evolution-trigger').textContent = "  --" 
  } else {
    const evolutionTrigger = pokemonData.evolvesInto[0].evolution_details[0].trigger.name
    document.getElementById('evolve-trigger').textContent = "  " + capitalizeFirstLetter(evolutionTrigger.replace(/-/g, ' '))
  }
}

async function displayGrowthRate(pokemonData) {
  const growthRate = pokemonData.growthRate.name
  document.getElementById('growth-rate').textContent = "  " + capitalizeFirstLetter(growthRate);
}

async function setAbilitiesData(abilities) {
  document.getElementById('abilities-data-container').getElementsByTagName('div')[1].innerHTML = ""
  document.getElementById('abilities-data-container').getElementsByTagName('div')[0].innerHTML = ""
  let abilitiesTextArea;
  let abilitiesList = []
  for(let i = 0; i <= abilities.length - 1; i++) {
    abilitiesList.push(abilities[i].ability.name)
  }
  for(let y = 0; y <= abilitiesList.length - 1; y++) {
    let listItem = document.createElement('li')
    let nameOfAbility = capitalizeFirstLetter(abilitiesList[y].replace(/-/g, ' '))
    listItem.textContent = nameOfAbility
    if(y > 6) {
      abilitiesTextArea = document.getElementById('abilities-data-container').getElementsByTagName('div')[1]
    } else {
      abilitiesTextArea = document.getElementById('abilities-data-container').getElementsByTagName('div')[0]
    }
    abilitiesTextArea.appendChild(listItem)
  }
}
