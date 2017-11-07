<template>
  <li>
    <div @click="toggle">
      <i class="icon iconfont" v-if="!modules.hasOwnProperty('child')">&#xe740;</i>
      <i class="icon iconfont" v-else-if="isFolder && !open">&#xe60e;</i>
      <i class="icon iconfont" v-else>&#xe64c;</i>
      <label @click.stop>
        <input type="checkbox" :value="modules.name" :checked="modules.checked" @change="checkData($event, modules)">
        <span class="original-checkbox"><i :class="{hasChecked: modules.nodeSelectNotAll && !modules.checked}"></i></span>
        <span class="item-name">{{modules.name}}</span>
      </label>
    </div>
    <ul v-show="open" v-if="isFolder">
      <trees v-for="module in modules.child" :key="module.name" :modules="module" @handleData="handleData"></trees>
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'trees',
    props: {
      modules: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        open: false,
        checkedNames: []
      }
    },
    computed: {
      isFolder () {
        return this.modules.child
      }
    },
    methods: {
      toggle () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      checkData (event, data) {
        if (!data.parentId) {
          if (event.target.checked) {
            this.$emit('handleData', 'all')
          } else {
            this.$emit('handleData', 'none')
          }
        } else {
          this.$emit('handleData', 'other', data, event.target.checked)
        }
      },
      handleData (type, data, checked) {
        this.$emit('handleData', type, data, checked)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  i
    float: left
  ul
    padding: 0
    li
      user-select: none
      list-style: none
      padding-left: 15px
      cursor: pointer
      div
        overflow: hidden
        margin: 5px 0
        line-height: 1
      label
        cursor: pointer
        display: flex
        align-items: flex-start
        input
          cursor: pointer
          float: left
          display: none
          &:checked + .original-checkbox
            background: #409eff
            i
              display: block
        span
          flex: 1
          &.original-checkbox
            margin: 0 5px
            position: relative
            flex: 0 0 16px
            height: 16px
            background: #fff
            z-index: 1
            transition: border-color .15s cubic-bezier(.71, -.46, .29, 1.46)
            border-radius: 4px
            border: 1px solid #bfcbd9
            cursor: pointer
            box-sizing: border-box
            i
              position: absolute
              left: 2px
              top: 2px
              width: 9px
              height: 5px
              display: none
              border: 1px solid #fff
              border-top: 0
              border-right: 0
              transform: rotate(-45deg)
              &.hasChecked
                border: 0
                transform: rotate(0)
                display: block
                background: #409eff
                width: 8px
                height: 8px
                left: 3px
                top: 3px
            &:hover
              border-color: #409eff
          &.item-name
            font-size: 12px
            line-height: 16px
            &:hover
              color: #409eff
</style>
