document.querySelectorAll('.list-info').forEach(item => {
	item.addEventListener('click', event => {
		// Check if the screen width is more than 620px
		if (window.innerWidth > 620) {
			// If it is, don't perform the toggle action
			return;
		}
		// Otherwise, toggle the 'show' class on the sub element
		const detailDiv = event.currentTarget.querySelector('.list-info .detail');
		detailDiv.classList.toggle('show');
	});
});

let slideIndex = 0;
const slides = document.querySelectorAll('.slides img');
const totalSlides = slides.length;

document.querySelector('.prev').addEventListener('click', () => {
	moveSlide(-1);
});

document.querySelector('.next').addEventListener('click', () => {
	moveSlide(1);
});

function moveSlide(step) {
	slideIndex = (slideIndex + step + totalSlides) % totalSlides;
	const slideWidth = slides[0].width;
	document.querySelector('.slides').style.transform = 'translateX(' + (-slideWidth * slideIndex) + 'px)';
}

