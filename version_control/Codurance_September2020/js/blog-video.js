window.codurance  = window.codurance || {}

window.codurance.cookieMessage = (function() {
    const COOKIE_NAME = 'has-cookie-consent';
    var messageElements = document.getElementsByClassName('js-cookie-message');
    var acceptButtons = document.getElementsByClassName('js-cookie-message-accept');
    var cookieIframeContainers = document.getElementsByClassName('js-iframe-container');
    
    if (!messageElements.length) {
        throw 'no element found for cookie message';
    }

    if(!acceptButtons.length) {
        throw 'no element found for cookie message accept';
    }

    var onConsentCallbacks = [];

    /**
     * Set cookie
     *
     * @param string name
     * @param string value
     * @param int days
     * @param string path
     * @see http://www.quirksmode.org/js/cookies.html
     */
    function createCookie(name, value, days, path) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path="+path;
    }

    /**
     * Read cookie
     * @param string name
     * @returns {*}
     * @see http://www.quirksmode.org/js/cookies.html
     */
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function showMessage() {
        for (let index = 0; index < messageElements.length; index++) {
            const messageElement = messageElements[index];
            messageElement.style.visibility= 'visible';
        }
    }

    function showConsentDependentIframes() {
        hideMessage();
        for (let index = 0; index < cookieIframeContainers.length; index++) {
            const container = cookieIframeContainers[index];

            var iframeUrl = container.getAttribute('js-iframe-url');
            
            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", iframeUrl);
            iframe.style.width = '100%';
            iframe.style.height = '400px';
            iframe.style.border = 'none';

            container.appendChild(iframe);
        }
    }

    function hideMessage() {
        for (let index = 0; index < messageElements.length; index++) {
            const messageElement = messageElements[index];
            messageElement.style.visibility = 'hidden';
            messageElement.style.display = 'none';
            messageElement.classList.add('accepted');
        }
    }

    function hasConsent() {
        var cookie = readCookie('has-cookie-consent');
        var hasConsent = cookie != null && cookie == 'yes';
        return hasConsent;
    }

    function setConsent() {
        // Set/update cookie
        var cookieExpiry = 60;
        var cookiePath =  "/";

        createCookie(COOKIE_NAME, 'yes', cookieExpiry, cookiePath);
    }

    function onConsent(callback){
        onConsentCallbacks.push(callback);
    }

    function triggerOnConsent () {
        onConsentCallbacks.forEach(function(callback){
            callback.call(null);
        });
    }

    function init () {
        if (hasConsent()) {
            showConsentDependentIframes();
            return;
        } 
        
        showMessage();

        for (let index = 0; index < acceptButtons.length; index++) {
            const acceptButton = acceptButtons[index];
            acceptButton.addEventListener('click', function(){
                setConsent();
                showConsentDependentIframes();
                triggerOnConsent();
            });
        }
    }

    init();
    return {
        hasConsent: hasConsent,
        onConsent: onConsent
    };

})();