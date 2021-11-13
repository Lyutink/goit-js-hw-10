const BASE_URL = "https://restcountries.com/v3.1/name/";

export function fetchCountries(countryInput) {
    return fetch(`${BASE_URL}/${countryInput}?fields=name,capital,population,flags,languages`)
        .then(responce => {
            if (!responce.ok) {
                throw Error(responce.statusText); 
            }
            return responce.json(); 
        })
        .catch(() =>
        {
            return ;
        });
}