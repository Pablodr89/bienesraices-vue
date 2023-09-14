import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

export let useAuthStore = defineStore('auth', () => {
    let auth = useFirebaseAuth()
    let authUser = ref(null)
    let router = useRouter()
    let errorCodes = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'El password es incorrecto'
    }

    onMounted (() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                authUser.value = user
            } 
        })
    })
    let errorMsg = ref('')

    let login = ({email, password}) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user
            authUser.value = user
            router.push({name: 'admin-propiedades'})
        })
        .catch(error => {
            errorMsg.value = errorCodes[error.code]
        })
    }

    let logout = () => {
        signOut(auth)
        .then(() => {
            authUser.value = null
            router.push({name: 'login'})
        })
        .catch(error => {
            console.log(error)
        })
    }

    let hasError = computed(() => {
        return errorMsg.value
    })

    let isAuth = computed(() => {
        return authUser.value
    })

    return {
        login,
        logout,
        hasError,
        errorMsg,
        isAuth
    }
})