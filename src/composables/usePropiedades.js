import { computed, ref } from 'vue'
import { collection, doc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'

export default function usePropiedades() {
    let piscina = ref(false)

    let storage = useFirebaseStorage()
    let db = useFirestore()
    let propiedadesCollection = useCollection(collection(db, 'propiedades'))

    async function deleteItem(id, urlImage) {
        if(confirm('¿Deseas eliminar esta propiedad?')) {
            let docRef = doc(db, 'propiedades', id)
            let imageRef = storageRef(storage, urlImage)
            
            await Promise.all([
                deleteDoc(docRef),
                deleteObject(imageRef)
            ])
        }
    }
 
    let filteredItems = computed(() => {
        return piscina.value ?
            propiedadesCollection.value.filter( propiedad => propiedad.piscina) :
            propiedadesCollection.value
    })

    return {
        piscina,
        propiedadesCollection,
        filteredItems,
        deleteItem
    }
}