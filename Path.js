class Path {
  constructor() {
    this.radius = 20;
    this.points = [];
  }

  addPoint(x, y) {
    this.points.push(createVector(x, y));
  }

  getStartingPoint() {
    return this.points[0];
  }

  getEndingPoint() {
    return this.points[this.points.length - 1];
  }

  // Draw the path
  display() {
    // Draw thick line for radius
    stroke(175);
    strokeWeight(this.radius*2);
    noFill();
    beginShape();
    for (var i = 0; i < this.points.length; i += 1) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape();
    // Draw thin line for center of path
    stroke(0);
    strokeWeight(1);
    noFill();
    beginShape();
    for (var i = 0; i < this.points.length; i += 1) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape();
  }
}
