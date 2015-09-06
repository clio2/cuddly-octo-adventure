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
    
    var bufferX = [];
    var bufferY = [];
    var bufferZ = [];
    
    // Used for the freeze function
	var onOff = 0;
    var locationX;
    var locationY;
    var angleFromZ;
    
    // to change text inside these ids
    var buttonFreeze = document.getElementById("freeze-button");
    var messageArea = document.getElementById("message-area");
    var freezeAngle;

    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        var aX, aY, aZ;
        var gX, gY, gZ;
        
     	var filteredValueX, filteredValueY, filteredValueZ;

        
        // This function handles the new incoming values from the accelerometer
        aX = event.accelerationIncludingGravity.x;
        aY = event.accelerationIncludingGravity.y;
        aZ = event.accelerationIncludingGravity.z;
        
        // Turn the acceleration values into ratios of gravity
        gX = aX/9.8;
        gY = aY/9.8;
        gZ = aZ/9.8;
        
        // Change to moving median here
        filteredValueX = movingAverage(bufferX, gX);
        filteredValueY = movingAverage(bufferY, gY);
        filteredValueZ = movingAverage(bufferZ, gZ);
        
        //filteredValueX = movingMedian(bufferX, gX);
        //filteredValueY = movingMedian(bufferY, gY);
        //filteredValueZ = movingMedian(bufferZ, gZ);
        
        angleFromZ = displayAngle(filteredValueX, filteredValueY, filteredValueZ);
        
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
        
        // For the freeze button, if onOff is not = to 0, the pale button will be frozen
        if(onOff === 0){
            uiController.bubbleTranslate(locationX, locationY, "dark-bubble")
            uiController.bubbleTranslate(locationX, locationY, "pale-bubble")
                         
            messageArea.innerHTML = "Angle from Z: " + angleFromZ.toFixed(2) + "\xB0"  + "<br/>";   
        }
        else{
            uiController.bubbleTranslate(locationX, locationY, "dark-bubble");
            messageArea.innerHTML = "Angle from Z: " + angleFromZ.toFixed(2) + "\xB0"  + "<br/>" + "Frozen Angle: " + freezeAngle + "\xB0";     
		}
            
        
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

        var angleZ;
         
        var outString="";
            
        var x2 = Math.pow(x,2);
        var y2 = Math.pow(y,2);
        var z2 = Math.pow(z,2);
        var Fg = Math.sqrt(x2 + y2 + z2);
            
    
        angleZ = (Math.acos(z/Fg) * 180) / Math.PI;
            
        return angleZ;
    }

    self.freezeClick = function()
    { 
        // This function will trigger when the "Freeze" button is pressed

		var freezeLocationX;
        var freezeLocationY;
    
        if(onOff === 0){
        	// Freezes the pale button and stores the angle 
            onOff = 1;
            freezeLocationX = locationX;
            freezeLocationY = locationY;
            buttonFreeze.innerHTML = "Unfreeze";
		    freezeAngle = angleFromZ.toFixed(2)
            
            uiController.bubbleTranslate(freezeLocationX, freezeLocationY, "pale-bubble");   
        }
        else{
        	// unfreezes the pale button
            onOff = 0;
            buttonFreeze.innerHTML = "Freeze";
        }
    }

    function movingMedian(buffer, newValue)
    {
      // This function handles the Moving Median Filter
      // Input:
      //      buffer - the buffer in which the function will apply the moving to.

      //      newValue - the newest value that will be pushed into the buffer

      // Output: filteredValue - returns the result of the moving median filter
        
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
