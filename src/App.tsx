// @ts-nocheck
import React, { useState } from "react";
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
  ShieldCheck,
  Clock,
  MapPin,
  Banknote,
} from "lucide-react";

// --- DADOS DO CARDÁPIO ---
const MENU_SALADS = [
  {
    id: "s1",
    name: "Salada Tropical (Tamanho M)",
    desc: "Bowl Médio: Mix de folhas, manga, morango, peito de frango grelhado e molho de mostarda e mel.",
    price: 28.9,
    tags: ["Mais Vendido"],
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "s2",
    name: "Salada Caesar Clássica (Tamanho M)",
    desc: "Bowl Médio: Alface americana, croutons, queijo parmesão, frango desfiado e molho caesar artesanal.",
    price: 26.9,
    tags: [],
    img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "s3",
    name: "Bowl Mediterrâneo (Tamanho M)",
    desc: "Bowl Médio: Folhas verdes, tomate cereja, pepino, azeitonas pretas, queijo branco e azeite.",
    price: 30.0,
    tags: ["Vegetariano"],
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "s4",
    name: "Quinoa Fit (Tamanho M)",
    desc: "Bowl Médio: Base de quinoa, brócolis, cenoura ralada, ovo cozido, amêndoas e molho de iogurte.",
    price: 32.5,
    tags: ["Sem Glúten", "Fit"],
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80",
  },
];

// MENU DE BEBIDAS E SOBREMESAS
const MENU_DRINKS = [
  {
    id: "d1",
    name: "Chá Gelado",
    desc: "Feito por nós",
    price: 9.0,
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "d2",
    name: "Chá Gelado com Limão",
    desc: "Feito por nós",
    price: 9.0,
    img: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "d3",
    name: "Água",
    desc: "Sem gás",
    price: 5.0,
    img: "/Agua.png",
  },
  {
    id: "d4",
    name: "Água com Gás",
    desc: "Com gás",
    price: 5.0,
    img: "/Aguagás.jpg",
  },
  {
    id: "d5",
    name: "Coca-Cola Lata",
    desc: "350ml",
    price: 7.0,
    img: "/coca.png",
  },
  {
    id: "d6",
    name: "Coca-Cola Zero Lata",
    desc: "350ml",
    price: 7.0,
    img: "/cocazero.webp",
  },
  {
    id: "d7",
    name: "Guaraná Lata",
    desc: "350ml",
    price: 7.0,
    img: "/guarana.webp",
  },
  {
    id: "d8",
    name: "Guaraná Zero Lata",
    desc: "350ml",
    price: 7.0,
    img: "/guaranazero.png",
  },
  {
    id: "sob1",
    name: "Bolo Gelado (Brigadeiro)",
    desc: "Sobremesa",
    price: 6.0,
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "sob2",
    name: "Bolo Gelado (Côco)",
    desc: "Sobremesa",
    price: 6.0,
    img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "sob3",
    name: "Bolo Gelado (Ninho)",
    desc: "Sobremesa",
    price: 6.0,
    img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=500&q=80",
  },
];

const CUSTOM_BOWL_OPTIONS = {
  sizes: [
    {
      id: "p",
      name: "Pequeno (P)",
      desc: "Ideal para uma refeição leve",
      price: 20.0,
    },
    {
      id: "m",
      name: "Médio (M)",
      desc: "A medida certa para a fome",
      price: 26.0,
    },
    {
      id: "g",
      name: "Grande (G)",
      desc: "Para quem tem muita fome",
      price: 34.0,
    },
  ],
  bases: [
    "Mix de Folhas Verdes",
    "Alface Americana",
    "Rúcula",
    "Quinoa",
    "Macarrão Integral",
  ],
  proteins: [
    "Frango Grelhado",
    "Frango Desfiado",
    "Atum",
    "Ovo Cozido (2 un)",
    "Tofu Temperado",
    "Sem Proteína",
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
  dressings: [
    "Mostarda e Mel",
    "Caesar",
    "Azeite e Limão",
    "Iogurte com Ervas",
    "Pesto",
    "Sem Molho",
  ],
};

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [cart, setCart] = useState([]);
  const [observacao, setObservacao] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");

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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={goToHome}
          >
            <img
              src="/saladbowl.png"
              alt="Salad Bowl Logo"
              className="h-24 object-contain"
            />
          </div>

          <button
            onClick={goToCart}
            className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto pb-20">
        {currentView === "home" && (
          <HomeView addToCart={addToCart} goToCustom={goToCustom} />
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
      </main>

      {currentView === "home" && (
        <footer className="bg-green-900 text-green-50 py-10 mt-12 border-t-8 border-orange-500">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-xl mb-4 text-white">Salad Bowl</h3>
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
              <h3 className="font-bold text-lg mb-4 text-white">Localização</h3>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <MapPin className="w-4 h-4" /> Centro da Cidade
              </div>
              <p className="text-xs mt-2 text-orange-300">
                Entregamos num raio de 5km!
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// ==========================================
// PÁGINA INICIAL
// ==========================================
function HomeView({ addToCart, goToCustom }) {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative bg-green-600 text-white overflow-hidden rounded-b-3xl sm:rounded-3xl sm:mt-4 mx-0 sm:mx-4 shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 p-8 sm:p-12 text-center sm:text-left md:w-2/3">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500 text-xs font-bold uppercase tracking-wider mb-4">
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
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto sm:mx-0"
          >
            <Leaf className="w-5 h-5" />
            Monte o seu Bowl
          </button>
        </div>
      </section>

      {/* Saladas Prontas */}
      <section className="px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Nossos Clássicos</h2>
          <div className="h-1 bg-green-500 flex-1 rounded-full opacity-20 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MENU_SALADS.map((salad) => (
            <div
              key={salad.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col relative"
            >
              {salad.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-md shadow-sm z-10 
                  ${
                    tag === "Mais Vendido"
                      ? "bg-orange-500 text-white flex items-center gap-1"
                      : "bg-white text-green-700 border border-green-200"
                  }`}
                >
                  {tag === "Mais Vendido" && <Flame className="w-3 h-3" />}{" "}
                  {tag}
                </span>
              ))}
              <img
                src={salad.img}
                alt={salad.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">
                  {salad.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">
                  {salad.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xl font-extrabold text-green-600">
                    R$ {salad.price.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => addToCart(salad)}
                    className="w-10 h-10 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bebidas e Sobremesas */}
      <section className="px-4 pb-10">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Bebidas e Sobremesas
          </h2>
          <div className="h-1 bg-orange-300 flex-1 rounded-full opacity-30 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MENU_DRINKS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-4 hover:border-orange-200 transition-colors"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {item.desc}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-orange-600 text-sm">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="p-1 bg-gray-50 hover:bg-orange-100 text-orange-600 rounded-md"
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
// ASSISTENTE DE BOWL PERSONALIZADO
// ==========================================
function CustomBowlView({ setCart, cart, goBack }) {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedProtein, setSelectedProtein] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedDressing, setSelectedDressing] = useState("");

  const FREE_TOPPINGS = 4;

  const handleToppingToggle = (toppingObj) => {
    if (selectedToppings.some((t) => t.name === toppingObj.name)) {
      setSelectedToppings(
        selectedToppings.filter((t) => t.name !== toppingObj.name)
      );
    } else {
      setSelectedToppings([...selectedToppings, toppingObj]);
    }
  };

  const getExtraToppingsCost = () => {
    if (selectedToppings.length <= FREE_TOPPINGS) return 0;
    const extraToppings = selectedToppings.slice(FREE_TOPPINGS);
    return extraToppings.reduce((total, topping) => total + topping.price, 0);
  };

  const currentTotalPrice =
    (selectedSize ? selectedSize.price : 0) + getExtraToppingsCost();

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return selectedSize !== null;
      case 2:
        return selectedBase !== "";
      case 3:
        return selectedProtein !== "";
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
      desc: `Base: ${selectedBase} | Proteína: ${selectedProtein} | Acomp.: ${toppingsFormattedDesc} | Molho: ${selectedDressing}`,
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
        className="flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Voltar ao Cardápio
      </button>

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-green-50 p-6 border-b border-green-100 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
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
          <p className="mt-4 text-sm font-medium text-green-700">
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
                  <span className="font-bold text-green-600">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CUSTOM_BOWL_OPTIONS.proteins.map((protein) => (
                <label
                  key={protein}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedProtein === protein
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="protein"
                    className="hidden"
                    checked={selectedProtein === protein}
                    onChange={() => setSelectedProtein(protein)}
                  />
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedProtein === protein
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedProtein === protein && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </span>
                  <span className="font-medium text-gray-700">{protein}</span>
                </label>
              ))}
            </div>
          )}

          {step === 4 && (
            <>
              <div className="flex items-center justify-between text-sm bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl mb-6 shadow-sm">
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <span className="font-semibold block">
                      Os {FREE_TOPPINGS} primeiros são grátis!
                    </span>
                    <span className="opacity-80">
                      Já escolheu {selectedToppings.length}.
                    </span>
                  </div>
                </div>
                {getExtraToppingsCost() > 0 && (
                  <div className="text-right">
                    <span className="block text-xs">Custo extra:</span>
                    <span className="font-bold text-orange-600">
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
                      <span className="font-medium text-sm text-gray-800 mt-1">
                        {topping.name}
                      </span>
                      <div className="mt-2 flex flex-col items-center">
                        {!isSelected && (
                          <span className="text-xs text-gray-400">
                            + R$ {topping.price.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                        {isSelected && !isExtraCharge && (
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1">
                            Grátis
                          </span>
                        )}
                        {isExtraCharge && (
                          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mt-1">
                            + R$ {topping.price.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-2" />
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
                  <span className="font-medium text-gray-700">{dressing}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Valor Parcial:</span>
            <span className="text-xl font-bold text-green-600">
              R$ {currentTotalPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className={`flex items-center gap-2 py-3 px-6 rounded-full font-bold transition-all ${
              isStepComplete()
                ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
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
  // Variável para armazenar qual nota o cliente vai entregar
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

    // Agora informamos qual nota o cliente vai entregar
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
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-green-600" /> Meu Pedido
        </h2>
        <button
          onClick={goBack}
          className="text-green-600 font-medium hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar e adicionar mais
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 text-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            Seu bowl está vazio
          </h3>
          <p className="text-gray-500 mb-6">
            Sua próxima refeição saudável está esperando.
          </p>
          <button
            onClick={goBack}
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
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
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 relative"
              >
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 bg-gray-50 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 pr-8">
                  <h4 className="font-bold text-gray-800 text-lg">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="font-bold text-green-600 mt-2">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Final */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" /> Finalizar
              Pedido
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de Entrega
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, Número, Bairro. (Deixe em branco se for retirar na loja)"
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                ></textarea>
              </div>
              <div className="pt-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Observações do pedido:
  </label>
  <textarea
    value={observacao}
    onChange={(e) => setObservacao(e.target.value)}
    placeholder="Ex: Tirar cebola, molho à parte, troco para 50..."
    rows="2"
    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
  ></textarea>
</div>

              {/* Opções de Pagamento */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Banknote className="w-4 h-4" /> Como vai pagar?
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">
                    Cartão de Crédito (Levar Máquina)
                  </option>
                  <option value="Cartão de Débito">
                    Cartão de Débito (Levar Máquina)
                  </option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              {/* CORREÇÃO AQUI: Pergunta qual nota o cliente vai entregar */}
              {paymentMethod === "Dinheiro" && (
                <div className="animate-in fade-in slide-in-from-top-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai pagar com nota de quanto?
                  </label>
                  <input
                    type="number"
                    value={billNote}
                    onChange={(e) => setBillNote(e.target.value)}
                    placeholder="Ex: 50, 100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none mb-1"
                  />
                  <p className="text-xs text-gray-500 leading-tight">
                    * Calcularemos o troco exato no WhatsApp após incluir a taxa
                    de entrega.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <span>Subtotal ({cart.length} itens)</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm mb-2">
                <span>Taxa de Entrega</span>
                <span className="text-orange-500 text-xs">
                  Calculada via WhatsApp
                </span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-gray-800 pt-3 border-t border-gray-200 mt-2">
                <span>Total Parcial</span>
                <span className="text-green-600">
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-200"
            >
              Enviar Pedido <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
