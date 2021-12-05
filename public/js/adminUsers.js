/**
 * TODO: 8.3 List all users (use <template id="user-template"> in users.html)
 *       - Each user should be put inside a clone of the template fragment
 *       - Each individual user HTML should look like this
 *         (notice the id attributes and values, replace "{userId}" with the actual user id)
 *
 *         <div class="item-row" id="user-{userId}">
 *           <h3 class="user-name" id="name-{userId}">Admin</h3>
 *           <p class="user-email" id="email-{userId}">admin@email.com</p>
 *           <p class="user-role" id="role-{userId}">admin</p>
 *           <button class="modify-button" id="modify-{userId}">Modify</button>
 *           <button class="delete-button" id="delete-{userId}">Delete</button>
 *         </div>
 *
 *       - Each cloned template fragment should be appended to <div id="users-container">
 *       - Use getJSON() function from utils.js to fetch user data from server
 *
 * TODO: 8.5 Updating/modifying and deleting existing users
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 *       - Use deleteResource() function from utils.js to delete users from server
 *       - Clicking "Delete" button of a user will delete the user and update the listing accordingly
 *       - Clicking "Modify" button of a user will use <template id="form-template"> to
 *         show an editing form populated with the values of the selected user
 *       - The edit form should appear inside <div id="modify-user">
 *       - Afted successful edit of user the form should be removed and the listing updated accordingly
 *       - You can use removeElement() from utils.js to remove the form.
 *       - Remove edit form from the DOM after successful edit or replace it with a new form when another
 *         user's "Modify" button is clicked. There should never be more than one form visible at any time.
 *         (Notice that the edit form has an id "edit-user-form" which should be unique in the DOM at all times.)
 *       - Also remove the edit form when a user is deleted regardless of which user is deleted.
 *       - Modifying a user successfully should show a notification message "Updated user {User Name}"
 *       - Deleting a user successfully should show a notification message "Deleted user {User Name}"
 *       - Use createNotification() function from utils.js to create notifications
 */

/**
 * TODO: 8.5 Updating/modifying and deleting existing users 
*/
const loadUser = async() =>{
    const userInfo = await getJSON("/api/users");
    const template = document.getElementById("user-template");
    const userContainer = document.getElementById("users-container");
    userInfo.forEach(item => {
        // Clone the template fragment
        const clonedDiv = template.content.cloneNode(true);
        const itemrow = clonedDiv.querySelector(".item-row");
        const name = clonedDiv.querySelector(".user-name");
        const email = clonedDiv.querySelector(".user-email");
        const role = clonedDiv.querySelector(".user-role");
        const modifybutton = clonedDiv.querySelector(".modify-button");
        const deletebutton = clonedDiv.querySelector(".delete-button");

        // set id
        itemrow.setAttribute("id","user-"+item._id);
        name.setAttribute("id","name-"+item._id);
        email.setAttribute("id","email-"+item._id);
        role.setAttribute("id","role-"+item._id);
        modifybutton.setAttribute("id","modify-"+item._id);
        deletebutton.setAttribute("id","delete-"+item._id);

        //added for 8.5 modify/delete handling
        modifybutton.setAttribute("onClick","modifyUser(this)");
        deletebutton.setAttribute("onClick","deleteUser(this)");

        //modify the clone template
        name.textContent = item.name;
        email.textContent = item.email;
        role.textContent = item.role;
        userContainer.appendChild(clonedDiv);
    
    });
};

const modifyUser = async(elem) =>{
    const id = elem.id.split("-");
    const url = "api/users/"+id[1];
    const userInfo = await getJSON(url);
    const template = document.getElementById("form-template");
    const modifyContainer = document.getElementById("modify-user");

    // Clone the template fragment
    const clonedDiv = template.content.cloneNode(true);
    const heading = clonedDiv.querySelector("h2");
    const userid = clonedDiv.querySelector("#id-input");
    const name = clonedDiv.querySelector("#name-input");
    const email = clonedDiv.querySelector("#email-input");
    const role = clonedDiv.querySelector("#role-input");

    //modify the clone template
    heading.textContent = "Modify user "+userInfo.name;
    userid.value = userInfo._id;
    name.value = userInfo.name;
    email.value = userInfo.email;
    role.value = userInfo.role;
    modifyContainer.innerHTML ="";
    modifyContainer.appendChild(clonedDiv);

    const update = document.getElementById("update-button");
    update.addEventListener('click',function(e){
        e.preventDefault();
        const newrole = role.value;
        const data = {...userInfo,role:newrole};
        postOrPutJSON(url,"PUT",data).then(response => {
            if(response){
                createNotification("Updated user "+response.name, "notifications-container", true);
                document.getElementById("role-"+response._id).textContent= response.role;
                removeElement("modify-user","edit-user-form");
            }
        });
    });
};

const deleteUser = (elem) =>{
    const id = elem.id.split("-");
    const url = "api/users/"+id[1];
    deleteResourse(url).then(response => {
        if(response){
            createNotification("Deleted user "+response.name, "notifications-container", true);
            removeElement("users-container","user-"+id[1]);
            removeElement("modify-user","edit-user-form");
        }
    });

};



/**
 * TODO: 8.3 List all users (use <template id="user-template"> in users.html) 
*/
(async function () {
    loadUser();
})();

