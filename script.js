import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const pokemonSearchBox = document.querySelector('.pokemon-search')
const triggerButton = document.querySelector('.trigger-button')
const randomPokemonSearchButton = document.getElementById('yellowBox1')

triggerButton.addEventListener('click', () => getPokemonNameToSearch(pokemonSearchBox.value))
triggerButton.addEventListener('click', () => getResponse(pokemon), false)
randomPokemonSearchButton.addEventListener('click', () => console.log('ive been clicked'))

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

async function getResponse(pokemon) {
    axios.get(baseUrl + pokemon)
      .then(function (response) {
        const responseData = response.data
        displayPokemonIdNumber(responseData)
        displaySprites(pokemon, responseData.sprites)
        displayPokemonName(pokemon);
        displayType(responseData.types)
        // TODO: displayHeight
        displayWeight(responseData.weight)
        displayGenus(responseData)
        displayFlavorText(responseData)
        // TODO: display Genus (need to grab species url, call it, then get genera/genus with language 'en')
        // TODO: displayFlavorText (need to grab species url, call it, then pick random flavor text)
        // displayAbilities(responseData.abilities)
        // displayForms(responseData.forms)
        // displayMoves(responseData.moves)
        // displaySpecies(responseData.species)
        
        // displayStats(responseData.stats)
        // displayTypes(responseData.types)
        
      })
      .catch(function (error) {
        console.log(error)
        document.getElementById('error-message').textContent = "Invalid Pokemon.  Check your spelling"
      })
      .finally(function() {
        // console.log('finally this is the response' + response)
      })
}

async function displayPokemonIdNumber(pokemonResponseData) {
  const pokemonIdNumber = pokemonResponseData.id;
  document.getElementById('pokemon-id-number').textContent = pokemonIdNumber;
}

async function displaySprites(pokemon, sprites) {
  document.getElementById('display-picture').src = sprites.front_default
  document.getElementById('display-picture').alt = pokemon;
  // TODO: Make image into a gif using more sprites
  // Call pokemon species endpoint to get 'varities' of pokemon that has more sprites
}

async function displayPokemonName(pokemon) {
  const pokemonName = await capitalizeFirstLetter(pokemon);
  document.getElementById('stats').childNodes[2].textContent = "  " + pokemonName;
}

function capitalizeFirstLetter(str) {
  const pokemonName = str.charAt(0).toUpperCase() + str.slice(1);
  return pokemonName
}

async function displayType(types) {
  const pokemonType = capitalizeFirstLetter(types[0].type.name);
  document.getElementById('stats').childNodes[6].textContent = "  " + pokemonType;
}

async function displayWeight(weight) {
  const pokemonWeight = weight;
  document.getElementById('stats').childNodes[14].textContent = "  " + pokemonWeight;
}

async function getPokemonSpecies(pokemonResponseData) {
  const pokemonSpeciesEndpoint = pokemonResponseData.species.url;
  const pokemonSpeciesResponseData =
  axios.get(pokemonSpeciesEndpoint)
  .then(response => {
    return response.data
  }).catch(function (error) {
    console.log(error)
  })
  return pokemonSpeciesResponseData
}

async function displayGenus(pokemonResponseData) {
  const pokemonSpeciesData = await getPokemonSpecies(pokemonResponseData)
  const pokemonGenera = pokemonSpeciesData.genera;
  for(let i = 0; i <= pokemonGenera.length - 1; i++) {
    if(pokemonGenera[i].language.name === "en") {
      const pokemonGenus = pokemonGenera[i].genus;
      document.getElementById('stats').childNodes[18].textContent = "The " + pokemonGenus
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
  console.log(document.getElementById('stats').childNodes[20].textContent)
  const randomFlavorText = flavorTextStrings[Math.floor(Math.random()*flavorTextStrings.length)];
  document.getElementById('stats').childNodes[20].textContent = randomFlavorText
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

async function displaySpecies(species) {
  let pokemonSpecies = species.name;
  document.getElementById('pokemon-species').textContent = pokemonSpecies
}

async function displayStats(stats) {
  for(let i = 0; i <= stats.length - 1; i++) {
    let li = document.createElement('li')
    li.textContent = stats[i].stat.name;
    document.getElementById('stats-list').appendChild(li)
    let baseStatLi = document.createElement('ul')
    baseStatLi.textContent = "Base Stat: " + stats[i].base_stat
    li.appendChild(baseStatLi)
    let effortLi = document.createElement('ul')
    effortLi.textContent = "Effort: " + stats[i].effort
    li.appendChild(effortLi)
  }
}
