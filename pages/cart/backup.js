import { db } from "../../js/firebase-init.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { products as data } from "./products.js";

//// prevent user go to this page without login

let isLogged = localStorage.getItem("isLogged");
if (isLogged == null) {
  isLogged = false;
}
if (isLogged == false) {
  window.location.href = "../login/login.html";
}

//// firebase helper functions
async function getItemFromFirestore(docId, collectionName) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

async function getAllFirestore(collectionName) {
  try {
    const items = [];
    const snapShots = await getDocs(collection(db, collectionName));
    snapShots.forEach((doc) => {
      const item = { docId: doc.id, ...doc.data() };
      items.push(item);
    });

    return items;
  } catch (e) {
    console.error("Error get document: ", e);
  }
}

async function addFirestore(item, collectionName) {
  try {
    const itemRef = await addDoc(collection(db, collectionName), item);
    console.log("Document written with ID: ", itemRef.id);
  } catch (error) {
    console.log("Error when add item: ", error);
  }
}

async function deleteFirestore(docId, collectionName) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log("Item deleted with id", docId);
  } catch (e) {
    console.log("Error delete document: ", e);
  }
}

async function updateFirestore(docId, newItem, collectionName) {
  try {
    const itemRef = doc(db, collectionName, docId);
    await updateDoc(itemRef, newItem);
    console.log("Item updated with id", docId);
  } catch (e) {
    console.log("Error update document: ", e);
  }
}

//// render products from memory to HTML
let iconCart = document.getElementById("icon-cart");
let iconCartSpan = document.querySelector("#icon-cart span");
let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector(".listCart");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
let products = [];
let cart = [];

iconCart.addEventListener("click", async () => {
  try {
    body.classList.toggle("showCart");
  } catch (e) {
    console.log("Error when get cart: ", e);
  }
});

closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

let totalQuantity = cart.length;

const renderCart = async () => {
  console.log("renderCart: ", cart);

  listCartHTML.innerHTML = "";

  if (cart.length <= 0) return;

  cart.forEach((item) => {
    totalQuantity = totalQuantity + item.quantity;
    let newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.dataset.id = item.docId;

    listCartHTML.appendChild(newItem);

    newItem.innerHTML = `
        <div class="image">
                <img src="${item.image}">
            </div>
            <div class="name">
            ${item.name}
            </div>
            <div class="totalPrice">$${parseFloat(
              item.price * item.quantity
            ).toFixed(2)}</div>
            <div class="quantity">
                <span class="plus"><</span>
                <span>${item.quantity}</span>
                <span class="minus">></span>
            </div>
        `;
  });
};

const addDataToHTML = () => {
  // remove datas default from HTML
  listProductHTML.innerHTML = "";

  // add new datas
  if (products.length > 0) {
    // if has data
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("item");
      newProduct.innerHTML = `<img src="${product.image}" alt="">
                  <h2>${product.name}</h2>
                  <div class="price">$${product.price}</div>
                  <button class="addCart">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

// hanlde add to cart
listProductHTML.addEventListener("click", async (event) => {
  let positionClick = event.target;

  if (positionClick.classList.contains("addCart")) {
    let id_product = positionClick.parentElement.dataset.id;
    await addFirestore({ ...products[id_product - 1], quantity: 1 }, "cart");
    await initApp();
  }
});

// handle update quantity
listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let docId = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(docId, type);
  }
});

const changeQuantityCart = async (docId, type) => {
  const oldItem = await getItemFromFirestore(docId, "cart");

  switch (type) {
    case "plus":
      const plusQuantity = oldItem.quantity + 1;
      await updateFirestore(
        docId,
        { ...oldItem, quantity: plusQuantity },
        "cart"
      );
      break;

    default:
      const minusQuantity = oldItem.quantity - 1;

      if(minusQuantity == 0) {
        await deleteFirestore(docId, "cart");
        break;
      }
      
      if (minusQuantity < 0) break;

      await updateFirestore(
        docId,
        { ...oldItem, quantity: minusQuantity },
        "cart"
      );
      break;
  }

  await initApp();
};

const initApp = async () => {
  products = data;
  addDataToHTML();
  cart = await getAllFirestore("cart");
  await renderCart();
  iconCartSpan.innerText = cart.length;
};

await initApp();
