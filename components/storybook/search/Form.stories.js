import Form from '~/components/search/Form.vue'

export default {
    title: 'Search',
    component: 'Form',
    argTypes: {
        _keyword: {
            description: '検索ワード',
            control: 'text',
          },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Form },
  setup() {
    return { args };
  },
  template: `<Form v-bind="args"/>`,
});

export const FormDefault = Template.bind({});

FormDefault.args = {
    _keyword: "storybook nuxt",
};