import React, {Component, PropTypes} from 'react';
import Validate from 'validate.js';
import _ from 'lodash';

const iterateInputRefs = function(refs, fn) {
    _.forOwn(refs, (value, key) => {
        if (key.startsWith('input')) {
            fn.call(this, value);
        }
    });
};

const findInputs = function(children, valueChange, context={inputIndex: 0, childIndex: 0}, depth=0) {
    let inputs = [];
    React.Children.forEach(children, (child) => {
        // have to assign a key to avoid warning about dynamic children
        // (https://facebook.github.io/react/docs/multiple-components.html#dynamic-children)
        if (_.isNil(child)) {
            return;
        }
        let childKey = 'feinput-child' + context.childIndex++;
        if (child && child.type && child.type.displayName === 'feinput') {
            let input = React.cloneElement(child, {
                ref: `input${context.inputIndex++}`,
                key: childKey,
                valueChange
            });
            inputs.push(input);
        } else {
          if (child && child.props && child.props.children) {
              let childInputs = findInputs(child.props.children, valueChange, context, depth+1);
              let input = React.cloneElement(child, {
                key: childKey,
                ...child.props
              }, childInputs);
              inputs.push(input)
          } else {
              inputs.push(child);
          }
        }
    });

    return inputs;
};

const runValidations = function(inputs, reportFailures = true) {
    let allFailures = [],
        inputCount = 0,
        pristineCount = 0,
        data = {};

    iterateInputRefs.call(this, inputs, function(input) {
        let inputFailures = [];
            inputCount++;

        // check for pristine inputs
        if (input.isPristine()) {
            pristineCount++;
        }

        // record the data as it stands
        data[input.getName()] = input.getValue();

        // run each validation against the current input
        _.each(input.props.validations, function(criteria) {
            if (criteria === 'required') {
                criteria = {presence: true};
            }

            const result = Validate.validate({[input.getName()]: input.getValue()}, {[input.getName()]: criteria});

            if (result) {
                const failures = result[input.getName()];
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
        data,
        pristineCount,
        valid: !allFailures.length,
        failures: allFailures
    }
};

export default class Form extends Component {
    static propTypes = {
        submit: PropTypes.func,
        validityChange: PropTypes.func,
        afterReset: PropTypes.func,
        reportFieldErrors: PropTypes.bool
    };

    static defaultProps = {
        submit: Function.prototype,
        validityChange: Function.prototype,
        afterReset: Function.prototype,
        reportFieldErrors: false
    };

    state = {
        validationFailures: []
    };

    getInputByName = (name) => {
        let input;

        _.forOwn(this.refs, (ref) => {
            if (ref.getName && ref.getName() === name) {
                input = ref;
            }
        });

        return input;
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const data = {},
            changedData = {},
            me = this;

        iterateInputRefs.call(me, me.refs, function(input) {
            data[input.getName()] = input.getValue();
            if (!input.isPristine()) {
                changedData[input.getName()] = input.getValue();
            }
        });

        const validate = runValidations(me.refs, true);

        me.props.submit(Object.assign({}, validate, {data, changedData}), true);
    };

    handleReset = (event) => {
        const me = this;

        event.preventDefault();

        iterateInputRefs.call(me, me.refs, function(input) {
            input.resetValue();
        });

        me.setState({
            validationFailures: []
        }, me.props.afterReset);
    };

    validate = (reportInputErrors = true) => {
        const me = this;

        return runValidations(me.refs, reportInputErrors);
    };

    submit = () => {
        this.refs.form.dispatchEvent(new Event('submit'));
    };

    reset = () => {
        this.refs.form.dispatchEvent(new Event('reset'));
    };

    render() {
        const me = this,
            // destruct props to prevent invalid prop on native input warning (React 15.2+)
            /* eslint-disable */
            {submit, validityChange, afterReset, reportFieldErrors, children, ...rest} = me.props;
            /* eslint-disable */

        return (
            <form ref="form" {...rest} onSubmit={me.handleSubmit} onReset={me.handleReset} noValidate>
                {findInputs(children, () => {
                    me.props.validityChange(runValidations(me.refs, me.props.reportFieldErrors));
                })}
            </form>
        );
    }
}

const feinput = (ComposedComponent) => class extends React.Component {
    static displayName = 'feinput';

    static propTypes = {
        name: PropTypes.string.isRequired,
        validations: PropTypes.array,
        initialValue: PropTypes.string
    };

    static defaultProps = {
        validations: [],
        initialValue: ''
    };

    constructor(props) {
        super(props);

        if (props.required) {
            console.warn("Inputs should not be passed `required` prop directly. Instead, add 'required' or " +
                "`{presence: true}` to the validations array.")
        }

        this.state = {
            value: props.initialValue,
            errors: null
        };
    }

    setErrors = (errors) => {
        this.setState({
            errors
        });
    };

    clearValue = () => {
        this.setState({
            value: '',
            errors: null
        });
    };

    resetValue = () => {
        this.setState({
            value: this.props.initialValue,
            errors: null
        });
    };

    setValue = (value, clearErrors = false) => {
        const nextState = { value };

        if (clearErrors) {
            nextState.errors = null;
        }

        this.setState(nextState);
    };

    getValue = () => this.state.value;

    getName = () => this.props.name;

    isPristine = () => this.props.initialValue === this.state.value;

    render() {
        const setValue = (value) => {
            const me = this;

            me.setState({
                value: value,
                errors: null
            }, me.props.valueChange);
        };

        const clearValue = () => {
            setValue('');
        };

        return <ComposedComponent {...this.props} {...this.state} setValue={setValue} clearValue={clearValue}/>;
    }
};

// utility function to pass allowed props to native input elements, preventing invalid prop warning (React 15.2+)
const inputPropSanitizer = function(props) {
    /* eslint-disable */
    const {name, validations, initialValue, errors, setValue, clearValue, valueChange, ...nativeProps} = props;
    /* eslint-disable */

    return nativeProps;
};

export {
    feinput,
    inputPropSanitizer
};
