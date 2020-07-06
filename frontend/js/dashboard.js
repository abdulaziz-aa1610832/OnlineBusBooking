document.getElementById("logoutbtn").addEventListener('click', doLogout)
window.addEventListener("load", getSession);
document.getElementById("submitbutton").addEventListener('click', getRoutesInfo);



// listening to the submit, because it's added dynamically, we need to listen this way..
document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'buy-btn'){
          //do something
          console.log("submit pressed")
          submitRoute();
     }
 });


function sortTicket() {
    var sortingMethod = document.getElementById("sorting").value;
    if (sortingMethod == "price-low-to-high"){
        // do something here
    } else if (sortingMethod == "price-high-to-low") {
        // do something here 
    }
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




function getRoutesInfo() {

  let selectOriginList = document.getElementById("from-place-id");
  let selectDestinationList = document.getElementById("to-place-id");


  let originFromForm = selectOriginList.options[selectOriginList.selectedIndex].text;
  let destinationFromForm = selectDestinationList.options[selectDestinationList.selectedIndex].text;
  let dateFromForm = document.getElementById("date-of-travel").value;
  // 2 0 2 0 - 1 0 - 2 2
  // 0 1 2 3 4 5 6 7 8 9 10
  let dateToSubmit = dateFromForm.substring(8);
  dateToSubmit+="/";
  dateToSubmit+=dateFromForm.substring(5,7);
  dateToSubmit+="/";
  dateToSubmit+=dateFromForm.substring(0,4);

  console.log("before fetch, checking input..");
  console.log(originFromForm);
  console.log(destinationFromForm);
  console.log(dateFromForm);
  console.log(dateToSubmit);
  fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `action=getRoutesInfo&data={"origin":"${originFromForm}", "destination":"${destinationFromForm}", "date":"${dateToSubmit}"}`
  })
    .then((response_from_api) => response_from_api.json())
    .then((data_in_json) => {
      console.log("logging data in json...");
      console.log(data_in_json);
      let divToInsert = `<select id="sorting" onchange="sortTicket()">
<option value="price-low-to-high">Price: Low to High</option>
<option value="price-high-to-low">Price: High to Low</option>
</select>
<form id="buyTicket" action="" method="post">
<table class="trips">
<thead>
    <tr>
               <th>Date</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departure Time</th>
              <th>Price</th>
              <th>Available Seats</th>
              <th>Select</th>
    </tr>
  </thead>
  <tbody>
  `;

/*
data: {…}
​​
1913: {…}
​​​
  available_seats_count: "23"
  ​​​
  cost: "51"
  ​​​
  date: "22/10/2020"
  ​​​
  destination: "Sabah"
  ​​​
  origin: "Johor Bahru"
  ​​​
  routeid: "1913"
  ​​​
  time: "9:30AM"
*/

      for (i in data_in_json.data) {
        divToInsert += `<tr>
              <td>${data_in_json.data[i].date}</td>
              <td>${data_in_json.data[i].origin}</td>
              <td>${data_in_json.data[i].destination}</td>
              <td>${data_in_json.data[i].time}</td>
              <td>${data_in_json.data[i].cost}</td>
              <td>${data_in_json.data[i].available_seats_count}</td>
              <td><input type="radio" name="tickets" value="${data_in_json.data[i].routeid}" /></td>
            </tr>`;
      }



      divToInsert += `</tbody>
  </table>
  <button type="button" class="btn" id="buy-btn">Buy Ticket</button>       

      </form>
    `
      document.getElementById("after-submit").innerHTML = divToInsert;


    })

}




function getSingleRouteInfo(routeNumber){
    
    fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
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
        body: `action=submitRoute&data={"routeId":${chosenRouteId}}`
    })
    .then((response_from_api) => response_from_api.json())
    .then(data_from_json => {
        
        if(data_from_json.success){
            // the route has been submitted
            console.log("successful");
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