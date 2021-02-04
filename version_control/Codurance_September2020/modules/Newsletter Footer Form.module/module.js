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

const detectFormSubmission = _ => {
    let form = document.querySelector(".newsletter-footer-form__container form");

    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.removedNodes.forEach(function(removed_node) {
                if (removed_node === form) {
                    showSuccessfulFormHTML();
                }
            });
        });
    });
    
    observer.observe(document.querySelector("#hs_form_target_newsletter_footer_form_email_form"), { subtree: false, childList: true });
}

window.addEventListener('load', detectFormSubmission);