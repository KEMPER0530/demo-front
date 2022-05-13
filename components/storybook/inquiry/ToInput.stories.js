import ToInput from '~/components/inquiry/ToInput.vue'

export default {
    title: 'Inquiry',
    component: 'ToInput',
    argTypes: {
      value: {
        description: 'Toの入力欄',
        control: 'text',
      },
      placeholder: {
        description: 'Toの入力欄のプレイスホルダー',
        control: 'text',
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { ToInput },
  setup() {
    return { args };
  },
  template: `<ToInput v-bind="args"/>`,
});

export const ToInputDefault = Template.bind({});

ToInputDefault.args = {
    value: "入力テスト",
    placeholder: "test@gmail.com",
};