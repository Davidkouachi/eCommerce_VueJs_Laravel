export const onlyNumbers = (id, maxLength = null) => { 
    const input = document.getElementById(id); 
    if (!input) return;
    input.addEventListener('input', () => { 
        let value = input.value.replace(/[^0-9]/g, ''); 
        if (maxLength) { 
            value = value.slice(0, maxLength); 
        } 
        input.value = value; 
    }); 
};

export const onlyUppercase = (id, maxLength = null) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('input', () => {
        let value = input.value.toUpperCase();

        if (maxLength) {
            value = value.slice(0, maxLength);
        }

        input.value = value;

    });
};
