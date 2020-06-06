var resizeableImage = function(image_target, orig_w, orig_h) {
  // Some variable and settings
  var $container,
      orig_src = new Image(),
      image_target = $(image_target).get(0),
      event_state = {},
      min_width = 20, // Change as required
      min_height = 20,
      max_width = 700, // Change as required
      max_height = 700,
      resize_canvas = document.createElement('canvas');

  init = function() {

    // When resizing, we will always use this copy of the original as the base
    orig_src.src=image_target.src;

    // Center image in canvas
    if (orig_w > orig_h) {
      var init_top = -1 * canvas_height / 2 - 100 * orig_h / orig_w;
      var init_left = $(".lc-picker").width() + canvas_width / 2 - 100;
    } else {
      var init_top = -1 * canvas_height / 2 - 100;
      var init_left = $(".lc-picker").width() + canvas_width / 2 - 100 * orig_w / orig_h;
    }

    // Wrap the image with the container and add resize handles
    $(image_target).wrap('<div class="resize-container" style="top: ' + init_top + 'px; left: ' + init_left + 'px"></div>')
    .before('<span class="resize-handle resize-handle-nw"></span>')
    .before('<span class="resize-handle resize-handle-ne"></span>')
    .after('<span class="resize-handle resize-handle-se"></span>')
    .after('<span class="resize-handle resize-handle-sw"></span>');

    // Assign the container to a variable
    $container = $(image_target).parent('.resize-container');

    // Add events
    $container.on('mousedown touchstart', '.resize-handle', startResize);
    $container.on('mousedown touchstart', 'img', startMoving);

    // Max dimension is 200 and keep original ratio
    if (orig_w > orig_h) {
      resizeImage(200, 200 * orig_h / orig_w);
    } else {
      resizeImage(200 * orig_w / orig_h, 200);
    }
  };

  startResize = function(e){
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', resizing);
    $(document).on('mouseup touchend', endResize);
  };

  endResize = function(e){
    e.preventDefault();
    $(document).off('mouseup touchend', endResize);
    $(document).off('mousemove touchmove', resizing);
  };

  saveEventState = function(e){
    // Save the initial event details and container state
    event_state.container_width = $container.width();
    event_state.container_height = $container.height();
    event_state.container_left = $container.offset().left; 
    event_state.container_top = $container.offset().top;
    event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
	
	// This is a fix for mobile safari
	// For some reason it does not allow a direct copy of the touches property
	if(typeof e.originalEvent.touches !== 'undefined'){
		event_state.touches = [];
		$.each(e.originalEvent.touches, function(i, ob){
		  event_state.touches[i] = {};
		  event_state.touches[i].clientX = 0+ob.clientX;
		  event_state.touches[i].clientY = 0+ob.clientY;
		});
	}
    event_state.evnt = e;
  };

  resizing = function(e){
    var mouse={},width,height,left,top,offset=$container.offset();
    mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
    
    // Position image differently depending on the corner dragged and constraints
    if( $(event_state.evnt.target).hasClass('resize-handle-se') ){

      width = Math.min(canvas_left + canvas_width - event_state.container_left,
        (canvas_top + canvas_height - event_state.container_top) * event_state.container_width / event_state.container_height,
        mouse.x - event_state.container_left);
      height = Math.min(canvas_top + canvas_height - event_state.container_height,
        (canvas_left + canvas_width - event_state.container_left) * event_state.container_height / event_state.container_width,
        mouse.y  - event_state.container_top);
      left = event_state.container_left;
      top = event_state.container_top;

    } else if($(event_state.evnt.target).hasClass('resize-handle-sw') ){

      width = Math.min(event_state.container_left + event_state.container_width - canvas_left,
        (canvas_top + canvas_height - event_state.container_top) * event_state.container_width / event_state.container_height,
        event_state.container_width - (mouse.x - event_state.container_left));
      height = Math.min(canvas_top + canvas_height - event_state.container_top,
        (event_state.container_left + event_state.container_width - canvas_left) * event_state.container_height / event_state.container_width,
        mouse.y  - event_state.container_top);
      left = Math.max(canvas_left,
        event_state.container_left + event_state.container_width - (canvas_top + canvas_height - event_state.container_top) * event_state.container_width / event_state.container_height,
        mouse.x);
      top = event_state.container_top;

    } else if($(event_state.evnt.target).hasClass('resize-handle-nw') ){

      width = Math.min(event_state.container_left + event_state.container_width - canvas_left,
        (event_state.container_top + event_state.container_height - canvas_top) * event_state.container_width / event_state.container_height,
        event_state.container_width - (mouse.x - event_state.container_left));
      height = Math.min(event_state.container_top + event_state.container_height - canvas_top,
        (event_state.container_left + event_state.container_width - canvas_left) * event_state.container_height / event_state.container_width,
        event_state.container_height - (mouse.y - event_state.container_top));
      left = Math.max(canvas_left,
        event_state.container_left + event_state.container_width - (event_state.container_top + event_state.container_height - canvas_top) * event_state.container_width / event_state.container_height,
        mouse.x);
      top = Math.max(canvas_top,
        event_state.container_top + event_state.container_height - (event_state.container_left + event_state.container_width - canvas_left) * event_state.container_height / event_state.container_width,
        mouse.y - ((width / orig_src.width * orig_src.height) - height));

    } else if($(event_state.evnt.target).hasClass('resize-handle-ne') ){

      width = Math.min(canvas_left + canvas_width - event_state.container_left,
        (event_state.container_top + event_state.container_height - canvas_top) * event_state.container_width / event_state.container_height,
        mouse.x - event_state.container_left);
      height = Math.min(event_state.container_top + event_state.container_height - canvas_top,
        (canvas_left + canvas_width - event_state.container_left) * event_state.container_height / event_state.container_width,
        event_state.container_height - (mouse.y - event_state.container_top));
      left = event_state.container_left;
      top = Math.max(canvas_top,
        event_state.container_top + event_state.container_height - (canvas_left + canvas_width - event_state.container_left) * event_state.container_height / event_state.container_width,
        mouse.y - ((width / orig_src.width * orig_src.height) - height));
    }
	
    // Maintain aspect ratio
    height = width / orig_src.width * orig_src.height;

    if(width > min_width && height > min_height && width < max_width && height < max_height){
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);
      // Without this Firefox will not re-calculate the the image dimensions until drag end
      $container.offset({'left': left, 'top': top});
    }
  }

  resizeImage = function(width, height){
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);   
    $(image_target).attr('src', resize_canvas.toDataURL("image/png"));  
  };

  startMoving = function(e){
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on('mousemove touchmove', moving);
    $(document).on('mouseup touchend', endMoving);
  };

  endMoving = function(e){
    e.preventDefault();
    $(document).off('mouseup touchend', endMoving);
    $(document).off('mousemove touchmove', moving);
  };

  moving = function(e){
    var  mouse={}, touches;
    e.preventDefault();
    e.stopPropagation();
    
    touches = e.originalEvent.touches;
    
    mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft(); 
    mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();

    $container.offset({
      'left': Math.max(canvas_left,
        Math.min(canvas_left + canvas_width - event_state.container_width,
          mouse.x - ( event_state.mouse_x - event_state.container_left ))),
      'top': Math.max(canvas_top,
        Math.min(canvas_top + canvas_height - event_state.container_height,
          mouse.y - ( event_state.mouse_y - event_state.container_top )))
    });
    // Watch for pinch zoom gesture while moving
    if(event_state.touches && event_state.touches.length > 1 && touches.length > 1){
      var width = event_state.container_width, height = event_state.container_height;
      var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      a = a * a; 
      var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
      b = b * b; 
      var dist1 = Math.sqrt( a + b );
      
      a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      a = a * a; 
      b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      b = b * b; 
      var dist2 = Math.sqrt( a + b );

      var ratio = dist2 /dist1;

      width = width * ratio;
      height = height * ratio;
      // To improve performance you might limit how often resizeImage() is called
      resizeImage(width, height);
    }
  };

  // Initiate picture canvas
  init();
};