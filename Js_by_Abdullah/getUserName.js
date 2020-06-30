// listen to the click, once clicked, perform getUserName function.

document.getElementById("buttonID")
.addEventListener('click', getUsername);





function getUsername(){

    fetch("users.json")
    .then((response_from_api) => response_from_api.json() )
    .then((data_from_json) => {

        //console.log(data_from_json)
        let output = '<h2>Users I got </h2>';
        data_from_json.forEach(function(user){

            output += `

            <ul>
            <li>UserId: ${user.id}<\li>
            <li>UserName: ${user.name}<\li>
            </ul>
             
            `;

            document.getElementById("output").innerHTML = output;
        })

    })
    

}