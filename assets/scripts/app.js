// const pokeInput = document.querySelector("#pokemon__name");

// const pokeSuggestions = document.querySelector("#poke-suggestions");

// // const pokeOutput = document.querySelector("#poke__info");

// const getPokeIndexUrl = "https://pokeapi.co/api/v2/pokemon";

// // const pokeImg = document.querySelector("#pokemon__img");

// const getAllPokeNamesUrl = "https://pokeapi.co/api/v2/pokemon?limit=1118";

// const imgPath =
//   "./node_modules/pokemon-sprites/sprites/pokemon/other/official-artwork";

// var pokeNameDataJson;

// async function getAllPokemonNames() {
//   const pokeNameData = await fetch(getAllPokeNamesUrl);
//   const pokeDataJson = await pokeNameData.json();
//   pokeNameDataJson = await pokeDataJson.results;
// }

// getAllPokemonNames();

// async function getPokeIndex(pokeName) {
//   const pokeData = await fetch(getPokeIndexUrl + "/" + pokeName);
//   console.log(pokeData);
//   const pokeIndexData = await pokeData.json();
//   console.log(pokeIndexData);
//   const pokeIndex = await pokeIndexData.id;
//   console.log(pokeIndex);
//   return pokeIndex;
// }

// function suggestPokeNames(event) {
//   let pokeNameSuggestions = pokeNameDataJson.filter((pokeName) => {
//     const regEx = new RegExp(`^${pokeInput.value}`, "gi");
//     return pokeName.name.match(regEx);
//   });

//   if (pokeInput.value === "") {
//     pokeNameSuggestions = [];
//     pokeSuggestions.innerHTML = "";
//   }

//   const pokeIndexPromises = pokeNameSuggestions.map(async (pokeName) => {
//     return await getPokeIndex(pokeName.name);
//   });

//   var pokeSuggestionsHTML;

//   Promise.all(pokeIndexPromises).then((pokeIndices) => {
//     console.log("Pokemon's Indices: " + pokeIndices);
//     pokeSuggestionsHTML = pokeIndices.map((pokeIndex) => {
//       return `
//       <div class="poke-suggestion__card">
//         <p><img src="${imgPath}/${pokeIndex}.png" alt="pokemon-img" />${pokeNameSuggestions[pokeIndex].name}</p>
//       </div>
//       `;
//     });
//   });

//   if (pokeNameSuggestions.length > 0) {
//     pokeSuggestions.classList.add("show");
//     pokeSuggestions.innerHTML = pokeSuggestionsHTML;
//   }
// }

// pokeInput.addEventListener("input", suggestPokeNames);

var pokemons_container = document.querySelector("#pokemons-container");

const pokeTypeAccent = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];

// const noOfPokemons = 150;
const pokeIndices = [
  1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653,
  656, 722, 725, 728, 810, 813, 816, 25, 133,
];

const pokeInfoUrl = "https://pokeapi.co/api/v2/pokemon";

const pokeImgUrl =
  "./node_modules/pokemon-sprites/sprites/pokemon/other/official-artwork";

const fetchPokemons = async () => {
  for (let pokeIndex = 0; pokeIndex < pokeIndices.length; pokeIndex++) {
    await getPokeInfo(pokeIndices[pokeIndex]);
  }
};

const getPokeInfo = async (pokeIndex) => {
  const pokeInfo = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + pokeIndex
  );
  const pokeInfoJson = await pokeInfo.json();
  await createPokeTile(pokeInfoJson);
};

const createPokeTile = (pokeInfo) => {
  let pokemonTile = document.createElement("DIV");
  let pokeName =
    pokeInfo.name.charAt(0).toUpperCase() + pokeInfo.name.substring(1);

  let currReturnedTypes = pokeInfo.types.map((type) => type.type.name);

  let pokeType = pokeTypeAccent.find(
    (type) => currReturnedTypes.indexOf(type) > -1
  );

  let accentClass = "bg-" + pokeType;

  pokemonTile.classList.add("poke-tile");
  pokemonTile.classList.add(`${accentClass}`);

  pokemonTile.innerHTML = `
      <div class="poke-image-container">
      <img class="poke-image" src="${pokeImgUrl}/${pokeInfo.id}.png"/>
      </div>
      <div class="poke-info-container">
      <h3 class="poke-index">#${pokeInfo.id.toString().padStart(3, "0")}</h3>
      <h3 class="poke-name">${pokeName}</h3>
      </div>
      `;

  pokemons_container.appendChild(pokemonTile);
  let pokeInfoContainer = document.querySelector(
    ".poke-tile:last-child .poke-info-container"
  );

  for (let type = 0; type < pokeInfo.types.length; type++) {
    pokeInfoContainer.innerHTML += `<h3><span class="poke-type bg-${
      pokeInfo.types[type].type.name
    }-dark col-white">${pokeInfo.types[
      type
    ].type.name.toUpperCase()}</span></h3>`;
  }

  pokemons_container.appendChild(pokemonTile);
};

fetchPokemons();
