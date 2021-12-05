/**
 * TODO: 11.3.5 Register new product
 */

document.getElementById("btnProduct").addEventListener("click",(event) =>{
    event.preventDefault();
    console.log("newProduct");
    const image =  document.querySelector("#image").value;
    const price = document.querySelector("#price").value;
    const name =  document.querySelector("#name").value;
    const description = document.querySelector("#description").value;

    if ( Number(price) <=0 ){
        createNotification("Price should be above 0", "notifications-container", false);
    }
    if ( description.length < 10 ){
        createNotification("Description should be atleast 10 charachter", "notifications-container", false);
    }
    if (!image.match(/^(http|https):\/\/\S+\.\w{2,}\/*\S*$/)){
        createNotification("Provide correct Url", "notifications-container", false);
    }
    else {
        const newProduct = {name : name, description : description, image : image, price: Number(price)};
        postOrPutJSON("/api/products","POST",newProduct).then(response => {
           console.log(response)
            if(response){
                createNotification("Successful creation", "notifications-container", true);
                document.querySelector("#product-form").reset();
            }
        });
        
    }
 });
