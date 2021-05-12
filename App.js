import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';

//Can rewrite these imports as one using one name import with the ./components directors

//import Products from './components/Products/Products';
//import Navbar from './components/Navbar/Navbar';

import { Products, Navbar, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    }

    const fetchCart = async () => {
        const cart = await commerce.cart.retrieve();

        setCart(cart);
    }

    const AddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);

        setCart(cart);
    }

    const UpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });

        setCart(cart);
    }

    const RemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);

        setCart(cart);
    }

    const makeEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();

        setCart(cart);
    }

    const restartCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    }

    const CaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);
            restartCart();
        } catch (error) {
            setErrorMessage(error.data.error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    console.log(cart);

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path="/">
                         <Products products={products} onAddToCart={AddToCart} />
                    </Route>

                    <Route exact path ="/cart">
                        <Cart 
                            cart={cart}
                            UpdateCartQty={UpdateCartQty}
                            RemoveFromCart={RemoveFromCart}
                            makeEmptyCart={makeEmptyCart}
                        />    
                    </Route>

                    <Route exact path="/checkout">
                        <Checkout cart={cart} order={order} onCaptureCheckout={CaptureCheckout} error={errorMessage}/>
                    </Route>
                </Switch>
             </div>
        </Router>
        
    )
}


export default App;