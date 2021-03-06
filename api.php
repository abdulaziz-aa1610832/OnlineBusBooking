<?php
include("database.php");

error_reporting(E_ALL & ~E_NOTICE);
session_start();

function isLoggedIn()
{
    if ($_SESSION['login'] != "true") {
        return FALSE;
    } else {
        return TRUE;
    }
}

$action = $_REQUEST['action'] or die('{"success":false, "data":"action parameter required!"}');
$data = json_decode($_REQUEST['data']) or die('{"success":false, "data":"Parameter data must be valid json!"}');

switch ($action) {
    case "testAction":
        session_start();
        if (isLoggedIn()) {
            if (isset($_SESSION['username'])) {
                echo var_dump($_SESSION);
            }
        }
        break;

    case "doLogin":
        if (!isset($data->username) or !isset($data->password)) {
            die('{"success":false, "data":"data parameter should be in this format {\"username\":\"foo\", \"password\":\"bar\"}"}');
        }
        if (isLoggedIn()) {
            echo '{"success":true, "data":' . json_encode($_SESSION) . '}';
            break;
        }

        $submitted_username = $data->username;
        $submitted_password = $data->password;

        //sql query
        $sql = "SELECT * FROM users where username = '$submitted_username' AND password = '$submitted_password' LIMIT 1;";

        try {
            $result  = mysqli_query($conn, $sql);
            $count   = mysqli_num_rows($result);
            if ($count == 1) {
                $row = mysqli_fetch_assoc($result);
                $user_name = $row["username"];
                $user_id = $row["userid"];
                $user_level = $row["level"];

                $_SESSION["login"] = "true";
                $_SESSION["username"] = $user_name;
                $_SESSION["id"] = $user_id;
                $_SESSION["level"] = $user_level;

                echo '{"success":true, "data":' . json_encode($_SESSION) . '}';
            } else {
                echo '{"success":false, "data":"username or password is invalid!"}';
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "getRoutesInfo":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        }
        $submitted_origin = $data->origin or die('{"success":false, "data":"data parameter should be in this format {\"origin\":\"foo\", \"destination\":\"bar\", \"date\":\"13/13/1313\"}"}');
        $submitted_destination = $data->destination or die('{"success":false, "data":"data parameter should be in this format {\"origin\":\"foo\", \"destination\":\"bar\", \"date\":\"13/13/1313\"}"}');
        $submitted_date = $data->date or die('{"success":false, "data":"data parameter should be in this format {\"origin\":\"foo\", \"destination":\"bar\", \"date\":\"13/13/1313\"}"}');


        //sql query ( use the above variable with the select statement in addition to available seatc count is not zero) 
        //Don't care about sql injection :3
        $sql = "SELECT * FROM routes WHERE origin = '$submitted_origin' AND destination = '$submitted_destination' AND date = '$submitted_date' AND available_seats_count > 0;";
        try {
            $result = mysqli_query($conn, $sql);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $id = $r['routeid'];  // id
                $rows[$id] = $r;
            }
            echo '{"success":true, "data":' . json_encode($rows) . '}';
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "getAllBookings":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        } else if ($_SESSION['level'] != "1") {
            die('{"success":false, "data":"Not admin!"}');
        }

        //sql query (Will get back to this)
        $sql = "SELECT booking.bookingid,users.name,
                        routes.origin,routes.destination,routes.date,
                    routes.time,booking.payment,booking.status
                FROM booking
                INNER JOIN routes
                    ON booking.routeid = routes.routeid
                INNER JOIN  users
                    ON booking.userid = users.userid;";
        try {
            $result = mysqli_query($conn, $sql);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $id = $r['bookingid'];
                $rows[$id] = $r;
            }

            echo '{"success":true, "data":' . json_encode($rows) . '}';
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "getSession":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        }
        echo '{"success":true, "data":' . json_encode($_SESSION) . '}';
        break;

    case "getSingleRouteInfo":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        }

        $submitted_routeid = $data->routeId or die('{"success":false, "data":"data parameter should be in this format {\"routeId\":routeIdHere}"}');

        //sql query
        $sql = "SELECT * FROM routes WHERE routeid = $submitted_routeid;";
        try {
            $result =  mysqli_query($conn, $sql);
            $count = mysqli_num_rows($result);
            if ($count == 1) {
                $row = mysqli_fetch_assoc($result);
                echo '{"success":true, "data":' . json_encode($row) . '}';
            } else {
                die('{"success":false, "data":"Database returned more than one record for this routeId"}');
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "submitRoute":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        }

        $submitted_routeid = $data->routeId or die('{"success":false, "data":"data parameter should be in this format {\"routeId\":routeIdHere}"}');
        $user_id = $_SESSION['id'];

        //sql query (insert booking, associate the user id with this record)(insert statement)
        $sql1 = "INSERT INTO booking VALUES (DEFAULT,$user_id,$submitted_routeid,(SELECT cost from routes where routeid=$submitted_routeid),0);";
        //sql query (decrement available seats for this route) (update statement)
        $sql2 = "UPDATE routes SET available_seats_count = available_seats_count-1 WHERE  routeid = $submitted_routeid;";
        try {
            if (mysqli_query($conn, $sql1)) {
                if (mysqli_query($conn, $sql2)) {
                    echo '{"success":true, "data":""}';
                } else {
                    die('{"success":false, "data":"Booking added to the database but could not decrement available seats for this trip}');
                }
            } else {
                die('{"success":false, "data":"Could not add booking to the database"}');
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "deleteBooking":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        } else if ($_SESSION['level'] != "1") {
            die('{"success":false, "data":"Not admin!"}');
        }

        $submitted_booking_id = $data->bookingId or die('{"success":false, "data":"data parameter should be in this format {\"bookingId\":bookingIdHere}"}');
        //sql query (get route id associated with this booking)
        $sql1 = "SELECT routeid from booking WHERE bookingid = $submitted_booking_id;";

        //sql query (delete statement) (delete the booking from table bookings)
        $sql2 = "DELETE FROM booking WHERE bookingid = $submitted_booking_id;";

        try {
            $result = mysqli_query($conn, $sql1);
            if (mysqli_num_rows($result) == 1) {
                $r = mysqli_fetch_assoc($result);
                $route_id = $r['routeid'];
            } else {
                die('{"success":false, "data":"Booking doesn not exist"}');
            }

            //sql query (update statement) (increment available seats for the trip associated with this booking)
            $sql3 = "UPDATE routes SET available_seats_count = available_seats_count+1 WHERE  routeid = $route_id;";
            if (mysqli_query($conn, $sql2)) {
                if (mysqli_query($conn, $sql3)) {
                    echo '{"success":true, "data":""}';
                } else {
                    die('{"success":false, "data":"Booking deleted from the database but could not increment available seats for this trip"}');
                }
            } else {
                die('{"success":false, "data":"Could not delete booking from the database"}');
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "getUserBookings":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        }

        $user_id = $_SESSION['id'];

        //sql query (Select bookings made by the user with $user_id)
        $sql = "SELECT booking.bookingid,users.name,
                        routes.origin,routes.destination,routes.date,
                        routes.time,booking.payment,booking.status
        FROM booking
        INNER JOIN routes
            ON booking.routeid = routes.routeid
        INNER JOIN  users
            ON booking.userid = users.userid
        WHERE users.userid = $user_id;";
        try {
            $result = mysqli_query($conn, $sql);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $id = $r['bookingid'];
                $rows[$id] = $r;
            }

            echo '{"success":true, "data":' . json_encode($rows) . '}';
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "confirmBooking":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        } else if ($_SESSION['level'] != "1") {
            die('{"success":false, "data":"Not admin!"}');
        }

        $submitted_booking_id = $data->bookingId or die('{"success":false, "data":"data parameter should be in this format {\"bookingId\":bookingIdHere}"}');

        //sql query
        $sql = "UPDATE booking SET status = 1 WHERE  bookingid = $submitted_booking_id;";

        try {
            if (mysqli_query($conn, $sql)) {
                echo '{"success":true, "data":""}';
            } else {
                die('{"success":false, "data":"Could not confirm booking"}');
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "registerUser":

        $submitted_name = $data->name or die('{"success":false, "data":"data parameter should be in this format {\"name\":nameFromFrom, \"username\":userFromForm, \"password\": passwordFromForm, \"phone\":phoneFromForm, \"email\":emailFromForm}"}');
        $submitted_username = $data->username or die('{"success":false, "data":"data parameter should be in this format {\"name\":nameFromFrom, \"username\":userFromForm, \"password\": passwordFromFormm, \"phone\":phoneFromForm, \"email\":emailFromForm}"}');
        $submitted_password = $data->password or die('{"success":false, "data":"data parameter should be in this format {\"name\":nameFromFrom, \"username\":userFromForm, \"password\": passwordFromFormm, \"phone\":phoneFromForm, \"email\":emailFromForm}"}');
        $submitted_phonenumber = $data->phone or die('{"success":false, "data":"data parameter should be in this format {\"name\":nameFromFrom, \"username\":userFromForm, \"password\": passwordFromFormm, \"phone\":phoneFromForm, \"email\":emailFromForm}"}');
        $submitted_email = $data->email or die('{"success":false, "data":"data parameter should be in this format {\"name\":nameFromFrom, \"username\":userFromForm, \"password\": passwordFromFormm, \"phone\":phoneFromForm, \"email\":emailFromForm}"}');

        //sql query
        $sql = "INSERT INTO users VALUES (DEFAULT, '$submitted_name', '$submitted_phonenumber' , '$submitted_email', '$submitted_username', 2, '$submitted_password')";

        try {
            if (mysqli_query($conn, $sql)) {
                echo '{"success":true, "data":""}';
            } else {
                die('{"success":false, "data":"Could not register user"}');
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }

        break;

    case "doLogout":
        $_SESSION = array();
        session_unset();
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        session_destroy();
        if ($_SESSION == array()) {
            echo '{"success":true, "data":""}';
        } else {
            echo '{"success":false, "data":"Could not logout!"}';
        }
        break;

    case "sendFeedback":
        $submitted_name = $data->name or die('{"success":false, "data":"data parameter should be in this format {\"name\":\"nameHere\",\"email\":\"emailHere\",\"phone\":\"phoneHere\",\"message\":\"messageHere\"}"}');
        $submitted_email = $data->email or die('{"success":false, "data":"data parameter should be in this format {\"name\":\"nameHere\",\"email\":\"emailHere\",\"phone\":\"phoneHere\",\"message\":\"messageHere\"}"}');
        $submitted_phone = $data->phone or die('{"success":false, "data":"data parameter should be in this format {\"name\":\"nameHere\",\"email\":\"emailHere\",\"phone\":\"phoneHere\",\"message\":\"messageHere\"}"}');
        $submitted_message = $data->message or die('{"success":false, "data":"data parameter should be in this format {\"name\":\"nameHere\",\"email\":\"emailHere\",\"phone\":\"phoneHere\",\"message\":\"messageHere\"}"}');

        //sql query (insert statement)
        $sql = "INSERT INTO feedback (`name`,`email`,`phoneno`,`message`) VALUES 
                ('$submitted_name','$submitted_email','$submitted_phone','$submitted_message');";

        try {
            if (mysqli_query($conn, $sql)) {
                echo '{"success":true, "data":""}';
            } else {
                echo '{"success":false, "data":"Could not send feedback!"}';
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "getFeedback":
        if (!isLoggedIn()) {
            die('{"success":false, "data":"Not logged in!"}');
        } else if ($_SESSION['level'] != "1") {
            die('{"success":false, "data":"Not admin!"}');
        }

        //sql query (select statement)
        $sql = "SELECT * FROM feedback;";

        try {
            $result = mysqli_query($conn, $sql);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $id = $r['msgid'];
                $rows[$id] = $r;
            }

            echo '{"success":true, "data":' . json_encode($rows) . '}';
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;
}
