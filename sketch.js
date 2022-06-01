// Constants to define color for backgrounds
const WHITE_BACKGROUND = 255;
const BLACK_BACKGROUND = 0;

// Constants for radio button input
const BLACK_BACKGROUND_RGB_RADIO_VALUE = 1;
const BLACK_BACKGROUND_HSB_RADIO_VALUE = 2;
const WHITE_BACKGROUND_RGB_RADIO_VALUE = 3;
const WHITE_BACKGROUND_HSB_RADIO_VALUE = 4;


// The perlin noise flow field object
var perlinNoiseFlowField;

// Input fields for user interactivity
var alphaInput, 
  strokeWeightInput, 
  vectorMagnitudeInput, 
  numParticlesInput,
  vectorFieldSizeInput;

var vectorFieldOffsetSlider,
  noiseScaleSlider,
  flowFieldRotationAngleSlider;

// HTML paragraph elements to display information about the perlin noise flow field
 var alphaElement, 
  vectorFieldEOffsetElement, 
  noiseScaleElement, 
  strokeWeightElement, 
  vectorMagnitudeElement, 
  numParticlesElement, 
  vectorFieldSizeElement,
  flowFieldRotationAngleElement;

// Buttons to process user input, clearing the screen, and reseting the perlin noise flow field
var submitButton, 
  clearButton,
  resetButton;

// Radio button to control the background and perlin noise flow field color
var colorRadio,
  previousRadioValue;

// Keep track of the color of the background to clear the screen
var currentBackgroundColor;

function setup() 
{
  createCanvas(1420, 720, P2D);
  
  // Set the current background
  currentBackgroundColor = WHITE_BACKGROUND;
  // Clear the background to the current background color
  ClearBackground();

  // Set the angle mode to radians
  angleMode(RADIANS)

  // Create perlin noise flow field
  perlinNoiseFlowField = new FlowField(DEFAULT_VECTOR_FIELD_SIZE,
     DEFAULT_NUM_PARTICLES,
     DEFAULT_ALPHA,
     DEFAULT_VECTOR_FIELD_OFFSET,
     DEFAULT_VECTOR_MAGNITUDE,
     DEFAULT_NOISE_SCALE,
     DEFAULT_STROKE_WEIGHT);

  // Initialize all UI for user interactivity
  SetupUI();
}

function draw()
{
  UpdateColorRadioButtons();
  UpdateSliders();
  perlinNoiseFlowField.Update();
  perlinNoiseFlowField.Draw();
}

/*
 * Initialize and position all user interface elements on the web page
 */
function SetupUI()
{
  // Create radio button group
  colorRadio = createRadio();
  // Set each option for background color and color mode changes
  colorRadio.option(' Black Background', BLACK_BACKGROUND_RGB_RADIO_VALUE);
  colorRadio.option(' HSB with Black Background', BLACK_BACKGROUND_HSB_RADIO_VALUE);
  colorRadio.option(' White Background', WHITE_BACKGROUND_RGB_RADIO_VALUE);
  colorRadio.option(' HSB with White Background', WHITE_BACKGROUND_HSB_RADIO_VALUE);
  // Set previous radio value to an invalid value
  previousRadioValue = -1;

  // Create all buttons
  submitButton = createButton('Submit');
  clearButton = createButton('Clear');
  resetButton = createButton('Reset');

  // Set mouse pressed events for each button
  submitButton.mousePressed(ProcessInput); 
  clearButton.mousePressed(ClearBackground); 
  resetButton.mousePressed(Reset);

  // Create all sliders
  vectorFieldOffsetSlider = createSlider(0.00001, 1, 0.00001, 0.00001);
  noiseScaleSlider = createSlider(0.09, 1, 0.09, 0.01);
  flowFieldRotationAngleSlider = createSlider(0, 360, 0, 1);

  // Set the style of the slider objects
  vectorFieldOffsetSlider.style('width', '200px');
  noiseScaleSlider.style('width', '200px');
  flowFieldRotationAngleSlider.style('width', '200px');

  // Create all input fields
  alphaInput = createInput();
  strokeWeightInput = createInput();
  vectorMagnitudeInput = createInput();
  numParticlesInput = createInput();
  vectorFieldSizeInput = createInput();

  // Create all HTML paragraph elements to display information about the perlin noise field
  alphaElement = createElement('p', 'Input Alpha Value (currently ' + perlinNoiseFlowField.GetAlpha() + ')');
  vectorFieldEOffsetElement = createElement('p', 'Input Vector Field Offset (currently ' + perlinNoiseFlowField.GetVectorFieldOffset() + ')');
  noiseScaleElement = createElement('p', 'Input Noise Scale (currently ' + perlinNoiseFlowField.GetNoiseScale() + ')');
  strokeWeightElement = createElement('p', 'Input Stroke Weight (currently ' + perlinNoiseFlowField.GetStrokeWeight() + ')');
  vectorMagnitudeElement = createElement('p', 'Input Vector Magnitude (currently ' + perlinNoiseFlowField.GetVectorMagnitude() + ')');
  numParticlesElement = createElement('p', 'Input Number of Particles (currently ' + perlinNoiseFlowField.GetNumberOfParticles() + ')');
  vectorFieldSizeElement = createElement('p', 'Input Size of Vector Field Grid (currently ' + perlinNoiseFlowField.GetVectorFieldSize() + ')');
  flowFieldRotationAngleElement = createElement('p', 'Rotation Angle of Flow Field (currently ' + perlinNoiseFlowField.GetRotationalAngleOffset() + String.fromCharCode(176) + ')');

  // Position all buttons, HTML elements, input fields, and radio buttons
  alphaInput.position(0, height + 50);
  alphaElement.position(0, height + 10);

  vectorFieldOffsetSlider.position(250, height + 50);
  vectorFieldEOffsetElement.position(vectorFieldOffsetSlider.x,  height + 10);

  noiseScaleSlider.position(550, height + 50);
  noiseScaleElement.position(noiseScaleSlider.x, height + 10);

  strokeWeightInput.position(800, height + 50);
  strokeWeightElement.position(strokeWeightInput.x, height + 10);

  vectorMagnitudeInput.position(1050, height + 50);
  vectorMagnitudeElement.position(vectorMagnitudeInput.x, height + 10);

  numParticlesInput.position(0, alphaInput.y + 50);
  numParticlesElement.position(0, numParticlesInput.y - numParticlesInput.height - 15);

  vectorFieldSizeInput.position(300, alphaInput.y + 50);
  vectorFieldSizeElement.position(vectorFieldSizeInput.x, vectorFieldSizeInput.y - vectorFieldSizeInput.height - 15);

  flowFieldRotationAngleSlider.position(625, alphaInput.y + 50);
  flowFieldRotationAngleElement.position(flowFieldRotationAngleSlider.x, flowFieldRotationAngleSlider.y - flowFieldRotationAngleSlider.height - 15);

  submitButton.position(0, height + 150);
  clearButton.position(submitButton.width, submitButton.y);
  resetButton.position(clearButton.width + submitButton.width, clearButton.y);

  colorRadio.position(0, submitButton.y + 50);
}

/*
 * Update the perlin noise field based upon the selected radio button
 */
function UpdateColorRadioButtons()
{
  // Get the string value stored in the color radio button
  let stringValue = colorRadio.value();
  // Kill the update if the string value is an empty string
  if(stringValue != '')
  {
    // Since the string is not empty, parse the string into an integer value
    let value = parseInt(stringValue);
    // Only update the background and color mode if the previous radio button value is not the current value
    if(value != previousRadioValue)
    {
      if(value == BLACK_BACKGROUND_RGB_RADIO_VALUE)
      {
        // Change background color to black
        currentBackgroundColor = BLACK_BACKGROUND;
        // Change the color mode to the perlin noise flow field to RGB
        perlinNoiseFlowField.SetColorMode(RGB);
        // If the color of the particles in the perlin noise flow field is black, toggle the color to white
        if(perlinNoiseFlowField.GetColorOfParticles() == BLACK_BACKGROUND)
        {
          perlinNoiseFlowField.ToggleColorOfParticles();
        }
      }
      else if(value == BLACK_BACKGROUND_HSB_RADIO_VALUE)
      {
        // Change background color to black
        currentBackgroundColor = BLACK_BACKGROUND;
        // Change the color mode to the perlin noise flow field to HSB
        perlinNoiseFlowField.SetColorMode(HSB);
      }
      else if(value == WHITE_BACKGROUND_RGB_RADIO_VALUE)
      {
        // Change background color to white
        currentBackgroundColor = WHITE_BACKGROUND;
        // Change the color mode to the perlin noise flow field to RGB
        perlinNoiseFlowField.SetColorMode(RGB);
        // If the color of the particles in the perlin noise flow field is white, toggle the color to black
        if(perlinNoiseFlowField.GetColorOfParticles() == WHITE_BACKGROUND)
        {
          perlinNoiseFlowField.ToggleColorOfParticles();
        }
      }
      else if(value == WHITE_BACKGROUND_HSB_RADIO_VALUE)
      {
        // Change background color to white
        currentBackgroundColor = WHITE_BACKGROUND;
        // Change the color mode to the perlin noise flow field to HSB
        perlinNoiseFlowField.SetColorMode(HSB);
      }
      // Update the previous value of the radio button
      previousRadioValue = value;
      ClearBackground();
    }
  }
}

/*
 * Update the perlin noise attributes based upon the current value of the sliders
 */
function UpdateSliders()
{
  var value = noiseScaleSlider.value();
  perlinNoiseFlowField.SetNoiseScale(value);
  value = vectorFieldOffsetSlider.value();
  perlinNoiseFlowField.SetVectorFieldOffset(value);
  value = flowFieldRotationAngleSlider.value();
  perlinNoiseFlowField.SetRotationalAngleOffset(value);
  UpdateElements();
}

/*
 * Reset the perlin noise flow field
 */
function Reset()
{
  ClearBackground();
  perlinNoiseFlowField.Reset();
  UpdateElements();
  flowFieldRotationAngleSlider.value(0);
  noiseScaleSlider.value(DEFAULT_NOISE_SCALE);
  vectorFieldOffsetSlider.value(DEFAULT_VECTOR_FIELD_OFFSET);
}

/*
 * Process user input field data on click of the submit button 
 */
function ProcessInput()
{
  // Process value of the alpha input field
  let value = alphaInput.value();
  if(value != '')
  {
    perlinNoiseFlowField.SetAlpha(parseInt(value));
    alphaInput.value(''); 
  }

  // Process value of the stroke weight input field
  value = strokeWeightInput.value();
  if(value != '')
  {
    perlinNoiseFlowField.SetStrokeWeight(parseInt(value));
    strokeWeightInput.value('');
  }

  // Process value of the vector magnitude input field
  value = vectorMagnitudeInput.value();
  if(value != '')
  {
    perlinNoiseFlowField.SetVectorMagnitude(parseFloat(value));
    vectorMagnitudeInput.value('');
  }

  // Process value of the number of particles input field
  value = numParticlesInput.value();
  if(value != '')
  {
    ClearBackground();
    perlinNoiseFlowField.SetNumberOfParticles(parseInt(value));
    numParticlesInput.value('');
  }

  // Process value of the vector field size input field
  value = vectorFieldSizeInput.value();
  if(value != '')
  {
    ClearBackground();
    // Change the noise seed to create a new unique vector flow field
    noiseSeed(random(-height - width, height + width));
    perlinNoiseFlowField.SetVectorFieldSize(parseInt(value));
    vectorFieldSizeInput.value('');
  }

  // Display the new attributes of the perline noise flow field set by the input fields
  UpdateElements();
}

/*
 * Redisplay the perlin noise flow field information presented in the HTML paragraph elements
 */
function UpdateElements()
{
  alphaElement.html('Input Alpha Value (currently ' + perlinNoiseFlowField.GetAlpha() + ')', false); 
  vectorFieldEOffsetElement.html('Input Vector Field Offset (currently ' + perlinNoiseFlowField.GetVectorFieldOffset() + ')', false); 
  noiseScaleElement.html('Input Noise Scale (currently ' + perlinNoiseFlowField.GetNoiseScale() + ')', false);
  strokeWeightElement.html('Input Stroke Weight (currently ' + perlinNoiseFlowField.GetStrokeWeight() + ')', false);
  vectorMagnitudeElement.html('Input Vector Magnitude (currently ' + perlinNoiseFlowField.GetVectorMagnitude() + ')', false);
  numParticlesElement.html('Input Number of Particles (currently ' + perlinNoiseFlowField.GetNumberOfParticles() + ')', false);
  vectorFieldSizeElement.html('Input Size of Vector Field Grid (currently ' + perlinNoiseFlowField.GetVectorFieldSize() + ')', false);
  flowFieldRotationAngleElement.html('Rotation Angle of Flow Field (currently ' + perlinNoiseFlowField.GetRotationalAngleOffset() + String.fromCharCode(176) + ')', false);
}

/*
 * Clears the screen to the color stored currentBackgroundColor
 */
function ClearBackground()
{
  background(currentBackgroundColor);
}
