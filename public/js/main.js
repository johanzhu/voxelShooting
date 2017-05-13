'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var b = 1;

var Animal = function () {
	function Animal(name) {
		_classCallCheck(this, Animal);

		this.name = name;
	}

	_createClass(Animal, [{
		key: 'sayName',
		value: function sayName() {
			console.log(this.name);
		}
	}, {
		key: 'sayNum',
		value: function sayNum() {
			return 3;
		}
	}]);

	return Animal;
}();

var cat = new Animal('cat');
cat.sayName();

var player = new _player2.default({ x: 1, y: 2, z: 3 }, 1);
player.updatePosition();
console.log('改变了！');
console.log('改变了！');
console.log('改变了！');
console.log('改变了！');
console.log('改变了！');
console.log('改变了！');