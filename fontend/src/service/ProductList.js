export const ProductService = {

    getProductsData(total = 100) {

        const baseProducts = [
            {
                code: 'prod1234',
                nom: 'Montre Rolex 15 quarat',
                img: 'bamboo-watch.jpg',
                prix: 100000,
                prixReduc: 80000,
                livraison: 1,
                categoryID: 1,
                category: 'accessories',
                qte: 4,
                qteLimit: 10,
                dateCreat: '2026-02-20',
                eval: 3.5
            },
            {
                code: 'prod5678',
                nom: 'Chaussures Nike Air Max',
                img: 'black-watch.jpg',
                prix: 85000,
                prixReduc: 65000,
                livraison: 2,
                categoryID: 2,
                category: 'shoes',
                qte: 10,
                qteLimit: 10,
                dateCreat: '2026-01-15',
                eval: 4
            },
            {
                code: 'prod9101',
                nom: 'Sac à main en cuir Premium',
                img: 'blue-band.jpg',
                prix: 120000,
                prixReduc: 0,
                livraison: 1,
                categoryID: 3,
                category: 'fashion',
                qte: 0,
                qteLimit: 5,
                dateCreat: '2026-02-01',
                eval: 3
            },
            {
                code: 'prod1122',
                nom: 'Casque Bluetooth JBL Pro',
                img: 'game-controller.jpg',
                prix: 45000,
                prixReduc: 35000,
                livraison: 2,
                categoryID: 4,
                category: 'electronics',
                qte: 25,
                qteLimit: 7,
                dateCreat: '2026-02-10',
                eval: 4
            },
            {
                code: 'prod3344',
                nom: 'Lunettes Ray-Ban',
                img: 'bracelet.jpg',
                prix: 95000,
                prixReduc: 0,
                livraison: 2,
                categoryID: 5,
                category: 'informatique',
                qte: 5,
                qteLimit: 10,
                dateCreat: '2026-02-18',
                eval: 5
            },
            {
                code: 'prod3345',
                nom: 'Montre Homme Premium',
                img: 'bracelet.jpg',
                prix: 95000,
                prixReduc: 0,
                livraison: 1,
                categoryID: 6,
                category: 'hommes',
                qte: 5,
                qteLimit: 10,
                dateCreat: '2026-02-18',
                eval: 5
            }
        ];

        const bigList = [];

        for (let i = 0; i < total; i++) {

            const p = baseProducts[i % baseProducts.length];

            bigList.push({
                ...p,
                code: `${p.code}${i + 1}`,
                id: i + 1,
                nom: `${p.nom} #${i + 1}`
            });
        }

        return bigList;
    },

    getProductById(code) {

        const data = this.getProductsData(10000)

        const product = data.find(p => p.code == code)

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(product)
            }, 300)
        })
    },

    getProductsSmall() {
        return Promise.resolve(this.getProductsData(10));
    },

    getProductsPaginated(offset = 0, limit = 20, filters = {}) {
        let data = this.getProductsData(10000);

        const { searchQuery, selectedCategory, minPrix, maxPrix, livraison, stock } = filters;

        const category = Number(selectedCategory);
        const livraisonFilter = Number(livraison);
        const stockFilter = Number(stock);
        const min = Number(minPrix);
        const max = Number(maxPrix);

        if (searchQuery && searchQuery.trim() !== '') {
            data = data.filter(p =>
                p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (category !== 0) {
            data = data.filter(p => p.categoryID === category);
        }

        if (livraisonFilter !== 0) {
            data = data.filter(p => p.livraison === livraisonFilter);
        }

        if (!isNaN(min)) {
            data = data.filter(p => p.prix >= min);
        }

        if (!isNaN(max)) {
            data = data.filter(p => p.prix <= max);
        }

        if (stockFilter !== 0) {

            switch (stockFilter) {

                case 1: // stock suffisant
                    data = data.filter(p => p.qte > p.qteLimit);
                    break;

                case 2: // stock faible
                    data = data.filter(p => p.qte > 0 && p.qte <= p.qteLimit);
                    break;

                case 3: // rupture
                    data = data.filter(p => p.qte === 0);
                    break;

            }
            
        }

        const total = data.length;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    products: data.slice(offset, offset + limit),
                    total
                });
            }, 500);
        });
    },

};