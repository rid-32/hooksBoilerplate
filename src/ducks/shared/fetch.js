import { handleActions, createAction } from 'redux-actions'

import * as CONST from './const'
import { createNamedWrapperReducer } from './utils'
import * as _ from 'utils/lodash'

const fetchReducer = handleActions(
  {
    [CONST.STARTED]: state => ({
      ...state,
      isFetching: true,
      isFetched: false,
    }),
    [CONST.SUCCESS]: (state, { payload }) => ({
      ...state,
      isFetching: false,
      isFetched: true,
      errorMessage: null,
      payload,
    }),
    [CONST.FAILURE]: (state, { payload }) => ({
      ...state,
      isFetching: false,
      isFetched: true,
      errorMessage: payload,
    }),
    [CONST.CLEAR]: () => CONST.INITIAL_STATE,
  },
  CONST.INITIAL_STATE,
)

export const getFetchReducer = name =>
  createNamedWrapperReducer(fetchReducer, name)

export const getFetchActions = name => ({
  started: createAction(CONST.STARTED, undefined, () => ({ name })),
  success: createAction(CONST.SUCCESS, undefined, () => ({
    name,
  })),
  failure: createAction(CONST.FAILURE, undefined, () => ({
    name,
  })),
  clear: createAction(CONST.CLEAR, undefined, () => ({
    name,
  })),
})

const mirrorData = data => data

export const fetchData = config => async (dispatch, getState) => {
  const { name = true } = config
  const actions = getFetchActions(name)
  const handleSuccess = config.handleSuccess || mirrorData
  const handleError = config.handleError || mirrorData
  const payload = config.selector ? config.selector(getState()) : null
  let response = {}

  try {
    dispatch(actions.started())

    response = await config.apiMethod(payload)

    _.flow(
      handleSuccess,
      actions.success,
      dispatch,
    )(response.data)
  } catch (error) {
    _.flow(
      handleError,
      actions.failure,
      dispatch,
    )(error)
  }

  return response
}
