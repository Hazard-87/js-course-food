window.addEventListener('DOMContentLoaded', () => {
  // Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  function hideTabsContent() {
    tabsContent.forEach((item) => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });
    tabs.forEach((tab) => {
      tab.classList.remove('tabheader__item_active');
    });
  }

  function showTabsContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabsContent();
  showTabsContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, index) => {
        if (target == item) {
          hideTabsContent();
          showTabsContent(index);
        }
      });
    }
  });

  // Timer

  const deadline = '2021-03-08';

  const getTimeRemaining = (endtime) => {
    const total = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(total / (1000 * 60 * 60 * 24)),
      hours = Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((total / (1000 * 60)) % 60),
      seconds = Math.floor((total / 1000) % 60);

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const getZero = (num) => {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  };

  const setClock = (selector, endtime) => {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  };
  setClock('.timer', deadline);

  // Modal

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  const showModal = () => {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  };

  const closeModal = () => {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };

  modalTrigger.forEach((item) => {
    item.addEventListener('click', showModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.code == 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(showModal, 50000); // Увеличил время чтобы не мешало

  const showModalByScroll = () => {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      showModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  };

  window.addEventListener('scroll', showModalByScroll);

  // Class

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
      this.transfer = 75;
      this.changeToRub();
    }

    changeToRub() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');

      if (!this.classes.length) {
        this.classes = 'menu__item';
        element.classList.add(this.classes);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }

      element.innerHTML = `
          <img src=${this.src} alt=${this.alt} />
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total">
              <span>${this.price}</span> руб/день
            </div>
          </div>
        `;

      this.parent.append(element);
    }
  }

  axios.get('http://localhost:3000/menu').then(({ data }) => {
    data.forEach(({ img, altimg, title, descr, price }) =>
      new MenuCard(img, altimg, title, descr, price, '.menu .container').render(),
    );
  });

  // const getResource = async (url) => {
  //   const res = await fetch(url);

  //   if (!res.ok) {
  //     new Error(`Could not fetch ${url}, status ${res.status}`);
  //   }
  //   return await res.json();
  // };

  // getResource('http://localhost:3000/menu').then((data) =>
  //   data.forEach(({ img, altimg, title, descr, price }) =>
  //     new MenuCard(img, altimg, title, descr, price, '.menu .container').render(),
  //   ),
  // );

  // getResource('http://localhost:3000/menu').then((data) => {
  //   createCard(data);
  // });

  // function createCard(data) {
  //   data.forEach(({ img, altimg, title, descr, price }) => {
  //     const element = document.createElement('div');
  //     const parent = document.querySelector('.menu .container');

  //     price = price * 75;

  //     element.classList.add('menu__item');

  //     element.innerHTML = `
  //         <img src=${img} alt=${altimg} />
  //         <h3 class="menu__item-subtitle">${title}</h3>
  //         <div class="menu__item-descr">${descr}</div>
  //         <div class="menu__item-divider"></div>
  //         <div class="menu__item-price">
  //           <div class="menu__item-cost">Цена:</div>
  //           <div class="menu__item-total">
  //             <span>${price}</span> руб/день
  //           </div>
  //         </div>
  //       `;

  //     parent.append(element);
  //   });
  // }

  // Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся.',
    failure: 'Что-то пошло не так...',
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: data,
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
      `;

      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
          statusMessage.remove();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    showModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
          <div class='modal__content'>
          <div class='modal__close' data-close>&times;</div>
            <h3 class="modal__title">${message}</h3>
          </div>
        `;

    document.querySelector('.modal').append(thanksModal);

    function closeThanksModal() {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }

    const clearThanksModal = setTimeout(() => {
      closeThanksModal();
    }, 4000);

    thanksModal.addEventListener('click', (event) => {
      if (event.target.getAttribute('data-close') == '') {
        closeThanksModal();
        clearInterval(clearThanksModal);
      }
    });
  }
});
