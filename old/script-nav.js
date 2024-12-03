document.addEventListener('DOMContentLoaded', () => {
	const dynamicIslandContainer = document.getElementById('dynamicIslandContainer');
	const dynamicIsland = document.getElementById('dynamicIsland');
	const tabs = document.getElementById('tabs');

	dynamicIslandContainer.addEventListener('mouseover', () => {
		dynamicIsland.style.width = '0';
		dynamicIsland.style.height = '0';
		dynamicIsland.style.borderRadius = '0';
		tabs.style.width = '644px';
		tabs.style.height = '48px';
		tabs.style.opacity = '1';
	});

	dynamicIslandContainer.addEventListener('mouseout', () => {
		dynamicIsland.style.width = '48px';
		dynamicIsland.style.height = '24px';
		dynamicIsland.style.borderRadius = '24px';
		tabs.style.width = '0';
		tabs.style.height = '0';
		tabs.style.opacity = '0';
	});
});
