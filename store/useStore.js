import {create} from 'zustand'

// const useStore = create(set => ({
//   isSignedIn: false,
//   login: () => set(state => ({ isSignedIn: true })),
//   logout: () => set(state => ({ isSignedIn: false })),
// }))

const useStore = create(set => ({
  isSignedIn: false,
  login: () => set(state => ({ isSignedIn: true })),
  logout: () => set(state => ({ isSignedIn: false })),
  email: '',
  setEmail: (email) => set(state => ({ email: email })),
  
   
  
  
}))



export default useStore;
