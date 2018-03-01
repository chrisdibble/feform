'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inputPropSanitizer = exports.feinput = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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

var findInputs = function findInputs(form, children, valueChange) {
    var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { inputIndex: 0, childIndex: 0 };
    var depth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var inputs = [];
    _react2.default.Children.forEach(children, function (child) {
        // have to assign a key to avoid warning about dynamic children
        // (https://facebook.github.io/react/docs/multiple-components.html#dynamic-children)
        var childKey = void 0;

        if (child) {
            childKey = _lodash2.default.isNil(child.key) ? 'feinput-child' + context.childIndex++ : child.key;
        }
        if (child && child.type && child.type.displayName === 'feinput') {
            var input = _react2.default.cloneElement(child, {
                ref: function ref(c) {
                    form.inputs[context.inputIndex++] = c;
                },
                key: childKey,
                valueChange: valueChange
            });
            inputs.push(input);
        } else {
            if (child && child.props && child.props.children) {
                var childInputs = findInputs(form, child.props.children, valueChange, context, depth + 1);
                var _input = _react2.default.cloneElement(child, _extends({
                    key: childKey
                }, child.props), childInputs);
                inputs.push(_input);
            } else {
                inputs.push(child);
            }
        }
    });

    return inputs;
};

var runValidations = function runValidations(inputs) {
    var reportFailures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var allFailures = [],
        inputCount = 0,
        pristineCount = 0,
        data = {};

    _lodash2.default.forEach(inputs, function (input) {
        if (!input) return;

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
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Form);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            validationFailures: []
        }, _this.inputs = [], _this.getInputByName = function (name) {
            var input = void 0;

            _lodash2.default.forOwn(_this.inputs, function (ref) {
                if (ref && ref.getName && ref.getName() === name) {
                    input = ref;
                }
            });

            return input;
        }, _this.handleSubmit = function (event) {
            event.preventDefault();

            var data = {},
                changedData = {},
                me = _this;

            _lodash2.default.forEach(me.inputs, function (input) {
                if (!input) return;
                data[input.getName()] = input.getValue();
                if (!input.isPristine()) {
                    changedData[input.getName()] = input.getValue();
                }
            });

            var validate = runValidations(me.inputs, true);

            me.props.submit(Object.assign({}, validate, { data: data, changedData: changedData }), true);
        }, _this.handleReset = function (event) {
            var me = _this;

            event.preventDefault();

            _lodash2.default.forEach(me.inputs, function (input) {
                if (!input) return;
                input.resetValue();
            });

            me.setState({
                validationFailures: []
            }, me.props.afterReset);
        }, _this.validate = function () {
            var reportInputErrors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var me = _this;

            return runValidations(me.inputs, reportInputErrors);
        }, _this.submit = function () {
            _this.form.dispatchEvent(new Event('submit'));
        }, _this.reset = function () {
            _this.form.dispatchEvent(new Event('reset'));
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Form, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var me = this,
                _me$props = me.props,
                submit = _me$props.submit,
                validityChange = _me$props.validityChange,
                afterReset = _me$props.afterReset,
                reportFieldErrors = _me$props.reportFieldErrors,
                children = _me$props.children,
                rest = _objectWithoutProperties(_me$props, ['submit', 'validityChange', 'afterReset', 'reportFieldErrors', 'children']);
            /* eslint-disable */

            return _react2.default.createElement(
                'form',
                _extends({ ref: function ref(c) {
                        return _this2.form = c;
                    } }, rest, { onSubmit: me.handleSubmit, onReset: me.handleReset, noValidate: true }),
                findInputs(this, children, function () {
                    me.props.validityChange(runValidations(me.inputs, me.props.reportFieldErrors));
                })
            );
        }
    }]);

    return Form;
}(_react.Component);

Form.propTypes = {
    submit: _propTypes2.default.func,
    validityChange: _propTypes2.default.func,
    afterReset: _propTypes2.default.func,
    reportFieldErrors: _propTypes2.default.bool
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

            var _this3 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

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

            _this3.setValue = function (value) {
                var clearErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                var nextState = { value: value };

                if (clearErrors) {
                    nextState.errors = null;
                }

                _this3.setState(nextState);
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
        name: _propTypes2.default.string.isRequired,
        validations: _propTypes2.default.array,
        initialValue: _propTypes2.default.string
    }, _class.defaultProps = {
        validations: [],
        initialValue: ''
    }, _temp2;
};

// utility function to pass allowed props to native input elements, preventing invalid prop warning (React 15.2+)
var inputPropSanitizer = function inputPropSanitizer(props) {
    /* eslint-disable */
    var name = props.name,
        validations = props.validations,
        initialValue = props.initialValue,
        errors = props.errors,
        setValue = props.setValue,
        clearValue = props.clearValue,
        valueChange = props.valueChange,
        nativeProps = _objectWithoutProperties(props, ['name', 'validations', 'initialValue', 'errors', 'setValue', 'clearValue', 'valueChange']);
    /* eslint-disable */

    return nativeProps;
};

exports.feinput = feinput;
exports.inputPropSanitizer = inputPropSanitizer;
