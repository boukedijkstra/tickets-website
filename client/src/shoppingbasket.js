function retrieveAndParseOrdersFromLocalStorage() {

    var retrievedShoppingBasketOrders = JSON.parse(localStorage.getItem('shoppingBasketOrders'));

    if(retrievedShoppingBasketOrders) {
        // Cast ticket quantity strings to numbers
        for (i = 0; i < retrievedShoppingBasketOrders.length; i++) {
            retrievedShoppingBasketOrders[i].orderAdultsTicketQuantity = parseInt(retrievedShoppingBasketOrders[i].orderAdultsTicketQuantity);
            retrievedShoppingBasketOrders[i].orderKidsTicketQuantity = parseInt(retrievedShoppingBasketOrders[i].orderKidsTicketQuantity);
        }        
    }

    return retrievedShoppingBasketOrders;
}

function addTicketsElementFromTemplate() {
    var getTemplate = document.querySelector('#ticket');
    var getMain = document.querySelector("main");
    var getFinalizePaymentButton = document.getElementById("finalizepaymentbutton");

    var templateClone = getTemplate.content.cloneNode(true);
    getMain.insertBefore(templateClone,getFinalizePaymentButton);
    
}

function displayTicketsInTheShoppingBasket() {

    var shoppingBasketOrdersInLocalStorage = retrieveAndParseOrdersFromLocalStorage();

    if(shoppingBasketOrdersInLocalStorage) {

        for (i =0; i < shoppingBasketOrdersInLocalStorage.length; i++) {

            addTicketsElementFromTemplate();
            document.querySelector('#newTicketItem').setAttribute('id', "ticket"+i);
            document.getElementById("ticket"+i).children[0].innerHTML = "Park Name: " + shoppingBasketOrdersInLocalStorage[i].orderParkName;
            document.getElementById("ticket"+i).children[1].innerHTML = "Adult Tickets: " + shoppingBasketOrdersInLocalStorage[i].orderAdultsTicketQuantity;
            document.getElementById("ticket"+i).children[2].innerHTML = "Kids Tickets: " + shoppingBasketOrdersInLocalStorage[i].orderKidsTicketQuantity;
            document.getElementById("ticket"+i).children[3].innerHTML = "Total Price: " + "\u20AC" + shoppingBasketOrdersInLocalStorage[i].totalPrice;
        }

    }
 
}

async function finalizePaymentbuttonClicked() {  

    if (localStorage.getItem('shoppingBasketOrders') === null) {
        alert("\nShopping cart is empty.\n\nPlease add at least 1 ticket to the shopping cart before proceeding to payment");
    } else {
        await postOderDataToServer();
        localStorage.clear();
        window.location.replace("orderplaced.html")
    }

}

async function postOderDataToServer() {
    
    const postConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: localStorage.getItem('shoppingBasketOrders')
    }

    try{
        const fetchResponse = await fetch("/api/placeorder", postConfig);
        if (fetchResponse.ok) {
            console.log(fetchResponse);
        }
    } catch (e) {
        console.error(e);
    }

}

function initiateFinalizePaymentbuttoEventListener() {
    var getFinalizePaymentbutton = document.getElementById("finalizepaymentbutton");
    getFinalizePaymentbutton.addEventListener("click", function() {finalizePaymentbuttonClicked()});
}

function updateShoppingBasketBadge() {

    //get the existng data
    if(localStorage.getItem('shoppingBasketOrders')){
        var orderQuantityInShoppingBasketOrders = JSON.parse(localStorage.getItem('shoppingBasketOrders')).length;

        if(orderQuantityInShoppingBasketOrders > 0) {
            document.getElementById("shoppingbasket").querySelector("div.badge").innerHTML = orderQuantityInShoppingBasketOrders;
            document.getElementById("shoppingbasket").querySelector("div.badge").style.display = "inline";
        }
    }
}


//Run all the code lines below this one when the browser is initiated/ refreshed
updateShoppingBasketBadge();

displayTicketsInTheShoppingBasket();

initiateFinalizePaymentbuttoEventListener();