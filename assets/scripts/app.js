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

const pokeIndices = [
  1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653,
  656, 722, 725, 728, 810, 813, 816, 25, 133,
];

const pokeInfoUrl = "https://pokeapi.co/api/v2/pokemon";

let currGen = 1;
let isNextGen = true;

const pokeImgUrl = "./assets/images/starterMons/";

let loading = document.createElement("div");
loading.classList.add("loading");

const fetchPokemons = async () => {
  for (let pokeIndex = 0; pokeIndex < pokeIndices.length; pokeIndex++) {
    if (currGen <= 8 && pokeIndex % 3 == 0) {
      isNextGen = true;
    } else if (pokeIndex == 24) {
      currGen = 7;
      isNextGen = true;
    }
    pokemons_container.appendChild(loading);
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

  pokemonTile.id = "poke-tile";
  pokemonTile.setAttribute("data-poke-index", `${pokeInfo.id}`);

  if (pokeInfo.id == 133 || pokeInfo.id >= 650) {
    pokemonTile.innerHTML = `
        <div class="poke-image-container" data-poke-index="${pokeInfo.id}">
        <img class="poke-image" src="${pokeImgUrl}${pokeInfo.id}.png"  data-poke-index="${pokeInfo.id}"/>
        </div>`;
  } else {
    pokemonTile.innerHTML = `
        <div class="poke-image-container" data-poke-index="${pokeInfo.id}">
        <svg class="poke-image" data-poke-index="${pokeInfo.id}">
        <use xlink:href="#mon-${pokeInfo.id}-img">
        </svg>
        </div>`;
  }

  pokemonTile.innerHTML += `
      <div class="poke-info-container" data-poke-index="${pokeInfo.id}">
      <h3 class="poke-index" data-poke-index="${pokeInfo.id}">#${pokeInfo.id
    .toString()
    .padStart(3, "0")}</h3>
        <h3 class="poke-name" data-poke-index="${pokeInfo.id}">${pokeName}</h3>
        </div>
        `;

  if (isNextGen) {
    let genInfo = document.createElement("div");
    genInfo.innerHTML = `<span class="gen-info">Generation ${currGen}<span>`;
    pokemons_container.appendChild(genInfo);
    currGen += 1;
    isNextGen = false;
  }

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
  loading.remove();

  pokemons_container.appendChild(pokemonTile);
};

const addFocusOnHoveredPokeTile = () => {
  let allPokeTiles = document.querySelectorAll(".poke-tile");
  for (
    let eachPokeTile = 0;
    eachPokeTile < allPokeTiles.length;
    eachPokeTile++
  ) {
    allPokeTiles[eachPokeTile].addEventListener("mouseover", () => {
      for (
        let remainingTile = 0;
        remainingTile < allPokeTiles.length;
        remainingTile++
      ) {
        if (remainingTile != eachPokeTile) {
          allPokeTiles[remainingTile].classList.add("fadeAway");
        }
      }
    });
    allPokeTiles[eachPokeTile].addEventListener("mouseout", () => {
      for (
        let remainingTile = 0;
        remainingTile < allPokeTiles.length;
        remainingTile++
      ) {
        if (remainingTile != eachPokeTile) {
          allPokeTiles[remainingTile].classList.remove("fadeAway");
        }
      }
    });
  }
};

const runMain = async () => {
  await fetchPokemons();
  let lastUserLocOnYAxis = undefined;
  addFocusOnHoveredPokeTile();
  await addBehaviourToPokeTiles();
};

runMain();

const addBehaviourToPokeTiles = () => {
  let pokeTiles = document.querySelectorAll(".poke-tile");
  const displayPokeDetails = async (event) => {
    while (document.querySelectorAll(".div--floating").length > 0) {
      document.querySelectorAll(".div--floating")[0].remove();
    }

    document.querySelector(".primary-content").classList.add("out-of-focus");

    let floatingArea = document.createElement("DIV");
    floatingArea.classList.add("div--floating");
    floatingArea.setAttribute("id", "div--floating");

    loading.classList.add("comeInCenter");
    event.target.appendChild(loading);

    let pokeInfo = await fetch(
      pokeInfoUrl + "/" + event.target.dataset.pokeIndex
    );
    pokeInfo = await pokeInfo.json();
    const evaluatePokeHeight = (htInDm) => {
      let htInM = htInDm / 10;
      let htInInch = Math.round(htInM * 39.37007874);
      let residualInches = htInInch % 12;
      let feets = (htInInch - residualInches) / 12;
      if (residualInches != 0) {
        return feets + " ft " + residualInches + " in";
      } else {
        return feets + " ft";
      }
    };

    const evaluatePokeWeight = (wtInHG) => {
      let wtInKG = wtInHG / 10;
      return wtInKG + "  kg";
    };
    let pokeHeight = evaluatePokeHeight(await pokeInfo.height);
    let pokeWeight = evaluatePokeWeight(await pokeInfo.weight);
    let abilities = await pokeInfo.abilities;
    let abilityStr = "";
    for (let abilityIdx = 0; abilityIdx < abilities.length; abilityIdx++) {
      let abilityEl = abilities[abilityIdx];
      let abilityInfoFetch = await fetch(abilityEl.ability.url);
      abilityInfoFetch = await abilityInfoFetch.json();
      if (abilityEl.ability.name === "libero") {
        for (
          let i = 0;
          i < (await abilityInfoFetch.flavor_text_entries.length);
          i++
        ) {
          if (
            (await abilityInfoFetch.flavor_text_entries[i].language.name) ===
            "en"
          ) {
            abilityInfoFetch = await abilityInfoFetch.flavor_text_entries[i]
              .flavor_text;
            break;
          }
        }
      } else
        for (
          let i = 0;
          i < (await abilityInfoFetch.effect_entries.length);
          i++
        ) {
          if (
            (await abilityInfoFetch.effect_entries[i].language.name) === "en"
          ) {
            abilityInfoFetch = await abilityInfoFetch.effect_entries[i].effect;
            break;
          }
        }
      abilityStr += `<span class="poke-ability" data-ability-info="${abilityInfoFetch}">${abilityEl.ability.name}</span>`;
      if (abilityIdx != abilities.length - 1) {
        abilityStr += ",&nbsp;";
      }
    }

    let pokeStats = await pokeInfo.stats;
    if (pokeInfo.id == 133 || pokeInfo.id >= 650) {
      floatingArea.innerHTML = `
        <div class="poke-image-container">
          <img class="div--floating__img" src="${pokeImgUrl}${event.target.dataset.pokeIndex}.png"/>
        </div>`;
    } else {
      floatingArea.innerHTML = `
        <div class="poke-image-container">
          <svg class="div--floating__img">
            <use xlink:href="#mon-${event.target.dataset.pokeIndex}-img">
          </svg>
        </div>`;
    }

    let pokeIntroData = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species/" +
        event.target.dataset.pokeIndex
    );

    pokeIntroData = await pokeIntroData.json();

    let pokedexEntries = await pokeIntroData.flavor_text_entries;

    pokedexEntries = pokedexEntries.filter(
      (pokedexEntry) => pokedexEntry.language.name === "en"
    );

    let randomEntry = Math.floor(Math.random() * pokedexEntries.length);

    floatingArea.innerHTML += `<div class="div--floating__intro"><p>${pokedexEntries[randomEntry].flavor_text}<p></div>`;

    floatingArea.innerHTML += `
      <div class="div--floating__intro-stats">
      <h3 class="div--floating__height">Height: ${pokeHeight}</h3>
      <h3 class="div--floating__weight">Weight: ${pokeWeight}</h3>
      <h3 class="div--floating__abilities">Abilities: ${abilityStr}</h3>
    </div>
    <div class="div--floating__base-stats">
      <h3>Stats(Base stats at Level 1): </h3>
      <p class="poke-stats">HP: ${pokeStats[0].base_stat}</p>
      <p class="poke-stats">Attack: ${pokeStats[1].base_stat}</p>
      <p class="poke-stats">Defense: ${pokeStats[2].base_stat}</p>
      <p class="poke-stats">Special Attack: ${pokeStats[3].base_stat}</p>
      <p class="poke-stats">Special Defense: ${pokeStats[4].base_stat}</p>
      <p class="poke-stats">Speed: ${pokeStats[5].base_stat}</p>
    </div>
    `;
    loading.classList.remove("comeInCenter");
    loading.remove();

    document.body.appendChild(floatingArea);

    floatingArea.innerHTML += `<div class="div--floating__type-label"><h3>Type: </h3></div>`;
    let pokeTypes = pokeInfo.types;
    floatingArea.innerHTML += `<div class="div--floating__types" id="div--floating__types"></div>`;

    let floatingAreaTypes = document.createElement("div");
    floatingAreaTypes.classList.add("div--floating-types");
    for (let type = 0; type < pokeTypes.length; type++) {
      floatingAreaTypes.innerHTML += `<span class="poke-type bg-${
        pokeTypes[type].type.name
      }-dark col-white">${pokeTypes[type].type.name.toUpperCase()}</span>`;
      if (type != pokeTypes.length - 1) {
        floatingAreaTypes.innerHTML += `&nbsp`;
      }
    }

    document
      .querySelector("#div--floating__types")
      .appendChild(floatingAreaTypes);

    let pokeTypeRelations = await fetch(
      "https://pokeapi.co/api/v2/type/" + pokeInfo.types[0].type.name
    );

    pokeTypeRelations = await pokeTypeRelations.json();
    pokeTypeRelations = pokeTypeRelations.damage_relations;

    let weak2x = pokeTypeRelations.double_damage_from;
    floatingArea.innerHTML += `
    <div class="div--floating__weak2x-types-label"><h3>2x Weak against: </h3></div>
    <div class="div--floating__weak2x-types" id="div--floating__weak2x-types"></div>
    `;

    floatingAreaTypes.innerHTML = "";

    if (weak2x.length == 0) floatingAreaTypes.innerHTML += "<span>None</span>";
    for (let type = 0; type < weak2x.length; type++) {
      floatingAreaTypes.innerHTML += `<span class="poke-type bg-${
        weak2x[type].name
      }-dark col-white">${weak2x[type].name.toUpperCase()}</span>`;
      if (type != weak2x.length - 1) {
        floatingAreaTypes.innerHTML += `&nbsp`;
      }
    }

    document
      .querySelector("#div--floating__weak2x-types")
      .appendChild(floatingAreaTypes);

    let weak_half_x = pokeTypeRelations.half_damage_from;
    floatingArea.innerHTML += `
    <div class="div--floating__weak_half_x-types-label"><h3>Normal Damage From: </h3></div>
    <div class="div--floating__weak_half_x-types" id="div--floating__weak_half_x-types"></div>
    `;

    floatingAreaTypes.innerHTML = "";

    if (weak_half_x.length == 0)
      floatingAreaTypes.innerHTML += "<span>None</span>";
    for (let type = 0; type < weak_half_x.length; type++) {
      floatingAreaTypes.innerHTML += `<span class="poke-type bg-${
        weak_half_x[type].name
      }-dark col-white">${weak_half_x[type].name.toUpperCase()}</span>`;
      if (type != weak_half_x.length - 1) {
        floatingAreaTypes.innerHTML += `&nbsp`;
      }
    }
    document
      .querySelector("#div--floating__weak_half_x-types")
      .appendChild(floatingAreaTypes);

    let weak0x = pokeTypeRelations.no_damage_from;
    floatingArea.innerHTML += `
    <div class="div--floating__weak0x-types-label"><h3>No Damage From: </h3></div>
    <div class="div--floating__weak0x-types" id="div--floating__weak0x-types"></div>
    `;

    floatingAreaTypes.innerHTML = "";

    if (weak0x.length == 0) floatingAreaTypes.innerHTML += "<span>None</span>";
    for (let type = 0; type < weak0x.length; type++) {
      floatingAreaTypes.innerHTML += `<span class="poke-type bg-${
        weak0x[type].name
      }-dark col-white">${weak0x[type].name.toUpperCase()}</span>`;
      if (type != weak0x.length - 1) {
        floatingAreaTypes.innerHTML += `&nbsp`;
      }
    }

    document
      .querySelector("#div--floating__weak0x-types")
      .appendChild(floatingAreaTypes);

    let strong2x = pokeTypeRelations.double_damage_to;
    floatingArea.innerHTML += `
    <div class="div--floating__strong2x-types-label"><h3>Double Damage To: </h3></div>
    <div class="div--floating__strong2x-types" id="div--floating__strong2x-types"></div>
    `;

    floatingAreaTypes.innerHTML = "";

    if (strong2x.length == 0)
      floatingAreaTypes.innerHTML += "<span>None</span>";
    for (let type = 0; type < strong2x.length; type++) {
      floatingAreaTypes.innerHTML += `<span class="poke-type bg-${
        strong2x[type].name
      }-dark col-white">${strong2x[type].name.toUpperCase()}</span>`;
      if (type != strong2x.length - 1) {
        floatingAreaTypes.innerHTML += `&nbsp`;
      }
    }

    document
      .querySelector("#div--floating__strong2x-types")
      .appendChild(floatingAreaTypes);

    let strong_half_x = pokeTypeRelations.half_damage_to;
    floatingArea.innerHTML += `
    <div class="div--floating__strong_half_x-types-label"><h3>Normal Damage To: </h3></div>
    <div class="div--floating__strong_half_x-types" id="div--floating__strong_half_x-types"></div>
    `;

    floatingAreaTypes.innerHTML = "";

    if (strong_half_x.length == 0)
      floatingAreaTypes.innerHTML += "<span>None</span>";
    for (let type = 0; type < strong_half_x.length; type++) {
      floatingAreaTypes.innerHTML += `<span class="poke-type bg-${
        strong_half_x[type].name
      }-dark col-white">${strong_half_x[type].name.toUpperCase()}</span>`;
      if (type != strong_half_x.length - 1) {
        floatingAreaTypes.innerHTML += `&nbsp`;
      }
    }

    document
      .querySelector("#div--floating__strong_half_x-types")
      .appendChild(floatingAreaTypes);

    let strong0x = pokeTypeRelations.no_damage_to;
    floatingArea.innerHTML += `
    <div class="div--floating__strong0x-types-label"><h3>No Damage To: </h3></div>
    <div class="div--floating__strong0x-types" id="div--floating__strong0x-types"></div>
    `;

    floatingAreaTypes.innerHTML = "";

    if (strong0x.length == 0)
      floatingAreaTypes.innerHTML += "<span>None</span>";
    for (let type = 0; type < strong0x.length; type++) {
      floatingAreaTypes.innerHTML += `<span class="poke-type bg-${
        strong0x[type].name
      }-dark col-white">${strong0x[type].name.toUpperCase()}</span>`;
      if (type != strong0x.length - 1) {
        floatingAreaTypes.innerHTML += `&nbsp`;
      }
    }
    document
      .querySelector("#div--floating__strong0x-types")
      .appendChild(floatingAreaTypes);

    lastUserLocOnYAxis = window.pageYOffset;

    window.scrollTo(0, 450);

    let closeBtn = document.createElement("div");
    closeBtn.innerHTML = `<button class="div--floating-close-btn"><img class="div--floating-close-img" src="./assets/images/close.svg" alt="close-btn-img" /></button>`;
    document.querySelector("#div--floating").appendChild(closeBtn);

    closeBtn.addEventListener("click", (event) => {
      document.querySelector(".div--floating").remove();
      document
        .querySelector(".primary-content")
        .classList.remove("out-of-focus");

      document.querySelectorAll(".poke-tile").forEach((pokeTile) => {
        if (pokeTile.classList.contains("fadeAway"))
          pokeTile.classList.remove("fadeAway");
      });

      window.scrollTo(0, lastUserLocOnYAxis);
    });

    const addBehaviourToPokeAbilities = () => {
      let pokeAbilities = document.querySelectorAll(".poke-ability");
      pokeAbilities.forEach((pokeAbility, pokeAbilityIndex) => {
        let defaultLeftArrowShift = 260;
        pokeAbility.addEventListener("mouseover", (event) => {
          let abilityInfoTooltip = document.createElement("div");
          abilityInfoTooltip.classList.add("ability-tooltip");
          abilityInfoTooltip.innerHTML = `<p class="div--floating__ability-info">${event.target.dataset.abilityInfo}</p>`;

          floatingArea.appendChild(abilityInfoTooltip);

          if (pokeAbilityIndex != 0)
            abilityInfoTooltip.style.setProperty(
              "--left-val",
              defaultLeftArrowShift * pokeAbilityIndex + "px"
            );
        });
        pokeAbility.addEventListener("mouseout", (event) => {
          floatingArea.lastChild.remove();
        });
      });
    };
    addBehaviourToPokeAbilities();
  };
  pokeTiles.forEach((pokeTile) => {
    pokeTile.addEventListener("click", displayPokeDetails);
  });
};
