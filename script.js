document.querySelectorAll('.list-item').forEach(item => {
	item.addEventListener('click', () => {
		const h5 = item.querySelector('.list-info h5');
		h5.classList.toggle('show');
	});
});