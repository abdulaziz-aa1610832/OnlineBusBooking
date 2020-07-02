<?php
include("database.php");

error_reporting(E_ALL & ~E_NOTICE);

function verifySession()
{
    if (session_status() == PHP_SESSION_NONE) {
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
        if (verifySession()) {
            if (isset($_SESSION['username'])) {
                echo var_dump($_SESSION);
            }
        }
        break;

    case "doLogin":
        if (!isset($data->username) or !isset($data->password)) {
            die('{"success":false, "data":"data parameter should be in this format {\"username\":\"foo\", \"password\":\"bar\"}"}');
        }
        if (!verifySession()) {
            session_start();
        } else if ($_SESSION["Login"] == "true") {
            echo '{"success":true, "data":' . json_encode($_SESSION) . '}';
            break;
        }

        $submitted_username = $data->username;
        $submitted_password = $data->password;

        //sql query
        $sql = "";

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
        if (!verifySession() or $_SESSION["login"] != "true") {
            die('{"success":false, "data":"Not logged in!"}');
        }
        $submitted_origin = $data->origin or die('{"success":false, "data":"data parameter should be in this format {\"origin\":\"foo\", \"destination":\"bar\", \"date\":\"13/13/1313\"}');
        $submitted_destination = $data->destination or die('{"success":false, "data":"data parameter should be in this format {\"origin\":\"foo\", \"destination":\"bar\", \"date\":\"13/13/1313\"}');
        $submitted_date = $data->date or die('{"success":false, "data":"data parameter should be in this format {\"origin\":\"foo\", \"destination":\"bar\", \"date\":\"13/13/1313\"}');


        //sql query ( use the above variable with the select statement in addition to available seatc count is not zero) 
        //Don't care about sql injection :3
        $sql = "";
        try {
            $result = mysqli_query($conn, $sql);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $id = $r['route_id'];  // id
                $rows[$id] = $r;
            }
            echo '{"success":true, "data":' . json_encode($rows) . '}';
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "getAllBookings":
        if (!verifySession() or $_SESSION["login"] != "true") {
            die('{"success":false, "data":"Not logged in!"}');
        } else if ($_SESSION['level'] != "2") {
            die('{"success":false, "data":"Not admin!"}');
        }

        //sql query
        $sql = "";
        try {
            $result = mysqli_query($conn, $sql);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $id = $r['booking_id'];
                $rows[$id] = $r;
            }

            echo '{"success":true, "data":' . json_encode($rows) . '}';
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "getSession":
        if (!verifySession() or $_SESSION["login"] != "true") {
            die('{"success":false, "data":"Not logged in!"}');
        }
        echo '{"success":true, "data":' . json_encode($_SESSION) . '}';
        break;

    case "getSingleRouteInfo":
        if (!verifySession() or $_SESSION["login"] != "true") {
            die('{"success":false, "data":"Not logged in!"}');
        }

        $submitted_routeid = $data->routeId or die('{"success":false, "data":"data parameter should be in this format {"routeId":routeIdHere}');

        //sql query
        $sql = "";
        try {
            $result =  mysqli_query($conn, $sql);
            $count = mysqli_num_rows($result);
            if ($count == 1) {
                $row = mysqli_fetch_assoc($result);
                echo '{"success":"true", "data":' . json_encode($row) . '}';
            } else {
                die('{"success":false, "data":"Database returned more than one record for this routeId"}');
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;
    
    case "submitRoute":
        if (!verifySession() or $_SESSION["login"] != "true") {
            die('{"success":false, "data":"Not logged in!"}');
        }

        $submitted_routeid = $data->routeId or die('{"success":false, "data":"data parameter should be in this format {\"routeId\":routeIdHere}');
        $user_id = $_SESSION['id'];

        //sql query (insert booking, associate the user id with this record)(insert statement)
        $sql1 = "";
        //sql query (decrement available seats for this route) (update statement)
        $sql2 = "";
        try {
            if(mysqli_query($conn, $sql1)){
                if(mysqli_query($conn, $sql2)){
                    echo '{"success":"true", "data":""}';
                }else{
                    die('{"success":false, "data":"Booking added to the database but could not decrement available seats for this trip}');
                }
            }else{
                die('{"success":false, "data":"Could not add booking to the database"}');
            }
        } catch (Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;

    case "deleteBooking":
        if (!verifySession() or $_SESSION["login"] != "true") {
            die('{"success":false, "data":"Not logged in!"}');
        } else if ($_SESSION['level'] != "2") {
            die('{"success":false, "data":"Not admin!"}');
        }

        $submitted_booking_id = $data->bookingId or die('{"success":false, "data":"data parameter should be in this format {"bookingId":bookingIdHere}');

        //sql query (delete statement) (delete the booking from table bookings)
        $sql1 = "";

        //sql query (update statement) (increment available seats for the trip associated with this booking)
        $sql2 = "";

        try{
            if(mysqli_query($conn,$sql1)){
                if(mysqli_query($conn,$sql2)){
                    echo '{"success":"true", "data":""}';
                }else{
                    die('{"success":false, "data":"Booking deleted from the database but could not increment available seats for this trip}');
                }
            }else{
                die('{"success":false, "data":"Could not delete booking from the database"}');
            }
        }catch(Exception $e) {
            die('{"success":false, "data":"Unknown error -> ' . str_replace('"', '\"', $e->getMessage()) . '"}');
        }
        break;
}
