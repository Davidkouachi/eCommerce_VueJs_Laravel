<template>
    <TitrePage />

    <Card class="h-full" >
        <template #header>
            <div class="flex justify-center items-center mt-5">
                <h3 class="font-semibold text-center">
                    Formulaire
                </h3>
            </div>
        </template>
        <template #content>
            <Fluid>
                <form @submit.prevent="formSubmit" class="flex flex-col gap-4 w-full">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <!-- Nom -->
                        <FloatLabel variant="on">
                            <InputText id="nom" v-model="nom" size="large" class="w-full" variant="filled" :invalid="submitted && !nom" @input="nom = nom.toUpperCase()"/>
                            <label for="nom">Nom</label>
                        </FloatLabel>

                        <!-- Prénom -->
                        <FloatLabel variant="on">
                            <InputText id="prenom" v-model="prenom" size="large" class="w-full" :invalid="submitted && !prenom" variant="filled" @input="prenom = prenom.toUpperCase()"/>
                            <label for="prenom">Prénom</label>
                        </FloatLabel>

                        <!-- Email -->
                        <FloatLabel variant="on">
                            <InputText id="email" type="email" v-model="email" size="large" class="w-full" :invalid="submitted && !email" variant="filled"/>
                            <label for="email">Email</label>
                        </FloatLabel>

                        <!-- Téléphone -->
                        <FloatLabel variant="on">
                            <InputMask id="telephone" v-model="telephone" size="large" class="w-full" mask="9999999999" inputmode="numeric" pattern="[0-9]*" :invalid="submitted && !telephone" variant="filled"/>
                            <label for="telephone">Téléphone</label>
                        </FloatLabel>

                        <!-- Titre (DR / Professeur) -->
                        <div class="flex gap-2 w-full">
                            <FloatLabel variant="on" class="flex-1">
                                <Select
                                    appendTo="body"
                                    v-model="titre_id"
                                    :options="titresOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    class="w-full"
                                    size="large"
                                    filter
                                    :loading="loadingSelectTitre"
                                    emptyMessage="Aucune donnée disponible"
                                    emptyFilterMessage="Aucun résultat trouvé"
                                    :invalid="submitted && !titre_id"
                                    variant="filled"
                                />
                                <label>Titre</label>
                            </FloatLabel>
                            <Button
                                icon="pi pi-refresh"
                                size="large"
                                severity="secondary"
                                :loading="loadingSelectTitreRefresh"
                                :disabled="loadingSelectTitreRefresh" 
                                @click="fetchTitre(true)"
                                variant="filled"
                            />
                        </div>

                        <!-- Spécialité -->
                        <div class="flex gap-2 w-full">
                            <FloatLabel variant="on" class="flex-1">
                                <Select
                                    appendTo="body"
                                    v-model="specialite_id"
                                    id="specialite_id"
                                    :options="specialiteOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    class="w-full"
                                    size="large"
                                    filter
                                    :loading="loadingSelectSpecialite"
                                    emptyMessage="Aucune donnée disponible"
                                    emptyFilterMessage="Aucun résultat trouvé"
                                    :invalid="submitted && !specialite_id"
                                    variant="filled"
                                />
                                <label for="specialite_id">Spécialité</label>
                            </FloatLabel>
                            <Button
                                icon="pi pi-refresh"
                                size="large"
                                severity="secondary"
                                :loading="loadingSelectSpecialiteRefresh"
                                :disabled="loadingSelectSpecialiteRefresh" 
                                @click="fetchSpecialite(true)"
                                variant="filled"
                            />
                        </div>

                        <!-- Numéro d’ordre -->
                        <FloatLabel variant="on">
                            <InputText id="numero_ordre" v-model="numero_ordre" size="large" class="w-full" variant="filled"/>
                            <label for="numero_ordre">Numéro d’ordre</label>
                        </FloatLabel>

                        <FloatLabel variant="on">
                            <Select
                                appendTo="body"
                                v-model="ajouterAcces"
                                :options="accesOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                size="large"
                                placeholder=""
                                variant="filled"
                            />
                            <label>Ajouter des accès ?</label>
                        </FloatLabel>

                        <template v-show="ajouterAcces" >
                            <!-- Login -->
                            <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                                <InputText
                                    v-model="login"
                                    size="large"
                                    class="w-full"
                                    :invalid="submitted && ajouterAcces && !login"
                                    variant="filled"
                                    @input="login = login.toUpperCase()"
                                />
                                <label>Login</label>
                            </FloatLabel>

                            <!-- Mot de passe -->
                            <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                                <Password appendTo="body" id="password" v-model="password" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Entrez votre mot de passe" size="large" autocomplete="off"
                                variant="filled"
                                    :invalid="
                                        submitted &&
                                        ajouterAcces &&
                                        (
                                            !password ||
                                            (cpassword && password !== cpassword)
                                        )
                                    "
                                >
                                    <template #header>
                                        <div class="font-semibold text-xm mb-4">Conditions</div>
                                    </template>
                                    <template #footer>
                                        <Divider />
                                        <ul class="pl-2 my-0 leading-normal text-sm">
                                            <li>✔ 1 minuscule</li>
                                            <li>✔ 1 majuscule</li>
                                            <li>✔ 1 chiffre</li>
                                            <li>✔ 8 caractères minimum</li>
                                        </ul>
                                    </template>
                                </Password>
                                <label for="password">Mot de passe</label>
                            </FloatLabel>

                            <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                                <Password appendTo="body" id="cpassword" v-model="cpassword" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Confirmer le mot de passe" size="large" autocomplete="off"
                                variant="filled"
                                    :invalid="
                                        submitted &&
                                        ajouterAcces &&
                                        (
                                            !cpassword ||
                                            password !== cpassword
                                        )
                                    "
                                >
                                    <template #header>
                                        <div class="font-semibold text-xm mb-4">Conditions</div>
                                    </template>
                                    <template #footer>
                                        <Divider />
                                        <ul class="pl-2 my-0 leading-normal text-sm">
                                            <li>✔ 1 minuscule</li>
                                            <li>✔ 1 majuscule</li>
                                            <li>✔ 1 chiffre</li>
                                            <li>✔ 8 caractères minimum</li>
                                        </ul>
                                    </template>
                                </Password>
                                <label for="cpassword">Confirmer le Mot de passe</label>
                            </FloatLabel>
                        </template>

                    </div>

                    <div class="flex items-center gap-2 mt-4">
                        <Checkbox v-model="checked" binary />
                        <span>Je confirme les informations</span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <div class="col-6">
                            <Button
                                icon="pi pi-times"
                                severity="danger"
                                label="Rémise à zéro"
                                size="large"
                                class="w-full"
                                :fluid="false"
                                @click="resetForm" 
                            />
                        </div>
                        <div class="col-6">
                            <Button
                                type="submit"
                                icon="pi pi-check"
                                severity="success"
                                :loading="loadingForm"
                                :label="loadingForm ? 'Opération en cours...' : 'Enregistrer'"
                                size="large"
                                class="w-full"
                                :fluid="false"
                            />
                        </div>
                    </div>
                </form>
            </Fluid>
        </template>
    </Card>

</template>

<script setup>
import { ref, onMounted, onUnmounted, computed,nextTick, watch } from 'vue';
import TitrePage from '@/layout/elements/TitrePage.vue';

import { useScript } from './script'

const {
    // ------------------ Formulaire édition
    formSubmit,
    checked,
    loadingForm,
    loadingSelectSpecialite,
    loadingSelectSpecialiteRefresh,
    loadingSelectTitre,
    loadingSelectTitreRefresh,
    submitted,

    // ------------------ Méthodes API
    fetchSpecialite,
    fetchTitre,
    resetForm,

    // ------------------ Formulaire champ
    nom,
    prenom,
    email,
    telephone,
    titre_id,
    specialite_id,
    numero_ordre,
    ajouterAcces,
    login,
    password,
    cpassword,
    titresOptions,
    accesOptions,
    specialiteOptions,

    // ------------------------- format
    onlyNumbers,

} = useScript();

onMounted(async () => {
    fetchTitre(false);
    fetchSpecialite(false);
});

</script>

<style scoped lang="scss">

</style>
