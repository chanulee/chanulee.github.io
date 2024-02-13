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

function showSlide(index) {
	const slides = document.querySelectorAll(".list-img .slider-img");
	if (index >= slides.length) slideIndex = 0;
	if (index < 0) slideIndex = slides.length - 1;

	slides.forEach(slide => slide.style.display = "none");
	slides[slideIndex].style.display = "block";
}

document.getElementById('next').addEventListener('click', () => {
	showSlide(++slideIndex);
});

document.getElementById('prev').addEventListener('click', () => {
	showSlide(--slideIndex);
});

// Touch sliding for mobile
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.getElementById('carousel');

carousel.addEventListener('touchstart', e => {
	touchStartX = e.touches[0].clientX;
}, false);

carousel.addEventListener('touchend', e => {
	touchEndX = e.changedTouches[0].clientX;
	handleTouch();
}, false);

function handleTouch() {
	if (touchEndX < touchStartX - 50) {
		showSlide(++slideIndex);
	}
	if (touchEndX > touchStartX + 50) {
		showSlide(--slideIndex);
	}
}

// Initially show the first slide
showSlide(slideIndex);
