const geonames = new Geonames({
    username: 'antondrik',
    lang: 'ru',
    encoding: 'JSON'
});

window.onload = function() {
    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', submitLogin);

}

async function submitLogin(e){
    e.preventDefault();
    const name = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    const formData = {name, password};
    const response = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log(data);

    // const x = await fetch("http://api.geonames.org/searchJSON?countryCode=RU&lang=ru&username=antondrik");
    // const z = await x.json();
    // console.log(z);
    // const img = document.getElementById('x');
    // img.src = z[0].flag;

    // try{
    //     const countries = await geonames.countryInfo({country: 'BY'});
    //     const cities = await geonames.children({geonameId: countries.geonames[0].geonameId});
    //     console.log(cities);
    //     const {east, north, south, west} = cities.geonames[0].bbox;
    //     const city = await geonames.cities({
    //         east, north, south, west
    //     });
    //     console.log(city.geonames);
    // }catch(err){
    //     console.error(err);
    // }


}
