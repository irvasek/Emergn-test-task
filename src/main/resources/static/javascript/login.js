var signinBoard = document.querySelector('.signin-board');
var signupBoard = document.querySelector('.signup-board');
var loginSUp = document.querySelector('.signup-form_item_login');
var usernameSUp = document.querySelector('.signup-form_item_username');
var emailSUp = document.querySelector('.signup-form_item_email');
var passwordSUp = document.querySelector('.signup-form_item_password');
var passwordConfirmSUp = document.querySelector('.signup-form_item_passwordConfirm');
var serverErrors = document.querySelector('.server-errors');
var popupSignupForm = document.querySelector('.popup-signup-form');
var signupButton = document.querySelector('.signin-button-signup');
var cancelButton = document.querySelector('.signup-button-cancel');

function sendAjax(type, path, args, responseHandler){
    var token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    var header = document.querySelector('meta[name="_csrf_header"]').getAttribute("content");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
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

function clearSignupForm(){
    popupSignupForm.style.display = "none";
    loginSUp.value="";
    usernameSUp.value="";
    emailSUp.value="";
    passwordSUp.value="";
    passwordConfirmSUp.value="";
}

function handleCreate(response){
    if(response.message!=""){
        serverErrors.textContent = response.message;
        serverErrors.style.display = "block"
    }else{
        clearSignupForm();
    }
}

signinBoard.addEventListener('submit', function (e){
    e.preventDefault();
    var invalidLoginSIn = document.querySelector('.signin-form_invalid_login');
    var invalidPasswordSIn = document.querySelector('.signin-form_invalid_password');
    var loginSIn = document.querySelector('.signin-form_item_login');
    var passwordSIn = document.querySelector('.signin-form_item_password');
    var isValidLogin = loginSIn.value.length >= 6 && loginSIn.value.length <= 20;;
    var isValidPassword = passwordSIn.value.length >= 8 && passwordSIn.value.length <= 20;

    setDisplay(invalidLoginSIn, isValidLogin);
    setDisplay(invalidPasswordSIn, isValidPassword);

    if(isValidLogin && isValidPassword) {
        signinBoard.submit();
    }
});

signupBoard.addEventListener('submit', function (e){
    e.preventDefault();
    var invalidLoginSUp = document.querySelector('.signup-form_invalid_login');
    var invalidUsernameSUp = document.querySelector('.signup-form_invalid_username');
    var invalidEmailSUp = document.querySelector('.signup-form_invalid_email');
    var invalidPasswordSUp = document.querySelector('.signup-form_invalid_password');
    var isValidLogin = loginSUp.value.length >= 6 && loginSUp.value.length <= 20;
    var isValidUsername = usernameSUp.value.length >= 6 && usernameSUp.value.length <= 20;
    var isValidEmail = (/^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(emailSUp.value));
    var isValidPassword = passwordSUp.value.length >= 8 && passwordSUp.value.length <= 20;

    setDisplay(invalidLoginSUp, isValidLogin);
    setDisplay(invalidUsernameSUp, isValidUsername);
    setDisplay(invalidEmailSUp, isValidEmail);
    setDisplay(invalidPasswordSUp, isValidPassword);

    if(isValidLogin && isValidUsername && isValidEmail && isValidPassword) {
        var params = JSON.stringify({"id":0,"login":loginSUp.value,"username":usernameSUp.value,"email":emailSUp.value,"password":passwordSUp.value,"passwordConfirm":passwordConfirmSUp.value,"active":0,"roles":[{"id":0,"name":null}]});
        sendAjax('POST', '/create', params, handleCreate);
    }
});

signupButton.addEventListener('click', function (){
    popupSignupForm.style.display = "block";
    serverErrors.style.display = "none";
});

cancelButton.addEventListener('click', function (){
    clearSignupForm();
});
