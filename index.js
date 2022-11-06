const fimlContainer = document.querySelector(".film-parent-container");
const hello = document.querySelector(".parent-container");
let films = [];
const getData = async () => {
  const data = await fetch("https://swapi.dev/api/people", {
    method: "GET",
  });
  return await data.json();
};
const fetchData = async (url) => {
  const data = await fetch(url, {
    method: "GET",
  });
  return await data.json();
};

const getPeopleUrls = async () => {
  const res = await getData();
  const urls = res?.results?.map((el) => {
    return el.url;
  });
  return urls;
};

const getPeopleData = async () => {
  const urls = await getPeopleUrls();

  const peopleData = urls.map(async (person) => {
    return await fetchData(person);
  });
  return peopleData;
};

const displayPeopleData = async () => {
  const peoplePromise = await getPeopleData();
  const people = await Promise.all(peoplePromise);

  people.forEach(async (person) => {
    const filmArr = person.films.map(async (film) => {
      return await fetchData(film);
    });
    const films = await Promise.all(filmArr);
    const html = `
   <div class="person-container">
   <div>
     <h3 class="person-name">${person.name}</h3>

   </div>
   <div class="properties-container">
     <p class="info"><span class='info-span'>Birthyear:</span> ${
       person.birth_year
     }</p>
     <p class="info"><span class='info-span'>Eye_Color:</span> ${
       person.eye_color
     }</p>
   </div>
   <div class="properties-container">
     <p class="info"><span class='info-span'>Gender:</span> ${person.gender}</p>
     <p class="info"><span class='info-span'>Hair_Color:</span> ${
       person.hair_color
     }</p>
   </div>
   <div class="film-container">
   <h2 class="film-title">Films</h2>
<ul>
${films.map((film) => {
  return `<a href="./film.html"> <li  class="film-list" data-url=${film.url}>${film.title}</li></a>`;
})}
</ul>

</div>
   </div>
   </div>
   `;

    hello ? (hello.innerHTML += html) : "";
  });

  return people.films;
};
displayPeopleData();

document.addEventListener("click", async function (e) {
  e.preventDefault();
  const url = e.target.dataset.url;
  const filmData = await fetchData(url);
  localStorage.setItem("film", JSON.stringify(filmData));
  document.location.href = "film.html";
});
const film = JSON.parse(localStorage.getItem("film"));
console.log(film);
const showFilm = async () => {
  if (fimlContainer) {
    const charArr = film.characters.map(async (char) => {
      return await fetchData(char);
    });
    const starships = film.starships.map(async (star) => {
      return await fetchData(star);
    });
    const vehicles = film.vehicles.map(async (veh) => {
      return await fetchData(veh);
    });
    const char = await Promise.all(charArr);
    const veh = await Promise.all(vehicles);
    const star = await Promise.all(starships);
    console.log(char);
    const html = `
  <div class="movie-container">
  <div>
    <h3 class="person-name">${film.title}</h3>

  </div>
  <div class="properties-container">
    <p class="info"><span class='info-span'>Director:</span> ${
      film.director
    }</p>
    <p class="info"><span class='info-span'>Release_Date:</span> ${
      film.release_date
    }</p>
  </div>
  <div class="properties-container">
    <p class="info"><span class='info-span'>Producers:</span> ${film.producer.replaceAll(
      ",",
      " and"
    )}</p>
    <p class="info"><span class='info-span'>Url:</span> ${film.url}</p>
  </div>
  <div class="film-container char-container">
  <div>
  <h2 class="film-title">Characters</h2>
  <ul>
  ${char.map((char) => {
    return `<li  class="film-list">${char.name}</li>`;
  })}
  </ul>
  </div>
  <div>
  <h2 class="film-title">Vehicles</h2>
  <ul>
  ${veh.map((vehicle) => {
    return `<a href="./film.html"> <li  class="film-list">${vehicle.name}</li></a>`;
  })}
  </ul>
  </div>
  <div>
  <h2 class="film-title">Starships</h2>
  <ul>
  ${star.map((star) => {
    return `<a href="./film.html"> <li  class="film-list">${star.name}</li></a>`;
  })}
  </ul>
  </div>


</div>
  </div>

  </div>
  `;

    fimlContainer ? (fimlContainer.innerHTML += html) : "";
  }
};
showFilm();
