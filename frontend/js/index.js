function changeToSignUp() {
    document.forms[0].action="";
    document.forms[0].childNodes[1].innerHTML="Sign Up";
    var newFormContent = '<div class="input-container"><input type="text" name="fullName" id="fullName" required><label>Full Name</label></div>';
    document.getElementById("signUpContent").innerHTML= newFormContent;
    newFormContent += '<div class="input-container"><input type="email" name="email" id="email" required><label>Email</label></div>';
    document.forms[0].id="signup";
    newSubmitBtn = '<input type="submit" class="btn" value="Submit"><div id="haveAnAccount"><a href="index.html">Have an account?</a></div>';
    document.getElementById("buttons").innerHTML=newSubmitBtn;
}