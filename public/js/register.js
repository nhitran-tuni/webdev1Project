/**
 * TODO: 8.3 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

 document.getElementById("btnRegister").addEventListener("click",(event) =>{
    event.preventDefault();

    const password =  document.querySelector("#password").value;
    const passwordConfirmation = document.querySelector("#passwordConfirmation").value;
    const name =  document.querySelector("#name").value;
    const email = document.querySelector("#email").value;

    if ( password !== passwordConfirmation ){
        createNotification("Password does not matched", "notifications-container", false);
    }
    else {
        const newUser = {name : name, email : email, password : password};
        postOrPutJSON("/api/register", "POST", newUser);
        createNotification("Successful registration", "notifications-container", true);
        document.querySelector("#register-form").reset();
    }
 });
