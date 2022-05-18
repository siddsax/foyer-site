const dev = 1;
var firebaseConfig;

var firebaseConfigProd = {
  apiKey: "AIzaSyBarNMFYvA5ChtKvyQCWmmjLweGqRfEauE",
  authDomain: "foyer-ba835.firebaseapp.com",
  projectId: "foyer-ba835",
  storageBucket: "foyer-ba835.appspot.com",
  messagingSenderId: "780614249083",
  appId: "1:780614249083:web:566cab2113efe820e610de",
  measurementId: "G-GQV12WQ37B",
};
const firebaseConfigDev = {
  apiKey: "AIzaSyByg4K4k0MAa3OKF0w6KXx_i4robouunFw",
  authDomain: "foyer-dev.firebaseapp.com",
  projectId: "foyer-dev",
  storageBucket: "foyer-dev.appspot.com",
  messagingSenderId: "125825527013",
  appId: "1:125825527013:web:514889ae719294dff0780c",
  measurementId: "G-8WPXHG7VTR",
};

if (dev) {
  firebaseConfig = firebaseConfigDev;
} else {
  firebaseConfig = firebaseConfigProd;
}

export { firebaseConfig, dev };
