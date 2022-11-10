const fimlContainer = document.querySelector(".film-parent-container");
const starshipContainer = document.querySelector(".starship-parent-container");
const vehicleContainer = document.querySelector(".vehicle-parent-container");
const home = document.querySelector(".parent-container");
home
  ? (home.innerHTML = `<div class='loader-container'><div class="loader"></div></div>`)
  : "";
fimlContainer
  ? (fimlContainer.innerHTML = `<div class='loader-container'><div class="loader"></div></div>`)
  : "";
vehicleContainer
  ? (vehicleContainer.innerHTML = `<div class='loader-container'><div class="loader"></div></div>`)
  : "";
starshipContainer
  ? (starshipContainer.innerHTML = `<div class='loader-container'><div class="loader"></div></div>`)
  : "";
const getData = async () => {
  const data = await fetch("https://swapi.dev/api/people", {
    method: "GET",
  });
  return await data.json();
};
const fetchData = async (url) => {
  try {
    const data = await fetch(url, {
      method: "GET",
    });
    return await data.json();
  } catch (err) {
    if (err.message.startsWith("Unexpected token")) {
      document.location.href = "index.html";
      alert(
        "maximum call to the api has been reached please wait for 2 mins before retrying"
      );
    }
  }
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
    home
      ? document.querySelector(".loader-container").classList.add("hide")
      : "";
    home ? (home.innerHTML += html) : "";
  });

  return people.films;
};
displayPeopleData();

document.addEventListener("click", async function (e) {
  e.preventDefault();
  const url = e.target.dataset.url;
  if (e.target.className === "film-list") {
    const filmData = await fetchData(url?.replace("dev", "tech"));
    localStorage.setItem("film", JSON.stringify(filmData));
    document.location.href = "film.html";
  } else if (e.target.className === "vehicle-list") {
    const vehicleData = await fetchData(url?.replace("dev", "tech"));
    localStorage.setItem("vehicle", JSON.stringify(vehicleData));
    document.location.href = "vehicle.html";
  } else if (e.target.className === "star-list") {
    const starshipData = await fetchData(url?.replace("dev", "tech"));
    localStorage.setItem("starship", JSON.stringify(starshipData));
    document.location.href = "starship.html";
  }
});
const film = JSON.parse(localStorage.getItem("film"));

const showFilm = async () => {
  if (fimlContainer) {
    console.log(film);
    const charArr = film.result.properties.characters
      ?.splice(0, 11)
      .map(async (char) => {
        return await fetchData(char?.replace("dev", "tech"));
      });
    const starships = film.result.properties.starships
      ?.splice(0, 11)
      .map(async (star) => {
        return await fetchData(star?.replace("dev", "tech"));
      });
    const vehicles = film.result.properties.vehicles
      ?.splice(0, 11)
      .map(async (veh) => {
        return await fetchData(veh?.replace("dev", "tech"));
      });
    const char = await Promise.all(charArr);
    const veh = await Promise.all(vehicles);
    const star = await Promise.all(starships);
    const html = `
    <nav class="nav">  
    <h1 class="nav-items">Movie</h1>
       </nav> 
  <div class="movie-container">
  <div>
    <h3 class="person-name">${film.result.properties.title}</h3>

  </div>
  <div class="properties-container">
    <p class="info"><span class='info-span'>Director:</span> ${
      film.result.properties.director
    }</p>
    <p class="info"><span class='info-span'>Release_Date:</span> ${
      film.result.properties.release_date
    }</p>
  </div>
  <div class="properties-container">
    <p class="info"><span class='info-span'>Producers:</span> ${film.result.properties.producer.replaceAll(
      ",",
      " and"
    )}</p>
    <p class="info"><span class='info-span'>Url:</span> ${
      film.result.properties.url
    }</p>
  </div>
  <div class="film-container char-container">
  <div>
  <h2 class="film-title">Characters</h2>
  <ul>
  ${char.map((char) => {
    return `<li  class="film-list" data-url=${char.result.properties.url}>${char.result.properties.name}</li>`;
  })}
  </ul>
  </div>
  <div>
  <h2 class="film-title">Vehicles</h2>
  <ul>
  ${veh.map((vehicle) => {
    return `<a href="./vehicle.html"> <li  class="vehicle-list" data-url=${vehicle.result.properties.url}>${vehicle.result.properties.name}</li></a>`;
  })}
  </ul>
  </div>
  <div>
  <h2 class="film-title">Starships</h2>
  <ul>
  ${star.map((star) => {
    return `<a href="./starship.html"> <li  class="star-list" data-url=${star.result.properties.url}>${star.result.properties.name}</li></a>`;
  })}
  </ul>
  </div>


</div>
  </div>

  </div>
  `;
    fimlContainer
      ? document.querySelector(".loader-container").classList.add("hide")
      : "";
    fimlContainer ? (fimlContainer.innerHTML += html) : "";
  }
};
showFilm();
const showVehicle = async () => {
  if (vehicleContainer) {
    const vehicle = JSON.parse(localStorage.getItem("vehicle"));

    const films = vehicle.result.properties?.films
      ?.splice(0, 11)
      .map(async (char) => {
        return await fetchData(char?.replace("dev", "tech"));
      });
    const starships = vehicle.result?.properties?.pilots
      ?.splice(0, 11)
      .map(async (star) => {
        return await fetchData(star?.replace("dev", "tech"));
      });

    const char = await Promise.all(films);

    const star = await Promise.all(starships);

    const html = `
    <nav class="nav">  
    <h1 class="nav-items">Vehicle</h1>
       </nav>
      <div class="movie-container">
      
      <div>
        <h3 class="person-name">${vehicle.result.properties.name}</h3>

      </div>
      <div class="properties-container">
        <p class="info"><span class='info-span'>Manufacturer:</span> ${
          vehicle.result.properties.manufacturer
        }</p>
        <p class="info"><span class='info-span'>Model:</span> ${
          vehicle.result.properties.model
        }</p>
      </div>
      <div class="properties-container">
        <p class="info"><span class='info-span'>Max_Atmosphering_Speed
        :</span> ${vehicle.result.properties.max_atmosphering_speed}</p>
        <p class="info"><span class='info-span'>Url:</span> ${
          vehicle.result.properties.url
        }</p>
      </div>
      <div class="film-container char-container">
      <div>
      <h2 class="film-title">Characters</h2>
      <ul>
   ${
     char.length === 0
       ? `<li  class="film-list">No Characters</li>`
       : char.map((char) => {
           return `<li  class="film-list" data-url=${char.result.properties.url}>${char.result.properties.name}</li>`;
         })
   }
      </ul>
      </div>
 
      <div>
      <h2 class="film-title">Pilots</h2>
      <ul>
      ${
        star.length === 0
          ? `<li  class="film-list">No Pilots</li>`
          : star.map((star) => {
              return `<li  class="star-list" data-url=${star.result.properties.url}>${star.result.properties.name}</li>`;
            })
      }
      </ul>
      </div>

    </div>
      </div>

      </div>
      `;
    vehicleContainer
      ? document.querySelector(".loader-container").classList.add("hide")
      : "";
    vehicleContainer ? (vehicleContainer.innerHTML += html) : "";
  }
};
showVehicle();
const showStarships = async () => {
  if (starshipContainer) {
    const starship = JSON.parse(localStorage.getItem("starship"));
    const starships = starship.result?.properties?.pilots
      ?.splice(0, 11)
      .map(async (star) => {
        return await fetchData(star?.replace("dev", "tech"));
      });

    const star = await Promise.all(starships);

    const html = `
    <nav class="nav">  
    <h1 class="nav-items">Starship</h1>
       </nav>
      <div class="movie-container">
      <div>
        <h3 class="person-name">${starship.result.properties.name}</h3>

      </div>
      <div class="properties-container">
        <p class="info"><span class='info-span'>Manufacturer:</span> ${
          starship.result.properties.manufacturer
        }</p>
        <p class="info"><span class='info-span'>Model:</span> ${
          starship.result.properties.model
        }</p>
      </div>
      <div class="properties-container">
        <p class="info"><span class='info-span'>Max_Atmosphering_Speed
        :</span> ${starship.result.properties.max_atmosphering_speed}</p>
        <p class="info"><span class='info-span'>Url:</span> ${
          starship.result.properties.url
        }</p>
      </div>
     
      <div class="film-container char-container">
 
      <div>
      <h2 class="film-title">Pilots</h2>
      <ul>
      ${
        star.length === 0
          ? `<li  class="film-list">No Pilots</li>`
          : star.map((star) => {
              return `<li  class="star-list" data-url=${star.result.properties.url}>${star.result.properties.name}</li>`;
            })
      }
      </ul>
      </div>

    </div>
      </div>
      </div>
      `;
    starshipContainer
      ? document.querySelector(".loader-container").classList.add("hide")
      : "";
    starshipContainer ? (starshipContainer.innerHTML += html) : "";
  }
};
showStarships();
