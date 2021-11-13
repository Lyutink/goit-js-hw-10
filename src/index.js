import * as HTTPServise from './fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 800;


let countryInput = '';

const inputRef = document.querySelector('#search-box');
const resultListRef = document.querySelector('.country-list');

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
        resultListRef.classList.add('is-hidden');
        resultListRef.innerHTML = '';
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
    
    if (countrys.length > 2) {
        renderMarkupMany(countrys);
        return;
    }

    renderMarkupOne(countrys);
}

function renderMarkupOne(countrys) {
    //console.log("dddd", countrys.lenghts);
    const markup = countrys.map(
        country => `
        <li>
        <img src="${country.flags.svg}" alt="" width="30"><span>${country.name.official}</span>
        </li>
        <li>Capital: ${country.capital}</li>
        <li>Population: ${country.population}</li>
        <li>Languages: ${country.languages}</li>
        `
    ).join('');

    resultListRef.innerHTML = markup;
    resultListRef.classList.remove('is-hidden');
}

function renderMarkupMany(countrys) {
    //console.log("dddd", countrys.lenghts);
    const markup = countrys.map(
        country => `
        <li>
        <img src="${country.flags.svg}" alt="" width="30"><span>${country.name.official}</span>
        </li>
        `
    ).join('');

    resultListRef.innerHTML = markup;
    resultListRef.classList.remove('is-hidden');
}