<script setup>
    import { useForm, useField } from 'vee-validate'
    import { validationSchema, imageSchema } from '@/validation/propiedadSchema'
    import { collection, addDoc } from "firebase/firestore"
    import { useFirestore } from 'vuefire'
    import { useRouter } from 'vue-router'
    import useImage from '@/composables/useImage'
    import useLocationMap from '@/composables/useLocationMap'
    import "leaflet/dist/leaflet.css"
    import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"

    let items = [1,2,3,4,5]
    let db = useFirestore()
    let router = useRouter()
    let { url, uploadImage, image } = useImage()
    let { zoom, center, pin } = useLocationMap()

    let { handleSubmit } = useForm({
        validationSchema: {
            ...validationSchema,
            ...imageSchema
        }
    })

    let titulo = useField('titulo')
    let imagen = useField('imagen')
    let precio = useField('precio')
    let habitaciones = useField('habitaciones')
    let baños = useField('baños')
    let parking = useField('parking')
    let descripcion = useField('descripcion')
    let piscina = useField('piscina', null, {
        initialValue: false
    })

    let submit = handleSubmit(async(values) => {
        let { imagen, ...propiedad } = values

        let docRef = await addDoc(collection(db, "propiedades"), {
            ...propiedad,
            imagen: url.value,
            ubicacion: center.value
        })
        if(docRef.id) {
            router.push({name: 'admin-propiedades'})
        }
    })
</script>

<template>
    <v-card max-width="800" flat class="mx-auto my-10">
        <v-card-title class="text-h4 font-weight-bold" tag="h3">Nueva Propiedad</v-card-title>
        <v-card-subtitle class="text-h5 py-5">Crea una nueva propiedad rellenando el siguiente formulario</v-card-subtitle>

        <v-form class="mt-10">
            <v-text-field class="mb-5" label="Titulo propiedad" v-model="titulo.value.value" :error-messages="titulo.errorMessage.value"/>

            <v-file-input accept="image/jpeg" label="Imagen propiedad" prepend-icon="mdi-camera" class="mb-5" v-model="imagen.value.value" :error-messages="imagen.errorMessage.value" @change="uploadImage"/>

            <div v-if="image" class="my-5">
                <p class="font-weight-bold">Imagen Propiedad:</p> 
                <img class="w-50" :src="image" alt="Imagen_propiedad">   
            </div>

            <v-text-field class="mb-5" label="Precio" v-model="precio.value.value" :error-messages="precio.errorMessage.value"/>

            <v-row>
                <v-col cols="12" md="4">
                    <v-select label="Habitaciones" class="mb-5" :items="items" v-model="habitaciones.value.value" :error-messages="habitaciones.errorMessage.value">

                    </v-select>
                </v-col>
                
                <v-col cols="12" md="4">
                    <v-select label="Baños" class="mb-5" :items="items" v-model="baños.value.value" :error-messages="baños.errorMessage.value">
               
                    </v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="Plazas parking" class="mb-5" :items="items" v-model="parking.value.value" :error-messages="parking.errorMessage.value">

                    </v-select>
                </v-col>  
                
            </v-row>
            
            <v-textarea class="mb-5" label="Descripción" v-model="descripcion.value.value" :error-messages="descripcion.errorMessage.value"></v-textarea>

            <v-checkbox label="Piscina" v-model="piscina.value.value"/>

            <h2 class="font-weight-bold text-center my-5">Ubicación</h2>
            <div class="pb-10">
                <div style="height:600px">
                <LMap ref="map" v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
                    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" ></LTileLayer>
                    <LMarker :lat-lng="center" draggable @moveend="pin" />
                </LMap>
                </div>
            </div>

            <v-btn @click="submit" color="pink-accent-3" block>Crear Propiedad</v-btn>
        </v-form>
    </v-card>
</template>