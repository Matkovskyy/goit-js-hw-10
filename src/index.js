import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const countrySearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryDescription = document.querySelector('.country-info');

countrySearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    const countrySearchInput = event.target.value.trim();
    if (countrySearchInput === '') { 
        removeData();
        return;
}
     fetchCountries(countrySearchInput)
        .then(data => renderCountries(data))
        .catch(error => {
            if (error.code === 404) {
                notFound();
            } 
            else {
                Notiflix.Notify.failure('Unknow error');
            }
            removeData();
    });
}     
    

const renderCountries = (countries) => {
    
    removeData();
    
     if (countries.length === 1) {
        
        const resultInfo = countryInfoMarkup(countries);
        countryDescription.insertAdjacentHTML('beforeend', resultInfo);

    } else if (countries.length < 10 && countries.length > 1) {
        const result = listCountry(countries);
        countryList.innerHTML = result; 
        
    } else if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        
    } else {
        notFound();
    }
}

const listCountry = (list) => list.reduce((acc, item) => acc + countryMarkup(item), '');


const countryMarkup = (({ name, flags }) => {
    return `<li class="country-item">
    <img src='${flags.svg}' alt='flag ${name}' width='60' height='40'>${name}</li>`
});

const countryInfoMarkup = (country) => {
    const { flags, name, capital, population, languages } = country[0];
        const language = languages.map(list => list.name).join(' ');
        const info = `<h2 class="country-name"><img class="country-flag"src='${flags.svg}' alt='Country flag' width='40'>${name}</h2>
        <p class="country-info__text"><span>Capital:</span>${capital}</p>
        <p class="country-info__text"><span>Population:</span>${population}</p>
        <p class="country-info__text"><span>Languages:</span>${language}</p>`;
        return info;
};

const notFound = () => {
    Notiflix.Notify.failure('Oops, there is no country with that name')
    removeData();
};


const removeData = () => {
    countryList.innerHTML = '';
    countryDescription.innerHTML = '';
}

