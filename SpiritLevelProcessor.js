/****************************************************************************************
Avaiable functions for usage in the uiController object
================================================================
uiController.bubbleTranslate(x,y, id)
    This function will translate the bubble from the middle of the screen.
    The center of the screen is considered (0,0).

    Inputs:
        x,y
        Translates the bubble x px right and y px up. Negative values are accepted
        and translate the bubble in the opposite direction.

        id
        ID of bubble that needs to be moved

uiController.bodyDimensions()
    Returns the width and height of the body (without the toolbar)

    Return:
        Returns an object with the following fields
        {
            width:      [Returns the width of the body],
            height:     [Returns the width of the body]
        }

ID of HTML elements that are of interest
==============================================================
dark-bubble
    ID of the dark green bubble

pale-bubble
    ID of the pale green bubble

message-area
    ID of text area at the bottom of the screen, just on top on the "Feeze" button

freeze-button
    ID of the "Freeze" button
****************************************************************************************/

function SpiritLevelProcessor()
{
    var self = this;

    var uiController = null;
    //Making empty buffer arrays for coordinates x y z values within object buffe  
    var bufferX = [];
    var bufferY = [];
    var bufferZ = [];
    
    // Used for the freeze function
	var onOff = 0;
	var angleFreeze;
    var locationX;
    var locationY;
    
    //Creating variable for writing messages in message area
    var messageArea = document.getElementById("message-area");
    
    //Freeze button to change
    var buttonFreeze = document.getElementById("freeze-button");
    
    //Variable for Intial freeze therefore freeze being false would be its 'true'
	var freeze = false;
    
    //Intial empty string before freeze and refresh is used
    var stringAngle = "";
    
    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        // This function handles the new incoming values from the accelerometer
       var aX = event.accelerationIncludingGravity.x;
       var aY = event.accelerationIncludingGravity.y;
       var aZ = event.accelerationIncludingGravity.z;
        
        // Turn the acceleration values into ratios of gravity
       var gX = aX/9.8;
       var gY = aY/9.8;
       var gZ = aZ/9.8;
        
        //Calling moving average value function
       var filteredValueX = movingAverage(bufferX, gX);
       var filteredValueY = movingAverage(bufferY, gY);
       var filteredValueZ = movingAverage(bufferZ, gZ);
        
         //Calling moving median function
       var movingMedianX = movingMedian(bufferX, gX);
       var movingMedianY = movingMedian(bufferY, gY);
       var movingMedianZ = movingMedian(bufferZ, gZ);
        
        //Calling Angle from angle function with respect to moving Average filtered x y z ( AS GLOBAL VAR)
        angleDisplay = displayAngle(filteredValueX,filteredValueY,filteredValueZ)
        
        //Calling Angle from angle function with respect to moving Median filtered x y z ( AS GLOBAL VAR)
        angleDisplay2 = displayAngle(movingMedianX,movingMedianY,movingMedianZ)
        
        
        // Bubble translate code
        var displayDimiensions = uiController.bodyDimensions();
        var displayHalfWidth = displayDimiensions.width / 2;
        var displayHalfLength = displayDimiensions.height / 2;
        
        // Body constraints (so bubble won't go out of phone)
        if(filteredValueX > 1)
            filteredValueX = 1;
        else if(filteredValueX < -1)
            filteredValueX = -1;
        
        if(filteredValueY > 1)
            filteredValueY = 1;
        else if(filteredValueY < -1)
            filteredValueY = -1;
        
        // The location in X and Y where the bubbles will be on the display
        locationX = displayHalfWidth * filteredValueX;
        locationY = -(displayHalfLength * filteredValueY);
        
        //Translating the dark-bubble
    uiController.bubbleTranslate(locationX, locationY, "dark-bubble")
		
            
      //Outputting angles and 'freezes' to message area (change to moving Median angle by changing to angleDisplay2)
		 messageArea.innerHTML = "Angle: " + angleDisplay.toFixed(2) + "\xB0"  + "<br/>" + "Captured Angle: " + stringAngle;  
    }

    function movingAverage(buffer, newValue)
    {
        // This function handles the Moving Average Filter

        // Input:
        //      buffer - the buffer used to smooth out the gravity values.
        //      newValue - the newest value that will pushed into the buffer

        // Output: filteredAverage - returns the filtered value

    
        var valueUpdate = newValue;
        var total = 0;
        var filteredAverage;
		
        
        buffer.push(valueUpdate)
       
        
        if(buffer.length > 20){ 
            buffer.splice(0,1);          			
        };
        
        for(var i = 0; i < buffer.length; i++){
            total += buffer[i];
           
        };
    
        filteredAverage = total / buffer.length;
        
        
        return filteredAverage;    
    }
    
    function displayAngle(x,y,z)
    {
        // This function will handle the calculation of the angle from the z-axis and
        // display it on the screen.

        // Input: x,y,z
        //      These values are the filtered values after the moving average or median for
        //      each of the axes respectively
        var angle;   
        var x2 = Math.pow(x,2);
        var y2 = Math.pow(y,2);
        var z2 = Math.pow(z,2);
        var Fg = Math.sqrt(x2 + y2 + z2) //Position vector
        
        angle = (Math.acos(z/Fg) * 180) / Math.PI;    //Calculating the angle

        return angle;
    }

  self.freezeClick = function()
    {
        // ADVANCED FUNCTIONALITY
        // ================================================================
        // This function will trigger when the "Freeze" button is pressed
        // The ID of the button is "freeze-button"
		if(freeze){                  //Intially false as set at top
		buttonFreeze.innerHTML = "Freeze";
		freeze = false;
        uiController.bubbleTranslate(0, 0, "pale-bubble");  //Stays at (0,0)
        stringAngle = ""                  //Changes stringAngle outputted to empty string
		}
        else {
		buttonFreeze.innerHTML = "Refresh"
		freeze = true;
        uiController.bubbleTranslate(locationX, locationY, "pale-bubble");  //Captures last angle(Moving Median is xTransM,yTransM)
        stringAngle = angleDisplay.toFixed(2) + "\xB0" //Changes stringAngle outputted to Angle 
        }
    }

    function movingMedian(buffer, newValue)
    {
      // This function handles the Moving Median Filter
      // Input:
      //      buffer - the buffer in which the function will apply the moving to.

      //      newValue - the newest value that will be pushed into the buffer

      // Output: filteredValue - returns the result of the moving median filter
      // NOTE: Jerky motion when using this function for some reason
        
        var tempBuffer = [];
        var valueUpdate = newValue;
        var middleOfArray;
        var filteredMedian;
        
        buffer.push(newValue);
        
        if(buffer.length > 30){
            buffer.splice(0, 1);
        }
        
        for(var i = 0; i < buffer.length; i++){
            tempBuffer[i] = buffer[i];
        }
        
        tempBuffer.sort(function(a, b){return a-b});
        
        middleOfArray = tempBuffer.length / 2;
        
        if(tempBuffer.length % 2 === 0)
            filteredMedian = (tempBuffer[middleOfArray] + tempBuffer[middleOfArray - 1]) / 2;
        else
            filteredMedian = tempBuffer[middleOfArray - 0.5];

        return filteredMedian;
    }
}
