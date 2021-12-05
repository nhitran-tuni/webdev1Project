// Load order list
const loadOrders = async() => {
    const orderInfo = await getJSON("/api/orders");
    const template = document.getElementById("order-template");
    const templatePro = document.getElementById("product-template");
    const orderContainer = document.getElementById("orders-container");
    orderInfo.forEach(item => {
        const cloneDiv = template.content.cloneNode(true);
        const orderrow = cloneDiv.querySelector(".order-row");
        const totalPrice = cloneDiv.querySelector(".total");

        orderrow.setAttribute("id",`order-${item._id}`);
        totalPrice.setAttribute("id",`order-${item._id}`);
        let total = 0.0;

        item.items.forEach ( ordered => {
            const cloneDivPro = templatePro.content.cloneNode(true);
            const itemrow = cloneDivPro.querySelector(".item-row");
            const productName = cloneDivPro.querySelector(".product-name");
            const description = cloneDivPro.querySelector(".product-description");
            const price = cloneDivPro.querySelector(".product-price");
            const quantity = cloneDivPro.querySelector(".quantity");

            const singleProduct = ordered.product;
            const orderedId = ordered._id
            itemrow.setAttribute("id", `product-${orderedId}`);
            productName.setAttribute("id", `name-${orderedId}`);
            description.setAttribute("id", `description-${orderedId}`);
            price.setAttribute("id", `price-${orderedId}`);
            quantity.setAttribute("id", `quantity-${orderedId}`);

            //modify clone template
            productName.textContent = singleProduct.name;
            description.textContent = singleProduct.description;
            price.textContent = singleProduct.price.$numberDecimal;
            quantity.textContent = ordered.quantity;
            total = total 
                    + Number(singleProduct.price.$numberDecimal) 
                    * Number(ordered.quantity);
            
            orderrow.appendChild(itemrow);
        });
        totalPrice.innerText = `Total: ${total}`;
        orderContainer.appendChild(cloneDiv);
    });
}

(async function () {
    loadOrders();
})();