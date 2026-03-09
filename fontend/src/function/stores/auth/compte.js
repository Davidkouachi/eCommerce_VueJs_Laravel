import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthCompteStore = defineStore('authCompte', () => {
    
    const loading = ref(false);
    const icon = ref(null);
    const header = ref('Titre');
    const position = ref('top');
    const width = ref('30rem');
    const component = ref(null);
    const props = ref({}); // 🔥
    const propsBtnFotter = ref({});
    const componentRef = ref(null);
    const footerLoading = ref(false);
    const footerLoadingId = ref(null);

    function show(
        title = null, 
        icone = null,
        pos = 'top',  
        w = '30rem', 
        comp = null, 
        compProps = {},
        footerProps = {} ) {
        loading.value = true;
        header.value = title;
        position.value = pos;
        icon.value = icone;
        width.value = w;
        component.value = comp;
        props.value = compProps;
        propsBtnFotter.value = footerProps;
    }

    function hide() {
        loading.value = false;
        icon.value = null;
        header.value = 'Titre';
        position.value = 'top';
        width.value = '30rem';
        component.value = null;
        props.value = {};
        propsBtnFotter.value = {};
    }

    function setFooterLoading(id) {
        footerLoadingId.value = id;
    }

    function clearFooterLoading() {
        footerLoadingId.value = null;
    }

    function setComponentRef(el) {
        componentRef.value = el;
    }

    function callComponentMethod(method) {
        if (componentRef.value && componentRef.value[method]) {
            componentRef.value[method]();
        }
    }

    return {
        loading,
        icon,
        header,
        position,
        width,
        component,
        props,
        propsBtnFotter,
        show,
        hide,
        setComponentRef,
        callComponentMethod,
        setFooterLoading,
        clearFooterLoading,
        footerLoadingId
    };
});