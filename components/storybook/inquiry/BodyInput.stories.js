import BodyInput from '~/components/inquiry/BodyInput.vue'

export default {
    title: 'Inquiry',
    component: 'BodyInput',
    argTypes: {
      value: {
        description: '本文の入力欄',
        control: 'text',
      },
      placeholder: {
        description: '本文の入力欄のプレイスホルダー',
        control: 'text',
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { BodyInput },
  setup() {
    return { args };
  },
  template: `<BodyInput v-bind="args"/>`,
});

export const BodyInputDefault = Template.bind({});

BodyInputDefault.args = {
    value: "本文のテスト",
    placeholder: "お問い合わせ内容です",
};