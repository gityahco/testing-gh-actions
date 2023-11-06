import Index from "./Body/Index";
import Header from "./Head/Header";
function App() {
  return (
    <div className="App">
      <h1 style={{display: "flex", justifyContent: "center", background: "blue"}}>The Path Finding Visualizer</h1>
      <Header />
      <Index/>
    </div>
  );
}

export default App;
