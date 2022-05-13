import Label from '~/components/inquiry/Label.vue'

export default {
    title: 'Inquiry',
    component: 'Label',
    argTypes: {
    },
};
  
// exportすることでコンポーネントを登録
const Template = (args) => ({
  components: { Label },
  setup() {
    return { args };
  },
  template: `<Label>Sample<span class="text-xs text-red-500">(必須)</span>
</Label>`,
});

export const LabelDefault = Template.bind({});

LabelDefault.args = {
};