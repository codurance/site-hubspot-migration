const oembedContainers = document.getElementsByClassName('oembed_container');
const embedContainers = document.getElementsByClassName('embed_container');

function loadOEmbed(container) {
  const embedContainer = container;
  const iframeWrapper = embedContainer.querySelector('.iframe_wrapper');
  const customThumbnail = embedContainer.querySelector('.oembed_custom-thumbnail');
  const url = iframeWrapper.dataset.embedUrl;

  if (url) {
    
    var request = new XMLHttpRequest();
    var requestUrl = "/_hcms/oembed?url=" + url + "&autoplay=0";
    
    request.open('GET', requestUrl, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);

          const el = document.createElement('div');
          el.innerHTML = data.html;
          const iframe = el.firstChild;
          iframe.setAttribute("class", "oembed_container_iframe");
          iframe.setAttribute("title", data.title);

          if (customThumbnail) {
            customThumbnail.onclick = function(){
              iframe.src += "&autoplay=1";
              this.setAttribute("class", "oembed_custom-thumbnail--hide");
              iframeWrapper.appendChild(iframe);
            };
          } else {
            iframeWrapper.appendChild(iframe);
          }
        } else {
          console.error('Server reached, error retrieving results.');
        }
      };
      request.onerror = function() {
        console.error('Could not reach the server.');
      };
      request.send();
  }
}

function loadEmbed(container) {
  const embedContainer = container;
  const iframe = embedContainer.querySelector('.iframe_wrapper iframe');
  
  iframe.style.height = '100%';
  iframe.style.width = '100%';
}

if (oembedContainers.length !== 0) {
  Array.prototype.forEach.call(oembedContainers, function(el) {
    loadOEmbed(el);
  });
}

if (embedContainers.length !== 0) {
  Array.prototype.forEach.call(embedContainers, function(el) {
    loadEmbed(el);
  });
}