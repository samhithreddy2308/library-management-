$(document).ready(function() {
    // web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyBin1evT-H6jfR49WIhtVPsGMLzbEklIQY",
      authDomain: "library-management-syste-f2a85.firebaseapp.com",
      databaseURL: "https://library-management-syste-f2a85.firebaseio.com",
      projectId: "library-management-syste-f2a85",
      storageBucket: "library-management-syste-f2a85.appspot.com",
      messagingSenderId: "914416876417",
      appId: "1:914416876417:web:bf9e7762c1c283ba"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  
    var db = firebase.firestore();
  
    // Prevent default refresh of form
    $("#login-form").submit(function(e) {
      e.preventDefault();
    });
  
    $("#register-form").submit(function(e) {
      e.preventDefault();
    });
  
    // If the user is logged in, go to the user_portal
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        window.location = 'user_portal.html';
      }
    });
  
    $('#log_me_in').click(function() {
      login();
    });
  
    $('#register_new').click(function() {
      register_me();
    });
  
    $('#log_button').click(function() {
      logout();
    });
  
    $('#searchButton').click(function() {
      var author = $('#searchAuthorInput').val();
      var id = $('#searchIdInput').val();
      searchBooks(author, id);
    });
  
    $('#addToCartButton').click(function() {
      var selectedBooks = $('input[name="bookCheckbox"]:checked').map(function() {
        return this.value;
      }).get();
      addToCart(selectedBooks);
    });
  
  });
  
  function logout() {
    firebase.auth().signOut().then(function() {
      console.log("logout done");
      window.location = 'usr_login.html';
    }).catch(function(error) {
      console.log("error");
    });
  }
  
  function register_me() {
    var db = firebase.firestore();
  
    var name = document.getElementById("usr_name").value;
    var Password = document.getElementById("usr_pass").value;
    var Email = document.getElementById("usr_email").value;
    var Roll_number = document.getElementById("usr_roll").value;
    var date_of_birth = document.getElementById("usr_dob").value;
    var books = [];
  
    firebase.auth().createUserWithEmailAndPassword(Email, Password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("error ", errorMessage);
    });
  
    db.collection("users").doc(Roll_number).set({
      name: name,
      Email: Email,
      Roll_Number: Roll_number,
      DOB: date_of_birth,
      books: books
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }
  
  function login() {
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;
  
    if (email === "admin@gmail.com") {
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
      });
    }
  }
  
  function searchBooks(author, id) {
    var booksList = document.getElementById("books");
    booksList.innerHTML = "";
  
    var query = db.collection("books");
    if (author) {
      query = query.where("author", "==", author);
    }
    if (id) {
      query = query.where("id", "==", id);
    }
  
    query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var book = doc.data();
        var listItem = document.createElement("li");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "bookCheckbox";
        checkbox.value = doc.id;
        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode("Title: " + book.title + ", Author: " + book.author + ", ID: " + book.id));
        booksList.appendChild(listItem);
      });
    }).catch(function(error) {
      console.log("Error getting books: ", error);
    });
  }
  
  function addToCart(selectedBooks) {
    var user = firebase.auth().currentUser;
    if (user) {
      var userId = user.uid;
      db.collection("users").doc(userId).get().then(function(doc) {
        if (doc.exists) {
          var userData = doc.data();
          var books = userData.books || [];
          books = books.concat(selectedBooks);
          db.collection("users").doc(userId).update({
            books: books
          }).then(function() {
            console.log("Books added to cart successfully!");
          }).catch(function(error) {
            console.log("Error adding books to cart: ", error);
          });
        } else {
          console.log("User data not found!");
        }
      }).catch(function(error) {
        console.log("Error getting user data: ", error);
      });
    }
  }
  