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
    
    var bufferX = [];
    var bufferY = [];
    var bufferZ = [];
    
    var aValues;
    var filteredValue;
    
    var onoff = 0;
    var tempX = 0, tempY = 0;
    var currentX = 0,currentY = 0;

    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        var aX, aY, aZ;
        var gX, gY, gZ;
        var movingAverageX = 0, movingAverageY = 0, movingAverageZ = 0;
        //var aValues;
        // This function handles the new incoming values from the accelerometer
        aX = event.accelerationIncludingGravity.x;
        aY = event.accelerationIncludingGravity.y;
        aZ = event.accelerationIncludingGravity.z;
        
        gX = aX/9.8;
        gY = aY/9.8;
        gZ = aZ/9.8;
        
        aValues = [gX, gY, gZ];
        
        movingAverageX = movingAverage(bufferX,gX);
        movingAverageY = movingAverage(bufferY,gY);
        movingAverageZ = movingAverage(bufferZ,gZ);
        
		console.log([movingAverageX,movingAverageY,movingAverageZ])
		
		displayAngle(movingAverageX, movingAverageY, movingAverageZ);
       
        //bubbleTranslate code=================================================================================
        var newX = 0, newY = 0;
        var bodyDi = uiController.bodyDimensions();
        var bodyX = bodyDi.width / 2;
        var bodyY = bodyDi.height / 2;
        var newerX = 0, newerY = 0;
        var tempAverageX, tempAverageY;
        //these temps ensure no change to the filtervalues 
		tempAverageX = movingAverageX;
		tempAverageY = movingAverageY;
		
	//just in case it goes over the limit [-1,1] which it will.. cause it favours a bit to right for some reason	
        if(movingAverageX > 1){
		
			tempAverageX = 1;
		}
        if(movingAverageX < -1){
			tempAverageX = -1
		}
		if(movingAverageY > 1){
		
			tempAverageY = 1;
		}
        if(movingAverageY < -1){
			tempAverageY = -1
		}
	//since the code start (0,0)
	//the range act as a factor for the translations
        newX = bodyX * tempAverageX;
        newY = -(bodyY * tempAverageY);
   
   //tempX amd tempY will acts as the previous location and translates from there
        newerX = newX - tempX;
        newerY = newY - tempX;
        tempX = newX;
        tempY = newY;
       
       if(onoff === 0){
       uiController.bubbleTranslate(newerX, newerY, "dark-bubble");
       uiController.bubbleTranslate(newerX, newerY, "pale-bubble");
       }
       else{
             uiController.bubbleTranslate(newerX, newerY, "dark-bubble");
           
       }
        //=========================================================================================================
        
      
    }

    function movingAverage(buffer, newValue)
    {
        var value_update = newValue;
        var total = 0;
        var moving_Average = 0;
		
        
        buffer.push(value_update)
       
        
        if(buffer.length > 20){
   
            buffer.splice(0,1);
            
			
        };
        for(var i = 0; i < buffer.length; i++){
            total += buffer[i];
           
        };
    
        moving_Average = total / buffer.length;
        
        
        return moving_Average;
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

            var angleXY,angleXZ,angleYZ;
         
            var outString="";
            
            var x2 = Math.pow(x,2);
            var y2 = Math.pow(y,2);
            var z2 = Math.pow(z,2);
            Fg = Math.sqrt(x2 + y2 + z2)
            
    
            angleYZ = (Math.acos(z/Fg) * 180) / Math.PI;
            
           
    
            outString += angleYZ.toFixed(2) + " degrees from the z axis." + "<br/>";
            
            target.innerHTML= outString;
    }

    self.freezeClick = function()
    {
        currentX = tempX;
        currentY = tempY;
    	if(onoff === 0){
    	    onoff++;
    	    
    	}
    	else{
    	    uiController.bubbleTranslate((tempX -currentX),(tempY - currentY), "pale-bubble");
    	    onoff = onoff - 1;
    	}
        // ADVANCED FUNCTIONALITY
        // ================================================================
        // This function will trigger when the "Freeze" button is pressed
        // The ID of the button is "freeze-button"
    }

    function movingMedian(buffer, newValue)
    {
        
        var value_update = newValue;
        var middle;
        var movingaMedian;
		var tempBuffer = 0;
        
        buffer.push(value_update)
       
        
        if(buffer.length > 10){
   
            buffer.splice(0, 1);
            }
        
		tempBuffer = buffer;
        tempBuffer.sort(function(a,b){return a-b});
        
        middle = tempBuffer.length/2;
        
            if (tempBuffer.length % 2 === 0){
                movingaMedian = (tempBuffer[middle] + tempBuffer[middle-1]) / 2;
            }
            else {
                movingaMedian = tempBuffer[middle-0.5];
            }

         return movingaMedian;
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

