import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;


createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      path: 'ryantsai',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      editIndex: null
    }
  },
  mounted() {
    let myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = myCookie;
    this.checkMember();

    productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
  },
  methods: {
    checkMember() {
      const api = `${this.apiUrl}/v2/api/user/check`
      axios.post(api)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location.href = './login.html'
        })
    },
    openModal(modalName, index) {
      if (modalName === 'productModal') {
        this.editIndex = null;
        this.tempProduct = {
          imagesUrl: []
        };
        productModal.show();
      } else if (modalName === 'delProductModal') {
        this.editIndex = index;
        this.tempProduct = { ...this.products[this.editIndex] };
        delProductModal.show();
      } else if (modalName === 'editModal') {
        productModal.show();
      }
    },
    submitProduct() {
      const data = {
        data: {
          ...this.tempProduct
        }
      };
      if (this.editIndex === null) {
        const api = `${this.apiUrl}/v2/api/${this.path}/admin/product`;

        axios.post(api, data)
          .then(() => {
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message)
          })
      } else {
        const { id } = this.tempProduct;
        const api = `${this.apiUrl}/v2/api/${this.path}/admin/product/${id}`;
        axios.put(api, data)
          .then(() => {
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message);
          })
      }
    },
    editProduct(index) {
      this.editIndex = index;
      if (this.products[this.editIndex].imagesUrl) {
        this.tempProduct = {
          ...this.products[this.editIndex],
        };
      } else {
        this.tempProduct = {
          ...this.products[this.editIndex],
          imagesUrl: []
        };
      }
      this.openModal('editModal');
    },
    delProduct() {
      const { id } = this.tempProduct;
      const api = `${this.apiUrl}/v2/api/${this.path}/admin/product/${id}`;
      axios.delete(api)
        .then(() => {
          this.getData();
          delProductModal.hide();
        })
        .catch((err) => {
          alert(err);
        })
    },
    getData() {
      const api = `${this.apiUrl}/v2/api/${this.path}/admin/products`;
      axios.get(api)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    clearNewProduct() {
      this.tempProduct = {
        imagesUrl: []
      };
    },
  }
}).mount('#app');