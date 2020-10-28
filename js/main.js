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

const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm');
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
    
    if(loginInput.value.trim()) {
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