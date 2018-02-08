## vue-selectl

## Demo

[Demo](https://luolinyuan.github.io/vue-selectl/)


```
vue-selectl base on Vue 2
```
## Install

```
npm install vue-selectl --save
```
## How to use

### Attributes

| parameter    | explain            | type   | optional          | default    |
| ------------ | ------------------ | ------ | ----------------- | ---------- |
| customdatas  | custom data        | array  | -                 | []         |
| initcurlists | init data          | array  | -                 | []         |
| limit        | choose up to a few | number | -                 | 0          |

### Events

| even name |       explain       | callback |
| --------- | ------------------- | -------- |
| checkitem | listen to selection | array    |
| updateinit | listen to change initcurlists | array

### Methods

| method name |       explain       | optional |
| --------- | ------------------- | -------- |
| reset | do reset | array[id]    |

1. use script

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>test</title>
  <link  rel="stylesheet" href="./dist/styles.css" />
</head>
<body>
  <div id="app">
    <vue-selectl :customdatas="datas" @checkitem="checkItem" @updateinit="changeCurLists" :initcurlists="curLists" :limit="limit" ref="vueSelectl"></vue-selectl>
    <button @click="add">add</button>
    <button @click="reset">reset</button>
  </div>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.min.js"></script>
<script src="./dist/vue-selectl.js"></script>
<script type="text/javascript">
  var app = new Vue({
      el: '#app',
      data () {
        return {
          curLists: [],
          limit: 5,
          datas: {
            name: '所有部门',
            checked: false,
            id: 1,
            parentId: null,
            nodeSelectNotAll: false,
            englishName: 'all',
            child: [
              {
                name: '行政部',
                checked: false,
                id: 2,
                parentId: 1,
                nodeSelectNotAll: false,
                englishName: 'Administration Department',
                child: [
                  {
                    name: '行政管理',
                    checked: false,
                    id: 3,
                    parentId: 2,
                    nodeSelectNotAll: false,
                    englishName: 'Administrative Management',
                    child: [
                      {
                        name: '风风',
                        checked: false,
                        id: 4,
                        parentId: 3,
                        nodeSelectNotAll: false,
                        englishName: 'Feng Feng'
                      },
                      {
                        name: '后勤管理',
                        checked: false,
                        id: 5,
                        parentId: 3,
                        nodeSelectNotAll: false,
                        englishName: 'Logistics Management',
                        child: [
                          {
                            name: '行政安全',
                            checked: false,
                            id: 16,
                            parentId: 5,
                            nodeSelectNotAll: false,
                            englishName: 'Administrative Security',
                            child: [
                              {
                                name: '卡拉',
                                checked: false,
                                id: 17,
                                parentId: 16,
                                nodeSelectNotAll: false,
                                englishName: 'Ka La'
                              },
                              {
                                name: '乒乓',
                                checked: false,
                                id: 18,
                                parentId: 16,
                                nodeSelectNotAll: false,
                                englishName: 'Ping Pang'
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    name: '企业文化',
                    checked: false,
                    id: 6,
                    parentId: 2,
                    nodeSelectNotAll: false,
                    englishName: 'Corporate Culture',
                    child: [
                      {
                        name: '企业活动',
                        checked: false,
                        id: 7,
                        parentId: 6,
                        nodeSelectNotAll: false,
                        englishName: 'Enterprise Activity',
                        child: [
                          {
                            name: '日常活动',
                            checked: false,
                            id: 19,
                            parentId: 7,
                            nodeSelectNotAll: false,
                            englishName: 'Daily Activities',
                            child: [
                              {
                                name: '小健',
                                checked: false,
                                id: 20,
                                parentId: 19,
                                nodeSelectNotAll: false,
                                englishName: 'Xiao Jian'
                              },
                              {
                                name: '小东',
                                checked: false,
                                id: 21,
                                parentId: 19,
                                nodeSelectNotAll: false,
                                englishName: 'Acron'
                              }
                            ]
                          }
                        ]
                      },
                      {
                        name: '企业宣传',
                        checked: false,
                        id: 8,
                        parentId: 6,
                        nodeSelectNotAll: false,
                        englishName: 'Enterprise Propaganda',
                        child: [
                          {
                            name: '宣传文案',
                            checked: false,
                            id: 22,
                            parentId: 8,
                            nodeSelectNotAll: false,
                            englishName: 'Propaganda copy',
                            child: [
                              {
                                name: '哈利',
                                checked: false,
                                id: 23,
                                parentId: 22,
                                nodeSelectNotAll: false,
                                englishName: 'Ha Li'
                              },
                              {
                                name: '米妮',
                                checked: false,
                                id: 24,
                                parentId: 22,
                                nodeSelectNotAll: false,
                                englishName: 'Minnie'
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: '财务部',
                checked: false,
                id: 9,
                parentId: 1,
                nodeSelectNotAll: false,
                englishName: 'Finance Department',
                child: [
                  {
                    name: '税务管理',
                    checked: false,
                    id: 10,
                    parentId: 9,
                    nodeSelectNotAll: false,
                    englishName: 'Tax Administration',
                    child: [
                      {
                        name: '张三',
                        checked: false,
                        id: 11,
                        parentId: 10,
                        nodeSelectNotAll: false,
                        englishName: 'Zhang San'
                      },
                      {
                        name: '李四',
                        checked: false,
                        id: 12,
                        parentId: 10,
                        nodeSelectNotAll: false,
                        englishName: 'Halen'
                      }
                    ]
                  },
                  {
                    name: '财务管理',
                    checked: false,
                    id: 13,
                    parentId: 9,
                    nodeSelectNotAll: false,
                    englishName: 'Financial Management',
                    child: [
                      {
                        name: '李李',
                        checked: false,
                        id: 14,
                        parentId: 13,
                        nodeSelectNotAll: false,
                        englishName: 'Aline Ly'
                      },
                      {
                        name: '赵六',
                        checked: false,
                        id: 15,
                        parentId: 13,
                        nodeSelectNotAll: false,
                        englishName: 'Zhao Liu'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      mounted () {
        // this.curLists.push(436)
        this.curLists = [4, 17, 20, 24, 23, 11]
      },
      methods: {
        checkItem: function (datas) {
          console.log('checkItem', datas)
        },
        add () {
          this.curLists.push(13)
          // this.curLists = [20, 24]
        },
        reset () {
          this.$refs.vueSelectl.reset([4, 17])
        },
        changeCurLists (value) {
          console.log(value)
        }
      }
    });
</script>
</html>
```

2. webpack

```javascript
import VueSelectl from 'vue-selectl'
import 'vue-selectl/dist/styles.css'
Vue.use(VueSelectl)
```
