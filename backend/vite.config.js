import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(),
    ],
    // server: {
    //     host: true, // rend Vite accessible depuis le réseau
    //     port: 5173,
    // },
    // necessaire quand le fontend et le backend sont different
});