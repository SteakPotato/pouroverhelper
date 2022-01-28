window.addEventListener('load',() => {
	let icon = document.querySelector('#hamburger-icon');
	icon.addEventListener('click', (e) => {
        icon.classList.toggle('open');
    });
});


    