// JS functions for the main page

document.getElementById("loginBtn").addEventListener("click", doLogin);

document.getElementById("signupbtn").addEventListener("click", changeToSignUp);

window.addEventListener("load", getSession);

function donothing() {
  console.log("donothing here..");
}

function getSession() {
  console.log("trying to fetch session ..");
  fetch("./api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `action=getSession&data={}`,
  })
    .then((response_from_api) => response_from_api.json())
    .then((data_from_json) => {
      console.log(data_from_json);
      if (data_from_json.success) {
        if (data_from_json.data.level == "1") {
          console.log("admin user");
          window.location.href = "admin.html";
        } else if (data_from_json.data.level == "2") {
          console.log("normal user");
          window.location.href = "dashboard.html";
        }

        return data_from_json;
      } else {
        console.log("user is not logged in, doin nothing....");
        // session is false
        // do nothing here
      }
    });
}

function validateLogin() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let canLogin = true;
  document.getElementById("usernameLoginError").innerHTML = "";
  document.getElementById("passwordLoginError").innerHTML = "";

  if (username == "") {
    document.getElementById("usernameLoginError").innerHTML =
      "Username required*";
    canLogin = false;
  }
  if (password == "") {
    document.getElementById("passwordLoginError").innerHTML =
      "Password required*";
    canLogin = false;
  }
  return canLogin;
}

function validateSignUp() {
  let fullName = document.getElementById("fullName").value;
  let email = document.getElementById("email").value;
  let phoneNo = document.getElementById("phoneNo").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let canRegister = true;
  document.getElementById("fullNameSignUpError").innerHTML = "";
  document.getElementById("emailSignUpError").innerHTML = "";
  document.getElementById("phoneNoSignUpError").innerHTML = "";
  document.getElementById("usernameSignUpError").innerHTML = "";
  document.getElementById("passwordSignUpError").innerHTML = "";

  if (fullName == "") {
    document.getElementById("fullNameSignUpError").innerHTML =
      "Full name required*";
    canRegister = false;
  }
  if (email == "") {
    document.getElementById("emailSignUpError").innerHTML = "Email required*";
    canRegister = false;
  }
  if (phoneNo == "") {
    document.getElementById("phoneNoSignUpError").innerHTML =
      "Phone number required*";
    canRegister = false;
  }
  if (isNaN(phoneNo)) {
    document.getElementById("phoneNoSignUpError").innerHTML =
      "Digits allowed only*";
    canRegister = false;
  }
  if (username == "") {
    document.getElementById("usernameSignUpError").innerHTML =
      "Username required*";
    canRegister = false;
  }
  if (password.length < 8) {
    document.getElementById("passwordSignUpError").innerHTML =
      "Minimum length: 8 characters*";
    canRegister = false;
  }
  if (password == "") {
    document.getElementById("passwordSignUpError").innerHTML =
      "Password required*";
    canRegister = false;
  }
  return canRegister;
}

function changeToSignUp() {
  console.log("sign up clicked..");
  document.getElementById("login-box").style.display = "none";
  let newFormContent = `
   <form id="signupForm">
   <span class="text-center">Sign Up</span>
   <div id="form-container">
       <div>
           <div class="input-container">
               <input type="text" name="fullName" id="fullName">
               <label>Full Name</label>
               <p id="fullNameSignUpError"></p>
           </div>
           <div class="input-container">
               <input type="email" name="email" id="email">
               <label>Email</label>
               <p id="emailSignUpError"></p>
           </div>
           <div class="input-container">
               <input type="text" name="phoneNo" id="phoneNo">
               <label>Phone Number</label>
               <p id="phoneNoSignUpError"></p>
           </div>
       </div>
       <div>
           <div class="input-container">
               <input type="text" name="username" id="username">
               <label>Username</label>
               <p id="usernameSignUpError"></p>
           </div>
           <div class="input-container" id="passwordSection">
               <input type="password" name="password" id="password">
               <label>Password</label>
               <p id="passwordSignUpError"></p>
           </div>
       </div>
   </div>
   <div id="buttons">
   
       <a class="btn" onclick="registerUser()" id="regbtn">Register</a>
       <div id="haveAnAccount">
           <a href="index.html">Have an account?</a>
       </div>
   </div>
</form>
  `;
  document.getElementById("signup-box").innerHTML = newFormContent;
  document.getElementById("signup-box").style.display = "block";
}

function doLogin(theEvent) {
  if (validateLogin()) {
    console.log("do login starts..");
    //  going to prevent the page from reloading or
    // navigating away when you actually submit the form
    theEvent.preventDefault();

    // extract data from the form.
    let userFromForm = document.getElementById("username").value;
    let passwordFromForm = document.getElementById("password").value;

    console.log("data from form...");
    console.log(userFromForm);
    console.log(passwordFromForm);

    console.log("before fetch.. trying to fetch");
    fetch("./api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=doLogin&data={"username":"${userFromForm}", "password":"${passwordFromForm}"}`,
    })
      .then((response_from_api) => response_from_api.json())
      .then((data_from_json) => {
        console.log("test after response.. converting to json next");

        if (data_from_json.success) {
          console.log("success");
          console.log(data_from_json);
          if (data_from_json.data.level == "1") {
            console.log("admin user");
            window.location.href = "admin.html";
          } else {
            console.log("normal user");
            window.location.href = "dashboard.html";
          }
        } else {
          console.log("api returned false for success, printing the log");
          console.log(data_from_json);
          document.getElementById("passwordLoginError").innerHTML =
            data_from_json.data;
          // we can redirect to error page here
          //window.location.replace("error.html");
        }
      })
      .catch((err) => console.log(err));
  } else {
  }
}

function registerUser() {
  if (validateSignUp()) {
    console.log("start register user..");

    // extract data from the form.
    let nameFromForm = document.getElementById("fullName").value;
    let userFromForm = document.getElementById("username").value;
    let passwordFromForm = document.getElementById("password").value;
    let emailFromForm = document.getElementById("email").value;
    let phoneFromForm = document.getElementById("phoneNo").value;

    console.log("logging data to be submitted..");
    console.log("user: " + userFromForm);
    console.log("name: " + nameFromForm);
    console.log(passwordFromForm);
    console.log(emailFromForm);
    console.log(phoneFromForm);

    fetch("./api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=registerUser&data={"name":"${nameFromForm}", "username":"${userFromForm}", "password": "${passwordFromForm}", "phone":"${phoneFromForm}", "email":"${emailFromForm}"}`,
    })
      .then((response_from_api) => response_from_api.json())
      .then((data_from_json) => {
        if (data_from_json.success) {
          console.log("succes: " + data_from_json);
          alert(
            "Registration Successful, redirecting to main page so u can  login..."
          );
          window.location.replace("index.html");
        } else {
          console.log("api returned false for success, printing the log");
          console.log(data_from_json);
          alert("an error happend .");

          // we can redirect to error page here
          //window.location.replace("error.html");
        }
      });
  } else {
  }
}
