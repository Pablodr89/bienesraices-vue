<script setup>
    import { useField, useForm } from 'vee-validate'
    import "leaflet/dist/leaflet.css"
    import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
    import useImage from '@/composables/useImage'
    import useLocationMap from '@/composables/useLocationMap'
    import { validationSchema } from '@/validation/propiedadSchema'

    let items = [1,2,3,4,5]

    let { url, uploadImage, image } = useImage()
    let { zoom, center, pin } = useLocationMap()

    let { handleSubmit } = useForm({ validationSchema })

    let titulo = useField('titulo')
    let imagen = useField('imagen')
    let precio = useField('precio')
    let habitaciones = useField('habitaciones')
    let baños = useField('baños')
    let parking = useField('parking')
    let descripcion = useField('descripcion')
    let piscina = useField('piscina')
</script>

<template>
    <h2 class="text-center text-h3 my-5 font-weight-bold">Editar Propiedad</h2>
</template>