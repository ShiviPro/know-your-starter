import * as pokeData from "../data/pokedata";
const pokeInput = document.querySelector("#pokemon__name");

const pokeOutput = document.querySelector("#poke__info");

const url = "https://pokeapi.co/api/v2/pokemon";

const pokeImg = document.querySelector("#pokemon__img");

var pokemonDetails;

function processPokeIndex(jsonOutput) {
  pokemonDetails = jsonOutput;

  console.log(pokemonDetails);
  let pokemonIndex = pokemonDetails.id;

  const imgPath =
    "./node_modules/pokemon-sprites/sprites/pokemon/other/official-artwork/" +
    pokemonIndex +
    ".png";

  pokeImg.setAttribute("src", imgPath);
}

function handleAPIErrors(error) {
  pokeImg.setAttribute("alt", "Image not found");
}

const getPokeIndex = function (e) {
  if (e.which === 13) {
    pokeImg.setAttribute("src", "");
    fetch(url + "/" + pokeInput.value.toLowerCase())
      .then((output) => output.json())
      .then(processPokeIndex)
      .catch(handleAPIErrors);
  }
};

console.log(pokeData);

pokeInput.addEventListener("keydown", getPokeIndex);
