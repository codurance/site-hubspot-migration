let modalBackground = document.querySelector('[data-exit-popup-modal]');
let closeButton = document.querySelector('[data-exit-popup-close-button]');

const closeModal = _ => {
  modalBackground.classList.add('hidden');
}

const checkClosingModal = e => {
  if (e.target == modalBackground) {
    closeModal();
  }
}

const checkEscButton = e => {
  if (e.key === 'Escape') {
    closeModal();
  }
}

const showModal = _ => {
  modalBackground.classList.remove('hidden');
  document.body.removeEventListener('mouseleave', checkExit);
}

const setCookie = (key, value) => {
  const 
    seconds = 60,
    minutes = 60, 
    hours = 24,
    days = 90;

  const expiry = seconds * minutes * hours * days;
  document.cookie = `${key}=${value}; path=/; max-age=${expiry}`;
}

const setPopupLimitingCookie = _ => {
  setCookie('newsletter_exit_popup', 'true');
}

const checkExit = e => {
  setPopupLimitingCookie();
  showModal();
}

const getCookies = _ => {
  let cookies = {};

  document.cookie.split('; ').forEach(cookie => {
    const splitCookie = cookie.split('=');
    cookies[splitCookie[0]] = splitCookie[1];
  });

  return cookies;
}

const shownPopup = _ => {
  const cookies = getCookies();
  return cookies.newsletter_exit_popup === 'true';
}

const getContactByToken = async _ => {
  const serverlessPath = '/_hcms/api';
  const contactEndpoint = 'contact_by_token';
  const { hubspotutk } = getCookies();
  const contactByToken = `${serverlessPath}/${contactEndpoint}?hubspotutk=${hubspotutk}`
  const guest = { is_contact: false };

  if (!hubspotutk) {
    return guest;
  }

  try {
    const response = await fetch(contactByToken);
    return response.json();
  } catch {
    return guest;
  }
}

const shouldSeePopup = async _ => {
  const contact = await getContactByToken();
  return !shownPopup() && !contact.is_contact;
}

const addPopupEventListeners = async _ => {
  if (await shouldSeePopup()) {
    closeButton.addEventListener('click', closeModal);
    document.addEventListener('click', checkClosingModal);
    document.addEventListener('keydown', checkEscButton);
    document.body.addEventListener('mouseleave', checkExit);
  }
}

const disableExitPopup = _ => {
  document.removeEventListener('mouseout', checkExit);
}


window.addEventListener('load', _ => {
  addPopupEventListeners();
});