// JS functions for the main page

document.getElementById("loginBtn")
.addEventListener('click', validateLogin); //doLogin originally

document.getElementById("signupbtn")
.addEventListener('click', changeToSignUp);



//window.addEventListener("load", getSession);


function donothing(){

    console.log("donothing here..");
}

function getSession(){

    console.log("trying to fetch session ..");
    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=getSession&data={}`
    })
    .then((response_from_api) => response_from_api.json() )
    .then((data_from_json) => {
        console.log(data_from_json);
        if(data_from_json.success){

            if(data_from_json.data.level == "1"){
                console.log("admin user");
                window.location.href = "admin.html";
            }
            else{
                console.log("normal user");
                window.location.href = "dashboard.html";
            }


            return data_from_json;
        }
        else{
            console.log("user is not logged in, doin nothing....");
            // session is false
            // do nothing here
            //alert(data_from_json.data);
            //window.location("error.html");
        }   
    })  
}

function validateLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(username=="") {
        document.getElementById("usernameLoginError").style.display="block";
    } if(password=="") {
        document.getElementById("passwordLoginError").style.display="block";
    }
}

function changeToSignUp() {
    console.log("sign up clicked..");
    document.getElementById("login-box").style.display = "none";
    let emailRegex = "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;";
    let passwordRegex = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$";
    let newFormContent = `
    <form id="signupForm">
    <span class="text-center">Sign Up</span>
    <div id="form-container">
        <div>
            <div class="input-container">
                <input type="text" name="fullName" id="fullName" required>
                <label>Full Name</label>
            </div>
            <div class="input-container">
                <input type="email" name="email" id="email" required>
                <label>Email</label>
            </div>
            <div class="input-container"><input type="text" name="phoneNo" id="phoneNo" pattern="01[0-9]{8}"
                    title="Format: 01xxxxxxxx (Length: 10 digits)" required>
                <label>Phone Number</label>
            </div>
        </div>
        <div>
            <div class="input-container">
                <input type="text" name="username" id="username" required>
                <label>Username</label>
            </div>
            <div class="input-container" id="passwordSection">
                <input type="password" name="password" id="password" required>
                <label>Password</label>
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
   `
   document.getElementById("signup-box").innerHTML = newFormContent;
   document.getElementById("signup-box").style.display = "block";
}

function doLogin(theEvent){


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
    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=doLogin&data={"username":"${userFromForm}", "password":"${passwordFromForm}"}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        console.log("test after response.. converting to json next");
        
        if(data_from_json.success){
            console.log("success");
            console.log(data_from_json);
            if(data_from_json.data.level == "1"){
                console.log("admin user");
                window.location.href = "admin.html";
            }
            else{
                console.log("normal user");
                window.location.href = "dashboard.html";
            }

            
        }
        else{
            console.log("api returned false for success, printing the log");
            console.log(data_from_json);
            
            // we can redirect to error page here
            //window.location.replace("error.html");
         }
    })
    .catch(err => console.log(err))

}


function registerUser(){


    console.log("start register user..")


    // extract data from the form.
    let nameFromForm = document.getElementById("fullName").value;
    let userFromForm = document.getElementById("username").value;
    let passwordFromForm = document.getElementById("password").value;
    let emailFromForm = document.getElementById("email").value;
    let phoneFromForm = document.getElementById("phoneNo").value;


    console.log("logging data to be submitted..");
    console.log("user: " + userFromForm);
    console.log("name: "+ nameFromForm);
    console.log(passwordFromForm);
    console.log(emailFromForm);
    console.log(phoneFromForm);

    
    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=registerUser&data={"name":"${nameFromForm}", "username":"${userFromForm}", "password": "${passwordFromForm}", "phone":"${phoneFromForm}", "email":"${emailFromForm}"}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        if(data_from_json.success){
            console.log("succes: " + data_from_json)
            alert("Registration Successful, redirecting to main page so u can  login...");  
            window.location.replace("index.html");
        }
        else{
            console.log("api returned false for success, printing the log");
            console.log(data_from_json);
            alert("an error happend .");
            
            
            // we can redirect to error page here
            //window.location.replace("error.html");
         }
    })


}


