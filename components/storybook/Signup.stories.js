import Signup from '~/components/Signup.vue'

export default {
    title: 'Auth',
    component: 'Signup',
    argTypes: {
      _email: {
        description: 'Email Addresの値',
        control: 'text',
      },
      _password: {
        description: 'Passwordの値',
        control: 'text',
      },
      _isSignupped: {
        description: 'モードの切替( true: Activateモード, false: Signupモード)',
        control: {
          type: 'radio',
          options: [true, false],
        },
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Signup },
  setup() {
    return { args };
  },
  template: `<Signup v-bind="args" />`,
});

export const SignupDefault = Template.bind({});

SignupDefault.args = {
  _email: 'test12345@gmail.com',
  _password: '1234567890',
  _isSignupped: false,
};

