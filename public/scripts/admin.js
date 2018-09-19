class adminApp {
  
  constructor() {
    this.logoutBtn = document.getElementById('logoutBtn');
    this.logoutBtn.addEventListener('click', this.logoutBtnAction.bind(this));
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }

  logoutBtnAction() {
    firebase.auth().signOut() 
  }

  onAuthStateChanged(user) {
    if (!user) {
      window.location.href = '/'
    } else {
      document.getElementById('welcome').innerText = this.welcome(user);
      user.getIdTokenResult()
        .then((idTokenResult) => {
          if (!!idTokenResult.claims.admin) {
            var adminFull = document.createElement('div');
            adminFull.classList.add('full-admin-ui');
            adminFull.innerText = 'This is full admin UI';
            document.getElementById('ui').appendChild(adminFull);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  welcome(user) {
    var name;
    (user.email == 'asd@asd.com') ? (name = "Administrator") : (name = user.email)
    return name;
  }

}

window.onload = function() {
  window.app = new adminApp();
};