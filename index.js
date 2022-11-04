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
  people.forEach((person) => {
    const html = `
   <div class="person-container">
   <div>
     <h3 class="person-name">${person.name}</h3>
   
   </div>
   <div class="properties-container">
     <p class="info">birthyear: ${person.birth_year}</p>
     <p class="info">eye_color: ${person.eye_color}</p>
   </div>
   <div class="properties-container">
     <p class="info">gender: ${person.gender}</p>
     <p class="info">hair_color: ${person.hair_color}</p>
   </div>
   <div class="properties-container">
    <a href="films.html" class="movie-btn">view movies</a>
   </div>
   </div>
   </div>
   `;

    hello.innerHTML += html;
  });
  return people.films;
};
displayPeopleData();
