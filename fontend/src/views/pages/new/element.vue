<template>
    <ConfirmDialog group="headless" :style="{ width: '25rem' }">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
                <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                    <i class="pi pi-question !text-4xl"></i>
                </div>
                <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                <p class="mb-0">{{ message.message }}</p>
                <div class="flex items-center gap-2 mt-6">
                    <Button label="Save" @click="acceptCallback"></Button>
                    <Button label="Cancel" variant="outlined" @click="rejectCallback"></Button>
                </div>
            </div>
        </template>
    </ConfirmDialog>
    <div class="card flex justify-center">
        <Button @click="requireConfirmation()" label="Save"></Button>
    </div>
    <Toast />
    <div class="card flex justify-center">
        <Button label="Login" icon="pi pi-user" @click="visible = true" />

        <Dialog :dismissableMask="false" v-model:visible="visible" pt:root:class="!border-0 !bg-transparent" pt:mask:class="backdrop-blur-sm !pointer-events-auto">
            <template #container="{ closeCallback }">
                <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl" style="background-image: radial-gradient(circle at left top, var(--p-primary-400), var(--p-primary-700))">
                    <Avatar icon="pi pi-user" class="block mx-auto" size="xlarge" shape="circle" />
                    <div class="inline-flex flex-col gap-2">
                        <label for="username" class="text-primary-50 font-semibold">Username</label>
                        <InputText id="username" class="!bg-white/20 !border-0 !p-4 !text-primary-50 w-80"></InputText>
                    </div>
                    <div class="inline-flex flex-col gap-2">
                        <label for="password" class="text-primary-50 font-semibold">Password</label>
                        <InputText id="password" class="!bg-white/20 !border-0 !p-4 !text-primary-50 w-80" type="password"></InputText>
                    </div>
                    <div class="flex items-center gap-4">
                        <Button label="Cancel" @click="closeCallback" variant="text" class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"></Button>
                        <Button label="Sign-In" @click="closeCallback" variant="text" class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"></Button>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
    <div class="card flex flex-wrap justify-center items-end gap-4">
        <FloatLabel class="w-full md:w-80" variant="in">
            <MultiSelect id="in_label" v-model="value1" :options="cities" optionLabel="name" filter :maxSelectedLabels="3" class="w-full" variant="filled" />
            <label for="in_label">In Label</label>
        </FloatLabel>
    </div>
    <div class="card flex flex-wrap justify-center items-stretch gap-4">
        <FloatLabel class="w-full md:w-80" variant="in">
            <Select v-model="value2" inputId="in_label" :options="cities2" optionLabel="name" class="w-full" variant="filled" filter />
            <label for="in_label">In Label</label>
        </FloatLabel>
    </div>
    <div class="card flex justify-center">
        <Select v-model="selectedCountry" :options="countries" optionLabel="name" placeholder="Chargement en cours" class="w-full md:w-80" size="large" :loading="true">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                    <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
                    <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex items-center">
                    <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
            <template #dropdownicon>
                <i class="pi pi-map" />
            </template>
            <template #header>
                <div class="font-medium p-3">Available Countries</div>
            </template>
            <template #footer>
                <div class="p-3">
                    <Button label="Add New" fluid severity="secondary" variant="text" size="small" icon="pi pi-plus" />
                </div>
            </template>
        </Select>
    </div>
    <div class="card flex justify-center">
        <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
                <RadioButton v-model="ingredient" inputId="ingredient1" name="pizza" value="Cheese" />
                <label for="ingredient1">Cheese</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton v-model="ingredient" inputId="ingredient2" name="pizza" value="Mushroom" />
                <label for="ingredient2">Mushroom</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton v-model="ingredient" inputId="ingredient3" name="pizza" value="Pepper" />
                <label for="ingredient3">Pepper</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton v-model="ingredient" inputId="ingredient4" name="pizza" value="Onion" />
                <label for="ingredient4">Onion</label>
            </div>
        </div>
    </div>
    <div class="card flex flex-wrap justify-center items-end gap-4">
        <FloatLabel variant="in">
            <Textarea id="in_label" v-model="Textarea1" rows="5" cols="30" style="resize: none" />
            <label for="in_label">In Label</label>
        </FloatLabel>

        <FloatLabel variant="on">
            <Textarea id="on_label" v-model="Textarea2" rows="5" cols="30" style="resize: none" />
            <label for="on_label">On Label</label>
        </FloatLabel>

        <IftaLabel>
            <Textarea id="description" v-model="Textarea3" rows="5" cols="30" style="resize: none" />
            <label for="description">Description</label>
        </IftaLabel>
    </div>
    <div class="card flex justify-center">
        <ToggleButton v-model="checked" onLabel="Locked" offLabel="Unlocked" onIcon="pi pi-lock" offIcon="pi pi-lock-open" class="w-36" aria-label="Do you confirm" />
    </div>
    <div class="card flex justify-center">
        <ToggleSwitch v-model="checkedBtn">
            <template #handle="{ checkedBtn }">
                <i :class="['!text-xs pi', { 'pi-check': checkedBtn, 'pi-times': !checkedBtn }]" />
            </template>
        </ToggleSwitch>
    </div>
    <div class="card">
        <Timeline :value="events" align="alternate" class="customized-timeline">
            <template #marker="slotProps">
                <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: slotProps.item.color }">
                    <i :class="slotProps.item.icon"></i>
                </span>
            </template>
            <template #content="slotProps">
                <Card class="mt-4">
                    <template #title>
                        {{ slotProps.item.status }}
                    </template>
                    <template #subtitle>
                        {{ slotProps.item.date }}
                    </template>
                    <template #content>
                        <img v-if="slotProps.item.image" :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.item.image}`" :alt="slotProps.item.name" width="200" class="shadow-sm" />
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
                            neque quas!
                        </p>
                        <Button label="Read more" variant="text"></Button>
                    </template>
                </Card>
            </template>
        </Timeline>
    </div>
    <div class="card flex flex-wrap gap-12">
        <Timeline :value="events2" class="w-full md:w-80">
            <template #content="slotProps">
                {{ slotProps.item.status }}
            </template>
        </Timeline>

        <Timeline :value="events2" align="right" class="w-full md:w-80">
            <template #content="slotProps">
                {{ slotProps.item.status }}
            </template>
        </Timeline>

        <Timeline :value="events2" align="alternate" class="w-full md:w-80">
            <template #content="slotProps">
                {{ slotProps.item.status }}
            </template>
        </Timeline>
    </div>
    <div class="card">
        <div class="flex gap-2 justify-center">
            <Button icon="pi pi-arrow-right" @click="visibleLeft = true" />
            <Button icon="pi pi-arrow-left" @click="visibleRight = true" />
            <Button icon="pi pi-arrow-down" @click="visibleTop = true" />
            <Button icon="pi pi-arrow-up" @click="visibleBottom = true" />
            <Button icon="pi pi-window-maximize" @click="visibleFull = true" />
            <Button icon="pi pi-plus" @click="visibleLogin = true" />
            <Button icon="pi pi-bars" @click="visibleMenu = true" />
        </div>

        <Drawer v-model:visible="visibleMenu">
            <template #container="{ closeCallback }">
                <div class="flex flex-col h-full">
                    <div class="flex items-center justify-between px-6 pt-4 shrink-0">
                        <span class="inline-flex items-center gap-2">
                            <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                                    fill="var(--p-primary-color)"
                                />
                                <path
                                    d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                                    fill="var(--p-text-color)"
                                />
                            </svg>
                            <span class="font-semibold text-2xl text-primary">Your Logo</span>
                        </span>
                        <span>
                            <Button type="button" @click="closeCallback" icon="pi pi-times" rounded variant="outlined"></Button>
                        </span>
                    </div>
                    <div class="overflow-y-auto">
                        <ul class="list-none p-4 m-0">
                            <li>
                                <div
                                    v-ripple
                                    v-styleclass="{
                                        selector: '@next',
                                        enterFromClass: 'hidden',
                                        enterActiveClass: 'animate-slidedown',
                                        leaveToClass: 'hidden',
                                        leaveActiveClass: 'animate-slideup'
                                    }"
                                    class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400 cursor-pointer p-ripple"
                                >
                                    <span class="font-medium">FAVORITES</span>
                                    <i class="pi pi-chevron-down"></i>
                                </div>
                                <ul class="list-none p-0 m-0 overflow-hidden">
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-home mr-2"></i>
                                            <span class="font-medium">Dashboard</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-bookmark mr-2"></i>
                                            <span class="font-medium">Bookmarks</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            v-ripple
                                            v-styleclass="{
                                                selector: '@next',
                                                enterFromClass: 'hidden',
                                                enterActiveClass: 'animate-slidedown',
                                                leaveToClass: 'hidden',
                                                leaveActiveClass: 'animate-slideup'
                                            }"
                                            class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                                        >
                                            <i class="pi pi-chart-line mr-2"></i>
                                            <span class="font-medium">Reports</span>
                                            <i class="pi pi-chevron-down ml-auto"></i>
                                        </a>
                                        <ul class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out">
                                            <li>
                                                <a
                                                    v-ripple
                                                    v-styleclass="{
                                                        selector: '@next',
                                                        enterFromClass: 'hidden',
                                                        enterActiveClass: 'animate-slidedown',
                                                        leaveToClass: 'hidden',
                                                        leaveActiveClass: 'animate-slideup'
                                                    }"
                                                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                                                >
                                                    <i class="pi pi-chart-line mr-2"></i>
                                                    <span class="font-medium">Revenue</span>
                                                    <i class="pi pi-chevron-down ml-auto"></i>
                                                </a>
                                                <ul class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out">
                                                    <li>
                                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                                            <i class="pi pi-table mr-2"></i>
                                                            <span class="font-medium">View</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                                            <i class="pi pi-search mr-2"></i>
                                                            <span class="font-medium">Search</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                                    <i class="pi pi-chart-line mr-2"></i>
                                                    <span class="font-medium">Expenses</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-users mr-2"></i>
                                            <span class="font-medium">Team</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-comments mr-2"></i>
                                            <span class="font-medium">Messages</span>
                                            <span class="inline-flex items-center justify-center ml-auto bg-primary text-primary-contrast rounded-full" style="min-width: 1.5rem; height: 1.5rem">3</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-calendar mr-2"></i>
                                            <span class="font-medium">Calendar</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-cog mr-2"></i>
                                            <span class="font-medium">Settings</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <ul class="list-none p-4 m-0">
                            <li>
                                <div
                                    v-ripple
                                    v-styleclass="{
                                        selector: '@next',
                                        enterFromClass: 'hidden',
                                        enterActiveClass: 'animate-slidedown',
                                        leaveToClass: 'hidden',
                                        leaveActiveClass: 'animate-slideup'
                                    }"
                                    class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400 cursor-pointer p-ripple"
                                >
                                    <span class="font-medium">APPLICATION</span>
                                    <i class="pi pi-chevron-down"></i>
                                </div>
                                <ul class="list-none p-0 m-0 overflow-hidden">
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-folder mr-2"></i>
                                            <span class="font-medium">Projects</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-chart-bar mr-2"></i>
                                            <span class="font-medium">Performance</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a v-ripple class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                                            <i class="pi pi-cog mr-2"></i>
                                            <span class="font-medium">Settings</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-auto">
                        <hr class="mb-4 mx-4 border-t border-0 border-surface-200 dark:border-surface-700" />
                        <a v-ripple class="m-4 flex items-center cursor-pointer p-4 gap-2 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple">
                            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                            <span class="font-bold">Amy Elsner</span>
                        </a>
                    </div>
                </div>
            </template>
        </Drawer>

        <Drawer v-model:visible="visibleLogin">
            <template #header>
                <div class="flex items-center gap-2">
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                    <span class="font-bold">Amy Elsner</span>
                </div>
            </template>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <template #footer>
                <div class="flex items-center gap-2">
                    <Button label="Account" icon="pi pi-user" class="flex-auto" variant="outlined"></Button>
                    <Button label="Logout" icon="pi pi-sign-out" class="flex-auto" severity="danger" text></Button>
                </div>
            </template>
        </Drawer>

        <Drawer v-model:visible="visibleFull" header="Drawer" position="full">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </Drawer>

        <Drawer v-model:visible="visibleLeft" header="Left Drawer" class="!w-full md:!w-80 lg:!w-[30rem]">
            <p> & Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </Drawer>

        <Drawer v-model:visible="visibleRight" header="Right Drawer" position="right">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </Drawer>

        <Drawer v-model:visible="visibleTop" header="Top Drawer" position="top" style="height: auto">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </Drawer>

        <Drawer v-model:visible="visibleBottom" header="Bottom Drawer" position="bottom" style="height: auto">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </Drawer>
    </div>
    <div class="card">
        <FileUpload
            name="demo[]"
            url="/api/upload"
            @upload="onTemplatedUpload"
            :multiple="true"
            accept="image/*"
            :maxFileSize="MAX_FILE_SIZE"
            @select="onSelectedFiles"
            :fileLimit="20"
        >
            <!-- HEADER -->
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files: headerFiles }">
                <div class="flex flex-col justify-between items-start flex-1 gap-4">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback()" label="Choisir" icon="pi pi-images" rounded />

                        <Button
                            @click="
                                clearCallback();
                                onClearTemplatingUpload(clearCallback);
                            "
                            label="Tout supprimer"
                            icon="pi pi-times"
                            rounded
                            severity="danger"
                            :disabled="!headerFiles || headerFiles.length === 0"
                        />
                    </div>

                    <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                        <div class="flex flex-wrap sm:flex-row gap-2 ">
                            <Chip icon="pi pi-google" removable>
                                Taille total des images inférieur ou égale à {{ formatSize(MAX_TOTAL_SIZE) }}
                            </Chip>

                            <Chip icon="pi pi-google" removable>
                                1 image est inférieur ou égale à {{ formatSize(MAX_FILE_SIZE) }}
                            </Chip>
                        </div>
                    </div>

                    <ProgressBar :value="totalSizePercent" :showValue="true" class="md:w-20rem w-full md:ml-auto h-1">
                        <span>{{ formatSize(totalBytes) }} / {{ formatSize(MAX_TOTAL_SIZE) }}</span>
                    </ProgressBar>
                </div>
            </template>

            <!-- CONTENT quand fichiers déjà présents -->
            <template #content="{ files: contentFiles, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div
                    class="flex flex-col gap-8 pt-4"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                >
                    <div v-if="contentFiles.length > 0">
                        <h5>En attente</h5>

                        <div class="flex flex-wrap gap-4">
                            <div
                                v-for="(file, index) in contentFiles"
                                :key="file.name + file.type + file.size"
                                class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
                            >
                                <img :src="file.objectURL" width="100" height="50" />
                                <span class="font-semibold max-w-60 text-ellipsis overflow-hidden">
                                    {{ file.name }}
                                </span>
                                <div>{{ formatSize(file.size) }}</div>

                                <Button
                                    icon="pi pi-times"
                                    @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                                    rounded
                                    severity="danger"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- EMPTY quand aucun fichier -->
            <template #empty="{ chooseCallback }">
                <div
                    class="flex items-center justify-center flex-col w-full h-full"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                >
                    <i class="pi pi-cloud-upload border-2 rounded-full p-8 text-4xl text-muted-color" />
                    <p class="mt-6 mb-0">Glissez des fichiers ici.</p>
                </div>
            </template>
        </FileUpload>
    </div>
    <div class="card flex flex-col items-center gap-6">
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />
        <img v-if="src" :src="src" alt="Image" class="shadow-md rounded-xl w-full sm:w-64" style="filter: grayscale(100%)" />
    </div>
    <div class="card flex flex-col items-center justify-center">
        <Button label="Show" @click="showMessage" :disabled="visible" class="mb-4" />
        <Message v-if="visibleMessage" severity="success" :life="3000">Auto Disappear Message</Message>
    </div>
    <div class="card flex flex-wrap gap-8">
        <div class="flex-auto">
            <h5>Label</h5>
            <Avatar label="P" class="mr-2" size="xlarge" />
            <Avatar label="V" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" />
            <Avatar label="U" class="mr-2" style="background-color: #dee9fc; color: #1a2551" />
        </div>

        <div class="flex-auto">
            <h5>Circle</h5>
            <Avatar label="P" class="mr-2" size="xlarge" shape="circle" />
            <Avatar label="V" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <Avatar label="U" class="mr-2" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
        </div>

        <div class="flex-auto">
            <h5>Badge</h5>
            <OverlayBadge value="4" severity="danger" class="inline-flex">
                <Avatar label="U" size="xlarge" />
            </OverlayBadge>
        </div>
    </div>
    <div class="card">
        <div class="flex flex-wrap gap-8">
            <div class="flex-auto">
                <h5>Icon</h5>
                <Avatar icon="pi pi-user" class="mr-2" size="xlarge" />
                <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" />
                <Avatar icon="pi pi-user" style="background-color: #dee9fc; color: #1a2551" />
            </div>

            <div class="flex-auto">
                <h5>Circle</h5>
                <Avatar icon="pi pi-user" class="mr-2" size="xlarge" shape="circle" />
                <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                <Avatar icon="pi pi-user" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
            </div>

            <div class="flex-auto">
                <h5>Badge</h5>
                <OverlayBadge value="4" severity="danger" class="inline-flex">
                    <Avatar icon="pi pi-user" size="xlarge" />
                </OverlayBadge>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="flex flex-wrap gap-8">
            <div class="flex-auto">
                <h5>Image</h5>
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" size="xlarge" shape="circle" />
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png" class="mr-2" size="large" shape="circle" />
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
            </div>

            <div class="flex-auto">
                <h5>Badge</h5>
                <OverlayBadge value="4" severity="danger" class="inline-flex">
                    <Avatar class="p-overlay-badge" image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" size="xlarge" />
                </OverlayBadge>
            </div>

            <div class="flex-auto">
                <h5>Gravatar</h5>
                <Avatar image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp" class="flex items-center justify-center mr-2" size="xlarge" />
            </div>
        </div>
    </div>
    <div class="card flex justify-center">
        <AvatarGroup>
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png" shape="circle" />
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png" shape="circle" />
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png" shape="circle" />
            <Avatar label="+2" shape="circle" />
        </AvatarGroup>
    </div>
    <div class="card flex flex-wrap justify-center gap-6">
        <OverlayBadge value="2">
            <i class="pi pi-bell" style="font-size: 2rem" />
        </OverlayBadge>
        <OverlayBadge value="4" severity="danger">
            <i class="pi pi-calendar" style="font-size: 2rem" />
        </OverlayBadge>
        <OverlayBadge severity="danger">
            <i class="pi pi-envelope" style="font-size: 2rem" />
        </OverlayBadge>
    </div>
    <div class="card flex justify-center flex-wrap gap-4">
        <Button type="button" label="Notifications" icon="pi pi-bell" badge="2" />
        <Button type="button" label="Inbox" icon="pi pi-inbox" badge="2" badgeSeverity="contrast" variant="outlined" />
    </div>
    <div class="card flex flex-wrap justify-center gap-2">
        <Badge value="2"></Badge>
        <Badge value="6" severity="secondary"></Badge>
        <Badge value="8" severity="success"></Badge>
        <Badge value="4" severity="info"></Badge>
        <Badge value="9" severity="warn"></Badge>
        <Badge value="3" severity="danger"></Badge>
        <Badge value="5" severity="contrast"></Badge>
    </div>
    <div class="card flex flex-wrap justify-center items-end gap-2">
        <Badge value="8" size="xlarge" severity="success"></Badge>
        <Badge value="6" size="large" severity="warn"></Badge>
        <Badge value="4" severity="info"></Badge>
        <Badge value="2" size="small"></Badge>
    </div>
    <div class="card flex flex-wrap gap-2">
        <Chip label="Apple" icon="pi pi-apple" />
        <Chip label="Facebook" icon="pi pi-facebook" />
        <Chip label="Google" icon="pi pi-google" />
        <Chip label="Microsoft" icon="pi pi-microsoft" removable />
        <Chip label="GitHub" icon="pi pi-github" removable>
            <template #removeicon="{ removeCallback, keydownCallback }">
                <i class="pi pi-minus-circle" @click="removeCallback" @keydown="keydownCallback" />
            </template>
        </Chip>
    </div>
    <!-- <div class="card flex flex-wrap gap-2">
        <Chip label="Amy Elsner" image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" />
        <Chip label="Asiya Javayant" image=https://primefaces.org/cdn/primevue"/images/avatar/asiyajavayant.png" />
        <Chip label="Onyama Limba" image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" />
        <Chip label="Xuxue Feng" image="https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png" removable />
    </div> -->
    <div class="card">
        <Chip class="py-0 pl-0 pr-4">
            <span class="bg-primary text-primary-contrast rounded-full w-8 h-8 flex items-center justify-center">P</span>
            <span class="ml-2 font-medium">PRIME</span>
        </Chip>
    </div>
    <div class="card">
        <MeterGroup :value="valueMetric" labelPosition="start">
            <template #label="{ value }">
                <div class="flex flex-wrap gap-4">
                    <template v-for="val of value">
                    <!-- <template v-for="val of value" :key="i"> -->
                        <Card class="flex-1 border border-surface shadow-none">
                            <template #content>
                                <div class="flex justify-between gap-8">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-surface-500 dark:text-surface-400 text-sm">{{ val.label }}</span>
                                        <span class="font-bold text-lg">{{ val.value }}%</span>
                                    </div>
                                    <span class="w-8 h-8 rounded-full inline-flex justify-center items-center text-center" :style="{ backgroundColor: `${val.color1}`, color: '#ffffff' }">
                                        <i :class="val.icon" />
                                    </span>
                                </div>
                            </template>
                        </Card>
                    </template>
                </div>
            </template>
            <template #meter="slotProps">
                <span :class="slotProps.class" :style="{ background: `linear-gradient(to right, ${slotProps.value.color1}, ${slotProps.value.color2})`, width: slotProps.size }" />
            </template>
            <template #start="{ totalPercent }">
                <div class="flex justify-between mt-4 mb-2 relative">
                    <span>Storage</span>
                    <span :style="{ width: totalPercent + '%' }" class="absolute text-right">{{ totalPercent }}%</span>
                    <span class="font-medium">1TB</span>
                </div>
            </template>
            <template #end>
                <div class="flex justify-between mt-4">
                    <Button label="Manage Storage" variant="outlined" size="small" />
                    <Button label="Update Plan" size="small" />
                </div>
            </template>
        </MeterGroup>
    </div>
    <div class="card">
        <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
    <div class="card flex justify-center">
        <ScrollPanel style="width: 250px; height: 200px">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae et leo duis ut diam. Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur adipiscing
                elit ut. Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor augue mauris. Semper
                feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet nisl purus. Cursus sit amet
                dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas. Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris. Eget egestas purus viverra accumsan in nisl nisi.
                Suscipit adipiscing bibendum est ultricies integer. Mattis aliquam faucibus purus in massa tempor nec.
            </p>
            <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" :buttonProps="{ severity: 'contrast', raised: true, rounded: true }" />
        </ScrollPanel>
    </div>
    <div class="card">
        <div class="flex flex-wrap">
            <div class="w-full xl:w-6/12 p-4">
                <h5>Rectangle</h5>
                <Skeleton class="mb-2"></Skeleton>
                <Skeleton width="10rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="10rem" height="4rem"></Skeleton>
            </div>
            <div class="w-full xl:w-6/12 p-4">
                <h5>Rounded</h5>
                <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
                <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
                <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
                <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
                <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
            </div>
            <div class="w-full xl:w-6/12 p-4">
                <h5 class="mt-4">Square</h5>
                <div class="flex items-end">
                    <Skeleton size="2rem" class="mr-2"></Skeleton>
                    <Skeleton size="3rem" class="mr-2"></Skeleton>
                    <Skeleton size="4rem" class="mr-2"></Skeleton>
                    <Skeleton size="5rem"></Skeleton>
                </div>
            </div>
            <div class="w-full xl:w-6/12 p-4">
                <h5 class="mt-4">Circle</h5>
                <div class="flex items-end">
                    <Skeleton shape="circle" size="2rem" class="mr-2"></Skeleton>
                    <Skeleton shape="circle" size="3rem" class="mr-2"></Skeleton>
                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                    <Skeleton shape="circle" size="5rem"></Skeleton>
                </div>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
            <div class="flex mb-4">
                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
            <Skeleton width="100%" height="150px"></Skeleton>
            <div class="flex justify-between mt-4">
                <Skeleton width="4rem" height="2rem"></Skeleton>
                <Skeleton width="4rem" height="2rem"></Skeleton>
            </div>
        </div>
    </div>
    <div class="card rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
        <ul class="m-0 p-0 list-none">
            <li class="mb-4">
                <div class="flex">
                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                    <div class="self-center" style="flex: 1">
                        <Skeleton width="100%" class="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
            </li>
            <li class="mb-4">
                <div class="flex">
                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                    <div class="self-center" style="flex: 1">
                        <Skeleton width="100%" class="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
            </li>
            <li class="mb-4">
                <div class="flex">
                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                    <div class="self-center" style="flex: 1">
                        <Skeleton width="100%" class="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
            </li>
            <li>
                <div class="flex">
                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                    <div class="self-center" style="flex: 1">
                        <Skeleton width="100%" class="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div class="card">
        <DataTable :value="products">
            <Column field="code" header="Code">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="name" header="Name">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="category" header="Category">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="quantity" header="Quantity">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
        </DataTable>
    </div>
    <div class="card flex flex-wrap justify-center gap-2">
        <Tag value="Primary"></Tag>
        <Tag severity="secondary" value="Secondary"></Tag>
        <Tag severity="success" value="Success"></Tag>
        <Tag severity="info" value="Info"></Tag>
        <Tag severity="warn" value="Warn"></Tag>
        <Tag severity="danger" value="Danger"></Tag>
        <Tag severity="contrast" value="Contrast"></Tag>
    </div>
    <div class="card flex justify-center">
        <div v-if="visibleHeadless" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-999">
        </div>
        <Toast position="top-center" group="headless" @close="visibleHeadless = false" class="z-100">
            <template #container="{ message, closeCallback }">
                <section class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
                    <div class="flex items-center gap-5">
                        <i class="pi pi-cloud-upload text-white dark:text-black text-2xl"></i>
                        <span class="font-bold text-base text-white dark:text-black">{{ message.summary }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ProgressBar :value="progressHeadless" :showValue="false" :style="{ height: '4px' }" pt:value:class="!bg-primary-50 dark:!bg-primary-900" class="!bg-primary/80"></ProgressBar>
                        <label class="text-sm font-bold text-white dark:text-black">{{ progressHeadless }}% uploaded</label>
                    </div>
                    <div class="flex gap-4 mb-4 justify-end">
                        <Button label="Another Upload?" size="small" @click="closeCallback"></Button>
                        <Button label="Cancel" size="small" @click="closeCallback"></Button>
                    </div>
                </section>
            </template>
        </Toast>
        <Button @click="showHeadless" label="View" />
    </div>
</template>

<script setup>
import FileUpload from 'primevue/fileupload';
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { usePrimeVue } from 'primevue/config';

const confirm = useConfirm();
const toast = useToast();
const $primevue = usePrimeVue();
// --------------------------------------------------------------
const requireConfirmation = () => {
    confirm.require({
        group: 'headless',
        header: 'Are you sure?',
        message: 'Please confirm to proceed.',
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};
// --------------------------------------------------------------
const visible = ref(false);
// --------------------------------------------------------------
const value1 = ref(null);
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
// --------------------------------------------------------------
const value2 = ref(null);
const cities2 = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
// --------------------------------------------------------------
const selectedCountry = ref();
const countries = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);
// --------------------------------------------------------------
const ingredient = ref('');
// --------------------------------------------------------------
const Textarea1 = ref('');
const Textarea2 = ref('');
const Textarea3 = ref('');
// --------------------------------------------------------------
const checked = ref(false);
// --------------------------------------------------------------
const checkedBtn = ref(false);
// --------------------------------------------------------------
const events = ref([
    { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
]);
// --------------------------------------------------------------
const events2 = ref([
    { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0'},
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
]);
// --------------------------------------------------------------
const visibleLeft = ref(false);
const visibleRight = ref(false);
const visibleTop = ref(false);
const visibleBottom = ref(false);
const visibleFull = ref(false);
const visibleLogin = ref(false);
const visibleMenu = ref(false);
// --------------------------------------------------------------
const MAX_TOTAL_SIZE = (1024 * 1024) * 2; // 1 MB réel
const MAX_FILE_SIZE = 1024 * 1024;  // idem
const files = ref([]);        // fichiers sélectionnés
const totalBytes = ref(0);    // taille totale en octets
const totalSizePercent = computed(() =>
  Math.min(100, (totalBytes.value / MAX_TOTAL_SIZE) * 100)
);
const formatSize = (bytes) => (bytes / 1024 / 1024).toFixed(2) + " MB";
const recalcTotalSize = () => {
  totalBytes.value = files.value.reduce((sum, f) => sum + f.size, 0);
};
const onSelectedFiles = (event) => {
  // fichiers nouvellement sélectionnés seulement
  const incomingFiles = event.originalEvent?.target?.files || [];

  const rejectedFiles = [];
  const acceptedFiles = [];

  for (const file of incomingFiles) {
    // doublon ?
    if (files.value.some(f => f.name === file.name)) {
      rejectedFiles.push({
        name: file.name,
        reason: `Un fichier avec le même nom existe déjà`
      });
      continue;
    }

    // taille max par fichier
    if (file.size > MAX_FILE_SIZE) {
      rejectedFiles.push({
        name: file.name,
        reason: `Fichier trop volumineux (${formatSize(file.size)} > ${formatSize(MAX_FILE_SIZE)})`
      });
      continue;
    }

    // taille totale
    if (totalBytes.value + file.size > MAX_TOTAL_SIZE) {
      rejectedFiles.push({
        name: file.name,
        reason: `La taille totale serait dépassée (${formatSize(totalBytes.value + file.size)} / ${formatSize(MAX_TOTAL_SIZE)})`
      });
      continue;
    }

    // accepté
    acceptedFiles.push(file);
    totalBytes.value += file.size;
  }

  // ajouter au tableau local
  files.value.push(...acceptedFiles);

  // mettre à jour FileUpload
  event.files.length = 0;
  files.value.forEach(f => event.files.push(f));

    if (rejectedFiles.length > 0) {
      const msg = rejectedFiles
        .map(f => `• ${f.name} : ${f.reason}`)
        .join("\n");

      toast.add({
        severity: "warn",
        summary: "Certains fichiers ont été rejetés",
        detail: msg,
        life: 6000,
      });
    }
};
const handleDrop = (e) => {
    const filesDropped = e.dataTransfer?.files || [];
    if (!filesDropped.length) return;

    onSelectedFiles({
        originalEvent: { target: { files: filesDropped } },
        files: []
    });
};
const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);       // PrimeVue supprime le fichier interne
  files.value.splice(index, 1);    // supprime aussi du tableau local
  recalcTotalSize();               // recalcul exact de la taille
};
const onClearTemplatingUpload = (clear) => {
  clear();          // PrimeVue supprime tout
  files.value = [];  // réinitialiser le tableau local
  totalBytes.value = 0;
};
const uploadEvent = (callback) => {
  callback();
};
const onTemplatedUpload = () => {
  toast.add({
    severity: "success",
    summary: "Succès",
    detail: "Fichiers uploadés",
    life: 6000,
  });
};
// --------------------------------------------------------------
const src = ref(null);
function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        src.value = e.target.result;
    };

    reader.readAsDataURL(file);
}
// --------------------------------------------------------------
let visibleMessage = ref(false);
const showMessage = () => {
    visibleMessage.value = true;

    setTimeout(() => {
        visibleMessage.value = false;
    }, 3500);
}
// --------------------------------------------------------------
const valueMetric = ref([
    { label: 'Apps', color1: '#34d399', color2: '#fbbf24', value: 25, icon: 'pi pi-table' },
    { label: 'Messages', color1: '#fbbf24', color2: '#60a5fa', value: 15, icon: 'pi pi-inbox' },
    { label: 'Media', color1: '#60a5fa', color2: '#c084fc', value: 20, icon: 'pi pi-image' },
    { label: 'System', color1: '#c084fc', color2: '#c084fc', value: 10, icon: 'pi pi-cog' }
]);
// --------------------------------------------------------------
const products = ref(new Array(4));
// --------------------------------------------------------------
const visibleHeadless = ref(false);
const progressHeadless = ref(0);
const intervalHeadless = ref();
const showHeadless = () => {
    if (!visibleHeadless.value) {
        toast.add({ severity: 'custom', summary: 'Uploading your files.', group: 'headless', styleClass: 'backdrop-blur-lg rounded-2xl' });
        visibleHeadless.value = true;
        progressHeadless.value = 0;

        if (intervalHeadless.value) {
            clearInterval(intervalHeadless.value);
        }

        intervalHeadless.value = setInterval(() => {
            if (progressHeadless.value <= 100) {
                progressHeadless.value = progressHeadless.value + 20;
            }

            if (progressHeadless.value >= 100) {
                progressHeadless.value = 100;
                clearInterval(intervalHeadless.value);
            }
        }, 1000);
    }
};
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
onMounted(() => {
    
})
onUnmounted(() => {
    if (intervalHeadless.value) {
        clearInterval(intervalHeadless.value);
    }
})

</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.customized-timeline) {
        .p-timeline-event:nth-child(even) {
            flex-direction: row;

            .p-timeline-event-content {
                text-align: left;
            }
        }

        .p-timeline-event-opposite {
            flex: 0;
        }
    }
}
</style>
