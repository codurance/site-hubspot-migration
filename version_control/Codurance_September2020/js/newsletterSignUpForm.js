const showSuccessfulFormHTML = _ => {
    Array.prototype.slice.call(
        document.querySelectorAll("[data-newsletter-sign-up-pending]")
    ).forEach(element => {
        element.classList.add('hidden');
    });
    
    Array.prototype.slice.call(
        document.querySelectorAll("[data-newsletter-sign-up-success]")
    ).forEach(element => {
        element.classList.remove('hidden');
    })
}

const detectFormChanges = _ => {
    let inlineForm = document.querySelector(".newsletter-inline-form__container form");
    let exitPopupForm = document.querySelector(".newsletter-exit-popup__container form");
    let footerForm = document.querySelector(".newsletter-footer-form__container form");
    let signUpForms = [ inlineForm, exitPopupForm, footerForm ]

    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.removedNodes.forEach(function(removed_node) {
                if (signUpForms.includes(removed_node)) {
                    showSuccessfulFormHTML();
                }
            });
        });
    });
    
    observer.observe(document.querySelector("#hs_form_target_newsletter_inline_form_email_form"), { subtree: false, childList: true });
    observer.observe(document.querySelector("#hs_form_target_newsletter_exit_popup_email_form"), { subtree: false, childList: true });
    observer.observe(document.querySelector("#hs_form_target_newsletter_footer_form_email_form"), { subtree: false, childList: true });
}

window.addEventListener('load', detectFormChanges);