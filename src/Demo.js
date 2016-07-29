import React, {Component} from 'react';
import Form from './feform';
import {Field, TextArea, Checkbox, TwitterTextArea, MultiValueInput, ManyInputsInput} from './Inputs';
// import {Field, TextArea, Checkbox, TwitterTextArea} from './MuiInputs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Demo extends Component {
    state = {
        example3Valid: false
    };

    onSubmit = (event, result) => {
        console.clear();
        console.log(result + ' submit:');
        console.log(event);
    };

    render() {
        return (
            <MuiThemeProvider>
                <div className="Demo">
                    <h1>feform Examples</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td><Example1 handleSubmit={this.onSubmit} /></td>
                            </tr>
                            <tr>
                                <td><Example2 handleSubmit={this.onSubmit} /></td>
                            </tr>
                            <tr>
                                <td><Example3 handleSubmit={this.onSubmit} /></td>
                            </tr>
                            <tr>
                                <td><Example4 handleSubmit={this.onSubmit} /></td>
                            </tr>
                            <tr>
                                <td><Example5 handleSubmit={this.onSubmit} /></td>
                            </tr>
                            <tr>
                                <td><Example6 handleSubmit={this.onSubmit} /></td>
                            </tr>
                            <tr>
                                <td><Example7 handleSubmit={this.onSubmit} /></td>
                            </tr>
                            <tr>
                                <td><Example8 handleSubmit={this.onSubmit} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </MuiThemeProvider>
        );
    }
}

const Example1 = (props) => {
    return (
        <div>
            <h2>Basic Form</h2>
            <Form submit={(event) => {props.handleSubmit(event, 'Example 1')}}>
                <Field name="username" label="Username" validations={['required']} />
                <Field name="password" label="Password" type="password" validations={['required']} />
                <TextArea name="about" label="Tell us about yourself"/>
                <Checkbox name="acceptTerms" label="Accept terms & conditions" checkedValue="accepted" validations={['required']} />
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
            </Form>
        </div>
    );
};

const Example2 = (props) => {
    return (
        <div>
            <h2>Basic Form with Field Errors</h2>
            <Form submit={(event) => {props.handleSubmit(event, 'Example 2')}}>
                <Field name="username" label="Username" validations={['required']} />
                <Field name="password" label="Password" type="password" validations={['required']} />
                <TextArea name="about" label="Tell us about yourself"/>
                <Checkbox name="acceptTerms" label="Accept terms & conditions" checkedValue="accepted" validations={['required']} />
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
            </Form>
        </div>
    );
};

class Example3 extends Component {
    state = {
        isValid: false
    };

    onValidityChange = (event) => {
        this.setState({
            isValid: event.valid
        });
    };

    render() {
        const {props, state} = this;

        return (
            <div>
                <h2>Realtime Submit Control</h2>
                <Form submit={(event) => {props.handleSubmit(event, 'Example 3')}} validityChange={this.onValidityChange}>
                    <Field name="username" label="Username" validations={['required']} />
                    <Field name="password" label="Password" type="password" validations={['required']} />
                    <TextArea name="about" label="Tell us about yourself"/>
                    <Checkbox name="acceptTerms" label="Accept terms & conditions" checkedValue="accepted" validations={['required']} />
                    <button type="submit" disabled={!state.isValid}>Submit</button>
                    <button type="reset">Reset</button>
                </Form>
            </div>
        );
    }
}

class Example4 extends Component {
    state = {
        isValid: false,
        failures: []
    };

    onValidityChange = (event) => {
        if (event.data.password !== event.data.confirmPassword) {
            event.valid = false;
            event.failures.push('Passwords must match');
        }

        this.setState({
            isValid: event.valid,
            failures: event.failures
        });
    };

    onAfterReset = () => {
        this.setState({
            isValid: false,
            failures: []
        });
    };

    render() {
        const {props, state} = this,
            emailValidations = [
                {presence: true},
                {email: true}
            ],
            usernameValidations = [
                {presence: true},
                {length: {minimum: 7}}
            ],
            passwordValidations = [
                {presence: true},
                {length: {minimum: 10}},
                {format: {pattern: /^.*\d+.*$/, message: 'must contain at least one digit'}},
                {format: {pattern: /^.*[A-Z]+.*$/, message: 'must contain at least one upper case letter'}},
                {format: {pattern: /^.*[a-z]+.*$/, message: 'must contain at least one lower case letter'}}
            ],
            confirmPasswordValidations = [
                {presence: true}
            ];

        return (
            <div>
                <div style={{display: 'inline-block', width: 400, float: 'left'}}>
                    <h2>Realtime Validation List</h2>
                    <Form submit={(event) => {props.handleSubmit(event, 'Example 4')}} validityChange={this.onValidityChange} afterReset={this.onAfterReset}>
                        <Field name="email" label="Email Address" validations={emailValidations} />
                        <Field name="username" label="Username" validations={usernameValidations} />
                        <Field name="password" label="Password" type="password" validations={passwordValidations} />
                        <Field name="confirmPassword" label="Confirm Password" type="password" validations={confirmPasswordValidations} />
                        <button type="submit" disabled={!state.isValid}>Submit</button>
                        <button type="reset">Reset</button>
                    </Form>
                </div>
                <div style={{display: 'inline-block', width: 400}}>
                    <ul>
                        {(() => state.failures.map((failure, index) => <li className="invalid" key={index}>{failure}</li>))()}
                    </ul>
                </div>
            </div>
        );
    }
}

const Example5 = (props) => {
    const tweetLength = 144;

    return (
        <div>
            <h2>Custom Inputs</h2>
            <Form submit={(event) => {props.handleSubmit(event, 'Example 5')}}>
                <TwitterTextArea name="tweet" maxLength={tweetLength} validations={[{presence: true}, {length: {maximum: tweetLength}}]}/>
                <button type="submit">Tweet</button>
            </Form>
        </div>
    );
};

class Example6 extends Component {
    state = {
        inputRows: [
            {name: 'tag'}
        ]
    };

    handleAddTag = () => {
        this.setState({
            inputRows: this.state.inputRows.concat({name: 'tag'})
        });
    };

    render() {
        const {props, state} = this;

        return (
            <div>
                <div style={{display: 'inline-block', width: 400, float: 'left'}}>
                    <h2>Dynamic Input</h2>
                    <Form submit={(event) => {props.handleSubmit(event, 'Example 6')}}>
                        {(() => {
                            return state.inputRows.map((input, index) => {
                                return <Field name={input.name + '-' + index} label="Tag" key={input.name + index} />

                            })
                        })()}
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                        <button type="button" onClick={this.handleAddTag}>Add Tag</button>
                    </Form>
                </div>
            </div>
        );
    }
}

class Example7 extends Component {
    state = {
        inputRows: [
            {name: 'tag'}
        ]
    };

    handleExternalSubmit = () => {
        this.refs.form.submit();
    };

    handleExternalReset = () => {
        this.refs.form.reset();
    };

    render() {
        const {props} = this;

        return (
            <div>
                <div style={{display: 'inline-block', width: 400, float: 'left'}}>
                    <h2>External Submit</h2>
                    <Form ref="form" submit={(event) => {props.handleSubmit(event, 'Example 7')}}>
                        <Field name="username" label="Username" validations={['required']} />
                        <Field name="password" label="Password" type="password" validations={['required']} />
                    </Form>
                </div>
                <a onClick={this.handleExternalSubmit}>External Submit</a><br/>
                <a onClick={this.handleExternalReset}>External Reset</a>
            </div>
        );
    }
}

class Example8 extends Component {
    render() {
        const {props} = this;

        return (
            <div>
                <div style={{display: 'inline-block', width: 400, float: 'left'}}>
                    <h2>Multi Value Input</h2>
                    <Form ref="form" submit={(event) => {props.handleSubmit(event, 'Example 8')}}>
                        <MultiValueInput name="favoriteLetter" label="Favorite Letter" options={['a', 'b', 'c', 'd', 'e']}/>
                        <ManyInputsInput name="tag" label="tag" />
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                    </Form>
                </div>
            </div>
        );
    }
}