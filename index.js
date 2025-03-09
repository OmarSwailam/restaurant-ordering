import { menuArray } from "./data.js"

const orderContainer = document.getElementById("order")

let order = JSON.parse(localStorage.getItem("order")) || {}

const itemsContainer = document.getElementById("items")

function getItemsHtml(arrayOfItems) {
    return arrayOfItems.map((item) => {
        return `
            <div class="item" id="${item.id}">
                <p class="item-image">${item.emoji}</p>
                <div class="item-text">
                    <h2 class="item-name">${item.name}</h2>
                    <p class="item-ingredients">${item.ingredients}</p>
                    <p class="item-price">$${item.price}</p>
                </div>
                <button class="add-btn" data-add="${item.id}">+</button>  
            </div>
            <hr class="item-hr">
        `
    }).join("")
}

itemsContainer.innerHTML = getItemsHtml(menuArray)

function getItem(itemId) {
    return menuArray.filter((item) => item.id === itemId)[0]
}

function addToOrder(e) {
    const itemId = parseInt(e.target.dataset.add)
    const item = getItem(itemId)
    if (item) {
        let quantity = order[itemId] || 0
        order[itemId] = quantity + 1
        localStorage.setItem("order", JSON.stringify(order))
    }
    renderOrder()
}

const addBtns = document.querySelectorAll(".add-btn")

addBtns.forEach((btn) => btn.addEventListener('click', addToOrder))

function renderOrder() {
    orderContainer.style.display = Object.keys(order).length > 0 ? 'flex' : 'none'
    let totalPrice = 0
    const orderItems = Object.keys(order).map((id) => {
        const item = getItem(parseInt(id))
        const quantity = parseInt(order[id])
        const itemTotal = parseInt(item.price) * quantity
        totalPrice += itemTotal
        return `
            <div class="order-item">
                <h3 class="order-item-name">${item.name}</h3>
                <button class="remove-btn" data-remove="${id}">-</button>
                <div class="order-item-numbers">
                    <p class="number">${quantity}</p>
                    <p class="number">$${item.price}</p>
                    <p class="number">$${itemTotal}</p>
                </div>
            </div>
        `
    }).join("")


    orderContainer.innerHTML = `
        <h3 class="order-label">Your order</h3>
        <div class="order-labels">
            <p>Quantity</p>
            <p>Unit Price</p>
            <p>Total Price</p>
        </div>
        ${orderItems}
        <div class="total-outer">
            <hr class="order-hr">
            <div class="total-div">
                <h3 class="total-label">Total</h3>
                <p class="total-price">$${totalPrice}</p>
            </div>
            <div class="order-btns">
                <button class="cancel-btn" id="cancel-btn">Cancel</button>
                <button class="complete-btn" id="complete-btn">Complete Order</button>
            </div>
        </div>

    `

    const removeBtns = document.querySelectorAll(".remove-btn")
    removeBtns.forEach((btn) => btn.addEventListener('click', removeItem))

    const cancelBtn = document.getElementById("cancel-btn")
    cancelBtn.addEventListener("click", cancelOrder)

}

function removeItem(e) {
    const itemId = parseInt(e.target.dataset.remove)
    const item = getItem(itemId)
    if (item) {
        order[itemId] -= 1
        order[itemId] == 0 && delete order[itemId]
        localStorage.setItem("order", JSON.stringify(order))
    }
    renderOrder()
}


function cancelOrder() {
    order = {}
    localStorage.removeItem("order")
    renderOrder()
}

renderOrder()