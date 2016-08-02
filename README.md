# feform (Iron-Form)

Simple Reactive Forms

## Requirements

- NPM
- React 15.2+

## Installation

Available through NPM: `npm install --save feform`

Import directly into your project: `import Form from 'feform';` 

## Usage

### Creating a Basic Input

Create custom inputs for your project by wrapping any React component
with an `feinput`:

    import {feinput} from 'feform';
    
    const Field = feinput(({label, setValue, value, type = 'text', ...rest}) => {
        const onChange = function(event) {
            setValue(event.target.value);
        };
    
        return (
            <fieldset>
                <label>{label}</label>
                <input type={type} onChange={onChange} value={value}/>
            </fieldset>
        );
    });
    
All components decorated with `feinput` receive the following `props`:

- value (string)
- setValue (fn)
- clearValue (fn)
- resetValue (fn)
- errors (Array)
- pristine (bool)

`setValue` must be invoked the set the value of your inpur within your `<Form>` component.

Note: Currently Inputs _must_ be direct children of the `<Form>` component

### Creating a Basic Form

    import Form from {feform};
    
    const BasicForm = (props) => {
        return (
            <div>
                <h2>Basic Form</h2>
                <Form submit={event => console.log(event)}>
                    <Field name="username" label="Username"/>
                    <Field name="password" label="Password" type="password"/>
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </Form>
            </div>
        );
    };

`<Form>` components support passing the following `props`:

- submit (fn) - invoked upon submission
- afterReset (fn) - invoked _after_ all inputs are reset
- validityChange (fn) - invoked _every time_ an `feinput`'s `setValue` method is called

Additionally, the following methods are available on a `<Form>` component:

- reset() - used to externally reset the `<Form>`
- submit() - used to externally submit the `<Form>`


### Adding Validations

The underlying validation engine behind Iron-Form uses [validate.js](https://validatejs.org/). See their docs for detailed examples.

Validations are passed to Input components like so:

    const BasicForm = (props) => {
        return (
            <div>
                <h2>Basic Form</h2>
                <Form submit={event => console.log(event)}>
                    <Field name="username" 
                            label="Username" 
                            validations={[
                                {presence: true},
                                {email: true}
                            ]}/>
                    <Field name="password" 
                            label="Password" 
                            type="password"
                            validations: {[
                                {presence: true},
                                {length: {min: 10}}
                            ]}/>
                    <button type="submit">Submit</button>
                    <button type="reset">Reset</button>
                </Form>
            </div>
        );
    };
    
Validations run and are reported 1. whenever a form is submitted and 2. whenever `setValue` on an Input component is invoked.