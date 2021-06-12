let video;
let obstacleCheckbox, videoCheckbox;
let colorPicker;
let facemesh;
let predictions;
let vehicles = [];
let obstacle;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height).hide();
  // Dom Elements
  obstacleCheckbox = createCheckbox('Have facemask flee from obstacle').checked(true);
  videoCheckbox = createCheckbox('Draw Video').checked(true);
  createButton('Randomise Obstacle Velocity').mousePressed(() => {
    obstacle.xVel = random(-10, 10);
    obstacle.yVel = random(-10, 10);
  });
  createP('Customize Facemesh Color -> ');
  colorPicker = createColorPicker('#00FF00').position(210, 562);
  // Facemesh and Obstacle
  facemesh = ml5.facemesh(video, () => console.log('Facemesh Model Ready!'));
  facemesh.on('predict', (results) => (predictions = results));
  obstacle = new Obstacle(random(width), random(height), 16);
}

function draw() {
  clear();
  background(0);
  translate(width, 0);
  scale(-1, 1);
  blendMode(ADD);
  updateFacemesh();
  if (videoCheckbox.checked()) {
    image(video, 0, 0, width, height);
  }
  if (obstacleCheckbox.checked()) {
    obstacle.show();
    obstacle.update();
  }
  for (const vehicle of vehicles) {
    vehicle.show();
    if (obstacleCheckbox.checked()) {
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
