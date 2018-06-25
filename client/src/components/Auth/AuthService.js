function register(data){
    return fetch('/api/register/user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
}
function login(data){
    return fetch('/api/authenticate',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
        if(data.token){
            localStorage.setItem('token', data.token);
            checkSession()
        }
        return data
    })
}
function resendLink(data){
    return fetch('/api/resend',{
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => data)
}
function isLoggedIn(){
    const token = localStorage.getItem('token');
    if(token){
        return true
    } else {
        return false
    }
}
function logOut(){
    let removeToken = localStorage.removeItem('token')
}
function checkSession(){
    if(isLoggedIn()){
        let interval = setInterval(function(){
            let token = localStorage.getItem('token');
            if(token === null){
                isLoggedIn();
                clearInterval(interval)
            } else {
                this.parseJwt = (token) => {
                    let base64Url = token.split('.')[1];
                    let base64 = base64Url.replace('-','+').replace('_','/');
                    return JSON.parse(window.atob(base64))
                }
                let expireTime = this.parseJwt(token);
                let timeStamp = Math.floor(Date.now()/1000);
                let timeCheck = expireTime.exp - timeStamp;
                if(timeCheck < 0){
                    logOut()
                }
            }
        },3000)
    }
};

export { register, login, isLoggedIn, checkSession, resendLink, logOut }