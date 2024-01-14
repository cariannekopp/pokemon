import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

export default async function getAllPokemon() {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1302')
    .then(function (response) {
      // const responseData = response.results
      console.log(response)
      // return responseData
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(function() {
      // console.log('finally this is the response' + response)
    })
}