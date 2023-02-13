class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.radius = 5;
    this.maxSpeed = 3;
    this.maxForce = 0.2;
    this.separationWeight = 2;
  }

  // Method that calculuates a steering force towards a target
  // Steering force = desired force - current velocity
  seek(target) {
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    var steeringForce = p5.Vector.sub(desired, this.velocity);
    steeringForce.limit(this.maxForce);
    this.applyForce(steeringForce);
  }

  separate(vehicles) {
    var desiredSeparation = this.radius*4;
    var sum = createVector();
    var count = 0;
    // For every vehicle in the system, chekc if its too close
    for (var i = 0; i < vehicles.length; i += 1) {
      var distance = p5.Vector.dist(this.position, vehicles[i].position);
      if ((distance > 0) && (distance < desiredSeparation)) {
        var difference = p5.Vector.sub(this.position, vehicles[i].position);
        difference.normalize();
        difference.div(distance);
        sum.add(difference);
        count += 1;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      // Steering = Desired - velocity
      sum.sub(this.velocity)
      sum.limit(this.maxForce);
    }
    var separateForce = sum;
    separateForce.mult(this.separationWeight);
    this.applyForce(separateForce);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  follow(path) {
    // Might need to change this to createVector(this.velocity.x, this.velocity.y);
    var predictedVelocity = createVector(this.velocity.x, this.velocity.y);
    predictedVelocity.setMag(50);
    var predictedLocation = p5.Vector.add(this.position, predictedVelocity);
    var closestDistance = 1000000;

    for (var i = 0; i < path.points.length - 1; i += 1) {
      var pointA = path.points[i];
      var pointB = path.points[i + 1];

      // Get the normal point to that line
      var normalPoint = this.getNormalPoint(predictedLocation, pointA, pointB);
      if (normalPoint.x < pointA.x || normalPoint.x > pointB.x) {
        // This is something of a hacky solution, but if it's not within the line segment
        // consider the normal to just be the end of the line segment (point b)
        normalPoint = createVector(pointB.x, pointB.y);
      }

      // How far away are we from the path?
      var distance = p5.Vector.dist(predictedLocation, normalPoint);
      // Are we closer than the previous distances?
      if (distance < closestDistance) {
        closestDistance = distance;
        // Find target point a little further ahead of normalPoint
        var direction = p5.Vector.sub(pointB, pointA);
        direction.normalize();
        direction.mult(10);
        var target = p5.Vector.add(normalPoint, direction);
      }
    }

    // Only if the distance is greater than the path's radus do we bother to steer
    if (closestDistance > path.radius) {
      this.seek(target);
    }
  }

  // A function to get the normal point from an outside point (p) to a line segment (a-b)
  getNormalPoint(outsidePoint, pointA, pointB) {
    // Vector from pointA to outsidePoint
    var ap = p5.Vector.sub(outsidePoint, pointA);
    // Vector from pointA to pointB
    var ab = p5.Vector.sub(pointB, pointA);
    ab.normalize(); // Normalize the line
    // Poject vector "difference" onto line by using the dot product
    ab.mult(ap.dot(ab));
    var normalPoint = p5.Vector.add(pointA, ab);
    return normalPoint;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90);
    fill(0);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.radius * 2);
    vertex(-this.radius, this.radius * 2);
    vertex(this.radius, this.radius * 2);
    endShape(CLOSE);
    pop();
  }

  // Wraparound
  borders(path) {
    if (this.position.x > path.getEndingPoint().x + this.radius) {
      this.position.x = path.getStartingPoint().x - this.radius;
      this.position.y = path.getStartingPoint().y + (this.position.y - path.getEndingPoint().y);
    }
  }
}
