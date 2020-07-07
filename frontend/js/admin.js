document.getElementById("adminLogout").addEventListener('click', doLogout)
window.addEventListener("load", getSession);
window.addEventListener("load", getAllBookings);

// listening to the submit, because it's added dynamically, we need to listen this way..
document.addEventListener('click',function(e){
    if(e.target && e.target.id == 'confirm-btn'){
          //do something
          console.log("confirm pressed")
          confirmBooking();
          
     }


     if(e.target && e.target.id == 'delete-btn'){
        //do something
        console.log("delete pressed")
        deleteBooking();
        
   }
 });



 function getSession() {

    console.log("trying to fetch session ..");
    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `action=getSession&data={}`
    })
        .then((response_from_api) => response_from_api.json())
        .then((data_from_json) => {
            console.log(data_from_json);
            if (data_from_json.success) {
                // we get the session here, we return it as a json object for further use.
                
                document.getElementById("userNamePic").innerHTML = `${data_from_json.data.username}`;
                return data_from_json;
    
            }
            else {
                // session is false
                alert("something went wrong: "+ data_from_json.data);
                window.location.href = "index.html";
            }
        })
    }

function doLogout(theEvent){
    
    console.log("do logout starts..");
    //  going to prevent the page from reloading or
    // navigating away when you actually submit the form
    theEvent.preventDefault();

    console.log("before fetch.. trying to fetch");
    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=doLogout&data={}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        console.log("test after response.. converting to json next");
        
        if(data_from_json.success){  
            //window.location.replace("dashboard.html");
            console.log("success");
            console.log(data_from_json);
            window.location.replace("index.html");
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



function getAllBookings(){


    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=getAllBookings&data={}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_in_json => {
        if(data_in_json.success){  
            console.log("success is true..")

            let divToInsert = `<table class="content-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking id</th>
                <th>Date</th>
                <th>Name</th>
                <th>Origin</th>
                <th>Destination</th>   
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
  `;
            for (i in data_in_json.data) {
                console.log(data_in_json[i]);
                if (data_in_json.data[i].status == 1) {
                    data_in_json.data[i].status = "confirmed";
                    divToInsert += `<tr class="active-row">
                    <td><input type="radio" id="${data_in_json.data[i].bookingid}" name="booking" value="${data_in_json.data[i].bookingid}"></td>
                    <td>${data_in_json.data[i].bookingid}</td>
                    <td>${data_in_json.data[i].date}</td>
                    <td>${data_in_json.data[i].name}</td>
                    <td>${data_in_json.data[i].origin}</td>
                    <td>${data_in_json.data[i].destination}</td>
                    <td>${data_in_json.data[i].payment}</td>
                    <td>${data_in_json.data[i].status}</td>
                </tr>`;
            }
                else{
                    data_in_json.data[i].status = "pending";
                    divToInsert += `<tr>
                    <td><input type="radio" id="${data_in_json.data[i].bookingid}" name="booking" value="${data_in_json.data[i].bookingid}"></td>
                    <td>${data_in_json.data[i].bookingid}</td>
                    <td>${data_in_json.data[i].date}</td>
                    <td>${data_in_json.data[i].name}</td>
                    <td>${data_in_json.data[i].origin}</td>
                    <td>${data_in_json.data[i].destination}</td>
                    <td>${data_in_json.data[i].payment}</td>
                    <td>${data_in_json.data[i].status}</td>
                </tr>`;
            }
                }
            divToInsert += `</tbody>
    </table>
    <button type="button" id="confirm-btn">Confirm</button>
        <button type="button" id="delete-btn">Delete</button>`
            document.getElementById("tableData").innerHTML = divToInsert;
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



function confirmBooking(){
    // action=confirmBooking&data={"bookingId":4}

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
    
    console.log("the chose route id is .. ");
    console.log(chosenRouteId);

    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=confirmBooking&data={"bookingId":${chosenRouteId}}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        
        if(data_from_json.success){
            // the route has been submitted
            console.log("successful");
            location.reload();
           // window.location.href = "confirmedBooking.html";
        }
        else{
            // success was false
            console.log("sometthing wrong happend, logging error to console");
            console.log(data_from_json.data);
            //window.location.href = "error.html";
        }

    })
}



function deleteBooking(){
    //action=deleteBooking&data={“bookingId”:id_here}

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
    
    console.log("the chose route id is .. ");
    console.log(chosenRouteId);

    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: `action=deleteBooking&data={"bookingId":${chosenRouteId}}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        
        if(data_from_json.success){
            // the route has been submitted
            console.log("successful");
            alert("succesully delete");
            location.reload();
           // window.location.href = "confirmedBooking.html";
        }
        else{
            // success was false
            console.log("sometthing wrong happend, logging error to console");
            console.log(data_from_json.data);
            //window.location.href = "error.html";
        }

    })
}