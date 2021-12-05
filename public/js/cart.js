// load product list
const loadCartProducts = async() =>{
    const arrayOfKeys = Object.keys(localStorage);
    const url = "api/products";
    const productInfo = await getJSON(url);
    const template = document.getElementById("cart-item-template");
    const productCartContainer = document.getElementById("cart-container");
    arrayOfKeys.forEach(id => {
        const index = productInfo.findIndex(x => x._id === id);
        const item = productInfo[index];

        // Clone the template fragment
        const clonedDiv = template.content.cloneNode(true);
        const itemrow = clonedDiv.querySelector(".item-row");
        const name = clonedDiv.querySelector(".product-name");
        const amount = clonedDiv.querySelector(".product-amount");
        const price = clonedDiv.querySelector(".product-price");
        const image = clonedDiv.querySelector(".product-image");
        const plusbutton = clonedDiv.querySelector("button:nth-child(5)");
        const minusbutton = clonedDiv.querySelector("button:last-child");

        // set id
        itemrow.setAttribute("id","product-"+item._id);
        name.setAttribute("id","name-"+item._id);
        price.setAttribute("id","price-"+item._id);
        image.setAttribute("id","image-"+item._id);
        image.setAttribute("src",item.image);
        image.setAttribute("alt",item.name);
        image.setAttribute("width", "150");
        image.setAttribute("height", "150");
        amount.setAttribute("id","amount-"+item._id);
        minusbutton.setAttribute("id","minus-"+item._id);
        plusbutton.setAttribute("id","plus-"+item._id);

        minusbutton.setAttribute("onClick","decreaseProductCount('"+item._id +"','"+ item.name+"')");
        plusbutton.setAttribute("onClick","addProductToCart('"+item._id +"','"+ item.name+"')");

        //modify the clone template
        name.textContent = item.name;
        amount.textContent = localStorage.getItem(item._id)+'x';
        price.textContent = item.price;
        productCartContainer.appendChild(clonedDiv);
    });
};

const addProductToCart = (id,name) => {
    addToCart(id);
    document.getElementById("amount-"+id).textContent=localStorage.getItem(id)+'x';
}

const decreaseProductCount = (id,name) => {
    decreasefromCart(id);
    const prodCount = parseInt(localStorage.getItem(id));
    if(prodCount>=1){
        document.getElementById("amount-"+id).textContent=localStorage.getItem(id)+'x';
    }
    else {
        removeElement("cart-container","product-"+id);
    }
}

/**
 * TODO: 9.1 List all Products (use <template id="product-template"> in products.html) 
*/
(async function () {
    loadCartProducts();
})();

const placeOrder = document.getElementById("place-order-button");
placeOrder.addEventListener('click', async function(e){
    e.preventDefault();
    await placeNewOrder();
    clearCart();
    document.getElementById("cart-container").innerHTML="";
    createNotification("Successfully created an order!", 
    "notifications-container",
    true);
});