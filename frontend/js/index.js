function changeToSignUp() {
    document.forms[0].action="";
    document.forms[0].childNodes[1].innerHTML="Sign Up";
    var newEmailForm = '<div class="input-container"><input type="email" name="email" id="email" required><label>Email</label></div>';
    document.getElementById("signUpEmail").innerHTML= newEmailForm;
    document.forms[0].id="signup";
    newSubmitBtn = '<input type="submit" class="btn" value="Submit"><div id="haveAnAccount"><a href="index.html">Have an account?</a></div>';
    document.getElementById("buttons").innerHTML=newSubmitBtn;
}