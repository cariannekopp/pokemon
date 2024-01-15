import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';


const baseUrl = 'https://pokeapi.co/api/v2/pokemon/'
let pokemon = 'pikachu'

export async function getPokemonDataById(id) {
    const pokemonData = axios.get(baseUrl + id)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function() {
        // console.log('finally this is the response' + response)
      })
      return pokemonData
  }

  export async function getPokemonDataByName(pokemon) {
    const pokemonData = axios.get(baseUrl + pokemon)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error)
        document.getElementById('error-message').textContent = "Invalid Pokemon.  Check your spelling"
      })
      .finally(function() {
        // console.log('finally this is the response' + response)
      })
      return pokemonData
}

export async function getPokemonSpecies(pokemonResponseData) {
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

export async function getEvolutionChain(chainUrl) {
    const evolutionChain = axios.get(chainUrl)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(function() {
        // console.log('finally this is the response' + response)
      })
      return evolutionChain
}

export function getItemImage(itemName) {
    const itemImage = axios.get('https://pokeapi.co/api/v2/item/' + itemName)
    .then(function(response) {
        return response.data.sprites.default;
    })
    .catch(function(err) {
        console.log(err)
    })
    .finally(function() {
        // console.log('finally this is the response' + response)
      })
    return itemImage;
}

async function getBlueButtonImages() {
  const abilitiesImage = getItemImage('fighting-gem')
  // const evolutionsImage = getItemImage('tbd')
  return abilitiesImage;
}
