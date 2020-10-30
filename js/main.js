'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", function() {
  renderCart();
  toggleModal();
});
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

    //////////////////////////////////поиск///////////////////////////////////////////////////////////////////////

    let inputSearch = document.querySelector('.input-search');
    inputSearch.addEventListener('keypress', e => {
      if(e.charCode === 13) {
        let value = e.target.value.trim();

        if (!value) {
          e.target.style.borderColor = 'red';
          e.target.value = '';
          setTimeout(function() {
            e.target.style.borderColor = '';
          }, 5500)
          return
        }

        getData('./db/partners.json')
        .then(function(data) {
          return data.map(function(partner) {
            return partner.products;
          });
        })
        .then(function(param) {
          param.forEach(function(link) {
            cardsMenu.textContent = '';
            getData(`./db/${link}`)
            .then(function(data) {

              let resultSearch = data.filter(function(item) {
                let name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              })
              
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');  
      
              restaurantTitle.textContent = 'Результат поиска';
              restaurantRating.textContent = '';
              restaurantPrice.textContent = '';
              restaurantCategory.textContent = 'разное';

              resultSearch.forEach(creatCardGood);
            })
              
          })
        })
      };
    }); 

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cardsMenu.addEventListener('click', addToCart);                         //вызов корзины

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
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  buttonAuth.style.display = 'none';
  userName.style.display = 'block';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

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
      restaurantTitle = document.querySelector('.restaurant-title'),
      restaurantRating = document.querySelector('.rating'),
      restaurantPrice = document.querySelector('.price'),
      restaurantCategory = document.querySelector('.category');

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

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;                                   //в свойство объекта записивыем значение из json
  cardRestaurant.info = { name, stars, price, kitchen };

  const card = `  
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

  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
};


function creatCardGood(goods) {
  let card = document.createElement('div');
  card.className = 'card';

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
                      <button class="button button-primary button-add-cart" id="${id}">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                      </button>
                      <strong class=" card-price card-price-bold">${price} ₽</strong>
                    </div>
                  </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};


function openGoods (e) {                                       //функция открытия страницы товаров
  let target = e.target;
  let restaurant = target.closest('.card-restaurant')

  if(restaurant) {

      if(login) {

        cardsMenu.textContent = '';                             //очистить содержимое страницы товаров
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');  

        const { stars, price, name, kitchen } = restaurant.info;       //записать заголовок над карточками товаров
        restaurantTitle.textContent = name;
        restaurantRating.textContent = stars;
        restaurantPrice.textContent = `От ${price} ₽`;
        restaurantCategory.textContent = kitchen;
    
        getData(`./db/${restaurant.products}`).then(function(data) {
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

///////////////////////////////////////корзина//////////////////////////////////////////////////////////////////

let cart = [];                                              //корзина

function addToCart(e) {

  let target = e.target;

  let buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart) {
    let card = target.closest('.card');

    let title = card.querySelector('.card-title-reg').textContent;
    let cost = card.querySelector('.card-price').textContent;
    let id = buttonAddToCart.id;

    let food = cart.find(function(item) {                 //поиск в массиве на совпадение товара в корзине
      return item.id === id
    })

    if (food) {                                            //ecли товар в корзине есть, то увеличивается количество
      food.count += 1;
    } else {
      cart.push({                                           //добавление в массив корзины объекта товара
        id: id,
        title: title,
        cost: cost,
        count: 1
      })
    }
    


    console.log(cart)
  };
};

let modalBody = document.querySelector('.modal-body'),
    modalPricetag = document.querySelector('.modal-pricetag'),
    clearCart = document.querySelector('.clear-cart');

function renderCart() {

  modalBody.textContent = '';

  cart.forEach(function(item) {

    let {                                           //добавление в массив корзины объекта товара
      id,
      title,
      cost,
      count
    } = item;
    
    let itemCart = `
                    <div class="food-row">
                    <span class="food-name">${title}</span>
                    <strong class="food-price">${cost}</strong>
                    <div class="food-counter">
                      <button class="counter-button counter-minus" data-id="${id}">-</button>
                      <span class="counter">${count}</span>
                      <button class="counter-button counter-plus" data-id="${id}">+</button>
                    </div>
                    </div>
    `;
  
    modalBody.insertAdjacentHTML('beforeend', itemCart);
  })
  
  const totalPrice = cart.reduce(function(result, item) {               //подсчет суммы
    return result + (parseFloat(item.cost)) * item.count;
  }, 0)

  modalPricetag.innerHTML = totalPrice;

}



const changeCount = e => {                                                 //счетчик количества
  let target = e.target;

  if(target.classList.contains('counter-button')) {

    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    })

    if(target.classList.contains('counter-plus')) {
      food.count++;
      renderCart();
    } 
    if(target.classList.contains('counter-minus')) {
      food.count--;
      if(food.count === 0) {                                                 //удалить товар, если счетчик меньше нуля
        cart.splice(cart.indexOf(food), 1)
      }
      renderCart();
    }

  }


}

modalBody.addEventListener('click', changeCount) ;                         //счетчик количества
clearCart.addEventListener('click', () => {                                   //очистка корзины
 cart.length = 0;
 renderCart();
})                                       



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

