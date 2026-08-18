import { store } from './store/store.js';
import { toggleThem } from './store/feachers/them/themSlice.js';

console.log("Initial:", store.getState());
store.dispatch(toggleThem());
console.log("After 1 toggle:", store.getState());
store.dispatch(toggleThem());
console.log("After 2 toggles:", store.getState());
