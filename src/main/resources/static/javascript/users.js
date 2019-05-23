var editButton = document.querySelector('.item_edit-button');
var cancelButton = document.querySelector('.edit-button-cancel');
var popupEditForm = document.querySelector('.popup-edit-form');
var editBoard = document.querySelector('.edit-board');
var resetButton = document.querySelector('.reset-button');
var filterButton = document.querySelector('.filter-button');
var passwordEd = document.querySelector('.edit-form_item_password');
var passwordConfirmEd = document.querySelector('.edit-form_item_passwordConfirm');

function sendAjax(type, path, args, responseHandler){
    var token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    var header = document.querySelector('meta[name="_csrf_header"]').getAttribute("content");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState == DONE) {
            if (xhr.status == OK) {
                responseHandler(JSON.parse(xhr.responseText));
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    }
    xhr.open(type, path);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader(header, token);
    xhr.send(args);
}

function setDisplay(input, condition){
    if(condition) {
        input.style.display = "none";
    } else {
        input.style.display = "block";
    }
}

var passwordEd = document.querySelector('.edit-form_item_password');
var passwordConfirmEd = document.querySelector('.edit-form_item_passwordConfirm');
var serverErrors = document.querySelector('.server-errors');

function handleEdit(response){
    if(response.message!=""){
        serverErrors.textContent = response.message;
        serverErrors.style.display = "block"
    }else{
        var item = editButton.parentNode.parentNode;
        var username = item.querySelector('.item_username');
        var email = item.querySelector('.item_email');
        var password = item.querySelector('.item_password');
        username.innerHTML = response.user.username;
        email.innerHTML = response.user.email;
        password.innerHTML = response.user.password;
        passwordEd.value="";
        passwordConfirmEd.value="";
        popupEditForm.style.display = "none";
    }
}

editBoard.addEventListener('submit', function (e){
    e.preventDefault();
    var usernameEd = document.querySelector('.edit-form_item_username');
    var emailEd = document.querySelector('.edit-form_item_email');
    var invalidUsernameEd = document.querySelector('.edit-form_invalid_username');
    var invalidEmailEd = document.querySelector('.edit-form_invalid_email');
    var invalidPasswordEd = document.querySelector('.edit-form_invalid_password');
    var isValidUsername = usernameEd.value.length >= 6 && usernameEd.value.length <= 20;
    var isValidEmail = (/^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(emailEd.value));
    var isValidPassword = passwordEd.value.length == 0 || passwordEd.value.length >= 8 && passwordEd.value.length <= 20;

    setDisplay(invalidUsernameEd, isValidUsername);
    setDisplay(invalidEmailEd, isValidEmail);
    setDisplay(invalidPasswordEd, isValidPassword);

    if(isValidUsername && isValidEmail && isValidPassword){
        var usernameValue = document.querySelector('.edit-form_item_username').value;
        var loginValue = document.querySelector('.edit-form_item_login').value;
        var emailValue = document.querySelector('.edit-form_item_email').value;
        var passwordValue = document.querySelector('.edit-form_item_password').value;
        var passwordConfirmValue = document.querySelector('.edit-form_item_passwordConfirm').value;
        var params = JSON.stringify({"id":0,"login":loginValue,"username":usernameValue,"email":emailValue,"password":passwordValue,"passwordConfirm":passwordConfirmValue,"active":0,"roles":[{"id":0,"name":null}]});
        sendAjax('PUT', "update/", params, handleEdit);
    }
});

editButton.addEventListener('click', function (){
    popupEditForm.style.display = "block";
    serverErrors.style.display = "none";
});

cancelButton.addEventListener('click', function (){
    popupEditForm.style.display = "none";
});

function customFilter(user){
    var username = document.querySelector('.username-filter').value;
    var email = document.querySelector('.email-filter').value;
    var login = document.querySelector('.login-filter').value;
    var emailValue = user.querySelector('.item_email').innerHTML;
    var loginValue = user.querySelector('.item_login').innerHTML;
    var usernameValue = user.querySelector('.item_username').innerHTML;
    var isPresent=true;
    if(username != ""){
        isPresent = usernameValue == username;
    }
    if(isPresent){
        if(login != ""){
            isPresent = loginValue == login;
        }
    }
    if(isPresent){
        if(email != ""){
            isPresent = emailValue == email;
        }
    }
    return !isPresent;
}

filterButton.addEventListener('click', function (){
    var allUsers = document.querySelectorAll('.users-list_item');
    var filtered = Array.from(allUsers).filter(customFilter);
    filtered.forEach(user => user.style.display="none");
});

resetButton.addEventListener('click', function (){
    var allUsers = document.querySelectorAll('.users-list_item');
    allUsers.forEach(user => user.style.display="table-row");
});
