class adminApp {
  constructor() {
    
  }
  signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  signOut() {
    firebase.auth().signOut();
  }
  onAuthStateChanged(user) {
    var login;
    user ?
      login = true
      :
      login = false
    return login
  }
}

window.onload = function() {
  window.app = new adminApp();
};