class Vehicle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 2;
    this.maxForce = 1;
    this.maxSpeed = 10;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    this.acc.mult(0);
  }

  show() {
    fill(colorPicker.color());
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    let speed = this.maxSpeed;
    let d = desired.mag();
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  flee(target) {
    const desired = p5.Vector.sub(target, this.pos);
    if (desired.mag() < 50) {
      desired.setMag(this.maxSpeed);
      desired.mult(-1);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce).mult(3);
      this.applyForce(steer);
    }
  }
}
