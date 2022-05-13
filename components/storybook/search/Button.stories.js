import Button from '~/components/search/Button.vue'

export default {
    title: 'Search',
    component: 'Button',
    argTypes: {
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: `<Button >検索</Button>`,
});

export const ButtonDefault = Template.bind({});

ButtonDefault.args = {
};