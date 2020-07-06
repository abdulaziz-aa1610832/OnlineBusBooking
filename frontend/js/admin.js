window.addEventListener("load", getSession);


function getSession(){

    console.log("trying to fetch ..");
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