import React, {PropTypes} from 'react';
import {feinput, inputPropSanitizer} from '../feform';
import _ from 'lodash';

const errorReporter = function(errors) {
    if (errors && errors.length === 1) {
        return (<div className="invalid">{errors[0]}</div>);
    }
};

const Field = feinput(({label, errors, setValue, type = 'text', ...other}) => {
    const onChange = function(event) {
        setValue(event.target.value);
    };

    return (
        <fieldset>
            <label>{label}</label>
            <input {...inputPropSanitizer(other)} type={type} onChange={onChange} />
            {errorReporter(errors)}
        </fieldset>
    );
});

const TextArea = feinput(({label, errors, setValue, ...other}) => {
    const onChange = function(event) {
        setValue(event.target.value);
    };

    return (
        <fieldset>
            <label>{label}</label>
            <textarea {...inputPropSanitizer(other)} onChange={onChange} />
            {errorReporter(errors)}
        </fieldset>
    );
});

const Checkbox = feinput(({label, errors, setValue, clearValue, name, checkedValue, ...other}) => {
    const onChange = function(event) {
        if (event.target.checked) {
            setValue(event.target.value);
        } else {
            clearValue();
        }
    };

    const checked = () => other.value === checkedValue;

    return (
        <fieldset className="inline">
            <input {...inputPropSanitizer(other)} type="checkbox" onChange={onChange} name={name} value={checkedValue} checked={checked()} />
            <label>{label}</label>
            {errorReporter(errors)}
        </fieldset>
    );
});

Checkbox.propTypes = {
    checkedValue: PropTypes.string.isRequired
};

const TwitterTextArea = feinput(({label, errors, setValue, value, ...other}) => {
    const onChange = function(event) {
        setValue(event.target.value);
    };

    return (
        <fieldset>
            <label>{label}</label>
            <textarea {...inputPropSanitizer(other)} onChange={onChange} />
            <div>{value.length} of {other.maxLength} characters remaining</div>
        </fieldset>
    );
});

const MultiValueInput = feinput(({label, errors, setValue, value, options, ...other}) => {
    const onChange = function(event) {
        var selectedValues = _.map(event.target.selectedOptions, (option) => option.value);

        setValue(selectedValues.join(','));
    };

    return (
        <fieldset>
            <label>{label}</label>
            <select onChange={onChange} multiple size={3}>
                { options.map(option => <option key={option}>{option}</option>) }
            </select>
        </fieldset>
    );
});

const ManyInputsInput = feinput(({label, errors, setValue, value, options, ...other}) => {
    const onChange = function(event) {
        const values = value.split(',');

        if (event.target.name === 'key') {
            values[0] = event.target.value;
        } else if (event.target.name === 'value') {
            values[1] = event.target.value;
        }

        console.log(values);

        setValue(values.join(','));
    };

    console.log(value);

    return (
        <fieldset>
            <label>{label}</label>
            <input style={{display: 'inline-block', width: 100}} type="text" name="key" value={!!value ? value.split(',')[0] || '' : ''} onChange={onChange}/>
            <input style={{display: 'inline-block', width: 100}} type="text" name="value" value={!!value ? value.split(',')[1] || '' : ''} onChange={onChange}/>
        </fieldset>
    );
});

export {
    Field,
    TextArea,
    Checkbox,
    TwitterTextArea,
    MultiValueInput,
    ManyInputsInput
}