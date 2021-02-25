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
  document.removeEventListener('mouseout', checkExit);
}

const potentiallyLeavingPage = e => {
  return e.clientY < 10;
}

const setCookie = (key, value) => {
  const expiry = 60 * 60 * 24 * 7;
  document.cookie = `${key}=${value}; path=/; max-age=${expiry}`;
}

const setPopupLimitingCookie = _ => {
  setCookie('newsletter_exit_popup', 'true');
}

const checkExit = e => {
  if (potentiallyLeavingPage(e)) {
    setPopupLimitingCookie();
    showModal();
  }
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
    document.addEventListener('mouseout', checkExit);
  }
}

const disableExitPopup = _ => {
  document.removeEventListener('mouseout', checkExit);
}

const listenForOtherFormSubmissions = _ => {
  let inlineForm = document.querySelector(".newsletter-inline-form__container form");
  let footerForm = document.querySelector(".newsletter-footer-form__container form");

  const observer = new MutationObserver(function(mutations_list) {
      mutations_list.forEach(function(mutation) {
          mutation.removedNodes.forEach(function(removed_node) {
              if (removed_node === inlineForm || removed_node === footerForm) {
                disableExitPopup();
              }
          });
      });
  });

  observer.observe(document.querySelector("#hs_form_target_newsletter_inline_form_email_form"), { subtree: false, childList: true });
  observer.observe(document.querySelector("#hs_form_target_newsletter_footer_form_email_form"), { subtree: false, childList: true });
}

window.addEventListener('load', _ => {
  if (!window.hsInEditor) {
    addPopupEventListeners();
  }
  listenForOtherFormSubmissions();
});