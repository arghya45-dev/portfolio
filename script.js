function hamburg(){
    const navbar = document.querySelector(".dropdown")
    navbar.style.transform = "translateY(0px)"
}
function cancel(){
    const navbar = document.querySelector(".dropdown")
    navbar.style.transform = "translateY(-500px)"
}
// Typewriter Effect
const texts = [
    "DEVELOPER",
    "PROGRAMMER",
    "TECH ENTHUSIAST"
]
let speed  =100;
const textElements = document.querySelector(".typewriter-text");
let textIndex = 0;
let charcterIndex = 0;
function typeWriter(){
    if (charcterIndex < texts[textIndex].length){
        textElements.innerHTML += texts[textIndex].charAt(charcterIndex);
        charcterIndex++;
        setTimeout(typeWriter, speed);
    }
    else{
        setTimeout(eraseText, 1000)
    }
}
function eraseText(){
    if(textElements.innerHTML.length > 0){
        textElements.innerHTML = textElements.innerHTML.slice(0,-1);
        setTimeout(eraseText, 50)
    }
    else{
        textIndex = (textIndex + 1) % texts.length;
        charcterIndex = 0;
        setTimeout(typeWriter, 500)
    }
}
window.onload = typeWriter


const skillElements = document.querySelectorAll('.skill-progress');

const skillValues = {
    html: '90%',
    javascript: '85%',
    react: '80%',
    nodejs: '40%',
    python: '70%'
};

const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.dataset.progress;
            entry.target.style.width = progress; // Set the width from the data-progress attribute
            observer.unobserve(entry.target); // Stop observing after animation
        }
    });
}, { threshold: 0.5 });

skillElements.forEach(skill => {
    skill.dataset.progress = skillValues[skill.classList[1]]; // Assign the skill level dynamically
    skill.style.width = '0%'; // Initially set to 0%
    skillObserver.observe(skill); // Observe each skill for animation trigger
});
AOS.init({
    duration: 1500,  // Animation duration
    easing: 'ease-in-out',  // Easing function for smoothness
    once: true,  // Animation happens once when it comes into view
    offset: 100,  // Trigger animation when the element is 100px from the bottom of the viewport
});


