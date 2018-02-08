import select from './Select.vue'

const VueSelect = {}
VueSelect.install = function (Vue, options) {
  Vue.component(select.name, select)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueSelect)
}

export default VueSelect
