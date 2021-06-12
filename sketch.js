let video;
let checkbox;
let facemesh;
let predictions;
let vehicles = [];
let obstacle;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height).hide();
  // Checkbox and Button
  checkbox = createCheckbox('Have facemask flee from obstacle').checked(true);
  createButton('Randomise Obstacle Velocity').mousePressed(() => {
    obstacle.xVel = random(-10, 10);
    obstacle.yVel = random(-10, 10);
  });
  // Facemesh and Obstacle
  facemesh = ml5.facemesh(video, () => console.log('Facemesh Model Ready!'));
  facemesh.on('predict', (results) => (predictions = results));
  obstacle = new Obstacle(random(width), random(height), 16);
}

function draw() {
  background(0);
  translate(width, 0);
  scale(-1, 1);
  clear();
  blendMode(ADD);
  image(video, 0, 0, width, height);
  updateFacemesh();
  if (checkbox.checked()) {
    obstacle.show();
    obstacle.update();
  }
  for (const vehicle of vehicles) {
    vehicle.show();
    if (checkbox.checked()) {
      vehicle.flee(obstacle);
    }
    vehicle.flee(createVector(map(mouseX, 0, width, width, 0), mouseY));
    vehicle.update();
  }
}

function updateFacemesh() {
  // For 1 prediction
  if (predictions?.length) {
    const keypoints = predictions[0].scaledMesh;
    if (!vehicles.length) {
      vehicles = new Array(keypoints.length).fill(undefined).map((_) => new Vehicle());
    }
    for (let i = 0; i < keypoints.length; i++) {
      const [x, y] = keypoints[i];
      vehicles[i].seek(createVector(x, y));
    }
  }
}
