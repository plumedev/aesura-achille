import { ref, type Component, type Ref } from 'vue'

interface ModalState {
  component: Component | null
  props: Record<string, any>
  events: Record<string, (...args: any[]) => void>
  isOpen: boolean
  title: string
}

const modalState: Ref<ModalState> = ref({
  component: null,
  props: {},
  events: {},
  isOpen: false,
  title: ''
})

export function useModal() {
  const openModal = (
    component: Component,
    props: Record<string, any> = {},
    events: Record<string, (...args: any[]) => void> = {},
    title: string = ''
  ) => {
    modalState.value = {
      component,
      props,
      events,
      isOpen: true,
      title: title
    }
  }

  const closeModal = () => {
    modalState.value.isOpen = false

    setTimeout(() => {
      if (!modalState.value.isOpen) {
        modalState.value.component = null
        modalState.value.props = {}
        modalState.value.events = {}
        modalState.value.title = ''
      }
    }, 300)
  }

  return {
    modalState,
    openModal,
    closeModal
  }
}
