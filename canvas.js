const canvas = document.getElementById("showcase__canvas");
const ctx = canvas.getContext("2d");

console.log(canvas.offsetWidth);

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let particlesArr = [];

//Mouse
const mouse = {
	x: null,
	y: null,
	radius: 100,
};

window.addEventListener("mousemove", event => {
	const canvasRect = canvas.getBoundingClientRect();
	mouse.x = event.x - canvasRect.x;
	mouse.y = event.y - canvasRect.y;
});

function drawImage() {
	let imageWidth = png.width;
	let imageHeight = png.height;
	const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	class Particle {
		constructor(x, y, color, size) {
			this.x = x + canvas.width / 2 - png.width * 2;
			this.y = y + canvas.height / 2 - png.height * 2;
			// this.x = x;
			// this.y = y;
			this.color = color;
			this.size = size;
			this.baseX = x + canvas.width / 2 - png.width * 2;
			this.baseY = y + canvas.height / 2 - png.height * 2;
			// this.baseX = x;
			// this.baseY = y;
			this.density = Math.random() * 10;
		}

		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}

		update() {
			ctx.fillStyle = this.color;

			// collision detection
			const dx = mouse.x - this.x;
			const dy = mouse.y - this.y;

			const distance = Math.sqrt(dx * dx + dy * dy);
			const forceDirectionX = dx / distance;
			const forceDirectionY = dy / distance;

			// max distance
			const maxDistance = 100;
			let force = (maxDistance - distance) / maxDistance;
			if (force < 0) force = 0;

			const directionX = forceDirectionX * force * this.density * 0.6;
			const directionY = forceDirectionY * force * this.density * 0.6;

			if (distance < mouse.radius + this.size) {
				this.x -= directionX;
				this.y -= directionY;
			} else {
				if (this.x !== this.baseX) {
					let dx = this.x - this.baseX;
					this.x -= dx / 20;
				}
				if (this.y !== this.baseY) {
					let dy = this.y - this.baseY;
					this.y -= dy / 20;
				}
			}

			this.draw();
		}
	}

	function init() {
		particlesArr = [];

		for (let y = 0; y < data.height; y++) {
			for (let x = 0; x < data.width; x++) {
				if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
					let positionX = x;
					let positionY = y;
					let color =
						"rgb(" +
						data.data[y * 4 * data.width + x * 4] +
						"," +
						data.data[y * 4 * data.width + x * 4 + 1] +
						"," +
						data.data[y * 4 * data.width + x * 4 + 2] +
						")";
					particlesArr.push(
						new Particle(positionX * 4, positionY * 4, color, 2)
					);
				}
			}
		}
	}

	function animate() {
		requestAnimationFrame(animate);
		// ctx.fillStyle = "rgba(22, 54, 74,1)";
		// ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < particlesArr.length; i++) {
			particlesArr[i].update();
		}
	}

	init();
	animate();

	window.addEventListener("resize", () => {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		init();
	});
}

const png = new Image();
png.src =
	"data:image/png;base64,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";

window.addEventListener("load", event => {
	console.log("Page has loaded");
	ctx.drawImage(png, 0, 0);
	drawImage();
});
