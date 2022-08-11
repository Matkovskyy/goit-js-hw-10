const URL = 'https://restcountries.com/v2';

   export default function fetchCountries(name) {

        return fetch(`${URL}/name/${name}?fields=name,capital,population,flags,languages`)
        .then(response => response.json())
    };
