import Signin from '~/components/Signin.vue'

export default {
    title: 'Auth',
    component: 'Signin',
    argTypes: {
      _email: {
        description: 'Email Addresの値',
        control: 'text',
      },
      _password: {
        description: 'Passwordの値',
        control: 'text',
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Signin },
  setup() {
    return { args };
  },
  template: `<Signin v-bind="args" />`,
});

export const SigninDefault = Template.bind({});

SigninDefault.args = {
  _email: 'test12345@gmail.com',
  _password: '1234567890',
};