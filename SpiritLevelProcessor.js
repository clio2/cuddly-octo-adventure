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
    //var u = 0;

    self.initialise = function(controller)
    {
        uiController = controller;

        window.addEventListener("devicemotion", handleMotion);
    }

    function handleMotion(event)
    {
        var aX, aY, aZ;
        var gX, gY, gZ;
        var movingAverageX, movingAverageY, movingAverageZ;
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
        
        filteredValue = [movingAverageX, movingAverageY, movingAverageZ];
        
        console.log(filteredValue);
       
        //bubbleTranslate code
        //var newX = 0, newY = 0;
       // var bodyDi = uiController.bodyDimensions();
        //var bodyX = bodyDi.width / 2;
        //var bodyY = bodyDi.height / 2;
        //var newerX = 0, newerY = 0, tempX = 0. tempY = 0;
       
        
        //reset starting doamin(-1 to 1) if needed==========================================================================
        //var firstgX = 0, firstgY = 0;
        //if(u === 0){
        //	firstgX = gX;
        //	firstgY = gY;
        //	u++;
       // };
     /*  if(firstgX > 0){  //calculating the domain(-1 to 1) with the starting point as 0
          if(gX >= firstgX || gX <= -(1 - firstgX)){
	     if(gX >= firstgX){
	         newX = bodyX * ( (1 - firstgX ) - (1 - Math.abs(gX)))}

             else{newX = bodyX * ((1 - Math.abs(gX)) + (1 - firstgX ))}

}
          else{newX = bodyX * -((1 -gX) - (1 - firstgX ))}

}

      else{
	if(gX >= firstgX && gX <= (1 + firstgX)){
	  if(gX >= firstgX){
	    newX = bodyX * -( (0 + firstgX ) + (0 - gX))}

          else{newX = bodyX * ((1 - Math.abs(gX)) + (1 - firstgX ))}

}
         else{
		if(gX > 0){
		newX = bodyX * -((1 - gX) + (1 + firstgX ))
	}
	        else{
   		newX = bodyX * ((1 + gX) + -( 1 + firstgX ))}

	}
}
       
       if(firstgY > 0){
	   if(gY >= firstgY || gY <= -(1 - firstgY)){
	      if(gY >= firstgY){
            	newY = bodyY * ( (1 - firstgY ) - (1 - Math.abs(gY)))
	      	
	      }

              else{newY = bodyY * ((1 - Math.abs(gY)) + (1 - firstgY ))
              	
              }

            }
           else{newY = bodyY * -((1 -gY) - (1 - firstgY ))}

           }

      else{
	if(gY >= firstgY && gY <= (1 + firstgY)){
	  if(gY >= firstgY){
	    newY = bodyY * -( (0 + firstgY ) + (0 - gY))}

          else{newY = bodyY * ((1 - Math.abs(gY)) + (1 - firstgY ))}

        }
        else{
		if(gY > 0){
		newY = bodyY * -((1 - gY) + (1 + firstgY ))
        	}
          	else{
		newY = bodyY * ((1 + gY) + -( 1 + firstgY ))}

        	}
}
   */  //==================================================================================================   
       // newerX = newX - tempX;
       // newerY = newY - tempX;
       // tempX = newX;
       //tempY = newY;
       
       
      //  uiController.bubbleTranslate(newerX, newerY, "dark-bubble");
        
        
      
    }

    function movingAverage(buffer, newValue)
    {
        var value_update = newValue;
        var total = 0;
        var moving_Average = 0;
		
        
        buffer.push(value_update)
       
        
        if(buffer.length > 30){
   
            buffer = buffer.slice(1);
            
			
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
    }

    self.freezeClick = function()
    {
    	if(onoff === 0){
    		window.removeEventListener("devicemotion", handleMotion);
    		onoff ++;
    	}
    	else{
    		SpiritLevelProcessor.initialise;
    		onoff = 0;
    	}
    	
        // ADVANCED FUNCTIONALITY
        // ================================================================
        // This function will trigger when the "Freeze" button is pressed
        // The ID of the button is "freeze-button"
    }

    /*function movingMedian(buffer, newValue)
    {
        
        var value_update = newValue;
        var middle = 0;
        var movingMedian = 0;
		
        
        buffer.push(value_update)
       
        
        if(buffer.length > 30){
   
            buffer = buffer.slice(1);
            };
        buffer.sort(function(a,b){return a-b});
        middle=parseInt(buffer.length/2);
            if (buffer.length%2==1){
                movingMedian = buffer[middle];}
            else 
            {movingMedian = (buffer[middle+1] + buffer[middle]) /2;
            }
         return movingMedian;} */
         
         
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

