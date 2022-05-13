import SubjectInput from '~/components/inquiry/SubjectInput.vue'

export default {
    title: 'Inquiry',
    component: 'SubjectInput',
    argTypes: {
      value: {
        description: 'タイトルの入力欄',
        control: 'text',
      },
      placeholder: {
        description: 'タイトルの入力欄のプレイスホルダー',
        control: 'text',
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { SubjectInput },
  setup() {
    return { args };
  },
  template: `<SubjectInput v-bind="args"/>`,
});

export const SubjectInputDefault = Template.bind({});

SubjectInputDefault.args = {
    value: "入力テスト",
    placeholder: "タイトル",
};