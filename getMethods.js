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

export async function getAllPokemonData(pokemon) {
    let generalPokemonData;
    if(pokemon === String) {
        generalPokemonData = await getPokemonDataByName(pokemon)
    } else {
        generalPokemonData = await getPokemonDataById(pokemon)
    }
    const speciesData = await getPokemonSpecies(generalPokemonData)
    const evolutionsData = await getEvolutionChain(speciesData.evolution_chain.url)


    const pokemonData = {
        id: generalPokemonData.id,
        pokemonName: generalPokemonData.name,
        height: generalPokemonData.height,
        weight: generalPokemonData.weight,
        abilities: generalPokemonData.abilities,
        forms: generalPokemonData.forms,
        moves: generalPokemonData.moves,
        species: generalPokemonData.species.name,
        speciesUrl: generalPokemonData.species.url,
        sprites: generalPokemonData.sprites,
        types: generalPokemonData.types,
        baseExp: generalPokemonData.base_experience,
        stats: generalPokemonData.stats,
        baseHappiness: speciesData.base_happiness,
        captureRate: speciesData.capture_rate,
        color: speciesData.color,
        eggGroups: speciesData.egg_groups,
        evolutionChainUrl: speciesData.evolution_chain.url,
        evolvesFrom: speciesData.evolves_from_species,
        speciesFlavorText: speciesData.flavor_text_entries,
        formDescriptions: speciesData.form_descriptions,
        formsSwitchable: speciesData.forms_switchable,
        genera: speciesData.genera,
        growthRate: speciesData.growth_rate,
        habitat: speciesData.habitat,
        isLegendary: speciesData.is_legendary,
        isMythical: speciesData.is_mythical,
        shape: speciesData.shape,
        varities: speciesData.varities,
        basePokemonEvolutionFormName: evolutionsData.chain.species.name,
        basePokemonEvolutionFormIsBaby: evolutionsData.chain.is_baby,
        evolvesInto: evolutionsData.chain.evolves_to
    }
    return pokemonData
}
