import PinyinEngine from 'pinyin-engine'

export function unique (array) {
  let obj = {}
  return array.filter((item, index, array) => {
    return obj[item.id] ? false : (obj[item.id] = true && true)
  })
}

export function filter (datas, value) {
  if (!value) {
    return []
  }
  let filterDatas = []
  let pinyinEngine = new PinyinEngine(datas, ['name'])
  if (pinyinEngine.query(value).length) {
    filterDatas = pinyinEngine.query(value)
  }
  for (let i = 0; i <= datas.length - 1; i++) {
    if (~datas[i].name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase())) {
      filterDatas.push(datas[i])
      continue
    }
    if (~datas[i].englishName.toLocaleLowerCase().indexOf(value.toLocaleLowerCase())) {
      filterDatas.push(datas[i])
      continue
    }
    let id = datas[i].id + ''
    if (~id.indexOf(value)) {
      filterDatas.push(datas[i])
    }
  }
  filterDatas = unique(filterDatas)
  return filterDatas
}

export function debounce (fn, timeout) {
  clearTimeout(fn.timer)
  fn.timer = setTimeout(() => {
    fn()
  }, timeout)
}
