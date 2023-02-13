var vehicles = [];
var path;

function setup() {
  createCanvas(800, 600);
  for (var i = 0; i < 10; i += 1) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
  newPath();
}

function newPath() {
  path = new Path();
  path.addPoint(-20, height/2);
  path.addPoint(random(0, width/2), random(0, height));
  path.addPoint(random(width/2, width), random(0, height));
  path.addPoint(width+20, height/2);
}

function draw() {
  background(255);
  path.display();
  for (var i = 0; i < vehicles.length; i += 1) {
    vehicles[i].follow(path);
    vehicles[i].separate(vehicles);
    vehicles[i].borders(path);
    vehicles[i].update();
    vehicles[i].display();
  }

  fill(0);
  text("Click to generate new vehicles", 10, height - 20);
  text("Press the spacebar to get a new path", 10, height - 4);
}

function mousePressed() {
  vehicles.push(new Vehicle(mouseX, mouseY));
}

function keyPressed() {
  if (key == ' ') {
    newPath();
  }
}
