import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CategoryForm from "./components/CategoryForm";
import Layout from "./components/Layout";
import ProductForm from "./components/ProductForm";
import CategoryList from "./pages/CategoryList";
import ProductList from "./pages/ProductList";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProductList />} />
            <Route path="add" element={<ProductForm />} />
            <Route path="edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
