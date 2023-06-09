import { mount } from '@vue/test-utils'
import VisualScrollList from '@/src/VisualScrollList'

test('test render Node number', async () => {
  const wrapper = mount(VisualScrollList, {
    props: {
      total: 100,
      rowHeight: 100,
      height: 800,
      bufferSize: 0
    },
    slots: {
      default: '<div data-test="row-node">area</div>'
    }
  })

  const item = wrapper.findAll('[data-test="row-node"]')

  // console.log(item.length)
  expect(item.length).toBe(10)
})
