// listen to the click, once clicked, perform getUserName function.

document.getElementById("getUser")
.addEventListener('click', getUsername);


console.log(document.getElementById("password").value);

document.getElementById("getRoute")
.addEventListener('click', getRoutesInfo);


document.getElementById("login")
.addEventListener('submit', doLogin);

document.getElementById("submitRoute")
.addEventListener('submit', submitRoute);




function getSession(){

    fetch('http://127.0.0.1/busbooking/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=getSession&data={}`
    })
    .then((response_from_api) => response_from_api.json() )
    .then((data_from_json) => {

        if(data_from_json.success){
            // we get the session here, we return it as a json object for further use.
            return JSON.stringify(data_from_json.data);
        }
        else{
            // session is false
            alert(data_from_json.data);
            window.location("error.html");
        }

        
    })  


}



function getRoutesInfo(){

    // action=getRoutesInfo&data={"origin":"foo", "destination":"bar", "date":"13/13/1313"}

    let originFromForm = document.getElementById("orgin").value;
    let destinationFromForm = document.getElementById("destination").value;
    let dateFromForm = document.getElementById("date-of-travel").value;

    fetch('http://127.0.0.1/busbooking/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=getRoutesInfo&data={"origin":"${originFromForm}", "destination":"${destinationFromForm}", "date":"${dateFromForm}"}`
    })
    .then((response_from_api) => response_from_api.json() )
    .then((data_from_json) => {

        if(data_from_json.success){
            // we get the all the objects of routes, we return them for further use.
            console.log(data_from_json.data);
            return JSON.stringify(data_from_json.data);
        }
        else{
            // success is false, show what happend?
            alert(data_from_json.data);
            window.location("error.html");
        }

        
    }) 

}





function getSingleRouteInfo(routeNumber){
    
    fetch('http://127.0.0.1/busbooking/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=getSingleRouteInfo&data={"routeId":${routeNumber}}`
    })
    .then((response_from_api) => response_from_api.json())
    .then((data_from_json) =>{
         
        if(data_from_json){
            // returning one flight info (after user choses it.)
            return data_from_json.data; 
        }
        else{
            console.log(data_from_json.data);
            window.location("error.html");
        }
    })
}



function submitRoute(){

    //  going to prevent the page from reloading or
    // navigating away when you actually submit the form
    theEvent.preventDefault();

    let chosenRouteId = "";
    
    // looping through all available radio buttons(routes to choose from)
    // looking for the chosen(checked) one we get it's value(which is techincally 
    // the route id from getRoutesInf() function that we dynamically typed, no we submit the chosen one)
    let  elements = document.getElementsByTagName('input'); 
      
    for(i = 0; i < elements.length; i++) { 
          
        if(elements[i].type="radio") { 
            if(elements[i].checked){
                chosenRouteId = elements[i].value;
            }         
        } 
    } 

    fetch('http://127.0.0.1/busbooking/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=submitRoute&data={"routeId":${chosenRouteId}}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        
        if(data_from_json.success){
            // the route has been submitted
            window.location.href = "confirmedBooking.html";
        }
        else{
            // success was false
            alert("sometthing wrong happend, logging error to console");
            console.log(data_from_json.data);
            window.location.href = "error.html";
        }

    })

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
    fetch('http://127.0.0.1/busbooking/OnlineBusBooking/backend/api.php', {
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
            //window.location.replace("dashboard.html");
            console.log("success");
            console.log(data_from_json);
            if()
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

    



    fetch('http://127.0.0.1/busbooking/OnlineBusBooking/backend/api.php', {
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