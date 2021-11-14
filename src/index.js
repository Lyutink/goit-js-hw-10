import * as HTTPServise from './fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

let countryInput = '';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));


function onInput(e) {
    countryInput = e.target.value;
    countryInput = countryInput.trim();
    if (!countryInput) {
        clearMarkup();
        return;
    }
    
    HTTPServise.fetchCountries(countryInput)
        .then(countrys => {
            if (!countrys) {
                clearMarkup();
                Notiflix.Notify.failure('Oops, there is no country with that name',
                    {
                        timeout: 4000,
                    },);
                 return;
             }
            checkQuantityCountrys(countrys)
    });
}

function clearMarkup() {
        countryListRef.classList.add('is-hidden');
        countryListRef.innerHTML = '';
}

function checkQuantityCountrys(countrys) {
    if (countrys.length > 10) {
        clearMarkup();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.',
            {
                timeout: 4000,
            },);
        return;
    }

    (countrys.length > 2) ? renderMarkupMany(countrys) : renderMarkupOne(countrys);
}


function renderMarkupOne(countrys) {
    const markup = countrys.map(
        ({ flags, name, capital, population, languages }) => `
        <li>
        <img src="${flags.svg}" alt="" width="30"><span>${name.official}</span>
        </li>
        <li>Capital: ${capital}</li>
        <li>Population: ${population}</li>
        <li>Languages: ${(Object.values(languages)).join(', ')}</li>
        `
    ).join('');

    countryListRef.innerHTML = markup;
    countryListRef.classList.remove('is-hidden');
}


function renderMarkupMany(countrys) {
    const markup = countrys.map(
        country => `
        <li>
        <img src="${country.flags.svg}" alt="" width="30"><span>${country.name.official}</span>
        </li> `
    ).join('');

    countryListRef.innerHTML = markup;
    countryListRef.classList.remove('is-hidden');
}