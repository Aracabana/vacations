window.onload = function() {
    const loginForm = document.querySelector('#login-form');
    loginForm.addEventListener('submit', submitLogin);
    
    function submitLogin(e) {
        e.preventDefault();
        let response = fetch('/auth/login', {
            method: 'POST',
            // body: new FormData(loginForm)
            body: {x: 1}
        });
        
    }
}
