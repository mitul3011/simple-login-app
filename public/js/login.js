const loginForm = document.querySelector('form');
const errMsg = document.querySelector('#errorMsg');
const submitBtn = document.querySelector('#submit');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.querySelector('#inputEmail').value;
    const password = document.querySelector('#inputPassword').value;

    submitBtn.innerHTML = 'Loading...';

    if(password.toLowerCase().includes('password')){
        errMsg.innerHTML = 'Password cannot contain "password".';
        submitBtn.innerHTML = 'Login';
    }else if(password.length <= 7){
        errMsg.innerHTML = 'Password length must be more than 8 characters.';
        submitBtn.innerHTML = 'Login';
    }else{
        const formData = JSON.stringify({
            email,
            password
        });

        fetch('/login', {
            method: 'POST',
            body: formData,
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then((response) => {
            if(response.status === 404){
                errMsg.innerHTML = 'Email is not registered!';
                submitBtn.innerHTML = 'Login';
            }else if(response.status === 400){
                errMsg.innerHTML = 'Either Email/Password is incorrect';
                submitBtn.innerHTML = 'Login';
            }else if(response.status === 200){
                window.location = '/home';
            }
        });
    }

});