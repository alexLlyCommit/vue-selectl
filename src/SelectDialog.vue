<template>
  <transition name="fade-all">
    <div class="choose" v-show="model" @click="hideChoose($event)">
      <div class="select-dialog" :class="{scale: model}">
        <div class="select-dialog-box">
          <div class="select-dialog-left">
            <div class="select-dialog-header">
              所有可选({{optionalLength}})
            </div>
            <div class="search">
              <input type="text" v-model="searchLeft" placeholder="名称、编号、英文名称(支持拼音搜索名字)" @focus="isFocusSearch('left', 'focus')" @blur="isFocusSearch('left', 'blur')" @input="isFocusSearch('left', 'no')">
              <transition name="fade">
                <ul v-show="searchLeft && isLeftSearch">
                  <li v-for="item in filter(optionalLists, searchLeft)" :key="item.id" @click="chooseItem(item)">{{item.name}}<span v-if="item.englishName">({{item.englishName}})</span></li>
                </ul>
              </transition>
            </div>
            <div class="select-dialog-item-box">
              <ul class="trees">
                <trees :modules="datas" @handleData="handleData"></trees>
              </ul>
            </div>
          </div>
          <div class="select-dialog-right">
            <div class="select-dialog-header">
              已选({{checkDatas.length}})
              <button type="button" @click="removeAll"><span>全部删除</span></button>
            </div>
            <div class="search">
              <input type="text" v-model="searchRight" placeholder="名称、编号、英文名称(支持拼音搜索名字)" @focus="isFocusSearch('right', 'focus')" @blur="isFocusSearch('right', 'blur')" @input="isFocusSearch('right', 'no')">
              <transition name="fade">
                <ul v-show="searchRight && isRightSearch">
                  <li v-for="item in filter(checkDatas, searchRight)" :key="item.id" @click="removeItem(item, 'search')">{{item.name}}<span v-if="item.englishName">({{item.englishName}})</span></li>
                </ul>
              </transition>
            </div>
            <div class="select-dialog-item-box">
              <ul>
                <li v-for="item in checkDatas" :key="item.id" @click="removeItem(item)">{{item.name}}</li>
              </ul>
            </div>
            <p>点击选中数据可取消</p>
          </div>
        </div>
        <div class="select-dialog-foot">
          <button type="button" @click="confirmItems"><span>确定</span></button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Trees from './Trees'
  import PinyinEngine from 'pinyin-engine'
  import { unique, filter } from './common/common'
  export default {
    name: 'select-dialog',
    props: {
      model: {
        type: Boolean,
        default: false
      },
      datas: {
        type: Object,
        default: function () {
          return {}
        }
      },
      limit: {
        type: Number,
        default: 0
      },
      initCurLists: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        searchLeft: '',
        searchRight: '',
        isLeftSearch: false,
        isRightSearch: false,
        historyDatas: {},
        checkDatas: [],
        sortDatas: []
      }
    },
    created () {
      const computeds = datas => {
        datas.child.forEach(item => {
          if (item.child) {
            computeds(item)
          } else {
            if (item.checked) {
              this.checkDatas.push(item)
              this.sortDatas.push(item)
            }
          }
        })
      }
      computeds(this.datas)
      let curs = []
      this.initCurLists.forEach(item => {
        this.checkDatas.forEach(curItem => {
          if (item === curItem.id) {
            curs.push(curItem)
          }
        })
      })
      this.checkDatas = JSON.parse(JSON.stringify(curs))
      this.sortDatas = JSON.parse(JSON.stringify(curs))
    },
    computed: {
      optionalLength () {
        let count = 0
        const computedLength = datas => {
          datas.child.forEach(item => {
            if (item.child) {
              computedLength(item)
            } else {
              count++
            }
          })
        }
        if (this.datas.name) {
          computedLength(this.datas)
          return count
        } else {
          return 0
        }
      },
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
    watch: {
      model (newValue, oldValue) {
        if (newValue) {
          this.historyDatas = JSON.parse(JSON.stringify(this.datas))
        }
      },
      datas: {
        handler (newValue, oldValue) {
          const computeds = (datas) => {
            datas.child.forEach(item => {
              if (item.child) {
                computeds(item)
              } else {
                if (item.checked && item.id) {
                  this.checkDatas.push(item)
                } else {
                  for (let i = 0; i <= this.checkDatas.length - 1; i++) {
                    if (this.checkDatas[i].id === item.id) {
                      this.checkDatas.splice(i, 1)
                      break
                    }
                  }
                }
              }
            })
          }
          if (newValue.name) {
            computeds(newValue)
            this.checkDatas = unique(this.checkDatas)
          }
        },
        deep: true
      }
    },
    methods: {
      nodeNotAll (datas) {
        let nodeSelectNotAll = false
        datas.nodeSelectNotAll = nodeSelectNotAll
        datas.child.forEach(item => {
          item.nodeSelectNotAll = nodeSelectNotAll
          if (item.child && item.child.length) {
            this.nodeNotAll(item)
          }
        })
      },
      checkedData (datas, checked, changeData) {
        if (changeData) {
          let count = 0
          datas.child.forEach(item => {
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
      forEachDatas (datas, type, changeData, checked) {
        if (!changeData) {
          if (type === 'all') {
            datas.checked = true
          } else if (type === 'none') {
            datas.checked = false
          }
          datas.child.forEach(item => {
            if (item.child && item.child.length) {
              this.forEachDatas(item, type)
            } else {
              if (type === 'all') {
                item.checked = true
              } else if (type === 'none') {
                item.checked = false
              }
            }
          })
        } else {
          this.checkedData(this.datas, checked, changeData)
        }
      },
      handleData (type, data, checked) {
        if (type === 'all') {
          this.forEachDatas(this.datas, 'all')
          this.nodeNotAll(this.datas)
        } else if (type === 'none') {
          this.forEachDatas(this.datas, 'none')
          this.nodeNotAll(this.datas)
          this.checkDatas = []
        } else if (type === 'other') {
          this.forEachDatas(this.datas, 'other', data, checked)
        }
      },
      removeAll () {
        this.handleData('none')
      },
      removeItem (item, type) {
        this.handleData('other', item, false)
        if (type) {
          this.searchRight = ''
        }
      },
      chooseItem (item) {
        this.handleData('other', item, true)
        this.searchLeft = ''
      },
      filter (datas, value) {
        return filter(datas, value)
      },
      isFocusSearch (position, type) {
        if (position === 'left') {
          if (type === 'focus') {
            this.isLeftSearch = true
          } else if (type === 'no') {
            if (this.searchLeft) {
              this.isLeftSearch = true
            } else {
              this.isLeftSearch = false
            }
          } else {
            this.isLeftSearch = false
          }
        } else {
          if (type === 'focus') {
            this.isRightSearch = true
          } else if (type === 'no') {
            if (this.searchRight) {
              this.isRightSearch = true
            } else {
              this.isRightSearch = false
            }
          } else {
            this.isRightSearch = false
          }
        }
      },
      confirmItems () {
        this.checkDatas = this.checkDatas.slice(-this.limit)
        this.$emit('hide', this.checkDatas)
        this.sortDatas = JSON.parse(JSON.stringify(this.checkDatas))
        const limitCheckTree = (datas) => {
          datas.child.forEach(item => {
            item.checked = false
            if (item.child && item.child.length) {
              limitCheckTree(item)
            } else {
              this.checkDatas.forEach(data => {
                if (data.id === item.id) {
                  this.checkedData(this.datas, true, data)
                }
              })
            }
          })
        }
        if (this.limit) {
          this.nodeNotAll(this.datas)
          limitCheckTree(this.datas)
        }
        this.searchLeft = ''
        this.searchRight = ''
      },
      hideChoose (event) {
        if (event.target.className === 'choose') {
          this.$emit('hide')
          this.$emit('resetDatas', this.historyDatas)
          this.checkDatas = JSON.parse(JSON.stringify(this.sortDatas))
          this.searchLeft = ''
          this.searchRight = ''
        }
      }
    },
    components: {
      Trees
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import './fonts/iconfont.css'
  @import './common/base.styl'
  .choose
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(55, 55, 55, .6)
    z-index: 2
    .select-dialog
      width: 700px
      border: 1px solid #c7c6c6
      border-radius: 3px
      margin: 100px auto 0
      padding: 24px 14px
      color: #5a5e66
      background: #fff
      transform: scale(.6)
      transition: all .2s linear 0s
      &.scale
        animation: scaleTo .2s linear 0s
        transform: scale(1)
      .select-dialog-header
        font-size: 14px
      .select-dialog-header button, .select-dialog-foot button
        float: right
        margin: 4.5px 15px
        button()
      .select-dialog-foot
        overflow: hidden
        padding: 19px 0 0
        button
          background-color: #2d8cf0
          border-color: #2d8cf0
          color: #fff
          &:hover
            background-color: #2d8cf0
            border-color: #2d8cf0
            color: #fff
            opacity: .85
      .select-dialog-box
        display: flex
        .select-dialog-left, .select-dialog-right
          flex: 1
          margin: 0 10px
          border: 1px solid #c7c6c6
          border-radius: 4px
          position: relative
        .select-dialog-header
          height: 40px
          line-height: 40px
          padding-left: 15px
          border-bottom: 1px solid #c7c6c6
          display: block
        .select-dialog-item-box ul
          padding: 0
          margin: 0
          height: 391px
          overflow: auto
        .select-dialog-right
          i
             float: left
          p
            color: #FA5555
            position: absolute
            right: 0
            bottom: 0
            margin: 5px
            display: none
          .select-dialog-item-box li
            height: 16px
            line-height: 16px
            margin-bottom: 5px
            padding-left: 15px
            cursor: pointer
            font-size: 12px
            &:hover
              color: #409eff
          &:hover
            p
              display: block
        .search
          position: relative
          input
            width: 80%
            input()
          ul
            margin-left: 33px
            width: 80%
            drowDownUl()
            li
              word-break: break-all
              cursor: pointer
              &:hover
                color: #409eff
</style>
