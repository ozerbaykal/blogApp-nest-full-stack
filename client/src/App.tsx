import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Header from "./components/header";
import Footer from "./components/footer";
import Create from "./pages/create";
import Detail from "./pages/detail";
import Edit from "./pages/edit";
import Protected from "./components/protected";
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

          <Route element={<Protected />} />
          <Route path="/create" element={<Create />} />
          <Route path="/blog/:id/edit" element={<Edit />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
