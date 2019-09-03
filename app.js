//Budget controller
let budgetController = (function() {

	//some code...

	let Expenses = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expenses.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expenses.prototype.getPercentage = function() {
		return this.percentage;
	};

	let Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	let calculateTotal = function(type) {
		let sum = 0;
		data.allItems[type].forEach(function (current) {
			sum += current.value; 
		});

		data.totals[type] = sum;
	};

	let data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percent: -1
	};

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

		deleteItem: function(type, id) {
			let ids, index;
			// id = 6
			// data.allItems[type][id];
			// ids = [1 2 4 6 8]
			// index = 3
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function() {
			//calcular el total de ingresos y gastos
			calculateTotal('exp');
			calculateTotal('inc');
			//calcular el presupuesto: ingresos y gastos
			data.budget = data.totals.inc - data.totals.exp;
			//calcular el procentaje de ingresos que gastamos
			if(data.totals.inc > 0) {
				data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else {
				data.percent = -1;
			}			
		},

		calculatePercentages: function() {
			//
			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});

		},

		getPercentage: function() {
			var allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percent
			}
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
		inputExpensesList: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage'
	};

	let formatNumber = function(num, type) {
		let numSplit, int, dec;

		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		}
		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};

	return {
		getInput: function () {
			return {
				type : document.querySelector(DOMStrings.inputType).value,
				description : document.querySelector(DOMStrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMStrings.inputValue).value)

			};
			
		},

		addListItem: function (obj, type) {
			
				let html, element;
				//crear el html
				if (type === 'inc') {
					element = DOMStrings.inputIncomeList;
					html = '<div class="item clearfix" id="inc-%id%">\
							<div class="item__description">%description%</div>\
							<div class="right clearfix">\
								<div class="item__value">%value%</div>\
								<div class="item__delete">\
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                                </div>\
                            </div>\
                        </div>'
				} else if (type === 'exp') {
					element = DOMStrings.inputExpensesList;
					html = '<div class="item clearfix" id="exp-%id%"">\
                            <div class="item__description">%description%</div>\
                            <div class="right clearfix">\
                                <div class="item__value">%value%</div>\
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
				newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
				//mostrar o insertar html
				document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);	
		},

		deleteListItem: function (selectorID) {
			let ele = document.getElementById(selectorID);
			ele.parentNode.removeChild(ele);
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

		displayBudget: function(obj) {
			let type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentage: function(percentage) {
			var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
			var nodeListForEach = function(list, callback) {
				for(i = 0; i < list.length; i++){
					callback(list[i], i);
				}
			};

			nodeListForEach(fields, function(current, index){
				if(percentage[index] > 0){
					current.textContent = percentage[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},

		getDOMStrings: function () {
			return DOMStrings;
		}

	};

})();


//Global app controller
let controller = (function (budgetCtrl, UICtrl) {

	let setupEventListeners = function () {
		let DOM = UICtrl.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if ( event.keyCode === 13 || event.which === 13 ) {
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	}

	let updateBudget = function () {
		// calculate the budget
		budgetCtrl.calculateBudget();
		//return the budget
		let budget = budgetCtrl.getBudget();
		//display the budget on the UI
		UICtrl.displayBudget(budget);
	}

	let updatePercentages = function () {
		//calcular los porcentajes
		budgetCtrl.calculatePercentages();
		//leer los porcentajes desde el budget controller
		let percentages = budgetCtrl.getPercentage();
		//actualizar la UI con los nuevos porcentajes
		UICtrl.displayPercentage(percentages);
	}

	let ctrlAddItem = function () {
		let input, newitem;
		//datos de entrada
		input = UICtrl.getInput();
		

		if ( input.description !== "" && !isNaN(input.value) && !isNaN(input.value) > 0) {

			//crear tipo de datos, agregar item al budget controller
			newitem = budgetCtrl.addItem(input.type, input.description, input.value);

			//agregar item en la UI
			UICtrl.addListItem(newitem, input.type);

			//limpiar inputs
			UICtrl.clearFields();

			//calcular y actualizar el presupuesto
			updateBudget();

			//actualizar y mostrar los porcentajes
			updatePercentages();
		}	
	}

	let ctrlDeleteItem = function(event) {
		let itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
		}

		//borrar el item de la estructura de datos
		budgetCtrl.deleteItem(type, ID);
		//borrar el item de la UI
		UICtrl.deleteListItem(itemID);
		//actualizar y mostrar el nuevo presupuesto
		updateBudget();
	}

	return {
		init: function () {
			console.log('Aplicaction has started.');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();