const BASE_SERVER_URL = "https://portfolio-api2.herokuapp.com";
// Auto text writer
(function autoTextWriter() {
	const text = `Young self motivated person who loves to code! I pride myself for beeing hardworking, creative, honest and reliable.`;
	const textContainer = document.querySelector("[data-auto-text]");
	for (let i = 0; i < text.length; i++) {
		setTimeout(() => {
			textContainer.textContent += text[i];
		}, 50 * i);
	}
})();

// Animation on scroll
(function animateOnScroll() {
	const elements = document.querySelectorAll("[data-anim]");
	const triggerPoint = window.innerHeight - 80;
	window.addEventListener("scroll", animate);
	window.addEventListener("load", animate);

	elements.forEach(element => {
		element.style.opacity = "0";
	});

	function animate() {
		elements.forEach(element => {
			if (element.getBoundingClientRect().top > triggerPoint) {
				return;
			}

			const animateDirection = element.getAttribute("data-anim");

			if (animateDirection === "left") {
				element.classList.add("animate_left");
				return;
			}
			if (animateDirection === "right") {
				element.classList.add("animate_right");
				return;
			}
			if (animateDirection === "bottom") {
				element.classList.add("animate_bottom");
				return;
			}
			if (animateDirection === "top") {
				element.classList.add("animate_top");
				return;
			}
		});
	}
})();

(function projectImagesSlider() {
	const controllers = document.querySelectorAll(
		"[data-project__images-controller]"
	);

	controllers.forEach(controller => {
		const sliderName = controller.getAttribute(
			"data-project__images-controller"
		);
		const slider = document.querySelector(
			`[data-project__images-slider=${sliderName}]`
		);
		const imageNumber = +controller.getAttribute("data-image-number");

		controller.addEventListener("click", () => {
			activateController(controller, sliderName);
			slider.style.transform = `translate(-${(imageNumber - 1) * 100}%,0px)`;
		});
	});

	function activateController(controller, sliderName) {
		const controllers = document.querySelectorAll(
			`[data-project__images-controller=${sliderName}]`
		);
		controllers.forEach(controller => {
			controller.classList.remove("active");
		});
		controller.classList.add("active");
	}
})();

// Projects dropdown
(function projectsDropdown() {
	const toggler = document.querySelector("[data-projects-dropdown-toggler]");
	const dropdown = document.getElementById("projects_dropdown");
	const dropdownContainer = document.querySelector(".dropdown");
	toggler.addEventListener("click", () => {
		dropdown.classList.toggle("show");
	});

	document.body.addEventListener("click", e => {
		if (!dropdownContainer.contains(e.target)) {
			dropdown.classList.remove("show");
		}
	});

	const dropdownLinks = dropdown.querySelectorAll("a");
	dropdownLinks.forEach(link => {
		link.addEventListener("click", () => {
			dropdown.classList.remove("show");
		});
	});
})();

// Track visits on website
(function trackVisits() {
	document.addEventListener("DOMContentLoaded", async () => {
		try {
			const res = await fetch("http://ip-api.com/json/");
			if (!res.ok) throw new Error("Fetch error");
			const data = await res.json();
			const geoData = {
				ip: data.query,
				country: data.country,
				city: data.city,
				zipcode: data.zip,
				lat: data.lat,
				lon: data.lon,
			};
			sendDataToServer(geoData);
		} catch (error) {
			console.log(error.message);
		}
	});

	async function sendDataToServer(data) {
		const config = {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		};
		try {
			const res = await fetch(BASE_SERVER_URL + "/visitors", config);
			if (!res.ok) throw new Error("Fetch error");
			const data = await res.json();
		} catch (error) {
			console.log(error.message);
		}
	}
})();
