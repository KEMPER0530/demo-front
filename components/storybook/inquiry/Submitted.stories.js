import Submitted from '~/components/inquiry/Submitted.vue'

export default {
    title: 'Inquiry',
    component: 'Submitted',
    argTypes: {
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Submitted },
  setup() {
    return { args };
  },
  template: `<Submitted />`,
});

export const SubmittedDefault = Template.bind({});

SubmittedDefault.args = {
};