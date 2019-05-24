//variables

const cartBtn = document.querySelector(".car-btn");
const closeCartBtn = document.querySelector("close-cart");
const clearCarBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart
let cart = [];
//getting the products
class Products{

    async getproducts(){
        try{
            let result= await fetch('products.json')
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title, price} = item.fields;
                const id  = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image};
            })
            return products
        }catch(error){
            console.log(error);
        }
    }
}

//didplay

class UI{
     displayProducts(products){
        let result = "";
        products.forEach(product => {
            result+=`
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>
            <!-- end of single product -->
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(iten => item.id === id);
            if(inCart){
                button.innerHTML = "In Cart";
                button.disabled = true;
            }else{
                button.addEventListener('click',(event)=>{
                    console.log(event);
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    //get product from products 
                    // add product to the cart
                    //save casr in local storage
                    //set cart value
                    //display cart item
                    //show the cart
                })
            }
            //console.log(id);

        });
    }
}
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

}
//local storage

document.addEventListener("DOMContentLoaded", ()=>{

    const ui = new UI;
    const products = new Products();

    //get all products
    //products.getproducts().then(data => console.log(data));
    products.getproducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
    });
} );