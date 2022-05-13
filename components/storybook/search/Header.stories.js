import Header from '~/components/search/Header.vue'

export default {
    title: 'Search',
    component: 'Header',
    argTypes: {
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Header },
  setup() {
    return { args };
  },
  template: `<Header />`,
});

export const HeaderDefault = Template.bind({});

HeaderDefault.args = {
};