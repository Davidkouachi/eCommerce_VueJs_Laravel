<template>
    <div class="grid grid-cols-12 gap-6 mb-5">
        <div class="col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12">
            <div class="bgtb rounded-[0.5rem]">
                <div class="bg-black/50 p-4 rounded-[0.5rem]">
                    <div class="flex items-start">
                        <div class="flex flex-col p-6 text-white gap-2">
                            <span class="text-white font-semibold text-[2rem]">
                                TABLEAU DE BORD
                            </span>
                            <span class="text-white font-semibold text-[1rem]">
                                Statistiques
                            </span>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mt-5 w-full items-stretch">
                                <div v-for="(item, i) in statsTb" :key="i" class="w-full">
                                    <div class="flex items-center gap-3 min-w-0 w-full">
                                        <!-- Icône -->
                                        <div class="flex-shrink-0 flex items-center justify-center
                                                   w-14 h-14 rounded-full bg-blue-700">
                                            <i :class="['pi', item.icon, 'text-white !text-[1.5rem]']"></i>
                                        </div>
                                        <!-- Texte -->
                                        <div class="flex flex-col min-w-0 w-full">
                                            <span class="text-base font-medium truncate" :title="item.label">
                                                {{ item.label }}
                                            </span>
                                            <span class="text-lg font-semibold leading-tight">
                                                {{ item.value }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12">
            <div class="card !bg-blue-800">
                <div class="flex flex-wrap">
                    <div class="w-1/2 flex justify-start">
                        <div>
                            <div class="text-2xl text-white">Total Balance</div>
                            <div class="mt-4 flex items-center gap-2">
                                <div class="text-4xl font-semibold text-white">
                                    $673,742.90
                                </div>
                                <span class="bg-green-500 p-1 rounded-[0.5rem]">
                                    <span class="text-sm text-white">17%</span>
                                </span>
                            </div>
                            <div class="mt-2 flex items-center gap-2">
                                <span class="text-dark/70 text-white">
                                    Compared to last month
                                </span>
                                <span class="font-medium text-green-400">$148,157.94</span>
                            </div>
                        </div>
                    </div>
                    <div class="w-1/2 flex justify-end items-center hidden md:flex">
                        <div class="">
                            <i class="pi pi-wallet text-surface-0 !text-[5rem]" ></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12">
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
                <div class="flex items-center flex-col lg:flex-row lg:justify-between">
                    <div class="flex items-start flex-col md:flex-row gap-8">
                        <img src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/pageheading/kathryn.png" class="w-[6.42rem] h-[6.42rem]" />
                        <div class="flex flex-col gap-4">
                            <div class="flex items-center">
                                <span class="text-surface-900 dark:text-surface-0 font-bold text-3xl">Kathryn Murphy</span>
                            </div>
                            <div class="flex items-center flex-wrap gap-8">
                                <div>
                                    <span class="text-surface-500 dark:text-surface-300">Followers</span>
                                    <div class="text-surface-700 dark:text-surface-100 mt-1 text-sm font-semibold">333</div>
                                </div>
                                <div>
                                    <span class="text-surface-500 dark:text-surface-300">Projects</span>
                                    <div class="text-surface-700 dark:text-surface-100 mt-1 text-sm font-semibold">26</div>
                                </div>
                                <div>
                                    <span class="text-surface-500 dark:text-surface-300">Collections</span>
                                    <div class="text-surface-700 dark:text-surface-100 mt-1 text-sm font-semibold">17</div>
                                </div>
                                <div>
                                    <span class="text-surface-500 dark:text-surface-300">Shots</span>
                                    <div class="text-surface-700 dark:text-surface-100 mt-1 text-sm font-semibold">130</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 lg:mt-0 flex items-center gap-4">
                        <Button icon="pi pi-bookmark" rounded severity="secondary" />
                        <Button icon="pi pi-heart" rounded severity="secondary" />
                        <Button icon="pi pi-list" rounded severity="secondary" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-12 gap-6 mb-5">
        <div class="col-span-12 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6" v-for="item in stats" :key="item.key">
            <div class="card mb-0 h-full" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                <div class="flex justify-between mb-2">
                    <!-- Texte -->
                    <div>
                        <span class="block text-muted-color font-medium mb-4">
                            {{ item.label }}
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ item.value }}
                        </div>
                    </div>
                    <!-- Icône + sparkline -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="flex items-center justify-center rounded-border" :class="`bg-${item.color}-100 dark:bg-${item.color}-400/10`" style="width: 2.5rem; height: 2.5rem">
                            <i :class="['pi', item.icon, `text-${item.color}-500`, '!text-xl']"></i>
                        </div>
                        <div class="flex items-center gap-2" >
                            <span class="text-primary font-medium">
                                {{ item.subtitleValue }}
                            </span>
                            <!-- <span class="text-muted-color">
                                {{ item.subtitleText }}
                            </span> -->
                        </div>
                    </div>
                </div>
                <div class="w-full h-10 flex items-center">
                    <Chart
                        v-show="item.sparkData"
                        :key="item.key + '-spark'"
                        type="line"
                        :data="item.sparkData"
                        :options="sparkOptions"
                        class="w-full h-full"
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-12 gap-6 mb-5">
       <div class="col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12">
            <div class="card mb-0 h-full">
                <Tabs value="0">
                    <TabList class="flex-nowrap overflow-x-auto scrollbar-hide" >
                        <Tab value="0" as="div" class="flex items-center gap-2">
                            <i class="pi pi-home text-500 !text-xl" />
                            <span class="font-bold whitespace-nowrap">Amy Elsner</span>
                        </Tab>
                        <Tab value="1" as="div" class="flex items-center gap-2">
                            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
                            <span class="font-bold whitespace-nowrap">Onyama Limba</span>
                        </Tab>
                        <Tab v-slot="slotProps" value="2" asChild>
                            <div :class="['flex items-center gap-2', slotProps.class]" @click="slotProps.onClick" v-bind="slotProps.a11yAttrs">
                                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png" shape="circle" />
                                <span class="font-bold whitespace-nowrap">Ioni Bowcher</span>
                                <Badge value="2" />
                            </div>
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </TabPanel>
                        <TabPanel value="1">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                            ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </TabPanel>
                        <TabPanel v-slot="slotProps" value="2" asChild>
                            <div v-show="slotProps.active" :class="slotProps.class" v-bind="slotProps.a11yAttrs">
                                <p class="m-0">
                                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                                    culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                </p>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
       </div>
       <div class="col-span-12 xl:col-span-6 lg:col-span-12 md:col-span-12 sm:col-span-12">
           <div class="card mb-0 h-full" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
               <div class="flex justify-between mb-4">
                   <div>
                       <span class="block text-muted-color font-medium mb-4">Revenue</span>
                       <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                   </div>
                   <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                       <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                   </div>
               </div>
               <span class="text-primary font-medium">%52+ </span>
               <span class="text-muted-color">since last week</span>
           </div>
       </div>
       <div class="col-span-12 xl:col-span-6 lg:col-span-12 md:col-span-12 sm:col-span-12">
           <div class="card mb-0 h-full" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
               <div class="flex justify-between mb-4">
                   <div>
                       <span class="block text-muted-color font-medium mb-4">Customers</span>
                       <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                   </div>
                   <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                       <i class="pi pi-users text-cyan-500 !text-xl"></i>
                   </div>
               </div>
               <span class="text-primary font-medium">520 </span>
               <span class="text-muted-color">newly registered</span>
           </div>
       </div>
       <div class="col-span-12 xl:col-span-6 lg:col-span-12 md:col-span-12 sm:col-span-12">
           <div class="card mb-0 h-full" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
               <div class="flex justify-between mb-4">
                   <div>
                       <span class="block text-muted-color font-medium mb-4">Comments</span>
                       <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                   </div>
                   <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                       <i class="pi pi-comment text-purple-500 !text-xl"></i>
                   </div>
               </div>
               <span class="text-primary font-medium">85 </span>
               <span class="text-muted-color">responded</span>
           </div>
       </div>
       <div class="col-span-12 xl:col-span-6 lg:col-span-12 md:col-span-12 sm:col-span-12">
           <div class="card mb-0 h-full" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
               <div class="flex justify-between mb-4">
                   <div>
                       <span class="block text-muted-color font-medium mb-4">Comments</span>
                       <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                   </div>
                   <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                       <i class="pi pi-comment text-purple-500 !text-xl"></i>
                   </div>
               </div>
               <span class="text-primary font-medium">85 </span>
               <span class="text-muted-color">responded</span>
           </div>
       </div>
    </div>

    <div class="grid grid-cols-12 gap-6 mb-5">
        <div class="col-span-12">
            <div class="card mb-0">
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-9 lg:col-span-12 md:col-span-12 sm:col-span-12">
                        <div class="mb-0 h-full">
                            <Chart type="bar" :data="chartData8" :options="chartOptions8" class="h-full" />
                        </div>
                    </div>
                    <div class="col-span-12 xl:col-span-3 lg:col-span-12 md:col-span-12 sm:col-span-12">
                        <div class="grid grid-cols-12 gap-6">
                           <div class="col-span-12 xl:col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-12">
                               <div class="h-full px-5 py-5 rounded-[0.5rem] !bg-red-500" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                                   <div class="flex justify-between">
                                       <div>
                                            <span class="block text-white font-medium mb-4">Dépenses</span>
                                            <div class="text-white font-medium text-lg">
                                                - 100.000.000.000 Fcfa
                                            </div>
                                       </div>
                                       <div class="flex items-center justify-center bg-red-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                           <i class="pi pi-arrow-down-right text-red-500 !text-xl"></i>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div class="col-span-12 xl:col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-12">
                               <div class="h-full px-5 py-5 rounded-[0.5rem] !bg-green-500" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                                   <div class="flex justify-between">
                                       <div>
                                            <span class="block text-white font-medium mb-4">
                                                Bénéfices
                                            </span>
                                            <div class="text-white font-medium text-lg">
                                                + 100.000.000.000 Fcfa
                                            </div>
                                       </div>
                                       <div class="flex items-center justify-center bg-green-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                           <i class="pi pi-arrow-up-right text-green-500 !text-xl"></i>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div class="col-span-12 xl:col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-12">
                               <div class="h-full px-5 py-5 rounded-[0.5rem] !bg-blue-500" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                                   <div class="flex justify-between">
                                       <div>
                                            <span class="block text-white font-medium mb-4">
                                                Bilan
                                            </span>
                                            <div class="text-white font-medium text-lg">
                                                100.000.000.000 Fcfa
                                            </div>
                                       </div>
                                       <div class="flex items-center justify-center bg-blue-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                           <i class="pi pi-chart-line text-blue-500 !text-xl"></i>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div class="col-span-12 xl:col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-12">
                               <div class="h-full px-5 py-5 rounded-[0.5rem] !bg-blue-500" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                                   <div class="flex justify-between">
                                       <div>
                                            <span class="block text-white font-medium mb-4">
                                                Bilan
                                            </span>
                                            <div class="text-white font-medium text-lg">
                                                100.000.000.000 Fcfa
                                            </div>
                                       </div>
                                       <div class="flex items-center justify-center bg-blue-100 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                           <i class="pi pi-chart-line text-blue-500 !text-xl"></i>
                                       </div>
                                   </div>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-12 gap-6 mb-5">
        <div class="col-span-12">
            <div class="card flex flex-col gap-6 justify-center mb-0">
                <div class="text-center mt-4 mb-4 text-2xl font-bold">
                    FORMULAIRE
                </div>
                <Stepper linear value="1" v-model:value="currentStep" class="basis-full">
                    
                    <StepList >
                        <Step v-for="(step, index) in steps" :key="step.value" v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="step.value">
                            <!-- si c'est le dernier step -->
                            <div :class="index === steps.length - 1 ? 'flex flex-row pl-2' : 'flex flex-row flex-auto gap-2'" v-bind="a11yAttrs.root">
                                <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                    <span :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                    { 'bg-primary text-primary-contrast border-primary': value <= currentStep, 'border-surface-200 dark:border-surface-700': value > currentStep }
                                  ]">
                                        <i :class="step.icon" />
                                    </span>
                                </button>
                                <!-- ajouter un divider sauf pour le dernier -->
                                <Divider v-if="index !== steps.length - 1" />
                            </div>
                        </Step>
                    </StepList>

                    <StepPanels>

                        <!-- STEP 1 -->
                        <StepPanel v-slot="{ activateCallback }" value="1">
                            <div class="flex flex-col gap-3">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">
                                    Informations
                                </div>
                                <InputText v-model="form.nom" placeholder="Nom" />
                                <InputText v-model="form.prenom" placeholder="Prénom" />
                                <small class="text-red-500">{{ errors.step1 }}</small>
                            </div>

                            <div class="flex pt-6 justify-end">
                                <Button
                                    :disabled="!isStep1Valid"
                                    label="Suivant"
                                    severity="success"
                                    icon="pi pi-arrow-circle-right"
                                    iconPos="right"
                                    @click="goToStep2(activateCallback)" 
                                />
                            </div>
                        </StepPanel>

                        <!-- STEP 2 -->
                        <StepPanel v-slot="{ activateCallback }" value="2">
                            <div class="flex flex-col gap-3">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">
                                    Compte
                                </div>
                                <InputText v-model="form.email" placeholder="Email" />
                                <Password v-model="form.password" placeholder="Mot de passe" />
                                <small class="text-red-500">{{ errors.step2 }}</small>
                            </div>

                            <div class="flex pt-6 justify-between">
                                <Button 
                                    label="Retour" 
                                    severity="danger"
                                    icon="pi pi-arrow-circle-left"
                                    iconPos="left"
                                    @click="activateCallback('1')" 
                                />
                                <Button
                                    :disabled="!isStep2Valid"
                                    label="Suivant"
                                    severity="success"
                                    icon="pi pi-arrow-circle-right"
                                    iconPos="right"
                                    @click="goToStep3(activateCallback)" 
                                />
                            </div>
                        </StepPanel>

                        <!-- STEP 3 -->
                        <StepPanel v-slot="{ activateCallback }" value="3">
                            <div class="flex flex-col gap-2">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">
                                    Confirmation
                                </div>
                                <p><strong>Nom:</strong> {{ form.nom }}</p>
                                <p><strong>Prénom:</strong> {{ form.prenom }}</p>
                                <p><strong>Email:</strong> {{ form.email }}</p>
                            </div>

                            <div class="flex pt-6 justify-between">
                                <Button
                                    label="Retour"
                                    severity="danger"
                                    icon="pi pi-arrow-circle-left"
                                    iconPos="left"
                                    @click="goToStep2(activateCallback)"
                                />
                                <Button
                                    severity="warn"
                                    label="Réinitialiser"
                                    icon="pi pi-sync"
                                    iconPos="right"
                                    @click="goToStepReset(activateCallback)" 
                                />
                            </div>
                        </StepPanel>

                    </StepPanels>
                </Stepper>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'

const stats = ref([])

const statsTb = [
  { label: 'Consultations', value: 10, icon: 'pi pi-user' },
  { label: 'Examens', value: 8, icon: 'pi pi-search' },
  { label: 'Hospitalisations', value: 5, icon: 'pi pi-building' },
  { label: 'Soins Ambulatoires', value: 12, icon: 'pi pi-heart' },
];

const sparkOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
        legend: 
            { 
                display: false 
            }, 
        tooltip: 
            { 
                enabled: false 
            } 
    },
    scales: 
    { 
        x: 
            { 
                display: false 
            }, 
        y: 
            { 
                display: false 
            } 
    }
}

const getColor = (color) => ({
  blue: '#3b82f6',
  orange: '#f97316',
  cyan: '#06b6d4',
  purple: '#a855f7'
}[color])

const makeSparkData = (values, color) => ({
  labels: values.map((_, i) => i), // important !
  datasets: [
    {
      data: values,
      borderColor: color,
      backgroundColor: color + '33',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0
    }
  ]
})

const generateIncreasingSpark = (length = 7, start = 5, maxStep = 5) => {
  const spark = [start]
  for (let i = 1; i < length; i++) {
    // On ajoute un petit delta aléatoire (-maxStep à +maxStep)
    const delta = Math.floor(Math.random() * (maxStep * 2 + 1)) - maxStep
    spark.push(Math.max(0, spark[i - 1] + delta)) // éviter les valeurs négatives
  }
  return spark
}

// --------------------------------------------------------------
const chartData8 = ref();
const chartOptions8 = ref();      
const setChartData8 = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Janv', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Spet', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                type: 'line',
                label: 'Dataset 1',
                borderColor: documentStyle.getPropertyValue('--p-orange-500'),
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                data: [50, 25, 12, 48, 56, 76, 42, 12, 48, 56, 76, 42]
            },
            {
                type: 'bar',
                label: 'Dataset 2',
                backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                data: [21, 84, 24, 75, 37, 65, 34, 24, 75, 37, 65, 34],
                borderColor: 'white',
                borderWidth: 2
            },
            {
                type: 'bar',
                label: 'Dataset 3',
                backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                data: [41, 52, 24, 74, 23, 21, 32, 24, 74, 23, 21, 32]
            }
        ]
    };
};
const setChartOptions8 = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}
// --------------------------------------------------------------

const steps = [
    { value: 1, icon: 'pi pi-user' },
    { value: 2, icon: 'pi pi-key' },
    { value: 3, icon: 'pi pi-id-card' }
]

const currentStep = ref('1')

const form = reactive({
    nom: '',
    prenom: '',
    email: '',
    password: ''
})

const errors = reactive({
    step1: '',
    step2: ''
})

const validateStep1 = () => {
    if (!form.nom || !form.prenom) {
        errors.step1 = "Tous les champs sont obligatoires"
        return false
    }
    errors.step1 = ''
    return true
}

const validateStep2 = () => {
    if (!form.email || !form.password) {
        errors.step2 = "Tous les champs sont obligatoires"
        return false
    }
    errors.step2 = ''
    return true
}

const isStep1Valid = computed(() => {
    return form.nom.trim() !== '' && form.prenom.trim() !== ''
})

const isStep2Valid = computed(() => {
    return form.email.trim() !== '' && form.password.trim() !== ''
})

const goToStep2 = (activateCallback) => {
    if (validateStep1()) {
        activateCallback('2')
    }
}

const goToStep3 = (activateCallback) => {
    if (validateStep2()) {
        activateCallback('3')
    }
}

const goToStepReset = (activateCallback) => {
    // Revenir au premier step
    currentStep.value = '1'

    // Reset formulaire
    form.nom = ''
    form.prenom = ''
    form.email = ''
    form.password = ''

    // Reset erreurs
    errors.step1 = ''
    errors.step2 = ''

    activateCallback('1')
}

// --------------------------------------------------------------

onMounted(() => {
    setTimeout(() => {
        const fakeData = [
            {
              key: 'orders',
              label: 'Orders',
              value: 152,
              icon: 'pi-shopping-cart',
              color: 'blue',
              subtitleValue: '+10%',
              subtitleText: 'since last visit',
              spark: [3,7,5,8,6,9,13,15]
            },
            {
              key: 'revenue',
              label: 'Revenue',
              value: '$2.100',
              icon: 'pi-dollar',
              color: 'orange',
              subtitleValue: '+7%',
              subtitleText: 'since last week',
              spark: [30,25,27,23,14,10,5,3]
            },
            {
              key: 'customers',
              label: 'Customers',
              value: 28441,
              icon: 'pi-users',
              color: 'cyan',
              subtitleValue: '+18%',
              subtitleText: 'newly registered',
              spark: Array.from({ length: 7 }, () => Math.floor(Math.random() * 15) + 5)
            },
            {
              key: 'comments',
              label: 'Comments',
              value: '152 Unread',
              icon: 'pi-comment',
              color: 'purple',
              subtitleValue: '+19%',
              subtitleText: 'responded',
              spark: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5) // 7 
            }
        ]

          // Transforme chaque item pour Chart.js (sparkline)
          stats.value = fakeData.map(item => ({
            ...item,
            sparkData: item.spark ? {
              labels: item.spark.map((_, i) => i), // Chart.js a besoin de labels
              datasets: [
                {
                  data: item.spark,
                  borderColor: getColor(item.color),
                  backgroundColor: getColor(item.color) + '33',
                  fill: true,
                  tension: 0.4,
                  borderWidth: 2,
                  pointRadius: 0
                }
              ]
            } : null
          }))

      // Pour vérifier chaque sparkData individuellement
      // stats.value.forEach(item => {
      //   console.log(item.key, item.sparkData)
      // })
    }, 1)

    chartData8.value = setChartData8();
    chartOptions8.value = setChartOptions8();
})

</script>



