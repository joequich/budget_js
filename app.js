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
		inputBtn: '.add__btn',
		inputIncomeList: '.income__list',
		inputExpensesList: '.expenses__list'
	};

	return {
		getInput: function () {
			return {
				type : document.querySelector(DOMStrings.inputType).value,
				description : document.querySelector(DOMStrings.inputDescription).value,
				value : document.querySelector(DOMStrings.inputValue).value

			};
			
		},

		addListItem: function (obj, type) {
			
				let html, element;
				//crear el html
				if (type === 'inc') {
					element = DOMStrings.inputIncomeList;
					html = '<div class="item clearfix" id="income-%id%">\
							<div class="item__description">%description%</div>\
							<div class="right clearfix">\
								<div class="item__value">+ %value%</div>\
								<div class="item__delete">\
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                                </div>\
                            </div>\
                        </div>'
				} else if (type === 'exp') {
					element = DOMStrings.inputExpensesList;
					html = '<div class="item clearfix" id="expense-%id%"">\
                            <div class="item__description">%description%</div>\
                            <div class="right clearfix">\
                                <div class="item__value">- %value%</div>\
                                <div class="item__percentage">21%</div>\
                                <div class="item__delete">\
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                                </div>\
                            </div>\
                        </div>'
				}

				//reemplazar data en el html
				newHtml = html.replace('%id%', obj.id);
				newHtml = newHtml.replace('%description%', obj.description);
				newHtml = newHtml.replace('%value%', obj.value);
				//mostrar html
				document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

			
		},

		clearFields: function () {
			let fields, fieldsArr;

			fields = document.querySelectorAll(DOMStrings.inputDescription+ ', ' +DOMStrings.inputValue) 

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach( function (current, index, array) {
				current.value = "";
			});

			fieldsArr[0].focus();

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
		
		//crear tipo de datos, agregar item al budget controller
		newitem = bugetCtrl.addItem(input.type, input.description, input.value);

		//agregar item en la UI
		UICtrl.addListItem(newitem, input.type);

		UICtrl.clearFields();
	}

	return {
		init: function () {
			console.log('Aplicaction has started.');
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();