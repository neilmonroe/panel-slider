;
(function() {
    $(function() {

        var expandedClass = 'expanded';
        var expandSpeed = 500;
        var collapseSpeed = 300;

        function getPercentString(num, fixed) {
        	return (100 * num).toFixed(fixed || 3) + '%'
        }

	    function getAnimProps($slides, index) {

	    	var slideCount = $slides.length;

	    	if (index > slideCount - 1) {
	    		index = slideCount - 1;
	    	}

	    	if (index < 0) {
	    		index = 0;
	    	}

	    	var width = 1 / slideCount;
            var left = width * index;
            var right = left + width;

            return {
            	left: getPercentString(left),
            	right: getPercentString(right),
            	width: getPercentString(width)
            };
        }

        $('.panel-slider').filter(function() {

        	// if the data attribute 'disabled' is set to 'true', then don't wire up the buttons
        	return String($(this).data('disabled')).toLowerCase() !== 'true';

    	}).each(function() {

        	var $slides = $(this).find('.slide');

        	$slides.each(function(index) {

	            var $slide = $(this);

	            $slide.find('button, .btn').on('click', function(e) {
	            	e.preventDefault();

	            	if ($slide.is(':animated')) {
	            		$slide.stop();
	            	}
	            	if ($slide.hasClass(expandedClass)) {
	            		// collapse
		                var animProps = getAnimProps($slides, index);
		                $slide
		                	.removeClass(expandedClass)
		                	.animate(animProps, { duration: collapseSpeed });
	            	} else {
	            		// expand
		                var animProps = { left: 0, right: 0, width: '100%' };
		                $slide
		                	// animate the slide
		                	.addClass(expandedClass)
		                	.css({ 'z-index': 5 })
		                	.animate(animProps, { duration: expandSpeed })

		                	// reset sibling slides
		                	.siblings('.slide')
		                		.css({ 'z-index': '' })
		                		.removeClass(expandedClass);
	            	}
	            });
        	});
        });

    });
})();
