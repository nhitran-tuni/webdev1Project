// load product list
const loadProducts = async(productInfo) =>{
    const template = document.getElementById("product-template");
    const productContainer = document.getElementById("products-container");
    productInfo.forEach(item => {
        // Clone the template fragment
        const clonedDiv = template.content.cloneNode(true);
        const itemrow = clonedDiv.querySelector(".item-row");
        const name = clonedDiv.querySelector(".product-name");
        const description = clonedDiv.querySelector(".product-description");
        const price = clonedDiv.querySelector(".product-price");
        const image = clonedDiv.querySelector(".product-image");
        const addtocartbutton = clonedDiv.querySelector(".cart-button");
        const modifybutton = clonedDiv.querySelector(".modify-button");
        const deletebutton = clonedDiv.querySelector(".delete-button");

        // set id
        itemrow.setAttribute("id","product-"+item._id);
        name.setAttribute("id","name-"+item._id);
        description.setAttribute("id","description-"+item._id);
        price.setAttribute("id","price-"+item._id);
        image.setAttribute("id","image-"+item._id);
        image.setAttribute("src",item.image);
        image.setAttribute("alt",item.name);
        image.setAttribute("width", "150");
        image.setAttribute("height", "150");
        modifybutton.setAttribute("id","modify-"+item._id);
        deletebutton.setAttribute("id","delete-"+item._id);
        addtocartbutton.setAttribute("id","add-to-cart-"+item._id);

        addtocartbutton.setAttribute("onClick","addProductToCart('"+item._id +"','"+ item.name+"')");
        modifybutton.setAttribute("onClick","modifyProduct(this)");
        deletebutton.setAttribute("onClick","deleteProduct(this)");

        //modify the clone template
        name.textContent = item.name;
        description.textContent = item.description;
        price.textContent = item.price;
        productContainer.appendChild(clonedDiv);
    
    });
};

const modifyProduct = async(elem) =>{
    const id = elem.id.split("-");
    const url = "api/products/"+id[1];
    const productInfo = await getJSON(url);
    const template = document.getElementById("form-template");
    const modifyContainer = document.getElementById("modify-product");

    // Clone the template fragment
    const clonedDiv = template.content.cloneNode(true);
    const heading = clonedDiv.querySelector("h2");
    const productid = clonedDiv.querySelector("#id-input");
    const name = clonedDiv.querySelector("#name-input");
    const description = clonedDiv.querySelector("#description-input");
    const image = clonedDiv.querySelector("#image-input");
    const price = clonedDiv.querySelector("#price-input");

    //modify the clone template
    heading.textContent = "Modify product "+productInfo.name;
    productid.value = productInfo._id;
    name.value = productInfo.name;
    description.value = productInfo.description;
    image.value = productInfo.image;
    price.value = productInfo.price;
    modifyContainer.innerHTML ="";
    modifyContainer.appendChild(clonedDiv);

    const update = document.getElementById("update-button");
    update.addEventListener('click',function(e){
        e.preventDefault();
        if (!image.value.match(/^(http|https):\/\/\S+\.\w{2,}\/*\S*$/)){
            createNotification("Provide correct Url", "notifications-container", false);
        }
        else{            
        const data = {...productInfo,name:name.value,description:description.value,image:image.value,price:Number(price.value)};
        postOrPutJSON(url,"PUT",data).then(response => {
            if(response){
                createNotification("Updated product "+response.name, "notifications-container", true);
                document.getElementById("name-"+response._id).textContent= response.name;
                document.getElementById("description-"+response._id).textContent= response.description;
                document.getElementById("price-"+response._id).textContent= response.price;
                document.getElementById("image-"+response._id).setAttribute("src",response.image);
                removeElement("modify-product","edit-product-form");
            }
        });
        }
    });
};

const deleteProduct = (elem) =>{
    const id = elem.id.split("-");
    const url = "api/products/"+id[1];
    deleteResourse(url).then(response => {
        if(response){
            createNotification("Deleted product "+response.name, "notifications-container", true);
            removeElement("products-container","product-"+id[1]);
            removeElement("modify-product","edit-product-form");
        }
    });

};

document
.getElementById("sort-by-A-Z")
.addEventListener("click", async (e) => {
    e.preventDefault();
    const productInfo = await getJSON("/api/products");
    const sortByAZProduct = productInfo.sort((x,y) => 
                                    (x.name > y.name) ? 1 : -1);
    document.getElementById("products-container").innerHTML = "";
    await loadProducts(sortByAZProduct);
})

document
.getElementById("sort-by-Z-A")
.addEventListener("click", async (e) => {
    e.preventDefault();
    const productInfo = await getJSON("/api/products");
    const sortByZAProduct = productInfo.sort((x,y) => 
                                    (x.name < y.name) ? 1 : -1);
    document.getElementById("products-container").innerHTML = "";
    await loadProducts(sortByZAProduct);
})

document
.getElementById("sort-increase-price")
.addEventListener("click", async (e) => {
    e.preventDefault();
    const productInfo = await getJSON("/api/products");
    const sortByIncreasePrice = productInfo.sort((x,y) => 
                                    (x.price > y.price) ? 1 : -1);
    document.getElementById("products-container").innerHTML = "";
    await loadProducts(sortByIncreasePrice);
})

document
.getElementById("sort-decrease-price")
.addEventListener("click", async (e) => {
    e.preventDefault();
    const productInfo = await getJSON("/api/products");
    const sortByDecreasePrice = productInfo.sort((x,y) => 
                                (x.price < y.price) ? 1 : -1);
    document.getElementById("products-container").innerHTML = "";
    await loadProducts(sortByDecreasePrice);
})

const addProductToCart = (id,name) => {
    addToCart(id);
    createNotification("Added "+name+" to cart!", "notifications-container", true);
}

/**
 * TODO: 9.1 List all Products (use <template id="product-template"> in products.html) 
*/
(async function () {
    const productInfo = await getJSON("/api/products");
    loadProducts(productInfo);
})();