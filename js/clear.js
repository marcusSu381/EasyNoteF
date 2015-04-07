$(document).ready(function(){
	//fetch();
	
	window.scrollTo(0, 1);

	//These store different elements of an item being manipulated
	//So that items can be references across anonymous setTimeout functions
	var v = {};
	v.$itemMod = null;
	v.$item = null;
	v.$itemInput = null;
	v.$itemModClone = null;
	v.$itemColorPicker = null;

	//create an object to store events
	var myevent={};
	var checkevent="";
	var updatedays=[];

	
	//These variables store the number of incomplete items before / after an item
	//As a reference to calculate the distance an item needs to move to be completed or un-completed
	var afterCount, beforeCount;

	//Variable stores the gesture event
	var releasePoint;

	//The spacer is placed (and maintained) between incomplete and complete items
	var spacer = $('#spacer');
	var hanger = $('.hanger');
	var newItemTop = $('.body-small').children('#new-item-top');
	var bodyClasses = $('body, .mod');

	//These booleans get set and unset throughout functions
	//So that we can ensure only one gestural reaction can happen at a time
	var wait = true;
	var focus = false;
	var itemMotion = false; 
	var scroll = false;
	var opensub = false;
	
	

	var itemModTemplate = $('#item-mod-template .item-mod');
	
	//Don't let anything happen right when the page loads.
	//Command+R to refresh would register as a keydown event.
	// setTimeout(function(){
	// 	wait = false;
	// }, 100);

	// setTimeout(function(){
	// 	$('.item-mod').eq(1).find('.item').addClass('bounce-once');
	// }, 500);

	// setTimeout(function(){
	// 	$('.bounce-once').removeClass('bounce-once');
	// }, 1500);

	// Pull to Create Task - Drag Events

	
	
	//indexedDB
	var dbName = 'todo_list_store';
	sklad.open(dbName, {
		version: 1,
		migration: {
			'1': function (database) {
				var objStore = database.createObjectStore('todos', {autoIncrement: true});
				objStore.createIndex('description_search', 'description', {unique: true});
			}
		}
	}, function (err, conn) {
		if (err) { throw err; }
		$(function () {

			var $add         = $('#add');
			var $delet        = $('#delet')

			function updateRows(conn) {
				conn
				.get({
					todos: {description: sklad.DESC, index: 'description_search'}
				}, function (err, data) {
					if (err) { return console.error(err); }

					console.log("updateRows");
          //console.log(eval("("+data.todos[0].value.description+")"));
          if (data.todos[0]==undefined){
          	console.log("undefined");
          }else{
          	console.log("defined");
          	console.log(eval("("+data.todos[0].value.description+")"));
          	myevent = eval("("+data.todos[0].value.description+")");
          	updatedays = Object.keys(eval("("+data.todos[0].value.description+")"));
          	console.log(myevent);
          	console.log(updatedays);
          	update();
          }
      });
			}

			updateRows(conn);

			$add.click(function () {
				conn.clear('todos', function (err) {
					if (err) {
						throw new Error(err.message);
					}
					updateRows(conn);
				});
				conn.insert({
					todos: [
					{ description: JSON.stringify(myevent) }
					]
				}, function (err, insertedKeys) {

					if (err) { return console.error(err); }
					updateRows(conn);
				})
			});
			$delet.click(function(){
				conn.clear('todos', function (err) {
					if (err) {
						throw new Error(err.message);
					}
					updateRows(conn);
				});
			});
			$(document).hammer({drag_min_distance: 0}).on('dragend', '.mod', function(event){
				conn.clear('todos', function (err) {
					if (err) {
						throw new Error(err.message);
					}
					updateRows(conn);
				});
				conn.insert({
					todos: [
					{ description: JSON.stringify(myevent) }
					]
				}, function (err, insertedKeys) {

					if (err) { return console.error(err); }
					updateRows(conn);
				})
			});
			//////////////////////////////////////////////
			$(document).hammer().on('dragend', '.item-mod', function(event){
				conn.clear('todos', function (err) {
					if (err) {
						throw new Error(err.message);
					}
					updateRows(conn);
				});
				conn.insert({
					todos: [
					{ description: JSON.stringify(myevent) }
					]
				}, function (err, insertedKeys) {

					if (err) { return console.error(err); }
					updateRows(conn);
				})
			});
			/////////////////////////////////////////////////////
			$(document).hammer().on('tap', '.x', function(){
				conn.clear('todos', function (err) {
					if (err) {
						throw new Error(err.message);
					}
					updateRows(conn);
				});
				conn.insert({
					todos: [
					{ description: JSON.stringify(myevent) }
					]
				}, function (err, insertedKeys) {

					if (err) { return console.error(err); }
					updateRows(conn);
				})
			});
			/////////////////////////////////////////////////
			$(document).on('blur','input', function(){
				conn.clear('todos', function (err) {
					if (err) {
						throw new Error(err.message);
					}
					updateRows(conn);
				});
				conn.insert({
					todos: [
					{ description: JSON.stringify(myevent) }
					]
				}, function (err, insertedKeys) {

					if (err) { return console.error(err); }
					updateRows(conn);
				})
			});
			///////////////////
		});
});

	//test
	// setTimeout(function() {
	// 	$("<div class='dots'><div>").insertAfter('.day-contents');
	// 		setTimeout(function() {
	// 			$('.dots').prepend("<div class='dotcontainer'><div>");
	// 				setTimeout(function() {
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");
	// 					$('.dotcontainer').prepend("<div class='dot'><div>");

	// 						}, 1);
	// 				}, 1);

	// 		}, 1);


	


	//hammerjs
	$(document).hammer({drag_min_distance: 0}).on('drag', '.mod', function(event){
		if ( opensub == true ) { return; }
		
		if (event.gesture.deltaY > 65 ) {
			
			newItemTop.find('input').val('Release to Create Item');
			$('.body-small').css('margin-top', ((event.gesture.deltaY) - 65)+"px");
			newItemTop.css('height', "65px");
		} else {
				//$(window).scrollTop(0);
				newItemTop.css('height', event.gesture.deltaY+"px");
				newItemTop.find('.item')
				.css('background-color', 'hsl(14, 80%, '+((event.gesture.deltaY)-10)+'%)')
				.css('border-color', 'hsl(14, 80%, '+((event.gesture.deltaY)-24)+'%)');
				newItemTop.find('input').val('Pull to Create Task');
				newItemTop.css('-webkit-transform', 'rotateX('+(90-(((event.gesture.deltaY)/65)*90))+'deg)');
			}
			if (event.gesture.deltaY > 20 || event.gesture.deltaY < -20) {
				scroll = true;
			}
		});

	// Pull to Create Task - Drag End Events
	$(document).hammer({drag_min_distance: 0}).on('dragend', '.mod', function(event){
		if ( opensub == true ) { return; }
		
		if (event.gesture.deltaY > 65 ) {
			$('.body-small').addClass('slide-back').css('margin-top','0px');
			newItemTop.css('height', "0px");
			$('.mod').prepend(itemModTemplate.clone());
			$('.item-mod.new input').focus();
			$('.mod .item-mod.new').removeClass('new');
			$('#draghere').remove();
			setTimeout(function() {
				$('.body-small').removeClass('slide-back');
			}, 200);
		} else {
			newItemTop
			.addClass('animate-back')
			.css('height', "0px")
			.css('-webkit-transform', 'rotateX(90deg)');
			setTimeout(function() {
				newItemTop
				.removeClass('animate-back')
				.attr('style','');
			}, 100);
		}
		scroll = false;
	});


	// Drag Item X - Drag Events
	$(document).hammer({drag_block_vertical: false}).on('drag', '.item-mod', function(event){
		if ( itemMotion == true ) { return; }
		if ( scroll == true ) { return; }
		if ( opensub == true ) { return; }
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemColorPicker = v.$itemMod.find('.colorpicker');
		v.$itemInput = $(this).find('.item').find('input');

		var dragX = event.gesture.deltaX;
		//console.log(dragX);
		v.$item.css('margin-left',dragX+'px');

		if ( event.gesture.deltaY > 15 || event.gesture.deltaY < -15 ) {
			dragX = 0;
		}

		var dragY = event.gesture.deltaY;
		v.$item.css('margin-left',dragX+'px');
		 // console.log(dragX);
		//If item is not done...
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			 // console.log(dragX);
			//If scroll enters the done position
			if ( dragX > 111 ) {
				v.$itemMod
				.css('background-position-x', (dragX-111)+"px")
				.addClass('check');
				v.$itemColorPicker.find('.cube3').css('border','2px solid #e7dfd0');
				v.$itemColorPicker.find('.cube1').css('border','2px solid #e7dfd0');
				v.$itemColorPicker.find('.cube2').css('border','2px solid #e7dfd0');
			//orange
		} else if (dragX > 40 &&dragX < 70){
			console.log("cube1");
			v.$itemColorPicker.find('.cube1').css('border','2px solid white');
			v.$itemColorPicker.find('.cube2').css('border','2px solid #e7dfd0');
			v.$itemColorPicker.find('.cube3').css('border','2px solid #e7dfd0');
			v.$item.css('background-color','#ed7c5b');
			v.$item.css('border-bottom-color','#ca4016');
			//blue
		}else if (dragX >= 70 &&dragX < 90){
			v.$itemColorPicker.find('.cube2').css('border','2px solid white');
			v.$itemColorPicker.find('.cube1').css('border','2px solid #e7dfd0');
			v.$itemColorPicker.find('.cube3').css('border','2px solid #e7dfd0');
			v.$item.css('background-color','#88bddb');
			v.$item.css('border-bottom-color','#3b92c4');
			//green
		}else if (dragX >= 90 &&dragX < 111){
			v.$itemColorPicker.find('.cube3').css('border','2px solid white');
			v.$itemColorPicker.find('.cube1').css('border','2px solid #e7dfd0');
			v.$itemColorPicker.find('.cube2').css('border','2px solid #e7dfd0');
			v.$item.css('background-color','#40837a');
			v.$item.css('border-bottom-color','#1e3e39');
		//If scroll enters the clear position
	}else if ( dragX < -111 ) {
		v.$itemMod.css('background-position-x', (dragX+111)+"px");

			//Anywhere in between
		} else {
			v.$itemMod
			.css('background-position-x', '0px')
			.removeClass('check');
		}
		//If item is done
	} else {
			//If scroll enters the un-do position
			if ( dragX > 55 ) {
				v.$itemMod
				.css('background-position-x', (dragX-111)+"px")
				.removeClass('done');

			//If scroll enters the clear position
		} else if ( dragX < -55 ) {
			v.$itemMod.css('background-position-x', (dragX+111)+"px");
			//Anywhere in between
		} else {
			v.$itemMod
			.css('background-position-x', '0px')
			.addClass('done');
				//v.$itemInput.prop('disabled', true);
			}
		}

	});//eo touchmove

	// Clears leftover styles on items when dragging begins
	$(document).hammer().on('dragstart', '.item-mod', function(){
		$(this).attr('style','');
	});

	// Creates an extra reference for items that were done
	// And that soon might be manipulated
	$(document).hammer().on('dragstart', '.item-mod.done', function(){
		$(this).addClass('was-done');
	});

	// Drag Item X - Drag End Events
	$(document).hammer().on('dragend', '.item-mod', function(event){
		if ( scroll == true ) { return; }
		if ( opensub == true ) { return; }
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemInput = $(this).find('.item').find('input');

		releasePoint = event.gesture.deltaX;

		//If item is not done
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			v.$itemMod.attr('style','');
			//And release point is in the 'done' zone
			if ( releasePoint > 111 ) {
				itemMotion = true;
				v.$item
				.addClass('slide-back')
				.css('margin-left','0px');
				afterCount = v.$itemMod.nextAll().not('.done').length;
				// v.$itemColorPicker.css('display','none');
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
				//Delay for item to momentum-scroll back, then do the move
				setTimeout( function(){
					v.$itemColorPicker.css('display','none');
					v.$item.removeClass('slide-back');
					v.$itemMod
					.css('background-image','none')
					.addClass('done')
					.removeClass('check');
					v.$itemModClone = v.$itemMod.clone();
					v.$itemModClone
					.insertAfter(v.$itemMod)
					.addClass('shrink');
					spacer.addClass('make-space');
					v.$itemMod
					.addClass('remove')
					.css('-webkit-transform', 'translate(0px,'+((afterCount-1)*65)+'px)');
				},200 );
				//Delay for another 0.5s for item move to occur, then clean up the leftovers
				setTimeout(function() {
					v.$itemModClone
					.insertAfter(spacer)
					.removeClass('shrink');
					v.$itemMod.hide().remove();
					spacer.removeClass('make-space');
					
					itemMotion = false;
				}, 600);
			} else {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
					itemMotion = false;
				},200 );
			}
		//If item is done
	} else {
			//And release point is in the un-do position
			if ( releasePoint > 55 ) {
				itemMotion = true;
				v.$item
				.addClass('slide-back')
				.css('margin-left','0px');
				beforeCount = v.$itemMod.prevAll('.done').length;
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");

				setTimeout( function(){
					v.$itemColorPicker.css('display','inline');
					v.$item.removeClass('slide-back');
					v.$itemMod.removeClass('done was-done check');
					spacer.addClass('make-space');
					v.$itemModClone = v.$itemMod.clone();
					v.$itemModClone
					.insertAfter(v.$itemMod)
					.addClass('shrink');
					v.$itemMod
					.addClass('remove')
					.css('-webkit-transform', 'translate(0px,'+(-(beforeCount+1)*65)+'px)');
				}, 200);
				
				setTimeout(function() {
					v.$itemModClone.insertBefore(spacer).removeClass('shrink');
					v.$itemMod.hide().remove();
					spacer.removeClass('make-space');
					itemMotion = false;

				}, 600);
			} else {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
					itemMotion = false;
				}, 200);
			}
		} //eo if item is done / not done

		//No matter what, if release point is in the clear position
		if ( releasePoint < -55 ) {
			console.log(releasePoint);
			console.log($(".mod").children('.item-mod').length);
			itemMotion = true;
			v.$itemMod.find('.colorpicker').css('margin-left','-100px');
			v.$itemMod.css('background-image', 'none');
			v.$item
			.addClass('slide-out')
			.css('margin-left','-320px');
			v.$itemMod.addClass('shrink-after gone');
			setTimeout(function() {
				v.$itemMod.remove();
				itemMotion = false;
			}, 400);
			if ($(".mod").children('.item-mod').length==1){
				setTimeout(function() {
					$('.mod').prepend("<p id='draghere'>drag here to create event.</p>");
				}, 400);
			}
		}
		
	});




	// A doubletap on an item triggers focus on the input within that item
	$(document).hammer().on('doubletap', '.item', function(){
		if ( focus == true || $(this).parent().hasClass('done') ) { return; }
		$(this).find('input').removeAttr("disabled").focus();
		$(this).closest('.item-mod').addClass('focus');
		bodyClasses.addClass('focus');
	});

	
	//tap on day, call the event page
	$(document).hammer().on('tap', '.day', function(){
		//block if it is last month or this month
		if ($(this).hasClass("last-month")||$(this).hasClass("next-month")){return;}
		//hide the month control btn
		$('.clndr-next-button').css('visibility','hidden');
		$('.clndr-previous-button').css('visibility','hidden');
		//get the class list
		var classlist = $(this).attr('class').split(/\s+/);
		$.each( classlist, function(index, item){
			if (item[10] === 'a') {
				checkevent=item;
			}
		});
		var day = $(this).find('.day-contents').text();
		console.log(checkevent);
		if (!$.isEmptyObject(myevent[checkevent])){
			console.log('not empty');
			$.each(myevent[checkevent],function( index, value ){
				console.log(value);
				if (value[2]==false){
					var removeNew = itemModTemplate.clone().removeClass('new');
					removeNew.find('.item').css('background-color',value[0]);
					removeNew.find('.item').css('border-bottom-color',value[1]);
					removeNew.find('.item input').val(value[3]);

					$('#spacer').before(removeNew);
				}else{
					var removeNew = itemModTemplate.clone().removeClass('new');
					removeNew.find('.item input').val(value[3]);
					removeNew.addClass('done');
					$('#spacer').after(removeNew);
					
				}
			});
		}else{//empty
			$('.mod').prepend("<p id='draghere'>drag here to create event.</p>");
		}
		

		//call the event pages
		$('.body').addClass('slide-back').css('margin-left','-320px');
		$('.e').text(day);
		setTimeout(function() {
			$('.body').removeClass('slide-back');
			$('.clndr-table').css('opacity','0');
		}, 200);

	});

	//close the event page.
	$(document).hammer().on('tap', '.x', function(){
		$('.body').addClass('slide-back').css('margin-left','0px');
		$('.clndr-table').css('opacity','1');
		
		$('.clndr-next-button').css('visibility','visible');
		$('.clndr-previous-button').css('visibility','visible');

		myevent[checkevent] =[];    
		$('.mod').children('.item-mod').each(function () {
			var content=$(this).find('.item input').val();
			var color=$(this).find('.item').css( "background-color" );
			var color_b=$(this).find('.item').css( "border-bottom-color" );
			var done=$(this).hasClass('done');
			var eventcontainer = [color,color_b,done,content];
			myevent[checkevent].push(eventcontainer);
		});
		if ($.isEmptyObject(myevent[checkevent])){
			//updatedays.push(checkevent);
			delete myevent[checkevent];
			console.log(checkevent);
			$('.'+checkevent).find('.dot').remove();
		}
		console.log(myevent);
		update();
		setTimeout(function() {
			$('.body').removeClass('slide-back');
			$('.mod .item-mod').remove();
			$('.mod #draghere').remove();
		}, 200);
	});
	function fetch() {
		setTimeout( function() {
			update();
			fetch();
		}, 500);

	}
	function update(){
		//console.log(updatedays);
		if (updatedays.length==0){
			console.log('null');
		}else {
			for (var i = 0; i < updatedays.length; i++){
				if (!$('.'+updatedays[i]).hasClass('hasevent')){
					$('.'+updatedays[i]).addClass('hasevent');
					$("<div class='dot'><div>").insertAfter('.'+updatedays[i]+' .day-contents');
				}
			}
		}
		
	}
	$(document).hammer().on('tap', '.clndr-previous-button', function(){

		setTimeout(function() {
			update()
		}, 50);
	});

	$(document).hammer().on('tap', '.clndr-next-button', function(){

		setTimeout(function() {
			update()
		}, 50);
	});
	var subModTemplate = $('#sub-mod-template .sub-mod');




	// Whenever focus on an input occurs, add some reference classes
	// So we know that an item is currently being edited
	$(document).on('focus','input',function(){
		bodyClasses.addClass('focus');
		$(this).closest('.item-mod').addClass('focus');
	});

	// Whenever an item is done being edited, close everything up.
	// If the item has no contents, trash it.
	$(document).on('blur','input', function(){
		// var hanger = $('.hanger');
		var itemMod = $(this).closest('.item-mod');
		// hanger.css('-webkit-transform','rotateX(-90deg)');
		$(this).attr("disabled", "disabled");
		bodyClasses.removeClass('focus');
		itemMod.removeClass('focus');
		// hanger.attr('style','');
		var value = $(this).val();
		if (value == "" || value == 0) {
			// itemMod
			// 	.css('-webkit-overflow-scrolling','none')
			// 	.css('background-image', 'none')
			// 	.addClass('transition')
			// 	.addClass('shrink-after gone');
			// itemMod.find('.item')
			// 	.css('left', releasePoint+'px')
			// 	.css('position','absolute')
			// 	.addClass('slide-out')
			// 	.css('margin-left','-320px')
			// 	.addClass('shrink-after gone');
			// setTimeout(function() {
			// 	itemMod.remove();
			// 	// hanger.attr('style','');
			// 	focus = false;
			// }, 400);
} else {
	setTimeout(function() {
				// hanger.attr('style','');
				focus = false;
			}, 400);
}
});

	// When ENTER key is pressed, lock up the input. (Triggers blur event)
	$(document).on('keyup', 'input', function (e) {
		if (e.keyCode == 13) {
			$(this).attr("disabled", "disabled").blur();
		}
	});

	// If a valid char keyCode is struck, create a new item.
	// Currently buggy if you start typing too fast.
	$(document).on('keyup',function(e){
		if (wait == true || focus == true) { return; }
		var keycode = e.keyCode;
		var valid = 
	        (keycode > 47 && keycode < 58)   || // number keys
	        (keycode > 64 && keycode < 91)   || // letter keys
	        (keycode > 95 && keycode < 112) // numpad keys
	        if (!bodyClasses.hasClass('focus') && valid) {
	        	$('#new-item-trigger').trigger('tap');
	        	wait = true;
	        	setTimeout(function() {
	        		$('.item-mod.focus').find('.item').find('input').val(String.fromCharCode(e.which));
	        		wait = false;
	        	}, 400);
	        } else if (bodyClasses.hasClass('focus') && e.keyCode == 27) {
	        	$('.item-mod.focus').find('input').val('').blur();
	        }
	    });

/////////////////////////////////////
});