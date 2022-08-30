"use strict";

// Api URL
const URL = "https://www.dnd5eapi.co";

// DOM elements
const mainContainerEl = document.querySelector(".main__container");
const modalFrameEl = document.querySelector(".modal__frame");
const overlayEl = document.querySelector(".overlay");
const monsterContainerEl = document.querySelector(".monster__container");
const filterBtn = document.querySelector(".filter__btn");
const showMsgEl = document.querySelector(".show__msg");

// Events
filterBtn.addEventListener("click", () => {
  const input = document.querySelector(".monster__input").value;
  if (input === "") {
    showMsgEl.textContent = "";
    mainContainerEl.innerHTML = "";
    init();
  }
  const data = filterMonster(input);
  if (!data.length) {
    showMsgEl.textContent = `${input} not found, try again!`;
    document.querySelector(".monster__input").value = "";
    init();
  } else {
    document.querySelector(".monster__input").value = "";
    showMsgEl.textContent = "";
    mainContainerEl.innerHTML = "";
    renderApiList(data);
  }
});

mainContainerEl.addEventListener(
  "click",
  function (ev) {
    const link = ev.target.closest("div").querySelector("p").innerHTML;
    // TODO open MODAL Window and get the data from the API data base
    const response = searchApi(link).then((data) => {
      renderMonster(data);
      return data;
    });
  },
  false
);

overlayEl.addEventListener("click", (ev) => {
  if (ev.target === overlayEl) overlayEl.classList.add("hide");
});

// Monster Data global
let monsterDataList = undefined;

// functions
function searchApi(word) {
  return fetch(URL + word).then((response) => {
    return response.json();
  });
}

function filterMonster(filterStr) {
  return monsterDataList.filter((monster) =>
    monster.name.includes(filterStr[0].toUpperCase() + filterStr.slice(1))
  );
}

function renderApiList(apiData) {
  apiData.forEach((item) => {
    const element = `
    <div class="monster__div">
        <h2 class="monster__header">${item["index"]}</h2>
        <p>${item["url"]}</p>  
    </div>`;
    mainContainerEl.insertAdjacentHTML("beforeend", element);
  });
}

function renderMonster(monsterData) {
  monsterContainerEl.innerHTML = "";

  const monsterHeaderStr = `
      <div class="monster__header separador">
            <h2 class="monster__name">${monsterData.name}</h2>
            <p>${monsterData.size} ${monsterData.type}  ${monsterData.alignment} CR:${monsterData.challenge_rating}</p>
      </div>
  `;
  monsterContainerEl.insertAdjacentHTML("beforeend", monsterHeaderStr);

  const monsterBasicStr = `
      <div class="monster__basic separador">
            <p class="monster__armor">Armor class ${monsterData.armor_class}</p>
            <p class="monster__hit-points">Hit points ${
              monsterData.hit_points
            } (${monsterData.hit_dice})</p>
            <p class="monster__speed">Speed: ${JSON.stringify(monsterData.speed)
              .slice(1, -1)
              .replaceAll(`\"`, "", "gi")}</p>
     </div>`;
  monsterContainerEl.insertAdjacentHTML("beforeend", monsterBasicStr);

  const monsterStatsStr = `
    <div class="monster__stats separador">
            <ul class="list__stats">
              <li>
                <p>STR:</p>
                <p>${monsterData.strength} (${Math.trunc(
    (monsterData.strength - 10) / 2
  )})</p>
              </li>
              <li>
                <p>DEX:</p>
                <p>${monsterData.dexterity} (${Math.trunc(
    (monsterData.dexterity - 10) / 2
  )})</p>
              </li>
              <li>
                <p>CON:</p>
                <p>${monsterData.constitution} (${Math.trunc(
    (monsterData.constitution - 10) / 2
  )})</p>
              </li>
              <li>
                <p>INT:</p>
                <p>${monsterData.intelligence} (${Math.trunc(
    (monsterData.intelligence - 10) / 2
  )})</p>
              </li>
              <li>
                <p>WIS:</p>
                <p>${monsterData.wisdom} (${Math.trunc(
    (monsterData.wisdom - 10) / 2
  )})</p>
              </li>
              <li>
                <p>CHA:</p>
                <p>${monsterData.charisma} (${Math.trunc(
    (monsterData.charisma - 10) / 2
  )})</p>
              </li>
            </ul>
    </div>

`;
  monsterContainerEl.insertAdjacentHTML("beforeend", monsterStatsStr);

  let monsterProficienciesStr = `
  <div class="monster__proficiencies separador">
  <h3>Proficiencies </h3>
`;

  if (monsterData.proficiencies.length)
    monsterData.proficiencies.forEach(
      (prof) =>
        (monsterProficienciesStr += `<p>Proficiency: ${prof.proficiency.name}: ${prof.value}</p>`)
    );

  if (monsterData.damage_vulnerabilities.length)
    monsterData.damage_vulnerabilities.forEach(
      (vuln) => (monsterProficienciesStr += `<p>Vulnerability to: ${vuln}</p>`)
    );

  if (monsterData.damage_immunities.length)
    monsterData.damage_immunities.forEach(
      (inmu) => (monsterProficienciesStr += `<p>Inmunity to: ${inmu}</p>`)
    );

  if (monsterData.damage_resistances.length)
    monsterData.damage_resistances.forEach(
      (resist) => (monsterProficienciesStr += `<p>Resistant to: ${resist}</p>`)
    );

  for (const sense in monsterData.senses) {
    monsterProficienciesStr += `<p>${sense}: ${monsterData.senses[sense]}</p>`;
  }

  monsterProficienciesStr += `<p>${monsterData.languages}</p>`;

  // Close the Div element.
  monsterProficienciesStr += `</div>`;
  monsterContainerEl.insertAdjacentHTML("beforeend", monsterProficienciesStr);

  // Special abilities
  if (monsterData.special_abilities.length) {
    let monsterSpecialAb = `
       <div class="monster__special separador">
      <h3>Special abilities </h3>`;

    monsterData.special_abilities.forEach((ability) => {
      const { name, desc } = ability;

      monsterSpecialAb += `<p><strong>${name}</strong>: ${desc} </p>`;
    });
    monsterSpecialAb += `</div>`;
    monsterContainerEl.insertAdjacentHTML("beforeend", monsterSpecialAb);
  }

  //monster actions
  if (monsterData.actions.length) {
    let monsterActions = `
  <div class="monster__actions separador">
  <h3>Actions</h3>`;
    monsterData.actions.forEach((action) => {
      const { name, desc } = action;
      monsterActions += `<p><strong>${name}</strong>: ${desc} </p>`;
    });
    monsterActions += `</div>`;
    monsterContainerEl.insertAdjacentHTML("beforeend", monsterActions);
  }

  // monster legend
  if (monsterData.legendary_actions.length) {
    let monsterLegend = `
<div class="monster__legend__actions separador">
<h3>Legendary actions</h3>`;
    monsterData.legendary_actions.forEach((action) => {
      const { name, desc } = action;
      monsterLegend += `<p><strong>${name}</strong>: ${desc} </p>`;
    });
    monsterLegend += `</div>`;
    monsterContainerEl.insertAdjacentHTML("beforeend", monsterLegend);
  }

  overlayEl.classList.remove("hide");
}

function init() {
  searchApi("/api/monsters/")
    .then((data) => {
      monsterDataList = data.results;
    })
    .then(() => renderApiList(monsterDataList))
    .catch((err) => console.error(`Error ${err}`));
}

init();
