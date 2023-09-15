import { ref } from 'vue'

export default function useLocationMap() {

    let zoom = ref(14)
    let center = ref([37.3157484, -5.9317107,14])

    function pin(e) {
        let marker = e.target.getLatLng()
        center.value = [marker.lat, marker.lng]
    }

    return {
        zoom,
        center,
        pin
    }
}