<template>
  <div class="btn-show">
    <div class="search-box">
      <div class="search">
        <input type="text" v-model="quickSearch" placeholder="支持快速搜索选择(支持拼音搜索名字)" @focus="isFocusSearch('focus')" @blur="isFocusSearch('blur')" @input="isFocusSearch('no')">
        <transition name="fade">
          <ul v-show="quickSearch && isSearch">
            <li v-for="item in filter(optionalLists, quickSearch)" @click="chooseItem(item)">{{item.name}}<span v-if="item.englishName">({{item.englishName}})</span></li>
          </ul>
        </transition>
      </div>
      <button type="button" @click="showSelectDialog"><span>选择插件</span></button>
    </div>
    <select-dialog :model="model" :datas="datas" @hide="hide" @resetDatas="resetDatas" v-if="datas.name" :limit="limit"></select-dialog>
    <div class="cur-lists">
      <ul>
        <li v-for="item in curLists" :key="item.id">
          <button type="button"><span>{{item.name}}</span><i @click="removeItem(item)">x</i></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import SelectDialog from './SelectDialog'
  import { unique, filter } from './common/common'
  export default {
    name: 'vueSelectl',
    props: {
      customdatas: {
        type: Object,
        default: function () {
          return {}
        }
      },
      initcurlists: {
        type: Array,
        default: function () {
          return []
        }
      },
      limit: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        model: false,
        quickSearch: '',
        isSearch: false,
        datas: this.customdatas,
        curLists: [],
        noCheckItem: ''
      }
    },
    created () {
      let count = 0
      const initCurLists = (datas, initIds) => {
        datas.child.forEach(item => {
          if (item.child) {
            initCurLists(item, initIds)
          } else {
            if (~initIds.indexOf(item.id)) {
              count++
              if (this.limit && count > this.limit) {
              } else {
                this.chooseItem(item)
              }
            }
          }
        })
      }
      initCurLists(this.datas, this.initcurlists)
    },
    computed: {
      optionalLists () {
        let lists = []
        const computedLists = datas => {
          datas.child.forEach(item => {
            if (item.child) {
              computedLists(item)
            } else {
              lists.push(item)
            }
          })
        }
        if (this.datas.name) {
          computedLists(this.datas)
          return lists
        } else {
          return []
        }
      }
    },
    methods: {
      showSelectDialog () {
        this.model = !this.model
      },
      chooseItem (item) {
        this.quickSearch = ''
        this.curLists.push(item)
        if (this.curLists.length > this.limit) {
          this.noCheckItem = (this.curLists.slice(0, this.curLists.length - this.limit))[0].id
        }
        this.checkedData(this.datas, true, item)
        this.noCheckItem = ''
        this.curLists = unique(this.curLists).slice(-this.limit)
        this.$emit('checkitem', this.curLists)
      },
      removeItem (item) {
        this.checkedData(this.datas, false, item)
        let removeItemIndex
        if (this.curLists.length) {
          for (let i = 0; i <= this.curLists.length - 1; i++) {
            if (this.curLists[i].id === item.id) {
              removeItemIndex = i
              break
            }
          }
          this.curLists.splice(removeItemIndex, 1)
        }
        this.curLists = unique(this.curLists)
        this.$emit('checkitem', this.curLists)
      },
      checkedData (datas, checked, changeData) {
        if (changeData) {
          let count = 0
          datas.child.forEach(item => {
            if (this.limit && this.noCheckItem && item.id === this.noCheckItem) {
              item.checked = false
            }
            if (item.id === changeData.id) {
              item.checked = checked
              if (item.child && item.child.length) {
                this.checkedData(item, checked)
              }
            } else {
              if (item.child && item.child.length) {
                this.checkedData(item, checked, changeData)
              }
            }
            if (item.checked) {
              count++
            }
            if (count === datas.child.length) {
              datas.checked = true
            } else {
              datas.checked = false
            }
          })
        } else {
          datas.child.forEach(item => {
            item.checked = checked
            if (item.child && item.child.length) {
              this.checkedData(item, checked)
            }
          })
        }
        datas.nodeSelectNotAll = datas.child.some(item => item.checked) || datas.child.some(item => item.nodeSelectNotAll)
      },
      filter (datas, value) {
        return filter(datas, value)
      },
      isFocusSearch (type) {
        if (type === 'focus') {
          this.isSearch = true
        } else if (type === 'no') {
          if (this.quickSearch) {
            this.isSearch = true
          } else {
            this.isSearch = false
          }
        } else {
          this.isSearch = false
        }
      },
      hide (datas) {
        this.model = false
        if (datas) {
          this.curLists = JSON.parse(JSON.stringify(datas))
          this.$emit('checkitem', this.curLists)
        }
      },
      resetDatas (datas) {
        this.datas = JSON.parse(JSON.stringify(datas))
      }
    },
    components: {
      SelectDialog
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import './common/base.styl'
  .btn-show
    .search-box
      display: flex
      .search
        position: relative
        width: 100%
        input
          width: 100%
          input()
        ul
          width: 100%
          drowDownUl()
          li
            word-break: break-all
            cursor: pointer
            &:hover
              color: #409eff
      button
        height: 32px
        margin: 10px
    button
      button()
    .cur-lists ul
      margin: 0
      display: flex
      flex-flow: row wrap
      li
        margin: 5px
        position: relative
        color: #495060
        &:hover
          opacity: .85
        button
          border: 1px solid #e9eaec
          &:hover
            color: #495060
            background-color: #fff
            border-color: #e9eaec
        i
          position: absolute
          right: 3px
          top: 11px
          width: 10px
          height: 10px
          line-height: 10px
          text-align: center
          font-style: normal
          cursor: pointer
</style>
