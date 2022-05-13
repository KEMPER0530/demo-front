import FromInput from '~/components/inquiry/FromInput.vue'

export default {
    title: 'Inquiry',
    component: 'FromInput',
    argTypes: {
      value: {
        description: 'Fromの入力欄',
        control: 'text',
      },
      placeholder: {
        description: 'Fromの入力欄のプレイスホルダー',
        control: 'text',
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { FromInput },
  setup() {
    return { args };
  },
  template: `<FromInput v-bind="args"/>`,
});

export const FromInputDefault = Template.bind({});

FromInputDefault.args = {
    value: "入力テスト",
    placeholder: "test@gmail.com",
};