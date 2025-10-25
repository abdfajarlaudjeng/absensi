// File: /_sdk/data_sdk.js

// ⬇️⬇️ GANTI DENGAN URL DEPLOYMENT APLIKASI WEB ANDA ⬇️⬇️
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbytMJLO0ykI3tYD088K-pku09U6NuaS9O4_TTJqOqrWuorKDhd44WdKq5bWANqBTvtR/exec";
// ⬆️⬆️ GANTI DENGAN URL DEPLOYMENT APLIKASI WEB ANDA ⬆️⬆️


window.dataSdk = {
  
  // Fungsi init (dipanggil saat aplikasi dimuat)
  // Menggunakan GET untuk mengambil semua data
  init: async function(dataHandler) {
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'GET',
        redirect: 'follow'
      });
      
      const result = await response.json();
      
      if (result.status === "ok") {
        // Panggil onDataChanged dari index.html
        dataHandler.onDataChanged(result.data);
        return { isOk: true };
      } else {
        console.error("SDK Init Gagal:", result.message);
        dataHandler.onError(result.message);
        return { isOk: false };
      }
    } catch (error) {
      console.error("SDK Init Error:", error);
      dataHandler.onError(error.message);
      return { isOk: false };
    }
  },

  // Fungsi untuk mengirim data ke backend (Login, Create, Delete, Update)
  // Menggunakan POST
  postAction: async function(actionName, dataPayload) {
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: actionName, // 'login', 'create', 'delete'
          data: dataPayload  // data yang dikirim
        }),
        redirect: 'follow'
      });

      const result = await response.json();
      
      if (result.status === "ok") {
        return { isOk: true, data: result }; // Sukses
      } else {
        return { isOk: false, error: result.message }; // Gagal
      }
    } catch (error) {
      console.error(`SDK postAction (${actionName}) Error:`, error);
      return { isOk: false, error: error.message };
    }
  },

  // ==================================================
  // Fungsi spesifik yang dipanggil oleh index.html
  // ==================================================

  // Dipanggil oleh form login
  login: async function(username, password) {
    const result = await this.postAction('login', { username: username, password: password });
    if (result.isOk) {
      // 'result.data.user' harus dikembalikan oleh Code.gs
      return { isOk: true, user: result.data.user };
    } else {
      return { isOk: false, error: result.error };
    }
  },

  // Dipanggil oleh form absensi atau saat buat user
  create: async function(itemData) {
    const result = await this.postAction('create', itemData);
    if (result.isOk) {
      return { isOk: true, item: result.data.item };
    } else {
      return { isOk: false, error: result.error };
    }
  },
  
  // Dipanggil saat membuat sample users
  createSampleUsers: async function() {
      return await this.postAction('createSampleUsers', {});
  },

  // Dipanggil saat menghapus data
  delete: async function(id) {
    const result = await this.postAction('delete', { id: id });
    if (result.isOk) {
      return { isOk: true, id: result.data.id };
    } else {
      return { isOk: false, error: result.error };
    }
  }
  
  // TODO: Tambahkan fungsi 'update' jika diperlukan
};
