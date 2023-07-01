# Visual-Scroll-List-LQF

虚拟列表插件

### install

```
npm install visual-scroll-list-lqf
```

### usage

- `ScrollVisualList` 固定高度虚拟列表组件

| 属性       | 描述             | 类型   | 必须 | 默认 |
| ---------- | ---------------- | ------ | ---- | ---- |
| height     | 设置滚动列表高度 | number | 否   | 800  |
| rowHeight  | 列高度           | number | 是   | -    |
| total      | 列表总数量       | number | 是   | -    |
| bufferSize | 显示视图外列数量 | number | 否   | 0    |

```vue
<template>
  <ScrollVisualList :rowHeight="20" :total="listData.length">
    <template #default="{ index }">
      <span>{{ index }}</span>
    </template>
  </ScrollVisualList>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { ScrollVisualList } from 'scroll-visual-list-lqf'

export default defineComponent({
  setup() {
    const listData = ref([])
    listData.length = 1000
    return {
      listData,
    }
  },
})
</script>
```

- `DynamicScrollVisualList` 动态虚拟列表，支持非固定列高度使用

| 属性            | 描述                               | 类型   | 必须 | 默认 |
| --------------- | ---------------------------------- | ------ | ---- | ---- |
| height          | 设置滚动列表高度                   | number | 否   | 600  |
| estimatedHeight | 预设列高度，提供一个列高度的参考值 | number | 是   | -    |
| listItems       | 列表数据                           | any[]  | 是   | -    |

```vue
<template>
  <dynamic-visual-scroll-list
    :list-items="listData"
    :estimated-height="20"
    tag="ul"
  >
    <template #default="{ item }">
      <li :style="{ height: 30 + Math.floor(Math.random() * 30) + 'px' }">
        {{ item }}
      </li>
    </template>
  </dynamic-visual-scroll-list>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { DynamicScrollVisualList } from 'scroll-visual-list-lqf'

export default defineComponent({
  setup() {
    const listData = ref([])
    listData.value.length = 1000
    for (let i = 0; i < listData.value.length; i++) {
      listData.value[i] = i
    }

    return {
      listData,
    }
  },
})
</script>
```
