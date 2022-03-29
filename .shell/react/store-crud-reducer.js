import {
    createSlice
} from '@reduxjs/toolkit'

const ID = 'id'

var initialState = {
    name: 'namestore',
    data: [],
    paginate: [],
    find: {}
}

export const appSlice = createSlice({
        name: 'namestore',
        initialState,
        reducers: {
            paginateNameExport(state, action) {
                const {
                    offset,
                    limit,
                    data
                } = action.payload
                state.paginate = (data || state.data).slice((offset - 1) * limit, offset * limit)
            },
            handleNameExport(state, action) {
                state[action.payload.name] = action.payload.value
            },
            resetNameExport(state, action) {
                state.data = action.payload || []
            },
            createNameExport(state, action) {
                state.data.push(action.payload)
            },
            findOneNameExport(state, action) {
                state.find = state.data.find((e) => e[ID] === action.payload) || {}
            },
            updateNameExport(state, action) {
                state.data = state.data.map(e => {
                    if (e[ID] === action.payload[ID]) {
                        e = Object.assign(e, action.payload)
                    }
                    return e
                })
            },
            removeNameExport(state, action) {
                state.data = state.data.filter(e => e[ID] !== action.payload)
            }
        },
        extraReducers: {},
    })

// import
export const {
    paginateNameExport,
    handleNameExport,
    resetNameExport,
    createNameExport,
    findOneNameExport,
    updateNameExport,
    removeNameExport
} = appSlice.actions

export default appSlice.reducer