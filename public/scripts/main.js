class adminApp {
  constructor() {
    //this.formLogin = document.getElementById('formLogin');
    //this.formLogin.addEventListener('submit', this.submit.bind(this.e))
    this.loginBtn = document.getElementById('loginBtn');
    this.loading = document.getElementById('loading');
    this.email = document.getElementById('email');
    this.password = document.getElementById('password');
    this.loginBtn.addEventListener('click', this.loginBtnAction.bind(this));
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }
  loginBtnAction() {

    var email = this.email.value;
    var password = this.password.value;

    this.loginBtn.disabled = true;    
    this.loading.style.display = '';  
    
    var t = this;

    setTimeout(function(){
      t.signIn(email, password)      
    }, 700)
  }
  signIn(email, password) {
    var t = this;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        return result.user.getIdToken();
      })
      .catch(function(error) {
        t.signError(error)
      });
  }
  setClaim(idToken) {
    let tokens = JSON.stringify({
      idToken: idToken
    })
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/setCustomClaims', true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(tokens)
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        var response = JSON.parse(xhttp.responseText);
          if (xhttp.status === 200 && response.status === 'success') {
            window.location.href = '/admin.html'
          } else {
            console.log(response);
          }
      }
    }
  }
  signError(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/wrong-password') {
      document.getElementById('loading').innerHTML = 'Wrong Password';
    }
    else {
      document.getElementById('loading').innerHTML = errorMessage;
    }
    console.log(error);
    window.location.reload();
  }
  onAuthStateChanged(user) {
    let t = this;
    if (user) {
      user.getIdToken().then(function(idToken) {
        t.setClaim(idToken);
      });      
    }
  }
}

window.onload = function() {
  window.app = new adminApp();
};