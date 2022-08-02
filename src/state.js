import { atom } from 'recoil'



export const drawerState = atom({ key: "drawerState", default: false })
export const filterState = atom({
    key: "filterState",
    default: '',
})
export const optionState = atom({ key: "optionState", default: "" })
export const resultsState = atom({ key: "resultsState", default: [] })
