'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inputPropSanitizer = exports.feinput = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _validate = require('validate.js');

var _validate2 = _interopRequireDefault(_validate);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var iterateInputRefs = function iterateInputRefs(refs, fn) {
    var _this = this;

    _lodash2.default.forOwn(refs, function (value, key) {
        if (key.startsWith('input')) {
            fn.call(_this, value);
        }
    });
};

var findInputs = function findInputs(children, valueChange) {
    var index = 0;

    return _react2.default.Children.map(children, function (child) {
        if (child && child.type && child.type.displayName === 'feinput') {
            return _react2.default.cloneElement(child, {
                ref: 'input' + index++,
                valueChange: valueChange
            });
        } else {
            return child;
        }
    });
};

var runValidations = function runValidations(inputs) {
    var reportFailures = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    var allFailures = [],
        inputCount = 0,
        pristineCount = 0,
        data = {};

    iterateInputRefs.call(this, inputs, function (input) {
        var inputFailures = [];
        inputCount++;

        // check for pristine inputs
        if (input.isPristine()) {
            pristineCount++;
        }

        // record the data as it stands
        data[input.getName()] = input.getValue();

        // run each validation against the current input
        _lodash2.default.each(input.props.validations, function (criteria) {
            if (criteria === 'required') {
                criteria = { presence: true };
            }

            var result = _validate2.default.validate(_defineProperty({}, input.getName(), input.getValue()), _defineProperty({}, input.getName(), criteria));

            if (result) {
                var failures = result[input.getName()];
                inputFailures = inputFailures.concat(failures);
                allFailures = allFailures.concat(failures);
            } else {
                input.setErrors(null);
            }
        });

        if (inputFailures.length && reportFailures) {
            input.setErrors(inputFailures);
        }
    });

    return {
        inputCount: inputCount,
        data: data,
        pristineCount: pristineCount,
        valid: !allFailures.length,
        failures: allFailures
    };
};

var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form() {
        var _Object$getPrototypeO;

        var _temp, _this2, _ret;

        _classCallCheck(this, Form);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Form)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this2), _this2.state = {
            validationFailures: []
        }, _this2.getInputByName = function (name) {
            var input = void 0;

            _lodash2.default.forOwn(_this2.refs, function (ref) {
                if (ref.getName && ref.getName() === name) {
                    input = ref;
                }
            });

            return input;
        }, _this2.handleSubmit = function (event) {
            event.preventDefault();

            var data = {},
                changedData = {},
                me = _this2;

            iterateInputRefs.call(me, me.refs, function (input) {
                data[input.getName()] = input.getValue();
                if (!input.isPristine()) {
                    changedData[input.getName()] = input.getValue();
                }
            });

            var validate = runValidations(me.refs, true);

            me.props.submit(Object.assign({}, validate, { data: data, changedData: changedData }), true);
        }, _this2.handleReset = function (event) {
            var me = _this2;

            event.preventDefault();

            iterateInputRefs.call(me, me.refs, function (input) {
                input.resetValue();
            });

            me.setState({
                validationFailures: []
            }, me.props.afterReset);
        }, _this2.runValidations = function () {
            var me = _this2;

            me.props.validityChange(runValidations(me.refs, me.props.reportFieldErrors));
        }, _this2.submit = function () {
            _this2.refs.form.dispatchEvent(new Event('submit'));
        }, _this2.reset = function () {
            _this2.refs.form.dispatchEvent(new Event('reset'));
        }, _temp), _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(Form, [{
        key: 'render',
        value: function render() {
            var me = this;
            var _me$props = me.props;
            var submit = _me$props.submit;
            var validityChange = _me$props.validityChange;
            var afterReset = _me$props.afterReset;
            var reportFieldErrors = _me$props.reportFieldErrors;
            var children = _me$props.children;

            var rest = _objectWithoutProperties(_me$props, ['submit', 'validityChange', 'afterReset', 'reportFieldErrors', 'children']);
            /* eslint-disable */

            return _react2.default.createElement(
                'form',
                _extends({ ref: 'form' }, rest, { onSubmit: me.handleSubmit, onReset: me.handleReset, noValidate: true }),
                findInputs(children, me.runValidations.bind(me))
            );
        }
    }]);

    return Form;
}(_react.Component);

Form.propTypes = {
    submit: _react.PropTypes.func,
    validityChange: _react.PropTypes.func,
    afterReset: _react.PropTypes.func,
    reportFieldErrors: _react.PropTypes.bool
};
Form.defaultProps = {
    submit: Function.prototype,
    validityChange: Function.prototype,
    afterReset: Function.prototype,
    reportFieldErrors: false
};
exports.default = Form;


var feinput = function feinput(ComposedComponent) {
    var _class, _temp2;

    return _temp2 = _class = function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
            _classCallCheck(this, _class);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, props));

            _this3.setErrors = function (errors) {
                _this3.setState({
                    errors: errors
                });
            };

            _this3.clearValue = function () {
                _this3.setState({
                    value: '',
                    errors: null
                });
            };

            _this3.resetValue = function () {
                _this3.setState({
                    value: _this3.props.initialValue,
                    errors: null
                });
            };

            _this3.getValue = function () {
                return _this3.state.value;
            };

            _this3.getName = function () {
                return _this3.props.name;
            };

            _this3.isPristine = function () {
                return _this3.props.initialValue === _this3.state.value;
            };

            if (props.required) {
                console.warn("Inputs should not be passed `required` prop directly. Instead, add 'required' or " + "`{presence: true}` to the validations array.");
            }

            _this3.state = {
                value: props.initialValue,
                errors: null
            };
            return _this3;
        }

        _createClass(_class, [{
            key: 'render',
            value: function render() {
                var _this4 = this;

                var setValue = function setValue(value) {
                    var me = _this4;

                    me.setState({
                        value: value,
                        errors: null
                    }, me.props.valueChange);
                };

                var clearValue = function clearValue() {
                    setValue('');
                };

                return _react2.default.createElement(ComposedComponent, _extends({}, this.props, this.state, { setValue: setValue, clearValue: clearValue }));
            }
        }]);

        return _class;
    }(_react2.default.Component), _class.displayName = 'feinput', _class.propTypes = {
        name: _react.PropTypes.string.isRequired,
        validations: _react.PropTypes.array,
        initialValue: _react.PropTypes.string
    }, _class.defaultProps = {
        validations: [],
        initialValue: ''
    }, _temp2;
};

// utility function to pass allowed props to native input elements, preventing invalid prop warning (React 15.2+)
var inputPropSanitizer = function inputPropSanitizer(props) {
    /* eslint-disable */
    var name = props.name;
    var validations = props.validations;
    var initialValue = props.initialValue;
    var errors = props.errors;
    var setValue = props.setValue;
    var clearValue = props.clearValue;
    var valueChange = props.valueChange;

    var nativeProps = _objectWithoutProperties(props, ['name', 'validations', 'initialValue', 'errors', 'setValue', 'clearValue', 'valueChange']);
    /* eslint-disable */

    return nativeProps;
};

exports.feinput = feinput;
exports.inputPropSanitizer = inputPropSanitizer;
