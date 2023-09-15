import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: {requiresAuth: true},
      children: [
        {
          path: 'propiedades',
          name: 'admin-propiedades',
          component: () => import('../views/admin/AdminView.vue')
        },
        {
          path: 'crear',
          name: 'nueva-propiedad',
          component: () => import('../views/admin/NuevaPropiedadView.vue')
        },
        {
          path: 'editar/:id',
          name: 'editar-propiedad',
          component: () => import('../views/admin/EditarPropiedadView.vue')
        }
      ]
    },
    {
      path: '/propiedad/:id',
      name: 'propiedad',
      component: () => import('../views/PropiedadView.vue')
    }
  ]
})

//Guard de navegacion
router.beforeEach(async (to, from, next) => {
  let requiresAuth = to.matched.some(url => url.meta.requiresAuth)

  if(requiresAuth) {
    //Comprobar que el usuario este logueado
    try {
      await authenticateUser()
      next()
    } catch(error) {
      console.log(error)
      next({name: 'login'})
    }
  } else {
    //Mostramos la vista al no estar protegida la ruta
    next()
  }
})

function authenticateUser() {
  let auth = useFirebaseAuth()

  return new Promise((resolve, reject) => {
    let unsubscribe = onAuthStateChanged(auth, (user) => {

      unsubscribe()
      if(user) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

export default router
