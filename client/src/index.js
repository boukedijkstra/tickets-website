function addShoppingBasketOrdersToLocalStorage(newOrder) {

    //get the existng data
    var shoppingBasketOrders = localStorage.getItem('shoppingBasketOrders');

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    if(shoppingBasketOrders) {
        shoppingBasketOrders = JSON.parse(shoppingBasketOrders);
    } else {
        shoppingBasketOrders = [];
    }

    // Add new data to localStorage Array and Save back to localStorage
    shoppingBasketOrders.push(newOrder);
    localStorage.setItem("shoppingBasketOrders", JSON.stringify(shoppingBasketOrders));
}

function saveOrderInShoppingBasket(parkName, adultsTicketQuantity, kidsTicketQuantity, orderTotalPrice) {

    var addedOrder = {
        orderParkName: parkName,
        orderAdultsTicketQuantity: adultsTicketQuantity,
        orderKidsTicketQuantity: kidsTicketQuantity,
        totalPrice: orderTotalPrice
    }

    addShoppingBasketOrdersToLocalStorage(addedOrder);
    updateShoppingBasketBadge();
}

async function getTicketsAvailableInStock(parkname) {
    
    let serverFetchedData = await fetchAndParseDataFromServer();

    for (let i = 0; i < serverFetchedData.length; i++) {

        if (serverFetchedData[i]["name"] == parkname) {
            return serverFetchedData[i]["available"];
        }
    }
}

function checkForZeroEventinput(adultsTicketQuantity, kidsTicketQuantity) {
    return (adultsTicketQuantity === "0" && kidsTicketQuantity === "0")
}

async function orderButtonClicked(event) {

    var getThisButtonArticleElement = event.target.parentNode.parentNode.parentNode;
    var parkNameFromEvent = getThisButtonArticleElement.querySelector("div.parkname").innerText;
    var adultsTicketQuantityFromEvent = getThisButtonArticleElement.querySelector("input.numberofadults").value;
    var kidsTicketQuantityFromEvent = getThisButtonArticleElement.querySelector("input.numberofkids").value;
    var totalTicketsOrderParsed = (parseInt(adultsTicketQuantityFromEvent) + parseInt(kidsTicketQuantityFromEvent));
    var ticketsAvailableInStock = await getTicketsAvailableInStock(parkNameFromEvent);
    var totalPriceElement = Number(event.target.parentNode.parentNode.querySelector("div.total").querySelector("span.price").innerText); 
    console.log(totalPriceElement);


    if (checkForZeroEventinput(adultsTicketQuantityFromEvent, kidsTicketQuantityFromEvent)) {
        alert("\nNothing added to the shopping basket.\n\nPlease choose at least 1 adult or 1 kid ticket");
        return;
    }
    
    if (ticketsAvailableInStock >= totalTicketsOrderParsed) {
        saveOrderInShoppingBasket(parkNameFromEvent, adultsTicketQuantityFromEvent, kidsTicketQuantityFromEvent, totalPriceElement);
    } else {
        alert("\nOnly "+ ticketsAvailableInStock +" ticket(s) available for this park .\n\nPlease order that quantity or less");
    }
}

function initiateOrderButtonsEventListener() {
    
    var myOrderButtons = document.querySelectorAll("button.orderbutton");
    
    for (i = 0; i < myOrderButtons.length; i++) {
        myOrderButtons[i].addEventListener("click", function() { orderButtonClicked(event) });
        }

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

function addArticleElementFromTemplate() {
    let getTemplate = document.querySelector("template");
    let getMain = document.querySelector("main");

    let templateClone = getTemplate.content.cloneNode(true);
    getMain.append(templateClone);
}

async function fetchAndParseDataFromServer() {

    try{
        let fetchResponse = await fetch("/api/attractions");
        const fetchResponseJSON = await fetchResponse.json();
        return fetchResponseJSON;

    } catch (e) {
        console.error(e);
    }

}

async function displayAttractionsInPage() {

    let serverFetchedData = await fetchAndParseDataFromServer();

    if (serverFetchedData) {

        for (i = 0; i < serverFetchedData.length; i++ ) {
            
            var obj = serverFetchedData[i];
            var objID = obj.name.replace(/\s+/g, '');

            mountAttractionArticleElement(obj, objID);
        }
    }

    return;
}

function mountAttractionArticleElement(jsonObject, objectID) {

    addArticleElementFromTemplate();

    document.querySelector('#newAttraction').setAttribute('id', objectID);
    document.getElementById(objectID).querySelector("div.parkname").innerHTML = jsonObject.name;
    document.getElementById(objectID).querySelector("div.parkdescription").innerHTML = jsonObject.description;
    document.getElementById(objectID).querySelector("div.adultprice").querySelector("span.price").innerHTML = jsonObject.adultPrice;
    document.getElementById(objectID).querySelector("div.kidsprice").querySelector("span.price").innerHTML = jsonObject.kidsPrice;
    document.getElementById(objectID).querySelector("div.discountrequirement").querySelector("span.adults").innerHTML = jsonObject.minimumNumberOfAdults;
    document.getElementById(objectID).querySelector("div.discountrequirement").querySelector("span.child").innerHTML = jsonObject.minimumNumberOfKids;
    document.getElementById(objectID).querySelector("div.discountrequirement").querySelector("span.percentage").innerHTML = jsonObject.discount;
}

function ticketInputUpdated(event) {

    var adultTicketQuantity = event.target.parentNode.querySelector("input.numberofadults").value;
    var adultTicketPrice = Number(event.target.parentNode.querySelector("div.prices").querySelector("div.adultprice").querySelector("span.price").innerText);
    var adultMinQuantForDiscount = Number(event.target.parentNode.querySelector("div.prices").querySelector("div.discountrequirement").querySelector("span.adults").innerText);
    var kidsTicketQuantity = event.target.parentNode.querySelector("input.numberofkids").value;
    var kidsTicketPrice = Number(event.target.parentNode.querySelector("div.prices").querySelector("div.kidsprice").querySelector("span.price").innerText);
    var kidsMinQuantForDiscount = Number(event.target.parentNode.querySelector("div.prices").querySelector("div.discountrequirement").querySelector("span.child").innerText);
    var getTotalPriceElement = event.target.parentNode.querySelector("div.total").querySelector("span.price"); 
    var parkDiscountRate = Number(event.target.parentNode.querySelector("div.prices").querySelector("div.discountrequirement").querySelector("span.percentage").innerText);

    if ((adultTicketQuantity >= adultMinQuantForDiscount) && (kidsTicketQuantity >= kidsMinQuantForDiscount)) {
        getTotalPriceElement.innerText = ((1-(parkDiscountRate/100)) * ((adultTicketQuantity * adultTicketPrice) + (kidsTicketQuantity * kidsTicketPrice)));
    } else {
        getTotalPriceElement.innerText = (adultTicketQuantity * adultTicketPrice) + (kidsTicketQuantity * kidsTicketPrice);
    }
}

function initiateTicketInputEventListener() {
    
    var myAdultInputElements = document.querySelectorAll("input.numberofadults");
    var myKidsInputElements = document.querySelectorAll("input.numberofkids");

    for (i = 0; i < myAdultInputElements.length; i++) {
        myAdultInputElements[i].addEventListener("input", ticketInputUpdated);
        }

    for (i = 0; i < myKidsInputElements.length; i++) {
        myKidsInputElements[i].addEventListener("input", ticketInputUpdated);
        }
}


async function main() {
    await displayAttractionsInPage();
    initiateOrderButtonsEventListener();
    initiateTicketInputEventListener();
    updateShoppingBasketBadge();
}
    
main()






