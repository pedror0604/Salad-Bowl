// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Leaf,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
  Info,
  Flame,
  Clock,
  Instagram,
  Lock,
  User,
  LogOut,
  LayoutDashboard,
  Edit,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  ShieldCheck,
  Banknote
} from "lucide-react";

// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

// --- CONFIGURAÇÃO FIREBASE (Novo Banco da Salad Bowl!) ---
const firebaseConfig = {
  apiKey: "AIzaSyAUb8bMwGOqnC7ReN3jo0OiCyqFGvxK_Eg",
  authDomain: "salad-bowl-b1b3d.firebaseapp.com",
  projectId: "salad-bowl-b1b3d",
  storageBucket: "salad-bowl-b1b3d.firebasestorage.app",
  messagingSenderId: "646927692592",
  appId: "1:646927692592:web:b88bb228591f8b31f40ef5",
  measurementId: "G-9D4M1L91TG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = "salad-bowl-app"; 

// --- DADOS PADRÃO (Caso o banco de dados esteja vazio) ---
const DEFAULT_SALADS = [
  {
    id: "s1",
    name: "Salada Tropical (Tamanho M)",
    desc: "Bowl Médio: Mix de folhas, manga, morango, peito de frango grelhado e molho de mostarda e mel.",
    price: 28.9,
    tags: "Mais Vendido",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "s2",
    name: "Salada Caesar Clássica (Tamanho M)",
    desc: "Bowl Médio: Alface americana, croutons, queijo parmesão, frango desfiado e molho caesar artesanal.",
    price: 26.9,
    tags: "",
    img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "s3",
    name: "Bowl Mediterrâneo (Tamanho M)",
    desc: "Bowl Médio: Folhas verdes, tomate cereja, pepino, azeitonas pretas, queijo branco e azeite.",
    price: 30.0,
    tags: "Vegetariano",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "s4",
    name: "Quinoa Fit (Tamanho M)",
    desc: "Bowl Médio: Base de quinoa, brócolis, cenoura ralada, ovo cozido, amêndoas e molho de iogurte.",
    price: 32.5,
    tags: "Sem Glúten, Fit",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80",
  },
];

const DEFAULT_DRINKS = [
  {
    id: "d1",
    name: "Chá Gelado",
    desc: "Feito por nós",
    price: 9.0,
    img: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "d3",
    name: "Água",
    desc: "Sem gás",
    price: 5.0,
    img: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "sob1",
    name: "Bolo Gelado (Brigadeiro)",
    desc: "Sobremesa",
    price: 6.0,
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
  },
];

const CUSTOM_BOWL_OPTIONS = {
  sizes: [
    { id: "p", name: "Pequeno (P)", desc: "Ideal para uma refeição leve", price: 20.0 },
    { id: "m", name: "Médio (M)", desc: "A medida certa para a fome", price: 26.0 },
    { id: "g", name: "Grande (G)", desc: "Para quem tem muita fome", price: 34.0 },
  ],
  bases: ["Mix de Folhas Verdes", "Alface Americana", "Rúcula", "Quinoa", "Macarrão Integral"],
  proteins: [
    { name: "Frango Grelhado", price: 6.0 },
    { name: "Frango Desfiado", price: 6.0 },
    { name: "Atum", price: 8.0 },
    { name: "Ovo Cozido", price: 4.0 },
    { name: "Tofu Temperado", price: 7.0 },
    { name: "Sem Proteína", price: 0 },
  ],
  toppings: [
    { name: "Tomate Cereja", price: 2.5 },
    { name: "Cenoura Ralada", price: 1.5 },
    { name: "Milho", price: 1.5 },
    { name: "Pepino", price: 1.5 },
    { name: "Brócolis", price: 2.5 },
    { name: "Croutons", price: 2.5 },
    { name: "Crocante de Milho", price: 3.0 },
    { name: "Cebola Crispy", price: 3.0 },
    { name: "Batata Palha", price: 2.0 },
    { name: "Bacon em cubos", price: 4.0 },
    { name: "Azeitona Preta", price: 2.5 },
    { name: "Manga", price: 2.0 },
    { name: "Morango", price: 2.5 },
    { name: "Queijo Parmesão", price: 3.5 },
    { name: "Queijo Branco", price: 3.5 },
  ],
  dressings: ["Mostarda e Mel", "Caesar", "Azeite e Limão", "Iogurte com Ervas", "Pesto", "Sem Molho"],
};

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [cart, setCart] = useState([]);
  const [observacao, setObservacao] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");

  // --- ESTADOS DO ADMIN E BANCO DE DADOS ---
  const [isLogged, setIsLogged] = useState(false);
  const [saladsMenu, setSaladsMenu] = useState([]);
  const [drinksMenu, setDrinksMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do Firebase
  useEffect(() => {
    const saladsRef = collection(db, "artifacts", appId, "public", "data", "salads");
    const drinksRef = collection(db, "artifacts", appId, "public", "data", "drinks");

    const unsubSalads = onSnapshot(saladsRef, (snapshot) => {
      if (snapshot.empty) {
        // Se estiver vazio, salva os dados padrão no banco
        DEFAULT_SALADS.forEach(async (item) => {
          await setDoc(doc(db, "artifacts", appId, "public", "data", "salads", item.id), item);
        });
      } else {
        setSaladsMenu(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    });

    const unsubDrinks = onSnapshot(drinksRef, (snapshot) => {
      if (snapshot.empty) {
        DEFAULT_DRINKS.forEach(async (item) => {
          await setDoc(doc(db, "artifacts", appId, "public", "data", "drinks", item.id), item);
        });
      } else {
        setDrinksMenu(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
      setIsLoading(false);
    });

    return () => {
      unsubSalads();
      unsubDrinks();
    };
  }, []);

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Math.random().toString() }]);
    alert(`${item.name} adicionado ao carrinho com sucesso!`);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const totalCart = cart.reduce((acc, item) => acc + item.price, 0);

  const goToHome = () => setCurrentView("home");
  const goToCustom = () => setCurrentView("custom");
  const goToCart = () => setCurrentView("cart");

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={goToHome}
          >
            <div className="bg-green-600 p-2 rounded-xl text-white">
              <Leaf size={28} />
            </div>
            <h1 className="text-xl font-black text-green-800 tracking-tight">SALAD BOWL</h1>
          </div>

          <div className="flex items-center gap-4">
            {isLogged && currentView !== "admin_dashboard" && (
              <button
                onClick={() => setCurrentView("admin_dashboard")}
                className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100 transition flex items-center gap-1"
              >
                <LayoutDashboard size={16} /> Painel
              </button>
            )}
            <button
              onClick={goToCart}
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full flex-1">
        {currentView === "home" && (
          <HomeView 
            addToCart={addToCart} 
            goToCustom={goToCustom} 
            saladsMenu={saladsMenu} 
            drinksMenu={drinksMenu}
            isLoading={isLoading} 
          />
        )}
        {currentView === "custom" && (
          <CustomBowlView setCart={setCart} cart={cart} goBack={goToHome} />
        )}
        {currentView === "cart" && (
          <CartView
            cart={cart}
            removeFromCart={removeFromCart}
            total={totalCart}
            goBack={goToHome}
            customerName={customerName}
            setCustomerName={setCustomerName}
            address={address}
            setAddress={setAddress}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            observacao={observacao}
            setObservacao={setObservacao}
          />
        )}
        {currentView === "admin_login" && (
          <AdminLogin 
            onSuccess={() => { setIsLogged(true); setCurrentView("admin_dashboard"); }} 
            goBack={goToHome} 
          />
        )}
        {currentView === "admin_dashboard" && (
          <AdminDashboard 
            salads={saladsMenu} 
            drinks={drinksMenu} 
            goBack={goToHome}
            onLogout={() => { setIsLogged(false); setCurrentView("home"); }}
          />
        )}
      </main>

      {currentView === "home" && (
        <footer className="bg-green-900 text-green-50 py-10 mt-12 border-t-8 border-orange-500 relative">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-xl mb-4 text-white flex items-center justify-center md:justify-start gap-2">
                <Leaf size={20}/> Salad Bowl
              </h3>
              <p className="text-sm opacity-80 mb-2">
                Comida de verdade, feita com ingredientes frescos todos os dias
                para você.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-bold text-lg mb-4 text-white">Horário</h3>
              <div className="flex items-center gap-2 text-sm opacity-80 mb-2">
                <Clock className="w-4 h-4" /> Seg a Sáb: 10:30h às 21:00h
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Clock className="w-4 h-4" /> Domingo: Fechado
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-bold text-lg mb-4 text-white">CEO</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">Pedro Rocha</span>
                  <span className="text-[10px] opacity-60 uppercase tracking-wider border-l border-white/20 pl-2 leading-none">
                    Fundador & Idealizador
                  </span>
                </div>
                <a 
                  href="https://instagram.com/pedro.pr10" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-orange-300 hover:text-orange-200 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @pedro.pr10
                </a>
              </div>
            </div>
          </div>
          
          {/* BOTÃO SECRETO DO ADMIN */}
          <div className="absolute bottom-4 right-4">
             <button onClick={() => setCurrentView("admin_login")} className="text-green-800 hover:text-white transition flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
                <Lock size={12}/> Área Restrita
             </button>
          </div>
        </footer>
      )}
    </div>
  );
}

// ==========================================
// PÁGINA INICIAL (AGORA USA OS DADOS DO BANCO)
// ==========================================
function HomeView({ addToCart, goToCustom, saladsMenu, drinksMenu, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-green-600">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold animate-pulse">Carregando cardápio fresquinho...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <section className="relative bg-green-600 text-white overflow-hidden rounded-b-3xl sm:rounded-3xl sm:mt-4 mx-0 sm:mx-4 shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 p-8 sm:p-12 text-center sm:text-left md:w-2/3">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            NOVO: Entregas em domicílio
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Comida de verdade, <br />
            <span className="text-orange-300">feita para você.</span>
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Escolha uma de nossas receitas exclusivas ou crie a sua própria
            combinação perfeita.
          </p>
          <button
            onClick={goToCustom}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-full shadow-md transform hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto sm:mx-0"
          >
            <Leaf className="w-5 h-5" />
            Monte o seu Bowl
          </button>
        </div>
      </section>

      {/* Saladas Prontas */}
      <section className="px-4 pt-10">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Nossos Clássicos</h2>
          <div className="h-1 bg-green-500 flex-1 rounded-full opacity-20 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {saladsMenu.map((salad) => {
            const tags = salad.tags ? salad.tags.split(",").map(t => t.trim()).filter(t => t) : [];
            return (
            <div
              key={salad.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative group"
            >
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md shadow-sm w-max
                    ${
                      tag.toLowerCase() === "mais vendido"
                        ? "bg-orange-500 text-white flex items-center gap-1"
                        : "bg-white/90 text-green-700 backdrop-blur-sm"
                    }`}
                  >
                    {tag.toLowerCase() === "mais vendido" && <Flame className="w-3 h-3" />}
                    {tag}
                  </span>
                ))}
              </div>
              <div className="h-48 overflow-hidden relative bg-gray-100">
                <img
                  src={salad.img || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"}
                  alt={salad.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">
                  {salad.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-3">
                  {salad.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xl font-black text-green-600">
                    R$ {Number(salad.price).toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => addToCart(salad)}
                    className="w-10 h-10 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>
      </section>

      {/* Bebidas e Sobremesas */}
      <section className="px-4 pt-12">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Bebidas e Sobremesas
          </h2>
          <div className="h-1 bg-orange-300 flex-1 rounded-full opacity-30 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drinksMenu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-4 hover:border-orange-200 transition-colors group"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                <img
                  src={item.img || "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=500&q=80"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {item.desc}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-black text-orange-600 text-sm">
                    R$ {Number(item.price).toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="p-1.5 bg-gray-50 hover:bg-orange-500 hover:text-white text-orange-500 rounded-md transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// PAINEL ADMINISTRATIVO (NOVO)
// ==========================================
function AdminLogin({ onSuccess, goBack }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "Pedro0604" && pass === "raquel03") {
      onSuccess();
    } else {
      alert("Credenciais incorretas!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in">
      <button onClick={goBack} className="absolute top-24 left-4 text-green-700 flex items-center gap-1 font-bold">
        <ArrowLeft size={18}/> Voltar para a loja
      </button>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-800">Área Restrita</h2>
          <p className="text-sm text-gray-500 text-center mt-1">Apenas pessoas autorizadas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Usuário</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                required
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold" 
                placeholder="Digite seu usuário"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                required
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold" 
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3.5 rounded-xl shadow-md transition-all active:scale-95 mt-4">
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ salads, drinks, goBack, onLogout }) {
  const [activeTab, setActiveTab] = useState("salads");
  const [editingItem, setEditingItem] = useState(null);
  
  const handleSave = async (data) => {
    const collectionName = activeTab === "salads" ? "salads" : "drinks";
    const finalId = data.id || `item_${Date.now()}`;
    
    try {
      await setDoc(doc(db, "artifacts", appId, "public", "data", collectionName, finalId), { ...data, id: finalId });
      setEditingItem(null);
    } catch (e) {
      alert("Erro ao salvar produto!");
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Tem certeza que quer excluir este item?")) return;
    const collectionName = activeTab === "salads" ? "salads" : "drinks";
    try {
      await deleteDoc(doc(db, "artifacts", appId, "public", "data", collectionName, id));
    } catch (e) {
      alert("Erro ao excluir!");
    }
  };

  return (
    <div className="p-4 sm:p-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Painel Gerencial</h2>
          <p className="text-gray-500 text-sm">Gerencie os produtos que aparecem na loja.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={goBack} className="flex-1 sm:flex-none text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition">
            Ver Loja
          </button>
          <button onClick={onLogout} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      {editingItem ? (
        <AdminForm 
          item={editingItem === "new" ? {} : editingItem} 
          type={activeTab} 
          onSave={handleSave} 
          onCancel={() => setEditingItem(null)} 
        />
      ) : (
        <>
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab("salads")}
              className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${activeTab === "salads" ? "bg-green-600 text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}
            >
              <Leaf className="w-4 h-4 inline mr-2 -mt-1"/> Saladas ({salads.length})
            </button>
            <button 
              onClick={() => setActiveTab("drinks")}
              className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${activeTab === "drinks" ? "bg-orange-500 text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}
            >
              Bebidas & Sobremesas ({drinks.length})
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-700">Itens Cadastrados</h3>
              <button 
                onClick={() => setEditingItem("new")}
                className="bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition active:scale-95"
              >
                <Plus size={16}/> Adicionar Novo
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {(activeTab === "salads" ? salads : drinks).map(item => (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                  <img src={item.img || "/placeholder.jpg"} className="w-16 h-16 rounded-xl object-cover border border-gray-200" alt="img"/>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm font-black text-green-600 mt-1">R$ {Number(item.price).toFixed(2).replace(".", ",")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(item)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition">
                      <Edit size={18}/>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
              {(activeTab === "salads" ? salads : drinks).length === 0 && (
                <div className="p-10 text-center text-gray-400 font-bold">
                  Nenhum item cadastrado nesta categoria.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminForm({ item, type, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: item.id || "",
    name: item.name || "",
    desc: item.desc || "",
    price: item.price || "",
    img: item.img || "",
    tags: item.tags || ""
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
          {item.id ? <Edit className="text-blue-500"/> : <Plus className="text-green-500"/>}
          {item.id ? "Editar Item" : "Novo Item"}
        </h3>
        <button onClick={onCancel} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X size={20}/></button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave({ ...formData, price: Number(formData.price) }); }} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Nome do Produto</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ex: Salada Fit"/>
        </div>
        
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Descrição</label>
          <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none text-sm" placeholder="Ingredientes e detalhes..."/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Preço (R$)</label>
            <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-black text-green-700 focus:ring-2 focus:ring-green-500 outline-none" placeholder="0.00"/>
          </div>
          {type === "salads" && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tags (Opcional)</label>
              <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ex: Fit, Mais Vendido"/>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><ImageIcon size={14}/> URL da Imagem</label>
          <input type="url" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://link-da-imagem.jpg"/>
          {formData.img && (
            <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <img src={formData.img} alt="preview" className="w-full h-full object-cover"/>
            </div>
          )}
        </div>

        <div className="pt-4 flex gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-3.5 bg-gray-100 font-bold text-gray-600 rounded-xl hover:bg-gray-200 transition">Cancelar</button>
          <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition active:scale-95">
            <Save size={20}/> Salvar Produto
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// ASSISTENTE DE BOWL PERSONALIZADO
// ==========================================
function CustomBowlView({ setCart, cart, goBack }) {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedProteins, setSelectedProteins] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedDressing, setSelectedDressing] = useState("");

  const FREE_TOPPINGS = 4;
  const FREE_PROTEINS = 1;
  const handleToppingToggle = (toppingObj) => {
    if (selectedToppings.some((t) => t.name === toppingObj.name)) {
      setSelectedToppings(
        selectedToppings.filter((t) => t.name !== toppingObj.name)
      );
    } else {
      setSelectedToppings([...selectedToppings, toppingObj]);
    }
  };
  const handleProteinToggle = (proteinObj) => {
    if (selectedProteins.some((p) => p.name === proteinObj.name)) {
      setSelectedProteins(
        selectedProteins.filter((p) => p.name !== proteinObj.name)
      );
    } else {
      setSelectedProteins([...selectedProteins, proteinObj]);
    }
  };

  const getExtraToppingsCost = () => {
    if (selectedToppings.length <= FREE_TOPPINGS) return 0;
    const extraToppings = selectedToppings.slice(FREE_TOPPINGS);
    return extraToppings.reduce((total, topping) => total + topping.price, 0);
  };
  const getExtraProteinsCost = () => {
    if (selectedProteins.length <= 1) return 0;
    const extraProteins = selectedProteins.slice(1);
    return extraProteins.reduce((total, protein) => total + protein.price, 0);
  };
  const currentTotalPrice =
    (selectedSize ? selectedSize.price : 0) + getExtraToppingsCost() + getExtraProteinsCost();
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return selectedSize !== null;
      case 2:
        return selectedBase !== "";
      case 3:
        return selectedProteins.length > 0;
      case 4:
        return selectedToppings.length > 0;
      case 5:
        return selectedDressing !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepComplete()) {
      if (step < 5) setStep(step + 1);
      else finishCustomBowl();
    }
  };

  const finishCustomBowl = () => {
    const toppingsFormattedDesc = selectedToppings
      .map((t, index) => {
        if (index < FREE_TOPPINGS) return t.name;
        return `${t.name} (+R$ ${t.price.toFixed(2)})`;
      })
      .join(", ");

    const customItem = {
      id: `custom-${Date.now()}`,
      name: `Bowl Personalizado (${selectedSize.name.split(" ")[0]})`,
      type: "custom",
      price: currentTotalPrice,
      desc: `Base: ${selectedBase} | Proteína: ${selectedProteins.map(p => p.name).join(", ")} | Acomp.: ${toppingsFormattedDesc} | Molho: ${selectedDressing}`,
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
    };

    setCart([...cart, { ...customItem, cartId: Math.random().toString() }]);
    alert("Bowl personalizado adicionado ao carrinho!");
    goBack();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in slide-in-from-right-8 duration-300">
      <button
        onClick={goBack}
        className="flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors font-bold"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Voltar ao Cardápio
      </button>

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-green-50 p-6 border-b border-green-100 flex flex-col items-center">
          <h2 className="text-2xl font-black text-green-800 mb-4 tracking-tight">
            Monte o seu Bowl
          </h2>
          <div className="flex justify-between w-full max-w-sm relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-200 -z-10 transform -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-green-600 -z-10 transform -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>

            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  step === i
                    ? "bg-white border-green-600 text-green-600"
                    : step > i
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-green-200 text-green-300"
                }`}
              >
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-black uppercase tracking-widest text-green-700">
            {step === 1 && "Escolha o Tamanho"}
            {step === 2 && "Escolha a Base"}
            {step === 3 && "Escolha a Proteína"}
            {step === 4 && `Acompanhamentos (Até ${FREE_TOPPINGS} grátis)`}
            {step === 5 && "Escolha o Molho"}
          </p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              {CUSTOM_BOWL_OPTIONS.sizes.map((size) => (
                <label
                  key={size.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedSize?.id === size.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="size"
                    className="hidden"
                    checked={selectedSize?.id === size.id}
                    onChange={() => setSelectedSize(size)}
                  />
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedSize?.id === size.id
                          ? "border-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedSize?.id === size.id && (
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{size.name}</h4>
                      <p className="text-sm text-gray-500">{size.desc}</p>
                    </div>
                  </div>
                  <span className="font-black text-green-600">
                    R$ {size.price.toFixed(2).replace(".", ",")}
                  </span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CUSTOM_BOWL_OPTIONS.bases.map((base) => (
                <label
                  key={base}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedBase === base
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="base"
                    className="hidden"
                    checked={selectedBase === base}
                    onChange={() => setSelectedBase(base)}
                  />
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedBase === base
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedBase === base && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </span>
                  <span className="font-medium text-gray-700">{base}</span>
                </label>
              ))}
            </div>
          )}

      {step === 3 && (
        <>
          <div className="flex items-center justify-between text-sm bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center">
              <Info className="w-5 h-5 mr-3 text-orange-500" />
              <div>
                <span className="font-black block">
                  A 1ª proteína é grátis!
                </span>
                <span className="opacity-80 font-medium">
                  Já escolheu {selectedProteins.length}.
                </span>
              </div>
            </div>
            {getExtraProteinsCost() > 0 && (
              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-orange-500">Custo extra:</span>
                <span className="font-black text-lg text-orange-600">
                  + R$ {getExtraProteinsCost().toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CUSTOM_BOWL_OPTIONS.proteins.map((protein) => {
              const isSelected = selectedProteins.some((p) => p.name === protein.name);
              const isExtraCharge =
                isSelected &&
                selectedProteins.findIndex((p) => p.name === protein.name) >= FREE_PROTEINS;

              return (
                <label
                  key={protein.name}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => handleProteinToggle(protein)}
                  />
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      isSelected
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </span>
                  <span className="font-bold text-gray-700">
                    {protein.name}
                  </span>
                  
                  <div className="ml-auto flex items-center">
                    {!isSelected && protein.price > 0 && (
                      <span className="text-xs font-bold text-gray-400">
                        + R$ {protein.price.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                    {isSelected && !isExtraCharge && protein.price > 0 && (
                      <span className="text-[10px] uppercase tracking-widest font-black text-green-600 bg-green-100 px-2.5 py-1 rounded-md">
                        Grátis
                      </span>
                    )}
                    {isExtraCharge && protein.price > 0 && (
                      <span className="text-[10px] uppercase tracking-widest font-black text-white bg-orange-500 px-2.5 py-1 rounded-md">
                        + R$ {protein.price.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </>
      )}
          {step === 4 && (
            <>
              <div className="flex items-center justify-between text-sm bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl mb-6 shadow-sm">
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-3 text-orange-500" />
                  <div>
                    <span className="font-black block">
                      Os {FREE_TOPPINGS} primeiros são grátis!
                    </span>
                    <span className="opacity-80 font-medium">
                      Já escolheu {selectedToppings.length}.
                    </span>
                  </div>
                </div>
                {getExtraToppingsCost() > 0 && (
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-orange-500">Custo extra:</span>
                    <span className="font-black text-lg text-orange-600">
                      + R$ {getExtraToppingsCost().toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CUSTOM_BOWL_OPTIONS.toppings.map((topping) => {
                  const isSelected = selectedToppings.some(
                    (t) => t.name === topping.name
                  );
                  const isExtraCharge =
                    isSelected &&
                    selectedToppings.findIndex(
                      (t) => t.name === topping.name
                    ) >= FREE_TOPPINGS;

                  return (
                    <label
                      key={topping.name}
                      className={`flex flex-col items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all text-center h-full
                      ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }
                    `}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={() => handleToppingToggle(topping)}
                      />
                      <span className="font-bold text-sm text-gray-800 mt-1">
                        {topping.name}
                      </span>
                      <div className="mt-2 flex flex-col items-center w-full">
                        {!isSelected && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded w-full">
                            + R$ {topping.price.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                        {isSelected && !isExtraCharge && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-100 px-2 py-1 rounded w-full">
                            Grátis
                          </span>
                        )}
                        {isExtraCharge && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-white bg-orange-500 px-2 py-1 rounded w-full">
                            + R$ {topping.price.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </>
          )}

          {step === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CUSTOM_BOWL_OPTIONS.dressings.map((dressing) => (
                <label
                  key={dressing}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedDressing === dressing
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="dressing"
                    className="hidden"
                    checked={selectedDressing === dressing}
                    onChange={() => setSelectedDressing(dressing)}
                  />
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedDressing === dressing
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedDressing === dressing && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </span>
                  <span className="font-bold text-gray-700">{dressing}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Parcial:</span>
            <span className="text-2xl font-black text-green-600">
              R$ {currentTotalPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className={`flex items-center gap-2 py-3.5 px-8 rounded-full font-black transition-all ${
              isStepComplete()
                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg active:scale-95 transform"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {step === 5 ? "Adicionar ao Pedido" : "Próximo Passo"}
            {step < 5 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CARRINHO E CHECKOUT
// ==========================================
function CartView({ cart, removeFromCart, total, goBack, customerName, setCustomerName, address, setAddress, paymentMethod, setPaymentMethod, observacao, setObservacao }) {
  const [billNote, setBillNote] = useState("");

  const handleCheckout = () => {
    if (cart.length === 0) return alert("O seu carrinho está vazio!");
    if (!customerName) return alert("Por favor, indique o seu nome.");

    let message = `*🥗 NOVO PEDIDO - SALAD BOWL*%0A%0A`;
    message += `*👤 Cliente:* ${customerName}%0A`;
    message += `*📍 Endereço:* ${address ? address : "Retirar na Loja"}%0A`;
    if (observacao !== "") {
      message += `📝 *Observação:* ${observacao}%0A`;
    }

    message += `%0A*🛒 ITENS DO PEDIDO:*%0A`;
    cart.forEach((item, index) => {
      message += `▪️ ${index + 1}x *${item.name}* - R$ ${item.price
        .toFixed(2)
        .replace(".", ",")}%0A`;
      if (item.desc) {
        message += `   _${item.desc}_%0A`;
      }
    });

    message += `%0A*💳 PAGAMENTO:*%0A`;
    message += `Forma: ${paymentMethod}%0A`;

    if (paymentMethod === "Dinheiro" && billNote) {
      message += `*Pagará com nota de:* R$ ${billNote}%0A`;
    }

    message += `%0A*💰 TOTAL PARCIAL: R$ ${total
      .toFixed(2)
      .replace(".", ",")}*%0A`;
    message += `(Aguardando o cálculo da taxa de entrega)%0A`;

    const whatsappNumber = "5513996757174";
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(url, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-8 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3 tracking-tight">
          <ShoppingCart className="w-8 h-8 text-green-600" /> Meu Pedido
        </h2>
        <button
          onClick={goBack}
          className="text-green-600 font-bold hover:underline flex items-center gap-1 bg-green-50 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continuar comprando
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-green-50 text-green-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-gray-700 mb-2">
            Seu bowl está vazio
          </h3>
          <p className="text-gray-500 mb-8 font-medium">
            Sua próxima refeição saudável está esperando.
          </p>
          <button
            onClick={goBack}
            className="bg-orange-500 text-white px-8 py-4 rounded-full font-black hover:bg-orange-600 transition-colors shadow-md active:scale-95 transform"
          >
            Ver Cardápio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartId}
                className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-100 flex gap-4 relative group"
              >
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-xl transition hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                  <img
                    src={item.img || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 pr-10 flex flex-col justify-center">
                  <h4 className="font-black text-gray-800 text-lg leading-tight mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                  <p className="font-black text-green-600 mt-2 text-lg">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Final */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <h3 className="font-black text-xl text-gray-800 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-600" /> Finalizar
              Pedido
            </h3>

            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-green-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  Endereço de Entrega
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, Número, Bairro. (Deixe em branco se for retirar na loja)"
                  rows="2"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  Observações do pedido
                </label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Tirar cebola, molho à parte..."
                  rows="2"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  <Banknote className="w-4 h-4 text-green-500" /> Forma de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-bold focus:ring-2 focus:ring-green-500 outline-none transition appearance-none cursor-pointer"
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">
                    Cartão de Crédito (Máquina)
                  </option>
                  <option value="Cartão de Débito">
                    Cartão de Débito (Máquina)
                  </option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              {paymentMethod === "Dinheiro" && (
                <div className="animate-in fade-in slide-in-from-top-2 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1.5">
                    Troco para quanto?
                  </label>
                  <input
                    type="number"
                    value={billNote}
                    onChange={(e) => setBillNote(e.target.value)}
                    placeholder="Ex: 50"
                    className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2.5 font-bold focus:ring-2 focus:ring-orange-400 outline-none mb-2 text-orange-900"
                  />
                  <p className="text-[10px] font-bold text-orange-400/80 leading-tight uppercase tracking-wider">
                    * Calcularemos o troco exato no WhatsApp após incluir a taxa
                    de entrega.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100">
              <div className="flex justify-between text-gray-500 font-medium text-sm mb-2">
                <span>Subtotal ({cart.length} itens)</span>
                <span className="font-bold text-gray-700">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium text-sm mb-3">
                <span>Taxa de Entrega</span>
                <span className="text-orange-500 text-xs font-bold uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                  Via WhatsApp
                </span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-800 pt-4 border-t border-gray-200 mt-2">
                <span>Total Parcial</span>
                <span className="text-green-600">
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-black py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-green-200/50 text-lg"
            >
              Enviar via WhatsApp <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
