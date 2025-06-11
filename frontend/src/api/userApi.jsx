// userApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Thay đổi URL theo server của bạn

const userApi = {
  // Đăng ký tài khoản
  getSignUp: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        user_name: userData.username,
        user_password: userData.password,
        email: userData.email,
        full_name: userData.fullname,
        phone: userData.value // phone number từ PhoneInput
      });
      return response.data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Xác thực mã đăng ký
  postValidation: async (validationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register/validation`, {
        userInput: validationData.userInput
      });
      return response.data;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  },

  // Đăng nhập
  getLogin: async (loginData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        user_name: loginData.username,
        user_password: loginData.password
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Đăng xuất
  postLogout: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/logout`);
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Lấy thông tin profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile/update`, profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Kiểm tra session
  checkSession: async () => {
    try {
      console.log("Gửi yêu cầu kiểm tra session");
      const response = await axios.get(`${API_BASE_URL}/session/check`, {
        withCredentials: true
      });
      console.log("Phản hồi kiểm tra session:", response.data);
      return response.data;
    } catch (error) {
      console.error('Check session error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Lấy trang chủ
  getHomepage: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/home`);
      return response.data;
    } catch (error) {
      console.error('Get homepage error:', error);
      throw error;
    }
  },

  // Xóa tài khoản
  deleteAccount: async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/account/delete`);
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  getQuestionList: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/questionList`, {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('get question list error:' + error);
      throw error;
    }
  },

  getQuestionInList: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/questions/list/${id}`, {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('get question list error:' + error);
      throw error;
    }
  },

  postSubmission: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Cấu hình axios để tự động gửi cookies (để duy trì session)
axios.defaults.withCredentials = true;

// Interceptor để xử lý lỗi chung
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server trả về response với status code lỗi
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('Network Error:', error.request);
    } else {
      // Lỗi khác
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default userApi;