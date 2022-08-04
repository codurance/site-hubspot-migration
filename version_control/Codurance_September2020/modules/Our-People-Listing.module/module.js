
const checkbox = document.querySelector('.custom-our-people__checkbox');
const notLeadership = document.querySelectorAll(".custom-our-people__card:not(.leadership)");

checkbox.addEventListener('change', filterLeadershipBoard);


function filterLeadershipBoard() {
   notLeadership.forEach(member => member.classList.toggle("hidden"));
}

