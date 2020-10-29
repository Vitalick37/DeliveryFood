'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}
/////////////// 1 day//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////авторизация///////////////////////////////////////////////

let login = localStorage.getItem('Delivery');       //заполняет пользователя при перезагрузки страницы

//////////////////////////////валидация///////////////////////////////////////////////

function validName (str) {
  let regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////получение базы ресторанов//////////////////////////////////////////////////////

const getData = async function(url) {

  const response = await fetch(url);

  if(!response.ok) {
    throw new Error (`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
  }

  return await response.json();

};

function init() {                                                          //функция для вызова скриптов

  getData('./db/partners.json').then(function(data) {

    data.forEach(creatCardRestaurants);
  
  });
  getData('./db/partners.json').then(function(data) {
console.log(data)
    data.forEach(titleRestaurants);
  });

};
init();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////


const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out');

const toggleModalAuth = e => {
    modalAuth.classList.toggle('is-open');
    loginInput.style.borderColor = '';

    if(modalAuth.classList.contains('is-open')) {
      disableScroll()
    } else {
      enableScroll()
    };
};

function authorized () {

  let logOut = () => {
    login = '';
    localStorage.removeItem('Delivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  buttonAuth.style.display = 'none';
  userName.style.display = 'block';
  buttonOut.style.display = 'block';

  userName.textContent = login;

  buttonOut.addEventListener('click', logOut);
  
};

function notAutorized () {

  let logIn = e => {
    e.preventDefault();
    
    if(validName(loginInput.value)) {
      login = loginInput.value;

      localStorage.setItem('Delivery', login);    //запоминает пользователя при перезагрузки страницы
  
      toggleModalAuth();

      buttonAuth.removeEventListener('click', toggleModalAuth);        //удаляем события чтобы небыло рекурсии
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
    }

  };

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', e => {                    //закрытие по клику на фоне
    let target = e.target;
    if(target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  })
};

let checkAuth = () => {
  if (login) {               //если в переменной пустая строка, то вернет faulse
    authorized();
  } else {
    notAutorized();
  }
};
checkAuth();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////рендеринг карточек магазинов и товаров////////////////////////////////

const cardsRestaurants = document.querySelector('.cards-restaurants'),
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu'),
      headingTitle = document.querySelector('.heading-title');

function creatCardRestaurants(restaurant) {

  const {                                                                //деструкторизация объекта json
    name,
    time_of_delivery: timeOfDelivery,
    stars,
    price,
    kitchen,
    image,
    products
  } = restaurant;

  const card = `
                <a class="card card-restaurant" data-product="${products}">
                <img src="${image}" alt="image" class="card-image"/>
                <div class="card-text">
                  <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery} мин</span>
                  </div>
                  <div class="card-info">
                    <div class="rating">
                    ${stars}
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                  </div>
                </div>
                </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
};


function creatCardGood(goods) {
  let card = document.createElement('div');
  card.className = 'card'

  const {
    id,
    name,
    description,
    price,
    image
  } = goods;

  card.insertAdjacentHTML('beforeend', `
                  <img src="${image}"/>
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title card-title-reg">${name}</h3>
                    </div>
                    <div class="card-info">
                      <div class="ingredients">${description}
                      </div>
                    </div>
                    <div class="card-buttons">
                      <button class="button button-primary button-add-cart">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                      </button>
                      <strong class="card-price-bold">${price} ₽</strong>
                    </div>
                  </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

function titleRestaurants({ name, time_of_delivery: timeOfDelivery, stars, price, kitchen, image, products }) {
  const title = `
          <h2 class="section-title restaurant-title">${name}</h2>
          <div class="card-info">
          <div class="rating">
          ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
  `;
  headingTitle.insertAdjacentHTML('beforeend', title);
}

function openGoods (e) {                                       //функция открытия страницы товаров
  let target = e.target;
  let restaurant = target.closest('.card-restaurant')

  if(restaurant) {

      if(login) {

        cardsMenu.textContent = '';                             //очистить содержимое страницы товаров
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');                              
    
        getData(`./db/${restaurant.dataset.product}`).then(function(data) {
          
          data.forEach(creatCardGood);
        });

      } else {
        toggleModalAuth();
      };
  };
  
};

cardsRestaurants.addEventListener('click', openGoods);         //открытие страницы товаров

logo.addEventListener('click', () => {                         //возврат на страницу ресторанов
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////