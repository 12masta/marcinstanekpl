(function($){
	
	$.fn.cookieConsent = function(action) {
		
		var dropCookie = true;			// false disables the Cookie, allowing you to style the banner
		var cookieDuration = 365;		// Number of days before the cookie expires, and the banner reappears
		var cookieName = 'cc-cookie';	// Cookiename
		var cookieValue = '1';			// Value of cookie
		var act = action || 'init';
		
		function createDiv(){
			$('body').append($("<div>").attr('id','cookie-law').addClass('cc-bar')
			.html('<a href="#" class="cc-btn">Zgadzam się!</a><p class="cc-msg">W ramach naszej witryny stosujemy pliki cookies w celu świadczenia usług na najwyższym poziomie. Więcej szczegółów w <a class="cc_more_info" href="polityka_prywatnosci.html" rel="nofollow" title="Privacy &amp; Cookies Policy">Polityce Prywatności</a></p>'));
			$('#cookie-law .cc-btn').on('click', function() {
				$(window).cookieConsent('accept');
			});
		}

		function createCookie(name,value,days) {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000)); 
				expires = "; expires="+date.toGMTString(); 
			 }
			 if(dropCookie) { 
				  document.cookie = name+"="+value+expires+"; path=/"; 
			 }
		}

		function checkCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}

		function accept(){
			createCookie(cookieName, cookieValue, cookieDuration);
			$('#cookie-law').remove();
		}

		if (act == 'accept') {
			accept();
		} else {
			if(checkCookie(cookieName) !== cookieValue){
				createDiv(); 
			}
		}
	};
})(jQuery);