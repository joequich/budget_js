//Budget controller
let budgetController = (function() {

	//some code...

	let Expenses = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	let Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	let data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	}

	return {
		addItem: function (type, des, val) {
			let newItem, ID;
			//ID
			if (data.allItems[type].length > 0 ) {
				ID = data.allItems[type][data.allItems[type].length-1].id + 1;
			} else {
				ID = 0;
			}
			//Crear nuevos
			if ( type === 'exp') {
				newItem = new Expenses(ID, des, val);
			}else if ( type === 'inc' ) {
				newItem = new Income(ID, des, val);
			}

			data.allItems[type].push(newItem);
			console.log("item added!!")
			//
			return newItem;
		},

		testing: function () {
			console.log(data);
		}
	};

})();


//UI conntroller
let UIController = (function () {

	//some code...
	let DOMStrings = {

		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};

	return {
		getInput: function () {
			return {
				type : document.querySelector(DOMStrings.inputType).value,
				description : document.querySelector(DOMStrings.inputDescription).value,
				value : document.querySelector(DOMStrings.inputValue).value

			};
			
		},

		getDOMStrings: function () {
			return DOMStrings;
		}

	};

})();


//Global app controller
let controller = (function (bugetCtrl, UICtrl) {

	let setupEventListeners = function () {
		let DOM = UICtrl.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if ( event.keyCode === 13 || event.which === 13 ) {
				ctrlAddItem();
			}
		});
	}

	
	let ctrlAddItem = function () {
		let input, newitem;
		//datos de entrada
		input = UICtrl.getInput();
		
		//crear tipo de datos
		newitem = bugetCtrl.addItem(input.type, input.description, input.value);
	}

	return {
		init: function () {
			console.log('Aplicaction has started.');
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();