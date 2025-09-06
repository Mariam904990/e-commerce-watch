const Slider = {
  init(sliderSelector, interval = 4000) {
    this.slider = document.querySelector(sliderSelector);
    if (!this.slider) return;

    this.wrapper = this.slider.querySelector(".slides-wrapper");
    this.slides = this.slider.querySelectorAll(".slide");
    this.prevBtn = this.slider.querySelector("#prev");
    this.nextBtn = this.slider.querySelector("#next");
    this.dotsContainer = this.slider.querySelector(".dots");

    this.current = 0;
    this.intervalTime = interval;
    this.slideInterval = null;

    this.startX = 0;
    this.endX = 0;

    this.createDots();
    this.showSlide(this.current);
    this.bindEvents();
    this.startAutoSlide();
  },

  createDots() {
    this.slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      this.dotsContainer.appendChild(dot);
    });
    this.dots = this.dotsContainer.querySelectorAll("span");
  },

  showSlide(index) {
    this.current = index;
    this.wrapper.style.transform = `translateX(-${index * 100}%)`;
    this.dots.forEach((d) => d.classList.remove("active"));
    this.dots[index].classList.add("active");
  },

  nextSlide() {
    let index = (this.current + 1) % this.slides.length;
    this.showSlide(index);
  },

  prevSlide() {
    let index = (this.current - 1 + this.slides.length) % this.slides.length;
    this.showSlide(index);
  },

  startAutoSlide() {
    this.slideInterval = setInterval(() => this.nextSlide(), this.intervalTime);
  },

  stopAutoSlide() {
    clearInterval(this.slideInterval);
  },

  restartAuto() {
    this.stopAutoSlide();
    this.startAutoSlide();
  },

  bindEvents() {
    this.nextBtn.addEventListener("click", () => {
      this.nextSlide();
      this.restartAuto();
    });
    this.prevBtn.addEventListener("click", () => {
      this.prevSlide();
      this.restartAuto();
    });
    this.dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        this.showSlide(i);
        this.restartAuto();
      });
    });

    this.slider.addEventListener(
      "touchstart",
      (e) => (this.startX = e.touches[0].clientX)
    );
    this.slider.addEventListener("touchend", (e) => {
      this.endX = e.changedTouches[0].clientX;
      this.handleSwipe();
    });

    this.slider.addEventListener("mousedown", (e) => (this.startX = e.clientX));
    this.slider.addEventListener("mouseup", (e) => {
      this.endX = e.clientX;
      this.handleSwipe();
    });
  },

  handleSwipe() {
    const diff = this.startX - this.endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.nextSlide();
      else this.prevSlide();
      this.restartAuto();
    }
  },
};

export { Slider };
