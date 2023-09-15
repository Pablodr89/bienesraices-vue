<script setup>
    import { watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useField, useForm } from 'vee-validate'
    import { useFirestore, useDocument } from 'vuefire'
    import { doc, updateDoc } from 'firebase/firestore'
    import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
    import useImage from '@/composables/useImage'
    import useLocationMap from '@/composables/useLocationMap'
    import { validationSchema } from '@/validation/propiedadSchema'
    import "leaflet/dist/leaflet.css"

    let items = [1,2,3,4,5]
    let { url, uploadImage, image } = useImage()
    let { zoom, center, pin } = useLocationMap()
    let route = useRoute()
    let router = useRouter()
    let { handleSubmit } = useForm({ validationSchema })

    let titulo = useField('titulo')
    let imagen = useField('imagen')
    let precio = useField('precio')
    let habitaciones = useField('habitaciones')
    let baños = useField('baños')
    let parking = useField('parking')
    let descripcion = useField('descripcion')
    let piscina = useField('piscina')

    // Obtener la Propiedad a editar
    let db = useFirestore()
    let docRef = doc(db, 'propiedades', route.params.id)
    let propiedad = useDocument(docRef)

    watch(propiedad, (propiedad) => {
      titulo.value.value = propiedad.titulo
      precio.value.value = propiedad.precio
      habitaciones.value.value = propiedad.habitaciones
      baños.value.value = propiedad.baños
      parking.value.value = propiedad.parking
      descripcion.value.value = propiedad.descripcion
      piscina.value.value = propiedad.piscina
      center.value = propiedad.ubicacion
    })

    let submit = handleSubmit(async(values) => {
        let { imagen, ...propiedad } = values
        if(image.value) {
            let data = {
                ...propiedad,
                imagen: url.value,
                ubicacion: center.value
            }
            await updateDoc(docRef, data)
        } else {
            let data = {
                ...propiedad,
                ubicacion: center.value
            }
            await updateDoc(docRef, data)
        }
        router.push({name: 'admin-propiedades'})
    })
</script>

<template>
    <v-card max-width="800" flat class="mx-auto my-10">
        <v-card-title class="mt-5">
            <h1 class="text-h4 font-weight-bold">Editar Propiedad</h1>
        </v-card-title>
        <v-card-subtitle > 
            <p class="text-h5">Edita los detalles de la propiedad</p>
        </v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field v-model="titulo.value.value" :error-messages="titulo.errorMessage.value" label="Titulo" class="mb-5"></v-text-field>

            <v-file-input v-model="imagen.value.value" :error-messages="imagen.errorMessage.value" accept="image/jpeg" prepend-icon="mdi-camera" label="Fotografía" class="mb-5" @change="uploadImage"></v-file-input>

            <div class="my-5">
                <p class="font-weight-bold">Imagen Actual:</p>
                <img v-if="image" :src="image" class="w-50">
                <img v-else :src="propiedad?.imagen" class="w-50">
            </div>

            <v-text-field v-model="precio.value.value" :error-messages="precio.errorMessage.value" label="Precio" class="mb-5"
            ></v-text-field>

            <v-row>
                <v-col cols="12" md="4">
                    <v-select label="Habitaciones" class="mb-5" :items="items" v-model="habitaciones.value.value" :error-messages="habitaciones.errorMessage.value"/>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="Baños" class="mb-5" :items="items" v-model="baños.value.value" :error-messages="baños.errorMessage.value"/>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="Plazas de parking" class="mb-5" :items="items" v-model="parking.value.value" :error-messages="parking.errorMessage.value"/>
                </v-col>
            </v-row>

            <v-textarea v-model="descripcion.value.value" :error-messages="descripcion.errorMessage.value" label="Descripción" class="mb-5"></v-textarea>

            <v-checkbox v-model="piscina.value.value" label="Piscina"></v-checkbox>

            <h2 class="font-weight-bold text-center my-5">Ubicación</h2>
            <div class="pb-10">
                <div style="height:600px">
                    <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
                        <LMarker :lat-lng="center" draggable @moveend="pin"/>
                        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
                    </LMap>
                </div>
            </div>

            <v-btn color="pink-accent-3" block @click="submit">Guardar Cambios</v-btn>
        </v-form>
</v-card>
</template>