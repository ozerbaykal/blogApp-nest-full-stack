import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Header from "./components/header";
import Footer from "./components/footer";
import Detail from "./pages/detail";
import Protected from "./components/protected";
import BlogForm from "./pages/form";
const App = () => {
  return (
    <div className="bg-dark-08 text-white min-h-screen flex flex-col ">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Detail />} />

          <Route element={<Protected />}>
            <Route path="/blog/create" element={<BlogForm />} />
            <Route path="/blog/:id/edit" element={<BlogForm />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
