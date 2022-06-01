Perlin Noise Flow Field
=======================

![Perlin Noise Flow Field example](https://media.giphy.com/media/ck5Xl3NH0iosG9Kp3O/giphy.gif)

This project implements a vector flow field controlled by perlin noise. Each
particle on the screen uses the underlying vector field to determine its 
movement. 

Controls
========

### Input Fields:

1. Alpha Value: The alpha value of the particles in the flow field. Uses integervalues.

2. Stroke Weight: The stroke weight of the particles in the flow field. Uses integer values.

3. Vector Magnitude: The strength of the vectors within the vector field. The higher the value the greater
the directional effect the vectors have on the particles in the vector flow field. Uses float values.

4. Number Of Particles: The number of particles that will follow the vector flow field. When set,
the program will clear the screen and drop in the new particles. Uses integer values.

5. Size of Vector Field Grid: The size of the 2D vector field that the particles follow. When set, the program
will clear the screen, change the noise seed value, and create a new 2D vector field.

### Buttons:
    
 1. Submit Button: When clicked, it will parse the input fields and update the properties of the perlin noise flow
 field.

 2. Clear Button: Clears the screen with the current background color.

 3. Reset Button: Resets the perlin noise flow field to its default values.

### Radio Buttons:
    
1. Black Background: Changes the color mode to RGB, background to black, and sets the particle color to white.

2. HSB with Black Background: Changes the color mode to HSB, background to black, and sets the particle color to white.

3. White Background: Changes the color mode to RGB, background to white, and sets the particle color to black.

4. HSB with White Background: Changes the color mode to HSB, background to white, and sets the particle color to black.

### Sliders:
    
1. Vector Field Offset: The vector field offset controls how drastic the vector field changes over time.

2. Noise Scale: The noise scale to be applied to creating the vectors of the vector field. Uses float values.

3. Rotation Angle of FLow Field: The angle to rotate the vectors that comprise the flow field.
