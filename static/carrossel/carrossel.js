var ALL_CARDS;

;(function ( window ) {
	
	Carrossel = (function(){
		function loadJSON() {
			var xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					try {
						var event = document.createEvent('HTMLEvents');
						event.initEvent('loadCarrosselJSON', true, true);
						event.data = xmlhttp.responseText;
						document.dispatchEvent(event);	
					} catch(err) {
						console.error(err.message);
					}
				}
			}

			xmlhttp.open("GET", "fisl.json", true);
			xmlhttp.send();
		}
		
		function buildCards(cardData) {
			var div = document.createElement('div');
			
			div.innerHTML = 
				"Título: " + cardData.title + "</br>" +
				"Palestrante: " + cardData.candidate + "</br>" +	
				"Assunto: " + cardData.area + "</br>" +
				"Local: " + cardData.zone;
			
			div.classList.add('carrossel-card');
				
			div.style['backgroundColor'] = '#'+cardData.color;
			
			return div;
		}
		
		function drawCards(element, data) {
			var rawCards = JSON.parse(data)[0]['slot'],
				cardList = document.querySelector('#carrossel-card-list');
			
			ALL_CARDS = rawCards;
			
			var i = rawCards.length;
			while (i--) {
				var card = rawCards[i],
					cardDiv = buildCards(card);
			
				cardList.appendChild(cardDiv);
			}
		}
		
		function drawArrows(el) {
			var rightArrow = document.createElement('div'),
				leftArrow = document.createElement('div'),
				cardList = el.querySelector('#carrossel-card-list');
				
			rightArrow.classList.add('carrossel-arrow');
			leftArrow.classList.add('carrossel-arrow');
			rightArrow.classList.add('right-carrossel-arrow');
			
			rightArrow.addEventListener('click', function() {
				var currentValue = getTranslateValue(cardList),
					newValue = currentValue + document.getElementsByClassName('carrossel-card')[0].clientWidth;
					
				setTranslateValue(cardList, newValue);
			});
			
			leftArrow.addEventListener('click', function() {
				var currentValue = getTranslateValue(cardList),
					newValue = currentValue - document.getElementsByClassName('carrossel-card')[0].clientWidth;
					
				setTranslateValue(cardList, newValue);
			});
			
			el.insertBefore(rightArrow, el.firstChild);
			el.insertBefore(leftArrow, el.firstChild);
		}
		
		function setTranslateValue(el, translateValue) {
			var values = el.style.transform.split(' '),
				i = values.length;
			
			while (i--) {
				var value = values[i];
				
				if (value.indexOf('translateX') > -1) {
					values[i] = 'translateX(-'+translateValue+'px)';
				}
			}
			
			el.style.transform = values.join(' ');
		}
		
		function getTranslateValue(el) {
			var values = el.style.transform.split(' '),
				i = values.length;
			
			while (i--) {
				var value = values[i];
				
				if (value.indexOf('translateX') > -1) {
					var translateValue = value.slice(value.indexOf('(')+1, value.indexOf(')'));
					return Math.abs(parseInt(translateValue));
				}
			}
		}
		
		function buildCarrossel(el) {
			loadJSON();
		
			document.addEventListener('loadCarrosselJSON', function(ev) {
				var cardList = document.createElement('div');
				
				cardList.id = 'carrossel-card-list';
				cardList.style.transform = 'translateX(0px)';
				
				el.appendChild(cardList);
				
				drawArrows(el);
				drawCards(el, ev.data);
			});
		}
		
		return {
			buildCarrossel : buildCarrossel
		};
	})();
	
})( window );