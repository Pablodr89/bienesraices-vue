import { computed } from 'vue'
import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage, useStorageFile } from 'vuefire'
import { uid } from 'uid'

export default function useImage() {

    let storage = useFirebaseStorage()
    let storageRefPath = storageRef(storage, `/propiedades/${uid()}.jpg`)

    let { url, upload } = useStorageFile(storageRefPath)

    function uploadImage(e) {
        let data = e.target.files[0]
        if(data) {
            upload(data)
        }
    }

    let image = computed(() => {
        return url.value ? url.value : null
    })

    return {
        url,
        uploadImage,
        image
    }
}