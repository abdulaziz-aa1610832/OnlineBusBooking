document.getElementById("button-submit").addEventListener('click', sendFeedback);


function sendFeedback(){

    console.log("submit clicked, feeback send starts now");

        // extract data from the form.
        let nameFromForm = document.getElementById("name").value;
        let emailFromForm = document.getElementById("email").value;
        let phoneFromForm = document.getElementById("phoneNo").value;
        let messageFromForm = document.getElementById("message").value;
    
    
        console.log("logging data to be submitted..");
        console.log("name: "+ nameFromForm);
        console.log("email: " + emailFromForm);
        console.log("phone: " + phoneFromForm);
        console.log("message: " + messageFromForm);
        
        fetch('http://127.0.0.1/OnlineBusBooking/backend/api.php', {
            method:'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            //action=sendFeedback&data{“name”:”nameHere”,”email”:”emailHere”,”phone”:”phoneHere”,”message”:”messageHere”}

            body: `action=sendFeedback&data={"name":"${nameFromForm}", "email":"${emailFromForm}", "phone":"${phoneFromForm}", "message":"${messageFromForm}"}`
        })
        .then((response_from_api) => response_from_api.json())
        .then(data_from_json => {
            if(data_from_json.success){
                console.log("succes: " + data_from_json)
                alert("Thank you for your feedback, we will reach out to you soon.");  
                window.location.replace("index.html");
            }
            else{
                console.log("api returned false for success, printing the log");
                console.log(data_from_json);
                alert("an error happend .");
                
                
                // we can redirect to error page here
               // window.location.replace("error.html");
             }
        })
    
}