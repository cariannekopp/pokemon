import { getPokemonDataByName, getPokemonDataById, getPokemonSpecies, getEvolutionChain } from './getMethods.js'

const pokemonSearchBox = document.querySelector('.pokemon-search')
const triggerButton = document.querySelector('.trigger-button')
const randomPokemonSearchButton = document.getElementById('yellowBox1')
const backOnePokemonButton = document.getElementById('barbutton2')
const forwardOnePokemonButton = document.getElementById('barbutton1')
const evolutionsButton = document.getElementById('evolutions-button')
const abilitiesButton = document.getElementById('abilities-button')
const changeSpriteImgButton = document.getElementById('buttonbottomPicture')


triggerButton.addEventListener('click', () => getPokemonNameToSearch(pokemonSearchBox.value))
triggerButton.addEventListener('click', () => setPokemonData(pokemon), false)
randomPokemonSearchButton.addEventListener('click', () => displayRandomPokemon())
backOnePokemonButton.addEventListener('click', () => displayOnePokemonBack())
forwardOnePokemonButton.addEventListener('click', () => displayOnePokemonForward())
evolutionsButton.addEventListener('click', () => setPokemonEvolutionData())
abilitiesButton.addEventListener('click', () => setAbilitiesData())
changeSpriteImgButton.addEventListener('click', () => changeSpriteImage())


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

async function setPokemonData(pokemon) {
  const pokemonData = await getPokemonDataByName(pokemon)
  document.getElementById('stats-data').removeAttribute('hidden', "")
  document.getElementById('evolutions-data').setAttribute('hidden', "")
  document.getElementById('abilities-data').setAttribute('hidden', "")
  displayPokemonIdNumber(pokemonData)
  displaySprites(pokemon, pokemonData.sprites)
  displayPokemonName(pokemon);
  displayType(pokemonData.types)
  // TODO: displayHeight
  displayHeight(pokemonData.height);
  displayWeight(pokemonData.weight)
  displayGenus(pokemonData)
  displayFlavorText(pokemonData)
}

async function displayPokemonIdNumber(pokemonResponseData) {
  const pokemonIdNumber = pokemonResponseData.id;
  if(pokemonIdNumber > 999) {
    document.getElementById('pokemon-id-number').style.fontSize='x-large';
    document.getElementById('pokemon-id-number').style.marginTop='-3px';
  } else {
    document.getElementById('pokemon-id-number').style.fontSize='xx-large';
    document.getElementById('pokemon-id-number').style.marginTop='-10px';
  }
  document.getElementById('pokemon-id-number').textContent = pokemonIdNumber;
}

async function displaySprites(pokemon, sprites) {
  document.getElementById('display-picture').src = sprites.front_default
  document.getElementById('display-picture').alt = pokemon;

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

async function displayPokemonName(pokemon) {
  const pokemonName = await capitalizeFirstLetter(pokemon);
  document.getElementById('stats-data').childNodes[2].textContent = "  " + pokemonName;
}

function capitalizeFirstLetter(str) {
  const pokemonName = str.charAt(0).toUpperCase() + str.slice(1);
  return pokemonName
}

async function displayType(types) {
  const pokemonType = capitalizeFirstLetter(types[0].type.name);
  document.getElementById('stats-data').childNodes[6].textContent = "  " + pokemonType;
}

async function displayHeight(height) {
  const pokemonHeight = height;
  document.getElementById('stats-data').childNodes[10].textContent = "  " + pokemonHeight;
}

async function displayWeight(weight) {
  const pokemonWeight = weight;
  document.getElementById('stats-data').childNodes[14].textContent = "  " + pokemonWeight;
}

async function displayGenus(pokemonResponseData) {
  const pokemonSpeciesData = await getPokemonSpecies(pokemonResponseData)
  const pokemonGenera = pokemonSpeciesData.genera;
  for(let i = 0; i <= pokemonGenera.length - 1; i++) {
    if(pokemonGenera[i].language.name === "en") {
      const pokemonGenus = pokemonGenera[i].genus;
      document.getElementById('stats-data').childNodes[18].textContent = "The " + pokemonGenus
    } 
  }
}

async function displayFlavorText(pokemonResponseData) {
  const pokemonSpeciesData = await getPokemonSpecies(pokemonResponseData)
  const flavorTexts = pokemonSpeciesData.flavor_text_entries;
  let flavorTextStrings = []
  for(let i = 0; i <= flavorTexts.length - 1; i++) {
    if(flavorTexts[i].language.name === "en") {
      flavorTextStrings.push(flavorTexts[i].flavor_text)
    }
  }
  const randomFlavorText = flavorTextStrings[Math.floor(Math.random()*flavorTextStrings.length)];
  document.getElementById('stats-data').childNodes[20].textContent = randomFlavorText
}

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
  setPokemonData(randomPokemon.name)
}

async function displayOnePokemonBack() {
  const currentPokemonId = document.getElementById('pokemon-id-number').textContent
  let onePokemonBackId = Number(currentPokemonId) - 1
  if(onePokemonBackId === 0) {onePokemonBackId = 1}
  const pokemonData = await getPokemonDataById(onePokemonBackId)
  await setPokemonData(pokemonData.name);
}

async function displayOnePokemonForward() {
  const currentPokemonId = document.getElementById('pokemon-id-number').textContent
  let onePokemonForwardId = Number(currentPokemonId) + 1
  if(onePokemonForwardId === 1303) {onePokemonForwardId = 1302}
  const pokemonData = await getPokemonDataById(onePokemonForwardId)
  await setPokemonData(pokemonData.name);
}

async function setPokemonEvolutionData() {
  document.getElementById('stats-data').setAttribute('hidden', "")
  document.getElementById('abilities-data').setAttribute('hidden', "")
  document.getElementById('evolutions-data').removeAttribute('hidden', "")
  const pokemonIdNumber = document.getElementById('pokemon-id-number').textContent;
  const pokemonData = await getPokemonDataById(pokemonIdNumber)
  const pokemonSpeciesData = await getPokemonSpecies(pokemonData)
  displayEvolvesFrom(pokemonSpeciesData);
  displayEvolvesInto(pokemonSpeciesData);
  displayEvolutionTrigger(pokemonSpeciesData);
  displayGrowthRate(pokemonSpeciesData);
}

async function displayEvolvesFrom(pokemonSpeciesData) {
  if (pokemonSpeciesData.evolves_from_species === null) {
    document.getElementById('evolutions-data').childNodes[2].textContent = "  No prior evolution"
  } else {
    let evolvesFrom = pokemonSpeciesData.evolves_from_species.name;
    evolvesFrom = capitalizeFirstLetter(evolvesFrom);
    document.getElementById('evolutions-data').childNodes[2].textContent = "  " + evolvesFrom;
  }
}

async function displayEvolvesInto(pokemonSpeciesData) {
  const evolutionChainUrl = pokemonSpeciesData.evolution_chain.url
  const evolutionChain = await getEvolutionChain(evolutionChainUrl)
  let nextEvolution = evolutionChain.chain.evolves_to[0].species.name
  nextEvolution = capitalizeFirstLetter(nextEvolution)
  if (evolutionChain.chain.evolves_to[0].length === 0) {
    document.getElementById('evolutions-data').childNodes[6].textContent = "  No further evolutions";
  } else {
    document.getElementById('evolutions-data').childNodes[6].textContent = "  " + nextEvolution;
  }
}

async function displayEvolutionTrigger(pokemonSpeciesData) {
  const evolutionChainUrl = pokemonSpeciesData.evolution_chain.url
  const evolutionChain = await getEvolutionChain(evolutionChainUrl)

  const evolutionTrigger = evolutionChain.chain.evolves_to[0].evolution_details[0].trigger.name;
  document.getElementById('evolutions-data').childNodes[10].textContent = "  " + evolutionTrigger
}

async function displayGrowthRate(pokemonSpeciesData) {
  const growthRate = pokemonSpeciesData.growth_rate.name
  document.getElementById('evolutions-data').childNodes[14].textContent = "  " + growthRate
}

async function setAbilitiesData() {
  document.getElementById('stats-data').setAttribute('hidden', "")
  document.getElementById('evolutions-data').setAttribute('hidden', "")
  document.getElementById('abilities-data').removeAttribute('hidden', "")

}


async function displayAbilities(abilities) {
  for(let i = 0; i <= abilities.length - 1; i++) {
    let li = document.createElement('li')
    li.textContent = abilities[i].ability.name;
    document.getElementById('abilities-list').appendChild(li)
  }
}

async function displayForms(forms) {
  for(let i = 0; i <= forms.length - 1; i++) {
    let li = document.createElement('li')
    li.textContent = forms[i].name;
    document.getElementById('forms-list').appendChild(li)
  }
}

async function displayMoves(moves) {
  for(let i = 0; i <= moves.length - 1; i++) {
    let li = document.createElement('li')
    li.textContent = moves[i].move.name;
    document.getElementById('moves-list').appendChild(li)
  }
}


