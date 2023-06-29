import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  StyleValue,
  toRefs,
} from 'vue'

interface CachePosition {
  index: number
  top: number
  bottom: number
  itemHeight: number
}

const ListItem = defineComponent({
  emits: ['update:meta'],
  setup(props, { slots, emit }) {
    const divRef = ref<HTMLDivElement>()
    let resizeObserver: ResizeObserver
    onMounted(() => {
      resizeObserver = new ResizeObserver(() => {
        emit('update:meta', divRef.value)
      })
      resizeObserver.observe(divRef.value as HTMLDivElement)
    })
    onBeforeUnmount(() => {
      resizeObserver.unobserve(divRef.value as HTMLDivElement)
    })
    return () => {
      return (
        <div ref={divRef}>
          {slots.default ? slots.default({ ...props }) : ''}
        </div>
      )
    }
  },
})

export default defineComponent({
  props: {
    estimatedHeight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      default: 600,
    },
    listItems: {
      type: Array,
      required: true,
    },
  },
  setup(props, { slots }) {
    // 获取容器
    const listContainer = ref<HTMLDivElement>()
    // 在可视区域渲染的列表项
    const items = ref<unknown[]>([])
    const itemsMetaData = ref<CachePosition[]>([])
    const startIndex = ref<number>(0)

    // 假设获取每个列表项的高度的函数为 getItemHeight(index)
    const setItemsMetaData = () => {
      // const visibleItemCount = Math.ceil(props.height / props.estimatedHeight)
      const estimatedHeight = props.estimatedHeight
      itemsMetaData.value = props.listItems.map((_value, index) => {
        return {
          index,
          itemHeight: estimatedHeight,
          top: estimatedHeight * index,
          bottom: estimatedHeight * (index + 1),
        }
      })
    }

    // 初始化虚拟滚动列表
    const initVirtualScroll = () => {
      setItemsMetaData()
      // 更新容器的高度为所有列表项高度之和
      updateVisibleItems()
    }

    // 更新可见区域的列表项
    const updateVisibleItems = () => {
      // 获取容器的滚动偏移量和可视区域高度
      const scrollTop = listContainer.value ? listContainer.value.scrollTop : 0
      // 计算可见区域的起始索引和结束索引
      const toItemsMetaData = itemsMetaData.value
      let start = 0
      let end = toItemsMetaData.length
      for (let i = 0; i < toItemsMetaData.length; i++) {
        if (toItemsMetaData[i].bottom >= scrollTop) {
          start = i
          break
        }
      }

      end = start
      while (
        end <= toItemsMetaData.length &&
        toItemsMetaData[end].bottom < scrollTop + props.height
      ) {
        end++
      }
      // 渲染可见区域的列表项
      items.value = props.listItems.slice(start, end + 1)
      startIndex.value = start
    }

    const sizeChangeHandle = (index: number, target: HTMLDivElement) => {
      const { top, bottom, height } = target.getBoundingClientRect()
      console.log(index, top)
      itemsMetaData.value[index] = { index, top, bottom, itemHeight: height }
    }

    initVirtualScroll()

    return () => {
      const { length } = itemsMetaData.value
      const areaHeight = length ? itemsMetaData.value[length - 1].bottom : 0
      const top = length ? itemsMetaData.value[startIndex.value].top : 0
      return (
        <div
          onScroll={updateVisibleItems}
          ref={listContainer}
          style={{
            position: 'relative',
            overflow: 'auto',
            height: `${props.height}px`,
          }}
        >
          <div style={{ height: `${areaHeight}px` }} />
          <div
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              transform: `translateY(${top}px)`,
            }}
          >
            {items.value.map((item, index) => {
              return (
                <ListItem
                  onUpdate:meta={(target: HTMLDivElement) => {
                    sizeChangeHandle(startIndex.value + index, target)
                  }}
                  key={startIndex.value + index}
                >
                  {slots.default ? slots.default({ item }) : ''}
                </ListItem>
              )
            })}
          </div>
        </div>
      )
    }
  },
})
