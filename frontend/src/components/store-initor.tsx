'use client'
import { store } from "@/store"
import { Provider } from "react-redux"

const SotoreInitor = ({
  children,
}: any) => { 
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default SotoreInitor
