// Max speed of particles
const MAX_SPEED = 4;
// Time in milliseconds to change color of the particle in HSB mode
const QUARTER_OF_A_SECOND_IN_MILLIS = 250;

class Particle
{
  constructor(hsbRange)
  {
    // Set random position for the particle
    this.position = createVector(random(width - 1), random(height - 1));
    // Save previous point for line rendering
    this.previousPosition = createVector(this.position.x, this.position.y);
    this.velocity = createVector();
    // Get the initial time
    this.currentMillis = millis();
    this.previousMillis = this.currentMillis;
    // Set number of ticks to 0. Ticks dicate the hue in HSB mode
    this.ticks = 0;
    // Save the HSB mode range of values
    this.hsbRange = hsbRange;
  }

 /*
  * Update the veocity of the particle and the timer used for HSB color mode rendering
  * @param forceVector
  *        The force vector to apply to the velocity. The velocity updates the position of the particle
  */
  Update(forceVector)
  {
    // Add the force vector to the velocity
    this.velocity.add(forceVector);
    // Prevent the velocity from exceeding the max speed
    this.velocity.limit(MAX_SPEED);
    // Save the previous point before the velocity vector is applied to the position
    this.previousPosition = createVector(this.position.x, this.position.y);
    // Update the position based upon the velocity
    this.position.add(this.velocity);

    // Update the number of ticks if the total ellapsed time exceeds a quarter of a second
    this.currentMillis = millis();
    if(this.currentMillis - this.previousMillis >= QUARTER_OF_A_SECOND_IN_MILLIS)
    {
        this.previousMillis = this.currentMillis;
        this.ticks++;
    }

    // Prevent the ticks from exceeding the HSB value range since ticks dictate the hue in HSB mode
    if(this.ticks > this.hsbRange)
    {
      this.ticks = 0;
    }
  }

/*
 * Prevents particesl from flying off of the canvas
 */
  AvoidEdges()
  {
    if(this.position.x > width - 1)
    {
      this.position.x = 0;
      this.previousPosition.x = 0;
    }
    else if(this.position.x < 0)
    {
      this.position.x = width - 1;
      this.previousPosition.x = width - 1;
    }
    else if(this.position.y > height - 1)
    {
      this.position.y = 0;
      this.previousPosition.y = 0;
    }
    else if(this.position.y < 0)
    {
      this.position.y = height - 1;
      this.previousPosition.y = height - 1;
    }
  }

 /*
  * Renders a line from the previous to the current position of the particle. Stroke color must be set 
  * before calling this method
  */
  DrawRgb()
  {
    line(this.previousPosition.x, this.previousPosition.y, this.position.x, this.position.y);
  }

 /*
  * Renders a line from the previous to the current position of the particle. Use the ticks to determine 
  * the hue of the particle in HSB mode.
  * @param alpha
  *        The alpha value to apply to the particle
  */
  DrawHsb(alpha)
  {
    stroke(this.ticks, this.hsbRange, this.hsbRange, alpha);
    line(this.previousPosition.x, this.previousPosition.y, this.position.x, this.position.y);
  }

 /*
  * Returns the x position of the particle
  */
  GetXPosition()
  {
    return this.position.x;
  }

 /*
  * Returns the y position of the particle
  */
  GetYPosition()
  {
    return this.position.y;
  }
}
