import Login from 'pages/Authentication/Login';
import { Route, Routes, Navigate } from 'react-router-dom';
import "./assets/scss/theme.scss"
import VerticalLayout from 'components/VerticalLayout';
import UserVerticalLayout from 'components/UserVerticalLayout';
import Dashboard from 'pages/Dashboard';
import BusinessCategory from 'pages/BusinessCategories/BusinessCategory';
import Merchant from 'pages/Merchants/Merchant';
import Product from 'pages/products/Product';
import MerchantInfo from 'pages/Merchants/MerchantInfo';
import Unit from 'pages/Units/Unit';
import UserLogin from 'pages/Authentication/UserLogin';
import Estimate from 'pages/Estimation/Estimate'; 
import EstimateCustomerList from 'pages/Estimation/EstimateCustomerList';
import EstimationList from 'components/Estimate/EstimationUpdate';


const App = () => (
  <Routes>
    <Route path="/admin" element={<Navigate to="/admin/login" />} />
    <Route path="/admin/login" element={<Login />} />
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<UserLogin />} />

    <Route path="/admin" element={<VerticalLayout />} >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="business-category" element={<BusinessCategory />} />
      <Route path="merchant" element={<Merchant />} />
      <Route path="merchant/info/:id" element={<MerchantInfo />} />
      <Route path="product/:id" element={<Product />} />
      <Route path="product" element={<Product />} />
      <Route path="unit" element={<Unit />} />
    </Route>

    <Route path="/user" element={<UserVerticalLayout />} >
      <Route path="estimate" element={<Estimate />} />
      <Route path="customer/list" element={<EstimateCustomerList />} />
      <Route path="list/:customer_id" element={<EstimationList />} />
    </Route>

  </Routes>
);

export default App;
