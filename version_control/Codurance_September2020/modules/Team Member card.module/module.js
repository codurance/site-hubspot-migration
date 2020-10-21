if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

function toggleClass(element, className){
  if (!element || !className){
    return;
  }

  var classString = element.className, nameIndex = classString.indexOf(className);
  if (nameIndex == -1) {
    classString += ' ' + className;
  }
  else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
  }
  element.className = classString;
}

document.getElementById('readMore').addEventListener('click', function() {
  toggleClass(document.getElementById('team-section'), 'active');
});

var teamSection = document.querySelectorAll('.cm-team-member-card-group');
if (teamSection) {
  Array.prototype.slice.call(teamSection).forEach(function (ele) {
    ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('has-author-section');
  });
}