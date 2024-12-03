document.querySelectorAll('.list-info').forEach(item => {
	item.addEventListener('click', event => {
		// Check if the screen width is more than 620px
		if (window.innerWidth > 620) {
			// If it is, don't perform the toggle action
			return;
		}
		// Otherwise, toggle the 'show' class on the sub element
		const detailDiv = event.currentTarget.querySelector('.detail');
		detailDiv.classList.toggle('show');
	});
});

document.querySelectorAll('.news-list').forEach(item => {
	item.addEventListener('click', event => {
		// Check if the screen width is more than 620px
		// Otherwise, toggle the 'show' class on the sub element
		const detailDiv = event.currentTarget.querySelector('.news-detail');
		detailDiv.classList.toggle('show');
	});
});



function setupCarousel(carouselContainer) {
	let slideIndex = 0;
	const slides = carouselContainer.querySelectorAll('img');
	const totalSlides = slides.length;

	carouselContainer.querySelector('.prev').addEventListener('click', () => {
		moveSlide(-1);
	});

	carouselContainer.querySelector('.next').addEventListener('click', () => {
		moveSlide(1);
	});

	function moveSlide(step) {
		slideIndex = (slideIndex + step + totalSlides) % totalSlides;
		const slideWidth = slides[0].width;
		const remValue = parseFloat(getComputedStyle(document.documentElement).fontSize); // Get the value of 1 rem in pixels
		const additionalWidth = 0.5 * remValue;
		const newWidth = slideWidth + additionalWidth;

		carouselContainer.querySelector('.slides').style.transform = 'translateX(' + (-newWidth * slideIndex) + 'px)';
	}
}

// Query all carousels and initialize them
document.querySelectorAll('.carousel').forEach(setupCarousel);
