<script setup>
    import { ref, computed } from 'vue'
    import { useForm, useField } from 'vee-validate'
    import { loginSchema as validationSchema } from '@/validation/loginSchema'
    import { useAuthStore } from '@/stores/auth'

    let { handleSubmit } = useForm({ validationSchema })

    let auth = useAuthStore()
    let email = useField('email')
    let password = useField('password')

    let submit = handleSubmit((values) => {
       auth.login(values)
    })
</script>

<template>
    <v-card flat max-width="600" class="mx-auto my-10">
        <v-card-title class="text-h4 font-weight-bold" tag="h3">Iniciar Sesión</v-card-title>
        <v-card-subtitle class="text-h5">Inicia Sesión con tu cuenta</v-card-subtitle>

        <v-alert v-if="auth.hasError" type="error" :title="auth.errorMsg" class="my-5"></v-alert>

        <v-form class="mt-5"> 
            <v-text-field class="mb-3" v-model="email.value.value" type="email" label="Email" bg-color="blue-grey-lighten-5" :error-messages="email.errorMessage.value"/>
            <v-text-field class="mb-3" v-model="password.value.value" type="password" label="Password" bg-color="blue-grey-lighten-5" :error-messages="password.errorMessage.value"/>

            <v-btn block color="pink-accent-3" @click="submit">
                Iniciar Sesion
            </v-btn>
        </v-form>
    </v-card>
</template>
