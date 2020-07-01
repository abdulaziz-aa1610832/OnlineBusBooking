// listen to the click, once clicked, perform getUserName function.

document.getElementById("getUser")
.addEventListener('click', getUsername);

document.getElementById("getRoute")
.addEventListener('click', getRoutesInfo);


document.getElementById("login")
.addEventListener('submit', doLogin);

document.getElementById("submitRoute")
.addEventListener('submit', submitRoute);




function getSession(){

    fetch('api.php', {
        method:'POST',
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
            alert(data_from_json.error);
            window.location("error.html");
        }

        
    })  


}



function getRoutesInfo(){

    // action=getRoutesInfo&data={"origin":"foo", "destination":"bar", "date":"13/13/1313"}

    let originFromForm = document.getElementById("orgin").value;
    let destinationFromForm = document.getElementById("destination").value;
    let dateFromForm = document.getElementById("date-of-travel").value;

    fetch('api.php', {
        method:'POST',
        body: `action=getRoutesInfo&data={"origin":"${originFromForm}", "destination":"${destinationFromForm}", "date":"${dateFromForm}"}`
    })
    .then((response_from_api) => response_from_api.json() )
    .then((data_from_json) => {

        if(data_from_json.success){
            // we get the all the objects of routes, we return them for further use.
            return JSON.stringify(data_from_json.data);
        }
        else{
            // success is false, show what happend?
            alert(data_from_json.error);
            window.location("error.html");
        }

        
    }) 

}


function doLogin(theEvent){
    
    //  going to prevent the page from reloading or
    // navigating away when you actually submit the form
    theEvent.preventDefault();

    // extract data from the form.
    let userFromForm = document.getElementById("username").value;
    let passwordFromForm = document.getElementById("password").value;

    
    console.log("test");


    fetch('api.php', {
        method:'POST',
        body: `action=doLogin&data={username:${userFromForm}, password=${passwordFromForm}}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        if(data_from_json.success){  
            window.location.replace("dashboard.html");
        }
        else{
            console.log("api returned false for success, printing the log");
            console.log(data_from_json);
            
            // we can redirect to error page here
            window.location("error.html");
         }
    })

}



