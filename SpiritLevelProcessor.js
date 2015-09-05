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

    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        var aX, aY, aZ;
        var gX, gY, gZ;
        
        var bufferX = [];
        var bufferY = [];
        var bufferZ = [];
        var filteredValueX, filteredValueY, filteredValueZ;
        
        var onoff = 0;
	    var angleFreeze;
        
        // This function handles the new incoming values from the accelerometer
        aX = event.accelerationIncludingGravity.x;
        aY = event.accelerationIncludingGravity.y;
        aZ = event.accelerationIncludingGravity.z;
        
        gX = aX/9.8;
        gY = aY/9.8;
        gZ = aZ/9.8;
        
        filteredValueX = movingMedian(bufferX, gX);
        filteredValueY = movingMedian(bufferY, gY);
        filteredValueZ = movingMedian(bufferZ, gZ);
        
		console.log([filteredValueX,filteredValueY,filteredValueZ])
		
		displayAngle(filteredValueX, filteredValueY, filteredValueZ);
       
        //bubbleTranslate code=================================================================================
        var newX, newY;
        var bodyDimension = uiController.bodyDimensions();
        var bodyHalfWidth = bodyDimension.width / 2;
        var bodyHalfHeight = bodyDimension.height / 2;
        var locationX, locationY;
        var tempX = 0;
        var tempY = 0;
        var tempFilteredX, tempFilteredY, tempFilteredZ;

        //these temps ensure no change to the filtervalues 
		tempFilteredX = filteredValueX;
		tempFilteredY = filteredValueY;
		tempFilteredZ = filteredValueZ;
        
	   //just in case it goes over the limit [-1,1] which it will.. cause it favours a bit to right for some reason	
        if(filteredValueX > 1){	
			tempFilteredX = 1;
		}
        
        if(filteredValueX < -1){
			tempFilteredX = -1
		}
        
		if(filteredValueY > 1){		
			tempFilteredY = 1;
		}
        
        if(filteredValueY < -1){
			tempFilteredY = -1
		}
        
	//since the code start (0,0)
	//the range act as a factor for the translations
        newX = bodyHalfWidth * tempFilteredX;
        newY = -(bodyHalfHeight * tempFilteredY);
   
   //tempX amd tempY will acts as the previous location and translates from there
        locationX = newX - tempX;
        locationY = newY - tempX;
        tempX = newX;
        tempY = newY;
       
       
      if(onoff === 0){
       uiController.bubbleTranslate(locationX, locationY, "dark-bubble");
       uiController.bubbleTranslate(locationX, locationY, "pale-bubble");
       }
       else{
             uiController.bubbleTranslate(locationX, locationY, "dark-bubble");
           
       }
        //=========================================================================================================
        
      
    }

    function movingAverage(buffer, newValue)
    {
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
		          var target = document.getElementById("message-area");

            var angleZ;
         
            var outString="";
            
            var x2 = Math.pow(x,2);
            var y2 = Math.pow(y,2);
            var z2 = Math.pow(z,2);
            Fg = Math.sqrt(x2 + y2 + z2)
            
    
            angleZ = (Math.acos(z/Fg) * 180) / Math.PI;
            
             
            outString += angleZ.toFixed(2) + " degrees from the z axis." + "<br/>";
            
            target.innerHTML= outString;
    }

    self.freezeClick = function()
    {
		var target = document.getElementById("message-area")
		var outString="";
        var currentX = tempX;
        var currentY = tempY;
		var currentZ = tempZ;
    	if(onoff === 0){
    	    onoff++;
    	    if(currentX === locationX || currentY === locationY || currentZ === newerZ){
				
				angleFreeze = displayAngle(currentX,currentY,currentZ)
				outString += angleFreeze.toFixed(2) + "Same Level" + "<br/>";
				target.innerHTML = outString;
				
			}
    	}
    	else{
    	    uiController.bubbleTranslate((tempX - currentX),(tempY - currentY), "pale-bubble");
    	    onoff = onoff - 1;
    	}
        // ADVANCED FUNCTIONALITY
        // ================================================================
        // This function will trigger when the "Freeze" button is pressed
        // The ID of the button is "freeze-button"
    }

    function movingMedian(buffer, newValue)
    {
        var valueUpdate = newValue;
        var middleValue;
        var filteredMedian;
		var tempBuffer = [];
        
        buffer.push(valueUpdate)
       
        
        if(buffer.length > 20){
   
            buffer.splice(0, 1);
            }
        
        for(var i = 0; i < buffer.length; i++){
		tempBuffer[i] = buffer[i];
        }
        
        
        tempBuffer.sort(function(a,b){return a-b});
        
        middleValue = tempBuffer.length/2;
        
            if (tempBuffer.length % 2 === 0){
                filteredMedian = (tempBuffer[middleValue] + tempBuffer[middleValue-1]) / 2;
            }
            else {
                filteredMedian = tempBuffer[middleValue-0.5];
            }

         return filteredMedian;
	}
         
         
      //ADVANCED FUNCTIONALITY
      // =================================================================
      // This function handles the Moving Median Filter
      // Input:
      //      buffer
      //      The buffer in which the function will apply the moving to.

      //      newValue
      //      This should be the newest value that will be pushed into the buffer

      // Output: filteredValue
      //      This function should return the result of the moving average filter
   // }
}
