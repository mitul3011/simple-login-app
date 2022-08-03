const logOutBtn = document.querySelector('#logOut');
const logOutAllBtn = document.querySelector('#logOutAll');
const deleteButton = document.querySelector('#deleteProfile');
const errMsg = document.querySelector("#errMsg");

logOutBtn.addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/';
        else
            errMsg.innerHTML = 'Some Error Occurred!';
    });
});

logOutAllBtn.addEventListener('click', () => {
    fetch('/logoutall', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/';
        else
            errMsg.innerHTML = 'Some Error Occurred!';
    });
});

deleteButton.addEventListener('click', () => {
    fetch('/deletePro', {
        method: 'DELETE'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/success?task=Deleted';
        else
            errMsg.innerHTML = 'Some Error Occurred!';
    });
});