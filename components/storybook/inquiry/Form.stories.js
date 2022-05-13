import Form from '~/components/inquiry/Form.vue'

export default {
    title: 'Inquiry',
    component: 'Form',
    argTypes: {
      _from: {
        description: '送信元',
        control: 'text',
      },
      _to: {
        description: '送信先',
        control: 'text',
      },
      _subject: {
        description: 'タイトル',
        control: 'text',
      },
      _body: {
        description: '本文',
        control: 'text',
      },
      _isSubmited: {
        description: 'モードの切替',
        control: {
          type: 'radio',
          options: [true, false],
        },
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Form },
  setup() {
    return { args };
  },
  template: `<InquiryForm v-bind="args"/>`,
});

export const InquiryFormDefault = Template.bind({});

InquiryFormDefault.args = {
    _from: "test12345@gmail.com",
    _to: "test12345@gmail.com",
    _subject: "タイトルのテスト",
    _body: "本文のテストああああああああ",
    _isSubmited: false,
};