import * as CONFIG from '../config'
import * as ACTION from '../store/actions'

const initState = {
  searchText: '',
  baseMap: CONFIG.BASEMAP,
  viewType: CONFIG.VIEWTYPE,
  data: { sys: {}, weather: [{}], wind: {}, main: {} },
}

const reducer  = (state = initState, action) => {
  switch (action.type) {
    default: return state

    case ACTION.SEARCH: return {
      ...state,
      data: action.payload.data,
      searchText: action.payload.value,
    }

    case ACTION.CHANGE_BASEMAP: return { ...state, baseMap: action.value }
    case ACTION.CHANGE_VIEWTYPE: return { ...state, viewType: action.value }
  }
}

export default reducer
