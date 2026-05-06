import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD5zJPKAa6pLIXYEPXwYed529-hotxKiIU",
  authDomain: "doaai-bf5a1.firebaseapp.com",
  projectId: "doaai-bf5a1",
  storageBucket: "doaai-bf5a1.firebasestorage.app",
  messagingSenderId: "407416651624",
  appId: "1:407416651624:web:3f68e93de1f128be5860dd",
  measurementId: "G-T379JW9RTW"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export async function loginComGoogle() {
  const resultado = await signInWithPopup(auth, googleProvider)
  const user = resultado.user
  return {
    id: user.uid,
    nome: user.displayName,
    email: user.email,
    avatar: user.photoURL,
    cidade: 'São Paulo, SP',
    avaliacao: 4.9,
    totalDoacoes: 0,
    itensRecebidos: 0,
    anosNaPlataforma: 0,
  }
}

export async function fazerLogout() {
  await signOut(auth)
}
