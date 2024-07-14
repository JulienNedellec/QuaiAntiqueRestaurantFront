const TokenCookieName = "accesstoken";
const RoleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");
const apiURL = "http://127.0.0.1:8000/api/";

signoutBtn.addEventListener("click", signout);

function getRole(){
    return getCookie(RoleCookieName);
}

function signout(){
    eraseCookie(TokenCookieName);
    eraseCookie(RoleCookieName);
    window.location.reload();
}

function setToken(token){
    setCookie(TokenCookieName, token, 7);
}

function getToken(){
    return getCookie(TokenCookieName);
}

function setCookie(name,value,days) {
    let expires = "";
    
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for(const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1,c.length);
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected(){
    return !(getToken() == null || getToken() == undefined);
}

function showAndHideElementsForRoles(){
    const userConnected = isConnected();
    const role = getRole();
    
    let allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
        switch(element.dataset.show){
            case 'disconnected':
                if(userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'connected':
                if(!userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'admin':
                if(!userConnected || role != "admin"){
                    element.classList.add("d-none");
                }
                break;
            case 'client':
                if(!userConnected || role != "client"){
                    element.classList.add("d-none");
                }
                break;
            default:
                element.style.display = "none";
        }
    })  
}
