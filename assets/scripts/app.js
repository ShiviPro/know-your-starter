const pokeInput = document.querySelector("#pokemon__name");

const pokeSuggestions = document.querySelector("#poke-suggestions");

// const pokeOutput = document.querySelector("#poke__info");

const getPokeIndexUrl = "https://pokeapi.co/api/v2/pokemon";

// const pokeImg = document.querySelector("#pokemon__img");

const getAllPokeNamesUrl = "https://pokeapi.co/api/v2/pokemon?limit=1118";

const imgPath =
  "./node_modules/pokemon-sprites/sprites/pokemon/other/official-artwork";

async function suggestPokeNames(event) {
  const pokeNameData = await fetch(getAllPokeNamesUrl);
  const pokeDataJson = await pokeNameData.json();
  const pokeNameDataJson = await pokeDataJson.results;

  let pokeNameSuggestions = pokeNameDataJson.filter((pokeName) => {
    const regEx = new RegExp(`^${pokeInput.value}`, "gi");
    return pokeName.name.match(regEx);
  });

  if (pokeInput.value === "") {
    pokeNameSuggestions = [];
    pokeSuggestions.innerHTML = "";
  }

  // if (pokeNameSuggestions === []) {
  //   pokeSuggestions.innerHTML = "";
  // }

  const searchSuggestionsHTML = pokeNameSuggestions
    .map((pokeName) => {
      return `
      <div class="poke-suggestion__card">
        <p>${pokeName.name}</p>
      </div>
      `;
    })
    .join();

  if (pokeNameSuggestions.length > 0) {
    pokeSuggestions.classList.add("show");
    pokeSuggestions.innerHTML = searchSuggestionsHTML;
  }
}

pokeInput.addEventListener("input", suggestPokeNames);
