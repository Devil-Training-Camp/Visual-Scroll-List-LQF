import { defineComponent, onMounted, onUpdated, ref, toRefs } from 'vue'

interface CachePosition {
  index: number
  top: number
  bottom: number
  height: number
  dValue: number
}

export default defineComponent({
  props: {
    total: {
      type: Number,
      required: true,
    },
    estimateRowHeight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      default: 800,
    },
    tag: {
      type: String,
      default: 'div',
    },
    bufferSize: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { slots }) {
    const { total, estimateRowHeight, height, bufferSize } = toRefs(props)

    const scrollTop = ref<number>(0)
    const limit = ref<number>(Math.ceil(height.value / estimateRowHeight.value))
    const originHeight = ref<number>(estimateRowHeight.value * total.value)
    const originStartIndex = ref<number>(0)
    const cachePositions = ref<CachePosition[]>([])
    const scorllContainerRef = ref<HTMLElement>()
    const barRef = ref<HTMLElement>()
    const absoluteContainerRef = ref<HTMLElement>()
    const startIndex = ref<number>(0)
    const endIndex = ref<number>(0)

    const initCachePositions = () => {
      const positions = []
      for (let i = 1; i <= total.value; i++) {
        positions.push({
          index: i - 1,
          bottom: estimateRowHeight.value * i,
          top: estimateRowHeight.value * (i - 1),
          dValue: 0,
          height: estimateRowHeight.value,
        })
      }
      cachePositions.value = positions
    }

    const updateCachePositions = () => {
      // 如何找出元素索引
      const nodes = absoluteContainerRef.value?.children
      if (!nodes) return
      // const firstNode  = nodes[0]

      for (const node of nodes) {
        const { height } = node.getBoundingClientRect()
        console.log(node)
      }
    }

    const getStartIndex = (scrollTop = 0) => {
      let idx = cachePositions.value.findIndex((position, index) => {
        if (scrollTop - position.top) {
          // not do anything
        } else {
          return index
        }
      })

      // 如果超出滚动的高度，说明存在一部分空白
      // 则多显示一列
      if (scrollTop < cachePositions.value[idx].top) {
        idx = idx - 1
      }
      return idx
    }

    const onScroll = (event: Event) => {
      const bScrollTop = (event.target as HTMLDivElement).scrollTop
      const currentIndex = getStartIndex(bScrollTop)

      if (originStartIndex.value !== currentIndex) {
        originStartIndex.value = currentIndex
        startIndex.value = Math.max(currentIndex - bufferSize.value, 0)
        endIndex.value = Math.min(
          currentIndex + limit.value + bufferSize.value,
          total.value
        )

        scrollTop.value = bScrollTop
      }
    }

    const getTransform = () => {
      return `
              translateY(${cachePositions.value[startIndex.value].top}px)
            `
    }

    initCachePositions()

    onMounted(() => {
      updateCachePositions()
    })

    onUpdated(() => {
      updateCachePositions()
    })

    return () => {
      const redrawRender = () => {
        const elements = []
        for (let i = startIndex.value; i <= endIndex.value; i++) {
          elements.push(slots.default!({ index: i }))
        }
        return elements
      }

      return (
        <div
          ref={scorllContainerRef}
          style={{
            position: 'relative',
            overflow: 'hidden auto',
            height: `${height.value}px`,
          }}
          onScroll={onScroll}
        >
          <div
            ref={barRef}
            style={{
              position: 'relative',
              top: 0,
              height: `${originHeight.value}px`,
            }}
          />
          <div
            ref={absoluteContainerRef}
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              transform: getTransform(),
            }}
          >
            {redrawRender()}
          </div>
        </div>
      )
    }
  },
})
