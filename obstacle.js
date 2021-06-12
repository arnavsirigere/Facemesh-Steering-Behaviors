class Obstacle extends p5.Vector {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
    this.xVel = random(-3, 3);
    this.yVel = random(-3, 3);
  }

  show() {
    fill(128, 0, 128);
    noStroke();
    ellipse(obstacle.x, obstacle.y, this.r * 2);
  }

  update() {
    obstacle.x += this.xVel;
    obstacle.y += this.yVel;
    if (this.x - this.r < 0 || this.x + this.r > width) {
      this.xVel *= -1;
    }
    if (this.y - this.r < 0 || this.y + this.r > height) {
      this.yVel *= -1;
    }
  }
}
