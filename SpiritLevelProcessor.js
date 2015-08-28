/****************************************************************************************
Avaiable functions for usage in the uiController object
==========dfsfsdfsdfsfddsfdfdf======================================================
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
    
    var buffer = [0, 0, 0];
 
    var aValues;
    var filteredValue;

    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        var aX, aY, aZ;
        var gX, gY, gZ;
        //var aValues;
        // This function handles the new incoming values from the accelerometer
        aX = event.accelerationIncludingGravity.x;
        aY = event.accelerationIncludingGravity.y;
        aZ = event.accelerationIncludingGravity.z;
        
        gX = aX/9.8;
        gY = aY/9.8;
        gZ = aZ/9.8;
        
        aValues = [gX, gY, gZ];
        
        filteredValue = movingAverage(gX);
        console.log(filteredValue);
        
        
    }

    function movingAverage(gX)
    {
        var valuex_update = gX
        var bufferArray = [];
        var totalx_average = 0;
        var totalx = 0;
        
        bufferArray.push(valuex_update)
        
        while(bufferArray > 29){
            
            bufferArray.slice(1,10)
        };
        for(var i = 0; i< bufferArray.length; i++){
            totalx += bufferArray[i];
            
        };
    
        totalx_average = totalx / 10;
        
        return totalx_average;
        // This function handles the Moving Average Filter

        // Input:
        //      buffer
        //      The buffer in which the function will apply the moving to.

        //      newValue
        //      This should be the newest value that will be pushed into the buffer

        // Output: filteredValue
        //      This function should return the result of the moving average filter
        
        
        
    }

    function displayAngle(x,y,z)
    {
        // This function will handle the calculation of the angle from the z-axis and
        // display it on the screen inside a "div" tag with the id of "message-area"

        // Input: x,y,z
        //      These values should be the filtered values after the Moving Average for
        //      each of the axes respectively
    }

    self.freezeClick = function()
    {
        // ADVANCED FUNCTIONALITY
        // ================================================================
        // This function will trigger when the "Freeze" button is pressed
        // The ID of the button is "freeze-button"
    }

    function movingMedian(buffer, newValue)
    {
      // ADVANCED FUNCTIONALITY
      // =================================================================
      // This function handles the Moving Median Filter
      // Input:
      //      buffer
      //      The buffer in which the function will apply the moving to.

      //      newValue
      //      This should be the newest value that will be pushed into the buffer

      // Output: filteredValue
      //      This function should return the result of the moving average filter
    }
}

