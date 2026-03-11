import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import authConnexion from '@/layout/authCompte/connexion.vue'
import { useAuthStore } from '@/function/stores/auth'
import { useAuthCompteStore } from '@/function/stores/auth/compte'

export const useAuthDialogStore = defineStore('authDialog', {

    state: () => ({
        resolveLogin: null
    }),

    actions: {

        getFooterButtonsConnexion() {

            const authComptes = useAuthCompteStore()

            return [
                {
                    id: 'logout',
                    label: 'Fermer',
                    icon: 'pi pi-times',
                    variant: 'outlined',
                    severity: 'danger',
                    command: () => {
                        authComptes.hide()
                        if (this.resolveLogin) {
                            this.resolveLogin(false)
                            this.resolveLogin = null
                        }
                    }
                },
                {
                    id: 'connect',
                    label: 'Connexion',
                    loadingLabel: 'Vérification en cours...',
                    severity: 'success',
                    command: () => authComptes.callComponentMethod('submit')
                }
            ]
        },

        async requireLogin() {

            const auth = useAuthStore()
            const authComptes = useAuthCompteStore()

            if (auth.isAuthenticated) {
                return true
            }

            return new Promise((resolve) => {

                this.resolveLogin = resolve

                authComptes.show(
                    null,
                    null,
                    'top',
                    "30rem",
                    markRaw(authConnexion),
                    {},
                    { footerBtn: this.getFooterButtonsConnexion() }
                )

            })
        },

        loginSuccess() {
            if (this.resolveLogin) {
                this.resolveLogin(true)
                this.resolveLogin = null
            }
        }

    }

})