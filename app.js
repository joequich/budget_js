//Budget controller
var budgetController = (function() {

	//some code...

})();


//UI conntroller
var UIController = (function () {

	//some code...

})();


//Global app controller
var controller = (function (bugetCtrl, UICtrl) {

	var ctrlAddItem = function () {
		console.log("Add was pressed")
	}
	
	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function (event) {
		if ( event.keyCode === 13 || event.which === 13 ) {
			ctrlAddItem();
		}
	});

})(budgetController, UIController);