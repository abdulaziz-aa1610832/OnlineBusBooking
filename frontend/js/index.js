// JS functions for the main page

document.getElementById("login")
.addEventListener('submit', doLogin);


window.addEventListener("load", getSession);


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
            // we get the session here, we return it as a json object for further use.
            return data_from_json;
        }
        else{
            // session is false
            alert(data_from_json.data);
            //window.location("error.html");
        }   
    })  
}

function checkOnLoad(){

    // //let session = getSession();
    // if(session.loin){
    //     console.log("user already logged, rediredting..");
    //     window.location.replace("127.0.0.1/OnlineBusBooking/frontend/dashboard.html");
    // }
    // else{
    //     console.log("user no logged, do nothing..");
    // }

}

function changeToSignUp() {
    document.forms[0].action="";
    document.forms[0].id="signup";
    document.forms[0].childNodes[1].innerHTML="Sign Up";
    var newFormContent = '<div class="input-container"><input type="text" name="fullName" id="fullName" required><label>Full Name</label></div>';
    newFormContent += '<div class="input-container"><input type="email" name="email" id="email" required><label>Email</label></div>';
    newFormContent += '<div class="input-container"><input type="text" name="phoneNo" id="phoneNo" required><label>Phone Number</label></div>';
    document.getElementById("signUpContent").innerHTML= newFormContent;
    newSubmitBtn = '<input type="submit" class="btn" value="Submit"><div id="haveAnAccount"><a href="index.html">Have an account?</a></div>';
    document.getElementById("buttons").innerHTML=newSubmitBtn;
}
function validateInput() {
    //will add the implementation
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
                window.location.replace("admin.html");
            }
            else{
                console.log("normal user");
                window.location.replace("dashboard.html");
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


function registerUser(theEvent){
    //  going to prevent the page from reloading or
    // navigating away when you actually submit the form
    theEvent.preventDefault();

    // extract data from the form.
    let nameFromForm = document.getElementById("fullName").value;
    let userFromForm = document.getElementById("username").value;
    let passwordFromForm = document.getElementById("password").value;

    



    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=registerUser&data={"name":${nameFromFrom}, “username”:${userFromForm}, “password”: ${passwordFromForm}}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        if(data_from_json.success){
            alert("Registration Successful, redirecting to main pagel login...");  
            window.location.replace("index.html");
        }
        else{
            console.log("api returned false for success, printing the log");
            console.log(data_from_json);
            alert("an error happend .");
            
            
            // we can redirect to error page here
            window.location.replace("error.html");
         }
    })


}


