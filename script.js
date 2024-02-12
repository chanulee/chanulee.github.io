document.querySelectorAll('.list-item').forEach(item => {
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
