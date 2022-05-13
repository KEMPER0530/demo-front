import Activate from '~/components/Activate.vue'

export default {
    title: 'Auth',
    component: 'Activate',
    argTypes: {
      _email: {
        description: 'Email Addresの値',
        control: 'text',
      },
      _activatecode: {
        description: 'activatecodeの値',
        control: 'text',
      },
      _isSignupped: {
        description: 'モードの切替( true: Signuppedモード, false: Activateモード)',
        control: {
          type: 'radio',
          options: [true, false],
        },
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Activate },
  setup() {
    return { args };
  },
  template: `<Activate v-bind="args" />`,
});

export const ActivateDefault = Template.bind({});

ActivateDefault.args = {
    _email: 'test12345@gmail.com',
    _activatecode: '12345',
    _isSignupped: false,
};