import Button from '~/components/inquiry/Button.vue'

export default {
    title: 'Inquiry',
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
  template: `<Button >送信</Button>`,
});

export const ButtonDefault = Template.bind({});

ButtonDefault.args = {
};