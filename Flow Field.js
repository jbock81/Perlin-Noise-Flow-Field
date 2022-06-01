// Constants to define default properties of the perlin noise flow field
const DEFAULT_ALPHA = 5;
const DEFAULT_VECTOR_FIELD_OFFSET = 0.00001;
const DEFAULT_NUM_PARTICLES = 100;
const DEFAULT_VECTOR_MAGNITUDE = 1;
const DEFAULT_NOISE_SCALE = 0.09;
const DEFAULT_VECTOR_FIELD_SIZE = 50;
const DEFAULT_STROKE_WEIGHT = 1;
const WHITE = 255;
const BLACK = 0;
const HSB_RANGE = 100;

class FlowField
{
  constructor(
    vectorFieldGridSize, 
    numberOfParticles,
    alpha,
    vectorFieldOffset,
    vectorMagnitude,
    noiseScale,
    flowStrokeWeight)
  {
    this.vectorFieldShift = 0;
    this.vectorFieldOffset = vectorFieldOffset;
    this.alpha = alpha;
    this.vectorMagnitude = vectorMagnitude;
    this.noiseScale = noiseScale;
    this.vectorFieldGridSize = vectorFieldGridSize;
    this.flowStrokeWeight = flowStrokeWeight;
    this.colorOfParticles = BLACK;
    this.colorMode = RGB;
    this.rotationalAngleOffset = 0;
    this.CreateParticles(numberOfParticles);
    this.CreateNewVectorField();
  }

 /*
  * Finds the particles in the vector field and updates their velocities
  */
  Update()
  {
    // Get the row and column step based upon the vector field grid size and the canvas height and width
    let rowStep = height / this.vectorFieldGridSize;
    let columnStep = width / this.vectorFieldGridSize;
    // Iterate through all particles
    for(let i = 0; i < this.flowParticles.length; i++)
    {
      // Get a particle from the array of particles
      let particle = this.flowParticles[i];

      // Prevent the particle from flying off the canvas
      particle.AvoidEdges();

      // Get the vector field grid position of the particle
      let rowPositionOfParticle = floor(particle.GetYPosition() / rowStep);
      let columnPositionOfParticle = floor(particle.GetXPosition() / columnStep);
      // Update the velocity of the particle based upon the vector at the particles vector field grid position 
      particle.Update(this.vectorField[columnPositionOfParticle][rowPositionOfParticle]);
    }

    // Update the vector field using 
    this.CreateNewVectorField();
  }

 /*
  * Resets the perlin noise flow field properties to their default values
  */
  Reset()
  {
    this.alpha = DEFAULT_ALPHA;
    this.noiseScale = DEFAULT_NOISE_SCALE;
    this.flowStrokeWeight = DEFAULT_STROKE_WEIGHT;
    this.vectorFieldGridSize = DEFAULT_VECTOR_FIELD_SIZE;
    this.vectorFieldOffset = DEFAULT_VECTOR_FIELD_OFFSET;
    this.vectorMagnitude = DEFAULT_VECTOR_MAGNITUDE;
    this.rotationalAngleOffset = 0;
    this.CreateParticles(DEFAULT_NUM_PARTICLES);
    this.CreateNewVectorField();
  }

 /*
  * Render the perlin noise flow field based upon the color mode
  */
  Draw()
  {
    if(this.colorMode == RGB)
    {
      this.DrawRgb();
    }
    else
    {
      this.DrawHsb();
    }
  }

 /*
  * Render the perlin noise flow field using the RGB color mode
  */
  DrawRgb()
  {
    // Set color and alpha for all particles
    stroke(this.colorOfParticles, this.alpha);
    // Set stroke weight for all particles
    strokeWeight(this.flowStrokeWeight);
    // Iterate all particles 
    for(let i = 0; i < this.flowParticles.length; i++)
    {
      // Render the particle using RGB mode
      this.flowParticles[i].DrawRgb();
    }
  }

 /*
  * Render the perlin noise flow field using the HSB color mode
  */
  DrawHsb()
  {
    // Set stroke weight for all particles
    strokeWeight(this.flowStrokeWeight);
    // Iterate all particles 
    for(let i = 0; i < this.flowParticles.length; i++)
    {
      // Render the particle using HSB mode
      this.flowParticles[i].DrawHsb(this.alpha);
    }
  }

 /*
  * Create vector field for the particles to follow
  */
  CreateNewVectorField()
  {
    // Create 2D array to store each vector that will be used in the vector field
    this.vectorField = new Array(this.vectorFieldGridSize);
    for(let i = 0; i < this.vectorFieldGridSize; i++)
    {
      this.vectorField[i] = new Array(this.vectorFieldGridSize);
    }

    // Iterate throught the 2D vector field array
    for(let i = 0; i < this.vectorFieldGridSize; i++)
    {
      for(let j = 0; j < this.vectorFieldGridSize; j++)
      {
        // Use 3D perlin noise to generate a angle.
        let angle = noise(j * this.noiseScale, i * this.noiseScale, this.vectorFieldShift) * TWO_PI + radians(this.rotationalAngleOffset);
        // Create a vector from the angle and place it into the 2D vector field array
        this.vectorField[i][j] = p5.Vector.fromAngle(angle).setMag(this.vectorMagnitude);
      }
      // Update the vector field shift so that the perlin noise field changes over time
      this.vectorFieldShift += this.vectorFieldOffset;
    }
  }

 /*
  * Create an array of particles
  */
  CreateParticles(numberOfParticles)
  {
    // Create an array
    this.flowParticles = new Array(numberOfParticles);
    // Fill the array with Particle objects
    for(let i = 0; i < this.flowParticles.length; i++)
    {
      this.flowParticles[i] = new Particle(HSB_RANGE);
    }
  }

 /*
  * Set new alpha value
  * @param newAlpha
  *         New alpha value for the perlin noise flow field
  */
  SetAlpha(newAlpha)
  {
    (newAlpha >= 0 && newAlpha <= 255) ? this.alpha = newAlpha : this.alpha = DEFAULT_ALPHA;
  }

 /*
  * Return the alpha value of the perlin noise flow field
  */
  GetAlpha()
  {
    return this.alpha;
  }

 /*
  * Set new vector field offset value
  * @param newVectorFieldOffset
  *         New vector field offset value for the perlin noise flow field
  */
  SetVectorFieldOffset(newVectorFieldOffset)
  {
    this.vectorFieldOffset =newVectorFieldOffset;
  }

 /*
  * Return the vector field offset value of the perlin noise flow field
  */
  GetVectorFieldOffset()
  {
    return this.vectorFieldOffset;
  }

 /*
  * Set new noise scale value
  * @param newNoiseScale
  *         New noise scale value for the perlin noise flow field
  */
  SetNoiseScale(newNoiseScale)
  {
    (newNoiseScale > 0) ? this.noiseScale = newNoiseScale : this.noiseScale = DEFAULT_NOISE_SCALE;
  }

 /*
  * Return the noise scale value of the perlin noise flow field
  */
  GetNoiseScale()
  {
    return this.noiseScale;
  }

 /*
  * Set new stroke weight value
  * @param newStrokeWeight
  *         New stroke weight value for the perlin noise flow field
  */
  SetStrokeWeight(newStrokeWeight)
  {
    (newStrokeWeight > 0) ? this.flowStrokeWeight = newStrokeWeight: this.flowStrokeWeight = DEFAULT_STROKE_WEIGHT;
  }

 /*
  * Return the stroke weight value of the perlin noise flow field
  */
  GetStrokeWeight()
  {
    return this.flowStrokeWeight;
  }

 /*
  * Set new vector magnitude value
  * @param newVectorMagnitude
  *         New vector magnitude value for the perlin noise flow field
  */
  SetVectorMagnitude(newVectorMagnitude)
  {
    (newVectorMagnitude > 0) ? this.vectorMagnitude = newVectorMagnitude: this.vectorMagnitude = DEFAULT_VECTOR_MAGNITUDE;
  }

 /*
  * Return the vector magnitude value of the perlin noise flow field
  */
  GetVectorMagnitude()
  {
    return this.vectorMagnitude;
  }

 /*
  * Set new number of particles value and create new particle array to match the new value
  * @param newNumberOfParticles
  *         New number of particles value for the perlin noise flow field
  */
  SetNumberOfParticles(newNumberOfParticles)
  {
    if(newNumberOfParticles > 0)
    {
      this.CreateParticles(newNumberOfParticles);
    }
  }

 /*
  * Return the number of particles in the perlin noise flow field
  */
  GetNumberOfParticles()
  {
    return this.flowParticles.length;
  }

 /*
  * Set new vector field grid size value and create new 2D vector field array to match the new value
  * @param newVectorFieldGridSize
  *         New vector field grid size value for the perlin noise flow field
  */
  SetVectorFieldSize(newVectorFieldGridSize)
  {
    if(newVectorFieldGridSize > 0)
    {
      this.vectorFieldGridSize = newVectorFieldGridSize;
      this.CreateNewVectorField();
    }
  }

 /*
  * Return the size of the 2D vector field of the perlin noise flow field
  */
  GetVectorFieldSize()
  {
    return this.vectorFieldGridSize;
  }

 /*
  * Toggles the Particles color value between black and white for RGB rendering
  */
  ToggleColorOfParticles()
  {
    (this.colorOfParticles == BLACK) ? this.colorOfParticles = WHITE: this.colorOfParticles = BLACK;
  }

 /*
  * Return the color of the particles for RGB rendering
  */
  GetColorOfParticles()
  {
    return this.colorOfParticles;
  }

 /*
  * Set new color mode 
  * @param newColorMode
  *         New color mode for the perlin noise flow field
  */
  SetColorMode(newColorMode)
  {
    this.colorMode = newColorMode;
    if(this.colorMode == RGB)
    {
      colorMode(this.colorMode);
    }
    else if(this.colorMode == HSB)
    {
      colorMode(this.colorMode, HSB_RANGE);
    }
  }

 /*
  * Returns the rotational angle
  */
  GetRotationalAngleOffset()
  {
    return this.rotationalAngleOffset;
  }

 /*
  * Set new rotational angle offset for the flow field
  * @param newAngle
  *         New rotational angle offset for the perlin noise flow field
  */
  SetRotationalAngleOffset(newAngle)
  {
    (this.rotationalAngleOffset >= 0 || this.rotationalAngleOffset <= 360) ? this.rotationalAngleOffset = newAngle: this.rotationalAngleOffset = 0;
  }
}