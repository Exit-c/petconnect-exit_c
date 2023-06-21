import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDqHwA-3q5DkdgfIK0zlvwfNCGyw2_EjyY',
  authDomain: 'petconnect-6d04d.firebaseapp.com',
  projectId: 'petconnect-6d04d',
  storageBucket: 'petconnect-6d04d.appspot.com',
  messagingSenderId: '857961591646',
  appId: '1:857961591646:web:c31e484e54ef946b9155cf',
};

const app = initializeApp(firebaseConfig);

export default app;
