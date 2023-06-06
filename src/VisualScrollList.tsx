import { computed, defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  props: {
    total: {
      type: Number,
      required: true,
    },
    rowHeight: {
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
  },
  setup(props, { slots, expose }) {
    const containerRef = ref<HTMLElement | null>()
    const height = ref<number>(props.height)
    const rowHeight = computed<number>(() => props.rowHeight)
    const total = computed<number>(() => props.total)
    const limit = ref<number>()
    const startIndex = ref<number>(0)
    const endIndex = ref<number>(total.value - 1)
    const scrollTop = ref<number>(0)

    const init = () => {
      limit.value = Math.ceil(height.value / rowHeight.value)
      const index = Math.floor(scrollTop.value / rowHeight.value)

      startIndex.value = Math.max(index, 0)
      endIndex.value = Math.min(total.value - 1, startIndex.value + limit.value)
    }

    const handleScroll = (event: Event) => {
      scrollTop.value = (event.target as HTMLDivElement).scrollTop
      const index = Math.floor(scrollTop.value / rowHeight.value)

      if (index !== startIndex.value) {
        startIndex.value = Math.max(index, 0)
        endIndex.value = Math.min(
          total.value - 1,
          startIndex.value + limit.value!
        )
      }
    }

    watch([total, rowHeight], () => {
      init()
      console.log(startIndex.value, endIndex.value)
    })

    onMounted(() => {
      init()
    })

    expose({
      init,
    })

    return () => {
      const redrawRender = () => {
        const content = []
        for (let i = startIndex.value; i <= endIndex.value; i++) {
          content.push(
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: `${i * rowHeight.value}px`,
              }}
            >
              {slots.default!({ index: i })}
            </div>
          )
        }
        return content
      }
      return (
        <div
          ref={containerRef}
          style={{
            overflowX: 'hidden',
            overflowY: 'auto',
            height: height.value + 'px',
            position: 'relative',
          }}
          onScroll={handleScroll}
        >
          {redrawRender()}
        </div>
      )
    }
  },
})
