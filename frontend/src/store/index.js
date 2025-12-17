import { createStore, combineReducers } from 'redux';
import { IntlReducer as Intl } from 'react-redux-multilingual';

const rootReducer = combineReducers({
  Intl,
});

// Default language: Vietnamese
const preloadedState = {
  Intl: {
    locale: 'vi',
  },
};

const store = createStore(rootReducer, preloadedState);

export default store;

