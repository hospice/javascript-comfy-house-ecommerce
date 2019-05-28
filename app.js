//variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCarBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart
let cart = [];

//buttons
let buttonsDOM = [];
//getting the products
class Products{

    async getProducts(){
        try{
            let result = await fetch('products.json')
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title, price} = item.fields;
                const {id}  = item.sys;
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
        
        const buttonsDOM = buttons;
        buttons.forEach(button =>{
            let id = button.dataset.id;

           // console.log(Storage.etProduct(3));
            let inCart = cart.find(iten => item.id === id);
            if(inCart){
                button.innerHTML = "In Cart";
                button.disabled = true;
            }else{
                button.addEventListener('click',(event)=>{
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    //get product from products
                    let cartItem = {...Storage.getProduct(id), amount:1};
                    // add product to the cart
                    cart = [...cart, cartItem];
                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart value
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart();
                });
            }
            //console.log(id);

        });
       
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            itemsTotal += item.amount * item.amount;
            itemsTotal+= item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        //console.log(cartItems);
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount" data-id=${item.id}>1</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>

        </div>`;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);

    }
    populateCart(cart){
        cart.forEach(item =>this.addCartItem(item));
    }

    hideCart(){
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }
    cartLogic(){

        //clear cart button
        clearCarBtn.addEventListener("click", () => {
            this.clearCart();
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent[0]);
        }
        this.hideCart();
    }

    removeItem(id){
        cart = cart.filter(item => item.id !==id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-shopping-cart"></i>add to cart';
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        //console.log(products[5].id);
        //products.forEach(product => {console.log(product)});
        return products.find(item => item.id === id);
    }

    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }
}
//local storage

document.addEventListener("DOMContentLoaded", ()=> {

    const ui = new UI;
    const products = new Products();
    //setup application
    ui.setupAPP(); 
    //get all products
    //products.getproducts().then(data => console.log(data));
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        setupAPP();

    });
} );