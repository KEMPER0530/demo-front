import SearchInput from '~/components/search/SearchInput.vue'

export default {
    title: 'Search',
    component: 'SearchInput',
    argTypes: {
      value: {
        description: '検索内容',
        control: 'text',
      },
      placeholder: {
        description: 'テキストのplaceholder',
        control: 'text',
      },
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { SearchInput },
  setup() {
    return { args };
  },
  template: `<SearchInput v-bind="args" />`,
});

export const SearchInputDefault = Template.bind({});

SearchInputDefault.args = {
  value: "AWS",
  placeholder: "検索内容のテスト"
};