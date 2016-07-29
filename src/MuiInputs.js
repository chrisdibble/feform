import React, {PropTypes} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MUITextField from 'material-ui/TextField';
import MUICheckbox from 'material-ui/Checkbox';
import {feinput, inputPropSanitizer} from './feform';

injectTapEventPlugin();

const Field = feinput(({label, errors, setValue, value, ...other}) => {
    const onChange = function(event) {
        setValue(event.target.value);
    };

    return (
        <fieldset>
            <MUITextField hintText={label} name={name} value={value} onChange={onChange} errorText={errors ? errors.join(' ') : ''} {...inputPropSanitizer(other)}/>
        </fieldset>
    );
});

const TextArea = feinput(({label, errors, setValue, value, ...other}) => {
    const onChange = function(event) {
        setValue(event.target.value);
    };

    return (
        <fieldset>
            <MUITextField hintText={label} name={name} value={value} onChange={onChange} multiLine
                          errorText={errors ? errors.join(' ') : ''} rows={4} {...inputPropSanitizer(other)}/>
        </fieldset>
    );
});

const Checkbox = feinput(({label, setValue, clearValue, name, value, checkedValue}) => {
    const onChange = function(event) {
        if (event.target.checked) {
            setValue(event.target.value);
        } else {
            clearValue();
        }
    };

    const checked = () => value === checkedValue;

    return (
        <fieldset className="inline">
            <MUICheckbox label={label} onCheck={onChange} name={name} value={checkedValue} checked={checked()}/>
        </fieldset>
    );
});

Checkbox.propTypes = {
    checkedValue: PropTypes.string.isRequired
};

const TwitterTextArea = feinput(({label, errors, setValue, value, maxLength, ...other}) => {
    const onChange = function(event) {
        setValue(event.target.value);
    };

    console.log(errors);

    return (
        <fieldset>
            <MUITextField hintText={label} name={name} value={value} onChange={onChange} multiLine
                          floatingLabelText={`${value.length} of ${maxLength} characters remaining`}
                          errorText={errors ? errors.join(' ') : ''} rows={4} {...inputPropSanitizer(other)}/>
        </fieldset>
    );
});

export {
    Field,
    TextArea,
    Checkbox,
    TwitterTextArea
}